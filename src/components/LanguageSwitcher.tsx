import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiGlobe, FiCheck, FiChevronDown } from 'react-icons/fi';

const languages = [
  { code: 'en', name: 'English', shortCode: 'EN' },
  { code: 'zh', name: '中文', shortCode: 'ZH' },
  { code: 'ar', name: 'العربية', shortCode: 'AR' },
  { code: 'fr', name: 'Français', shortCode: 'FR' },
];

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'light' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = 'language-switcher-menu';

  // Get current language short code
  const currentLang = languages.find(l => l.code === i18n.language)?.shortCode || 'EN';
  const currentLangIndex = Math.max(
    languages.findIndex((language) => language.code === i18n.language),
    0
  );

  const closeDropdown = React.useCallback((returnFocus = false) => {
    setIsOpen(false);
    setActiveIndex(-1);

    if (returnFocus) {
      triggerRef.current?.focus();
    }
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeDropdown]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;

    optionRefs.current[activeIndex]?.focus();
  }, [activeIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (!dropdownRef.current?.contains(document.activeElement)) return;

      event.preventDefault();
      closeDropdown(true);
    };

    document.addEventListener('keydown', handleDocumentKeyDown);
    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [closeDropdown, isOpen]);

  const changeLanguage = React.useCallback((langCode: string) => {
    i18n.changeLanguage(langCode);
    
    // Update document direction for RTL languages
    if (langCode === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', langCode);
    }
    
    closeDropdown(true);
  }, [closeDropdown, i18n]);

  const openFromKeyboard = (index: number) => {
    setIsOpen(true);
    setActiveIndex(index);
  };

  const handleTriggerClick = () => {
    if (isOpen) {
      closeDropdown();
      return;
    }

    setIsOpen(true);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openFromKeyboard(currentLangIndex);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openFromKeyboard(currentLangIndex);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      openFromKeyboard(languages.length - 1);
      return;
    }

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      closeDropdown(true);
    }
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
    langCode: string
  ) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDropdown(true);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index + 1) % languages.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index - 1 + languages.length) % languages.length);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(languages.length - 1);
      return;
    }

    if (event.key === 'Tab') {
      closeDropdown();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      changeLanguage(langCode);
    }
  };

  // Dark variant styles (for dark header)
  const isDark = variant === 'dark';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language Selector Pill */}
      <button
        ref={triggerRef}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        className={`group flex h-9 items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
          isDark 
            ? 'bg-gray-800 active:bg-gray-700 border border-gray-700' 
            : 'bg-gray-100 hover:bg-gray-200 border border-transparent dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700'
        }`}
        aria-label="Select language"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
      >
        <FiGlobe className={`w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`} />
        <span className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
          {currentLang}
        </span>
        <FiChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-gray-500' : 'text-gray-500'}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-label="Language options"
          className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-[200]"
        >
          {languages.map((lang, index) => {
            const isActive = i18n.language.startsWith(lang.code);
            return (
              <button
                key={lang.code}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => changeLanguage(lang.code)}
                onKeyDown={(event) => handleOptionKeyDown(event, index, lang.code)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors
                  ${isActive 
                    ? 'bg-[#135bec]/5 text-[#135bec] font-semibold' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <span>{lang.name}</span>
                {isActive && (
                  <FiCheck className="w-4 h-4 text-[#135bec]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
