import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { trackEvent } from '../utils/analytics';

const LanguageToggle: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const next = lang === 'ar' ? 'en' : 'ar';

  return (
    <button
      type="button"
      onClick={() => {
        trackEvent('language_switch', { to: next });
        setLang(next);
      }}
      aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      className="fixed top-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full
                 bg-gray-800/80 backdrop-blur-md border border-gold-soft text-sm
                 text-gray-300 hover:text-amber-300 hover:border-amber-500/50
                 transition-all duration-300 shadow-lg font-inter
                 start-4"
    >
      <span className={lang === 'ar' ? 'text-amber-400 font-bold font-amiri' : 'font-amiri'}>ع</span>
      <span className="text-gray-600">/</span>
      <span className={lang === 'en' ? 'text-amber-400 font-bold' : ''}>EN</span>
    </button>
  );
};

export default LanguageToggle;
