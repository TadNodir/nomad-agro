import type { MetadataRoute } from 'next'
import { LOCALES } from '@/lib/constants'
import { SITE, localeUrl } from '@/lib/site'

const pages = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/reviews', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/catalog', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/contacts', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const { path, priority, changeFrequency } of pages) {
    for (const locale of LOCALES) {
      const languages: Record<string, string> = { 'x-default': localeUrl(SITE.defaultLocale, path) }
      for (const loc of LOCALES) {
        languages[loc] = localeUrl(loc, path)
      }

      entries.push({
        url: localeUrl(locale, path),
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: { languages },
      })
    }
  }

  return entries
}
