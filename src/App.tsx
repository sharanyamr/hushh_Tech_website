import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/home/ui';
import Leadership from './components/Leadership';
import Philosophy from './components/Philosophy';
import Footer from './components/Footer';
import GoogleAnalyticsRouteTracker from './components/GoogleAnalyticsRouteTracker';
import LoginPage from './pages/login/ui'
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import OnboardingShellAutoPadding from './components/OnboardingShellAutoPadding';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import Consumers from './pages/services/consumers';
import Business from './pages/services/business';
import SignupPage from './pages/signup/ui';
import Faq from './pages/faq';
import Career from './pages/career';
import CommunityPage from './pages/community/ui';
import CommunityPostPage from './pages/community/post-ui';
import ReportDetailPage from './pages/reports/reportDetail';
import BenefitsPage from './pages/benefits';
import PrivacyPolicy from './pages/privacy-policy';
import CareersPrivacyPolicy from './pages/career-privacy-policy';
import CaliforniaPrivacyPolicy from './pages/california-privacy-policy';
import EUUKPrivacyPolicy from './pages/eu-uk-privacy-policy';
import TermsOfService from './pages/terms-of-service';
import DeleteAccountPage from './pages/delete-account';
import { ReactNode } from 'react';
import Profile from './pages/profile';
import AuthCallback from './pages/AuthCallback';
import KYCVerificationPage from './pages/kyc-verification/page';
import NDARequestModalComponent from './components/NDARequestModal';
import UserProfilePage from './pages/user-profile/page';
import InvestorProfilePage from './pages/investor-profile';
import KYCFormPage from './pages/kyc-form/page';
import DiscoverFundA from './pages/discover-fund-a';
import SellTheWallPage from './pages/sell-the-wall';
import AIPoweredBerkshirePage from './pages/ai-powered-berkshire';
import UserRegistration from './pages/UserRegistration';
import ProtectedRoute from './components/ProtectedRoute';
import YourProfilePage from './pages/your-profile';
import HushhUserProfilePage from './pages/hushh-user-profile';
import ViewPreferencesPage from './pages/hushh-user-profile/view';
import PrivacyControlsPage from './pages/hushh-user-profile/privacy';
import PublicHushhProfilePage from './pages/hushhid';
import PublicInvestorProfilePage from './pages/investor/PublicInvestorProfile';
import HushhIDHeroDemo from './pages/hushhid-hero-demo';
import FinancialLinkPage from './pages/onboarding/financial-link/ui';
import OnboardingStep1 from './pages/onboarding/step-1/ui';
import OnboardingStep2 from './pages/onboarding/step-2/ui';
import OnboardingStep3 from './pages/onboarding/step-3/ui';
import OnboardingStep4 from './pages/onboarding/step-4/ui';
import OnboardingStep5 from './pages/onboarding/step-5/ui';
import OnboardingStep6 from './pages/onboarding/step-6/ui';
import OnboardingStep7 from './pages/onboarding/step-7/ui';
import OnboardingReviewStep from './pages/onboarding/step-8/ui';
import OnboardingBankDetailsStep from './pages/onboarding/step-9/ui';
import VerifyIdentityPage from './pages/onboarding/verify-identity/ui';
import VerifyCompletePage from './pages/onboarding/verify-complete/ui';
import MeetCeoPage from './pages/onboarding/meet-ceo/ui';
import InvestorGuidePage from './pages/onboarding/InvestorGuide';
import KYCDemoPage from './pages/kyc-demo';
import KycFlowPage from './pages/kyc-flow';
import A2APlaygroundPage from './pages/a2a-playground';
import ReceiptGeneratorPage from './pages/receipt-generator';
import DeveloperDocsPage from './pages/developer-docs';
import MobileBottomNav from './components/MobileBottomNav';
import HushhAIPage from './hushh-ai/pages';
import { LoginPage as HushhAILoginPage, SignupPage as HushhAISignupPage } from './hushh-ai/presentation/pages';
import KaiApp from './kai/pages';
import HushhStudioApp from './hushh-studio/pages';
import GlobalNDAGate from './components/GlobalNDAGate';
import SignNDAPage from './pages/sign-nda';
import DocumentViewerPage from './pages/document-viewer';
import NDAAdminPage from './pages/nda-admin';
import { AuthSessionProvider, useAuthSession } from './auth/AuthSessionProvider';
import AuthRequiredRoute from './components/AuthRequiredRoute';
import HushhHackathonPage from './pages/hushh-hackathon/ui';
import MetricsPage from './pages/metrics';
import NotFound from './pages/NotFound';

const KaiIndiaApp = React.lazy(() => import('./kai-india/pages'));

// Content wrapper component that applies conditional margin
const ContentWrapper = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/signUp' || location.pathname === '/solutions';
  const isAuthCallback = location.pathname.startsWith('/auth/callback');
  const isUserRegistration = location.pathname === '/user-registration';
  const isOnboarding = location.pathname.startsWith('/onboarding');
  const isKycFlow = location.pathname.startsWith('/kyc-flow');
  const isKycDemo = location.pathname.startsWith('/kyc-demo');
  const isA2APlayground = location.pathname.startsWith('/a2a-playground');
  const isInvestorGuide = location.pathname === '/investor-guide';
  const isHushhAI = location.pathname.startsWith('/hushh-ai');
  const isKai = location.pathname.startsWith('/kai');
  const isStudio = location.pathname.startsWith('/studio');
  const isHushhUserProfile = location.pathname.startsWith('/hushh-user-profile');
  const isSignNda = location.pathname.startsWith('/sign-nda');
  const isDocumentViewer = location.pathname.startsWith('/document-viewer');
  const isInvestorProfile = location.pathname.startsWith('/investor-profile');
  const isPublicInvestorProfile = location.pathname.startsWith('/investor/');
  const isDiscoverFundA = location.pathname === '/discover-fund-a';
  const isCommunity = location.pathname.startsWith('/community');
  const isDeleteAccount = location.pathname === '/delete-account';
  const isLogin = location.pathname.toLowerCase() === '/login';
  const isSignup = location.pathname.toLowerCase() === '/signup';
  const isProfile = location.pathname === '/profile';
  const isHushhHackathon = location.pathname === '/hushh-hackathon';
  const isMetrics = location.pathname === '/metrics' || location.pathname === '/metric';

  return (
    <div className={`${isHomePage || isAuthCallback || isUserRegistration || isOnboarding || isKycFlow || isKycDemo || isA2APlayground || isInvestorGuide || isHushhAI || isKai || isStudio || isHushhUserProfile || isSignNda || isDocumentViewer || isInvestorProfile || isPublicInvestorProfile || isDiscoverFundA || isCommunity || isDeleteAccount || isLogin || isSignup || isProfile || isHushhHackathon || isMetrics ? '' : 'mt-20'}`}>
      {children}
    </div>
  );
};

// Layout visibility hook - determines which components to show based on route
const useLayoutVisibility = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isHushhAI = location.pathname.startsWith('/hushh-ai');
  const isKai = location.pathname.startsWith('/kai');
  const isStudio = location.pathname.startsWith('/studio');
  const isOnboarding = location.pathname.startsWith('/onboarding');
  const isProfile = location.pathname === '/profile';
  const isFundA = location.pathname === '/discover-fund-a';
  const isCommunity = location.pathname.startsWith('/community');
  const isDeleteAccount = location.pathname === '/delete-account';
  const isLogin = location.pathname.toLowerCase() === '/login';
  const isSignup = location.pathname.toLowerCase() === '/signup';
  const isSignNda = location.pathname.startsWith('/sign-nda');
  const isDocumentViewer = location.pathname.startsWith('/document-viewer');
  const isHushhUserProfile = location.pathname.startsWith('/hushh-user-profile');

  // All pages using HushhTechHeader — hide old global Navbar/Footer
  const isKycFlow = location.pathname.startsWith('/kyc-flow');
  const isKycDemo = location.pathname.startsWith('/kyc-demo');
  const isA2APlayground = location.pathname.startsWith('/a2a-playground');
  const isPublicInvestorProfile = location.pathname.startsWith('/investor/');
  const isHushhHackathon = location.pathname === '/hushh-hackathon';
  const isMetrics = location.pathname === '/metrics' || location.pathname === '/metric';
  const hideOld = isHushhAI || isKai || isStudio || isHomePage || isOnboarding || isProfile || isFundA || isCommunity || isDeleteAccount || isLogin || isSignup || isSignNda || isDocumentViewer || isHushhUserProfile || isKycFlow || isKycDemo || isA2APlayground || isPublicInvestorProfile || isHushhHackathon || isMetrics;
  return {
    showNavbar: !hideOld,
    showFooter: !hideOld,
    showMobileNav: !hideOld,
  };
};

function App() {
  // Inner layout component that uses hooks for conditional rendering
  const AppLayout = () => {
    const { showNavbar, showFooter, showMobileNav } = useLayoutVisibility();
    const { session } = useAuthSession();
    
    return (
      <div className="min-h-screen flex flex-col">
        {showNavbar && <Navbar />}
        <ContentWrapper>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about/leadership" element={<Leadership />} />
            <Route path="/about/philosophy" element={<Philosophy />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/benefits" element={<BenefitsPage />} />
            <Route path='/services/consumers' element={<Consumers />} />
            <Route path='/services/business' element={<Business />} />
            <Route path='/Signup' element={<SignupPage />} />
            <Route path='/faq' element={<Faq />} />
            <Route path='/profile' element={
              <AuthRequiredRoute>
                <Profile />
              </AuthRequiredRoute>
            } />
            <Route path="/career" element={<Career />} />
            <Route path="/career/*" element={<Career />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
            <Route path='/career-privacy-policy' element={<CareersPrivacyPolicy />} />
            <Route path="/community" element={
              <CommunityPage />
            } />
            <Route path='/california-privacy-policy' element={<CaliforniaPrivacyPolicy />} />
            <Route path='/eu-uk-jobs-privacy-policy' element={<EUUKPrivacyPolicy />} />
            <Route path='/terms' element={<TermsOfService />} />
            <Route path='/terms-of-service' element={<TermsOfService />} />
            <Route path='/delete-account' element={
              <AuthRequiredRoute>
                <DeleteAccountPage />
              </AuthRequiredRoute>
            } />
            <Route path="/community/*" element={
              <CommunityPostPage />
            } />
            <Route path="/reports/:id" element={

              <ReportDetailPage />

            } />
            <Route path="/auth/callback" element={<AuthCallback />} />
            {/* Investor Onboarding Guide - Public landing page */}
            <Route path="/investor-guide" element={<InvestorGuidePage />} />
            {/* Financial Link — mandatory pre-step before onboarding */}
            <Route path="/onboarding/financial-link" element={
              <ProtectedRoute>
                <FinancialLinkPage />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/step-1" element={
              <ProtectedRoute>
                <OnboardingStep1 />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/step-2" element={
              <ProtectedRoute>
                <OnboardingStep2 />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/step-3" element={
              <ProtectedRoute>
                <OnboardingStep3 />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/step-4" element={
              <ProtectedRoute>
                <OnboardingStep4 />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/step-5" element={
              <ProtectedRoute>
                <OnboardingStep5 />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/step-6" element={
              <ProtectedRoute>
                <OnboardingStep6 />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/step-7" element={
              <ProtectedRoute>
                <OnboardingStep7 />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/step-8" element={
              <ProtectedRoute>
                <OnboardingReviewStep />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/step-9" element={
              <ProtectedRoute>
                <OnboardingBankDetailsStep />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/verify" element={
              <ProtectedRoute>
                <VerifyIdentityPage />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/verify-complete" element={
              <ProtectedRoute>
                <VerifyCompletePage />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/meet-ceo" element={
              <ProtectedRoute>
                <MeetCeoPage />
              </ProtectedRoute>
            } />
            <Route path="/hushh-user-profile" element={
              <ProtectedRoute>
                <HushhUserProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/hushh-user-profile/view" element={
              <ProtectedRoute>
                <ViewPreferencesPage />
              </ProtectedRoute>
            } />
            <Route path="/hushh-user-profile/privacy" element={
              <ProtectedRoute>
                <PrivacyControlsPage />
              </ProtectedRoute>
            } />
            <Route path="/profile/:id" element={
              <AuthRequiredRoute>
                <ViewPreferencesPage />
              </AuthRequiredRoute>
            } />
            <Route path="/hushhid/:id" element={<PublicHushhProfilePage />} />
            <Route path="/hushhid-hero-demo" element={<HushhIDHeroDemo />} />
            {/* <Route path="/solutions" element={<SolutionsPage />} /> */}
            <Route path='/kyc-verification' element={

              <KYCVerificationPage />

            } />
            <Route path='/kyc-form' element={

              <KYCFormPage />

            } />
            <Route path='/discover-fund-a' element={

              <DiscoverFundA />

            } />
            <Route path='/sell-the-wall' element={

              <SellTheWallPage />

            } />
            <Route path='/ai-powered-berkshire' element={

              <AIPoweredBerkshirePage />

            } />
            <Route path='/user-registration' element={
              <ProtectedRoute>
                <UserRegistration />
              </ProtectedRoute>
            } />
            <Route path='/nda-form' element={
              <AuthRequiredRoute>
                <NDARequestModalComponent
                  session={session}
                  onSubmit={(result: string) => {
                    console.log("NDA submission result:", result);
                    // Handle post-submission actions here
                    if (result === "Approved" || result === "Pending" || result === "Requested permission") {
                      // Redirect to appropriate page on success
                      window.location.href = "/";
                    }
                  }}
                />
              </AuthRequiredRoute>

            } />
            <Route path='/investor-profile' element={
              <ProtectedRoute>
                <InvestorProfilePage />
              </ProtectedRoute>
            } />
            <Route path='/investor/:slug' element={<PublicInvestorProfilePage />} />
            <Route path='/user-profile' element={
              <AuthRequiredRoute>
                <UserProfilePage />
              </AuthRequiredRoute>
            } />
            <Route path='/your-profile' element={
              <AuthRequiredRoute>
                <YourProfilePage />
              </AuthRequiredRoute>
            } />
            <Route path='/kyc-demo' element={<KYCDemoPage />} />
            <Route path='/kyc-flow' element={<KycFlowPage />} />
            <Route path='/a2a-playground' element={<A2APlaygroundPage />} />
            <Route path='/receipt-generator' element={<ReceiptGeneratorPage />} />
            <Route path='/developer-docs' element={<DeveloperDocsPage />} />
            <Route path='/metrics' element={<MetricsPage />} />
            <Route path='/metric' element={<Navigate to='/metrics' replace />} />
            <Route path='/hushh-ai' element={<HushhAIPage />} />
            <Route path='/hushh-ai/login' element={<HushhAILoginPage />} />
            <Route path='/hushh-ai/signup' element={<HushhAISignupPage />} />
            {/* Kai - Financial Intelligence Agent */}
            {/* Real-time AI voice/video financial advisor powered by Gemini 2.0 Flash */}
            <Route path='/kai' element={<KaiApp />} />
            {/* Kai India - Indian Market Intelligence Dashboard */}
            {/* Real-time NSE/BSE market data powered by Gemini 2.5 Flash with Google Search */}
            <Route
              path='/kai-india'
              element={
                <Suspense fallback={<div className="min-h-screen bg-black" />}>
                  <KaiIndiaApp />
                </Suspense>
              }
            />
            {/* Hushh Studio - FREE AI Video Generation */}
            {/* Powered by Google Veo 3.1 - No login required, free for Indian audience */}
            <Route path='/studio' element={<HushhStudioApp />} />
            {/* Global NDA Signing Page */}
            <Route path='/sign-nda' element={<SignNDAPage />} />
            <Route path='/document-viewer' element={<DocumentViewerPage />} />
            {/* NDA Admin Page - Password protected view of all NDA agreements */}
            <Route path='/nda-admin' element={<NDAAdminPage />} />
            {/* 404 Not Found - Must be last route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ContentWrapper>
        {showFooter && <Footer />}
        {showMobileNav && <MobileBottomNav />}
      </div>
    );
  };

  return (
    <ChakraProvider theme={theme}>
      <AuthSessionProvider>
        <Router>
          <GoogleAnalyticsRouteTracker />
          <ScrollToTop />
          <OnboardingShellAutoPadding />
          <GlobalNDAGate>
            <AppLayout />
          </GlobalNDAGate>
        </Router>
      </AuthSessionProvider>
    </ChakraProvider>
  );
}

export default App;
