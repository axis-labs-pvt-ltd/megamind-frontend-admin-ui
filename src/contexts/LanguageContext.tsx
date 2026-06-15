// Client Component - Language context: fetches translations from DB, persists lang in localStorage
'use client';

import { buildTFromRows, Lang, T, TRANSLATIONS } from '@/lib/i18n';
import { fetchTranslations } from '@/services/api/translations';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface LanguageCtx { lang: Lang; setLang: (l: Lang) => void; t: T; }

const Ctx = createContext<LanguageCtx>({ lang: 'en', setLang: () => {}, t: TRANSLATIONS.en });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  const { data: rows } = useQuery({
    queryKey: ['translations'],
    queryFn: fetchTranslations,
    staleTime: 5 * 60 * 1000,
    // Don't throw — fall back to hardcoded if table doesn't exist yet
    retry: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem('mm-lang') as Lang | null;
    if (stored === 'si') setLangState('si');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('lang-si', lang === 'si');
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('mm-lang', l);
  };

  const t = useMemo<T>(() => {
    if (rows && rows.length > 0) return buildTFromRows(rows, lang);
    return TRANSLATIONS[lang];
  }, [rows, lang]);

  return (
    <Ctx.Provider value={{ lang, setLang, t }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLanguage = () => useContext(Ctx);
export const useT        = () => useContext(Ctx).t;
