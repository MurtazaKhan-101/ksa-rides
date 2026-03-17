'use client';

import { createContext, useContext } from 'react';

const enTranslations = require('../locales/en.json');

const LanguageContext = createContext();

const getNestedTranslation = (obj, path) => {
  return path.split('.').reduce((current, key) => current && current[key], obj);
};

export function LanguageProvider({ children }) {
  const t = (key, variables = {}) => {
    let translation = getNestedTranslation(enTranslations, key);
    if (!translation) return key;
    if (variables && typeof translation === 'string') {
      Object.keys(variables).forEach(variable => {
        translation = translation.replace(new RegExp(`{${variable}}`, 'g'), variables[variable]);
      });
    }
    return translation;
  };

  const value = {
    language: 'en',
    changeLanguage: () => {},
    t,
    isRTL: () => false,
    translations: enTranslations,
    isInitialized: true,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export const defaultLanguage = 'en';
export const supportedLanguages = ['en'];

export function useTranslation() {
  const { t, language, isRTL, isInitialized } = useLanguage();
  return { t, language, isRTL, isInitialized };
}
