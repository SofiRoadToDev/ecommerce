import { translations } from './translations'

export function t(key: string): string {
  // Ensure consistent locale between server and client
  let locale: string

  // Force 'en' for now to avoid hydration mismatch
  // TODO: Implement proper server-side locale detection via middleware if needed
  locale = 'en'

  const localeTranslations = translations[locale as keyof typeof translations]

  if (!localeTranslations) {
    console.warn(`Locale '${locale}' not found, falling back to 'en'`)
    return translations.en[key as keyof typeof translations.en] || key
  }

  return localeTranslations[key as keyof typeof translations.en] || key
}