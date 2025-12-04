import { translations } from './translations'

export function t(key: string): string {
  const locale = process.env.NEXT_PUBLIC_LOCALE || 'en'
  const localeTranslations = translations[locale as keyof typeof translations]
  
  if (!localeTranslations) {
    console.warn(`Locale '${locale}' not found, falling back to 'en'`)
    return translations.en[key as keyof typeof translations.en] || key
  }
  
  return localeTranslations[key as keyof typeof translations.en] || key
}