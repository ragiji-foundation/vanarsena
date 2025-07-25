import { useRouter } from 'next/router';

export function useTranslation() {
  const router = useRouter();
  const { locale } = router;

  const t = (key: string, translations: Record<string, any>) => {
    const keys = key.split('.');
    let value = translations[locale || 'hi'];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return { t, locale };
}

export function getStaticTranslations(locale: string) {
  try {
    return require(`../locales/${locale}.json`);
  } catch {
    return require(`../locales/hi.json`);
  }
}
