import type { MetadataRoute } from 'next'
import { LOCALES } from '@/lib/constants'
import { localeUrl, xDefaultUrl } from '@/lib/site'
import { PRODUCT_PAGES } from '@/lib/productPages'

// Date each page's visible content last changed (all three languages share it).
// Update the date when you change a page's text, so search engines recrawl it;
// never use the build time, or Google learns to ignore lastmod.
const LAST_MODIFIED: Record<string, string> = {
  '': '2026-11-21',
  '/about': '2026-11-21',
  '/reviews': '2026-11-19',
  '/catalog': '2026-11-21',
  '/contacts': '2026-11-21',
  '/privacy': '2026-11-14',
  ...Object.fromEntries(PRODUCT_PAGES.map((p) => [`/catalog/${p.slug}`, '2026-11-21'])),
}

// No changefreq/priority: Google ignores both.
const pages = ['', '/about', '/reviews', '/catalog', ...PRODUCT_PAGES.map((p) => `/catalog/${p.slug}`), '/contacts', '/privacy']

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const path of pages) {
    for (const locale of LOCALES) {
      const languages: Record<string, string> = { 'x-default': xDefaultUrl(path) }
      for (const loc of LOCALES) {
        languages[loc] = localeUrl(loc, path)
      }

      entries.push({
        url: localeUrl(locale, path),
        lastModified: LAST_MODIFIED[path],
        alternates: { languages },
      })
    }
  }

  return entries
}
