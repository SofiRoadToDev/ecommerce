import { translations } from './translations'

export function t(key: string): string {
  // Ensure consistent locale between server and client
  let locale: string
  
  if (typeof window !== 'undefined') {
    // Client side: detect from URL path or default to 'en'
    const path = window.location.pathname
    if (path.startsWith('/es')) {
      locale = 'es'
    } else if (path.startsWith('/pt')) {
      locale = 'pt'
    } else {
      locale = 'en'
    }
  } else {
    // Server side: use environment variable or default to 'en'
    locale = process.env.NEXT_PUBLIC_LOCALE || 'en'
  }
  
  const localeTranslations = translations[locale as keyof typeof translations]
  
  if (!localeTranslations) {
    console.warn(`Locale '${locale}' not found, falling back to 'en'`)
    return translations.en[key as keyof typeof translations.en] || key
  }
  
  return localeTranslations[key as keyof typeof translations.en] || key
}