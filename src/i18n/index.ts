import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fr from './locales/fr.json';

export const supportedLanguages = ['en', 'fr'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const normalizeLanguage = (lng: string | null | undefined): SupportedLanguage => {
  const value = (lng || '').toLowerCase();
  if (value === 'en' || value === 'fr') return value;
  return 'fr';
};

export const setAppLanguage = async (lng: string) => {
  const normalized = normalizeLanguage(lng);
  await i18n.changeLanguage(normalized);
  localStorage.setItem('languageId', normalized);

  // Update HTML attributes.
  document.documentElement.lang = normalized;
  document.documentElement.dir = 'ltr';
};

const initialLanguage = normalizeLanguage(
  localStorage.getItem('languageId') || (navigator.language?.split('-')[0] ?? 'fr')
);

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    lng: initialLanguage,
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
    returnNull: false,
  });

// Set document attributes on init.
document.documentElement.lang = initialLanguage;
document.documentElement.dir = 'ltr';

export default i18n;
