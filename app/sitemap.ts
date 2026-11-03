import type { MetadataRoute } from 'next'
import { LOCALES } from '@/lib/constants'
import { localeUrl, xDefaultUrl } from '@/lib/site'

// Date each page's visible content last changed (all three languages share it).
// Update the date when you change a page's text, so search engines recrawl it;
// never use the build time, or Google learns to ignore lastmod.
const LAST_MODIFIED: Record<string, string> = {
  '': '2026-11-01',
  '/about': '2026-11-01',
  '/reviews': '2026-11-01',
  '/catalog': '2026-11-01',
  '/contacts': '2026-11-01',
  '/privacy': '2026-11-01',
}

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
      const languages: Record<string, string> = { 'x-default': xDefaultUrl(path) }
      for (const loc of LOCALES) {
        languages[loc] = localeUrl(loc, path)
      }

      entries.push({
        url: localeUrl(locale, path),
        lastModified: LAST_MODIFIED[path],
        changeFrequency,
        priority,
        alternates: { languages },
      })
    }
  }

  return entries
}
