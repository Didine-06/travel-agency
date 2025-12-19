import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../api';
import type { SupportedLanguage } from '../i18n';
import { setAppLanguage } from '../i18n';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const normalizeLanguage = (lng: string | null | undefined): SupportedLanguage => {
  const v = (lng || '').toLowerCase();
  if (v === 'en' || v === 'fr') return v;
  return 'fr';
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<SupportedLanguage>(() =>
    normalizeLanguage(localStorage.getItem('languageId') || i18n.language)
  );

  // 1) Apply initial language to i18n (already initialized), and keep state in sync.
  useEffect(() => {
    const normalized = normalizeLanguage(language);
    if (i18n.language !== normalized) {
      void setAppLanguage(normalized);
    }
  }, [i18n, language]);

  // 2) On mount: if logged-in, prefer backend languageId.
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    (async () => {
      try {
        const response = await api.auth.getCurrentUser();
        if (response.isSuccess && response.data?.languageId) {
          const backendLng = normalizeLanguage(response.data.languageId);
          setLanguageState(backendLng);
          await setAppLanguage(backendLng);
        }
      } catch {
        // Ignore: we keep local language.
      }
    })();
  }, []);

  const setLanguage = async (lng: SupportedLanguage) => {
    const normalized = normalizeLanguage(lng);
    setLanguageState(normalized);
    await setAppLanguage(normalized);

    // If authenticated, persist the preference server-side.
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      const me = await api.auth.getCurrentUser();
      if (me.isSuccess && me.data?.id) {
        await api.auth.updateProfile(me.data.id, { languageId: normalized });
      }
    } catch {
      // Ignore server errors, keep UI language.
    }
  };

  const value = useMemo<LanguageContextType>(
    () => ({ language, setLanguage }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
};
