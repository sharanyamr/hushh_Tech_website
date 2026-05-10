import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import config from "../resources/config/config";
import {
  type AuthSessionReason,
  type AuthSessionSnapshot,
  type AuthSessionStatus,
  type OAuthProvider,
  type OAuthStartResult,
  AUTH_EVENT_STORAGE_KEY,
  broadcastAuthEvent,
  clearLegacyAuthStorage,
  clearSupabaseSession,
  getLocalSession,
  getValidatedSession,
  parseAuthBroadcastEvent,
  startUnifiedOAuth,
} from "./session";

interface AuthSessionContextValue extends AuthSessionSnapshot {
  startOAuth: (provider: OAuthProvider) => Promise<OAuthStartResult>;
  signOut: () => Promise<void>;
  revalidateSession: () => Promise<AuthSessionSnapshot>;
  handleAccountDeleted: () => Promise<void>;
}

interface PendingSignedOutState {
  reason: AuthSessionReason;
  status: Extract<AuthSessionStatus, "anonymous" | "invalidated">;
}

const AuthSessionContext = createContext<AuthSessionContextValue | undefined>(
  undefined
);

const INITIAL_SNAPSHOT: AuthSessionSnapshot = {
  status: "booting",
  session: null,
  user: null,
};

export const AuthSessionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const supabase = config.supabaseClient;

  const [snapshot, setSnapshot] =
    useState<AuthSessionSnapshot>(INITIAL_SNAPSHOT);

  const pendingSignedOutStateRef = useRef<PendingSignedOutState | null>(null);

  // Prevent stale INITIAL_SESSION events from restoring
  // invalid sessions from localStorage after backend rejection.
  const invalidatedSessionRef = useRef(false);

  const applySnapshot = useCallback((nextSnapshot: AuthSessionSnapshot) => {
    setSnapshot((currentSnapshot) => {
      const currentUserId = currentSnapshot.user?.id ?? null;
      const nextUserId = nextSnapshot.user?.id ?? null;

      const currentAccessToken =
        currentSnapshot.session?.access_token ?? null;

      const nextAccessToken =
        nextSnapshot.session?.access_token ?? null;

      if (
        currentSnapshot.status === nextSnapshot.status &&
        currentSnapshot.reason === nextSnapshot.reason &&
        currentUserId === nextUserId &&
        currentAccessToken === nextAccessToken
      ) {
        return currentSnapshot;
      }

      return nextSnapshot;
    });
  }, []);

  const applyClearedState = useCallback(
    (
      status: Extract<AuthSessionStatus, "anonymous" | "invalidated">,
      reason: AuthSessionReason
    ) => {
      applySnapshot({
        status,
        session: null,
        user: null,
        reason,
      });
    },
    [applySnapshot]
  );

  const clearLocalSession = useCallback(
    async (
      status: Extract<AuthSessionStatus, "anonymous" | "invalidated">,
      reason: AuthSessionReason,
      broadcast = false
    ) => {
      pendingSignedOutStateRef.current = { status, reason };

      clearLegacyAuthStorage();

      await clearSupabaseSession(supabase);

      applyClearedState(status, reason);

      if (broadcast) {
        broadcastAuthEvent(reason);
      }

      return {
        status,
        session: null,
        user: null,
        reason,
      } satisfies AuthSessionSnapshot;
    },
    [applyClearedState, supabase]
  );

  const revalidateSession = useCallback(async () => {
    const nextSnapshot = await getValidatedSession(supabase);

    if (nextSnapshot.status === "invalidated") {
      // Mark invalidation so stale INITIAL_SESSION
      // cannot restore old cached auth state.
      invalidatedSessionRef.current = true;

      return clearLocalSession(
        "invalidated",
        nextSnapshot.reason || "invalid_session"
      );
    }

    // Reset invalidation after successful validation.
    invalidatedSessionRef.current = false;

    applySnapshot(nextSnapshot);

    return nextSnapshot;
  }, [applySnapshot, clearLocalSession, supabase]);

  // Boot from localStorage first for fast UI,
  // then immediately perform authoritative validation.
  useEffect(() => {
    const bootSession = async () => {
      // Fast local restore
      const localSnapshot = await getLocalSession(supabase);

      applySnapshot(localSnapshot);

      // Critical: validate against backend/Supabase
      await revalidateSession();
    };

    void bootSession();
  }, [applySnapshot, revalidateSession, supabase]);

  useEffect(() => {
    if (!supabase) {
      applySnapshot({
        status: "anonymous",
        session: null,
        user: null,
      });

      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      // Ignore stale INITIAL_SESSION events restored from localStorage
      // after backend validation already invalidated the session.
      if (
        event === "INITIAL_SESSION" &&
        invalidatedSessionRef.current
      ) {
        return;
      }

      if (event === "SIGNED_OUT" || !nextSession) {
        const pendingState = pendingSignedOutStateRef.current;

        pendingSignedOutStateRef.current = null;

        applySnapshot({
          status: pendingState?.status || "anonymous",
          session: null,
          user: null,
          reason: pendingState?.reason,
        });

        return;
      }

      if (nextSession.user?.id && nextSession.access_token) {
        invalidatedSessionRef.current = false;

        applySnapshot({
          status: "authenticated",
          session: nextSession,
          user: nextSession.user,
        });
      } else {
        applySnapshot({
          status: "anonymous",
          session: null,
          user: null,
        });
      }
    });

    // Soft revalidation without network calls.
    const handleSoftRevalidation = async () => {
      const localSnapshot = await getLocalSession(supabase);

      if (localSnapshot.status === "invalidated") {
        invalidatedSessionRef.current = true;

        await clearLocalSession(
          "invalidated",
          localSnapshot.reason || "invalid_session"
        );

        return;
      }

      if (localSnapshot.status === "authenticated") {
        applySnapshot(localSnapshot);
      }
    };

    const handleWindowFocus = () => {
      void handleSoftRevalidation();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void handleSoftRevalidation();
      }
    };

    const handleStorage = (storageEvent: StorageEvent) => {
      if (
        storageEvent.key !== AUTH_EVENT_STORAGE_KEY ||
        !storageEvent.newValue
      ) {
        return;
      }

      const payload = parseAuthBroadcastEvent(storageEvent.newValue);

      if (!payload) {
        return;
      }

      const nextStatus =
        payload.reason === "signed_out"
          ? "anonymous"
          : "invalidated";

      void clearLocalSession(nextStatus, payload.reason, false);
    };

    window.addEventListener("focus", handleWindowFocus);

    window.addEventListener("storage", handleStorage);

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      subscription.unsubscribe();

      window.removeEventListener(
        "focus",
        handleWindowFocus
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [applySnapshot, clearLocalSession, supabase]);

  const startOAuth = useCallback(
    async (provider: OAuthProvider) =>
      startUnifiedOAuth(provider, supabase),
    [supabase]
  );

  const signOut = useCallback(async () => {
    clearLegacyAuthStorage();

    if (!supabase) {
      applyClearedState("anonymous", "signed_out");

      return;
    }

    pendingSignedOutStateRef.current = {
      status: "anonymous",
      reason: "signed_out",
    };

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error(
        "[AuthSession] Sign-out failed, clearing locally:",
        error
      );

      await clearSupabaseSession(supabase);
    }

    invalidatedSessionRef.current = false;

    applyClearedState("anonymous", "signed_out");

    broadcastAuthEvent("signed_out");
  }, [applyClearedState, supabase]);

  const handleAccountDeleted = useCallback(async () => {
    invalidatedSessionRef.current = true;

    await clearLocalSession(
      "invalidated",
      "deleted",
      true
    );
  }, [clearLocalSession]);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      ...snapshot,
      startOAuth,
      signOut,
      revalidateSession,
      handleAccountDeleted,
    }),
    [
      handleAccountDeleted,
      revalidateSession,
      signOut,
      snapshot,
      startOAuth,
    ]
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
};

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error(
      "useAuthSession must be used within an AuthSessionProvider"
    );
  }

  return context;
}