// src/components/LanguageSelector.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/components/LanguageSelector.scss';

const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  const languages = [
    { code: 'en', name: t('app.languages.en'), flag: '🇬🇧' },
    { code: 'fi', name: t('app.languages.fi'), flag: '🇫🇮' },
    { code: 'el', name: t('app.languages.el'), flag: '🇬🇷' }
  ];
  
  return (
    <div className="language-selector">
      <div className="language-options">
        {languages.map(lang => (
          <button
            key={lang.code}
            className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
            onClick={() => changeLanguage(lang.code)}
            title={lang.name}
          >
            <span className="language-flag">{lang.flag}</span>
            <span className="language-name">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
