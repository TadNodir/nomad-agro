import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ru', 'uz'],
  defaultLocale: 'en',
  // English is the main audience: it lives at the root (/, /catalog) with no prefix;
  // Russian and Uzbek keep /ru and /uz.
  localePrefix: 'as-needed',
  // No redirect by browser language: every URL always shows the same language, which
  // Google recommends (Googlebot sends no Accept-Language). Visitors switch via the menu.
  localeDetection: false,
  // hreflang is already in each page's <head> (generateMetadata); skip the duplicate header.
  alternateLinks: false,
})
