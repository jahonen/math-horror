import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
import enMainTranslation from './locales/en/main.json';
import enGameTranslation from './locales/en/game.json';

// Finnish translations
import fiMainTranslation from './locales/fi/main.json';
import fiGameTranslation from './locales/fi/game.json';

// Greek translations
import elMainTranslation from './locales/el/main.json';
import elGameTranslation from './locales/el/game.json';

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    
    // Common namespaces across all the languages
    ns: ['main', 'game'],
    defaultNS: 'main',
    
    // Load all translations directly
    resources: {
      en: {
        main: enMainTranslation,
        game: enGameTranslation
      },
      fi: {
        main: fiMainTranslation,
        game: fiGameTranslation
      },
      el: {
        main: elMainTranslation,
        game: elGameTranslation
      }
    },

    detection: {
      // order and from where user language should be detected
      order: ['localStorage', 'navigator'],
      
      // keys or params to lookup language from
      lookupLocalStorage: 'i18nextLng',
      
      // cache user language on
      caches: ['localStorage']
    }
  });

export default i18n;
