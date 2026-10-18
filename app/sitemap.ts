import type { MetadataRoute } from 'next'
import { BASE_URL, LOCALES } from '@/lib/constants'

const pages = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/reviews', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/catalog', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/contacts', priority: 0.9, changeFrequency: 'monthly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const { path, priority, changeFrequency } of pages) {
    for (const locale of LOCALES) {
      const languages: Record<string, string> = {}
      for (const loc of LOCALES) {
        languages[loc] = `${BASE_URL}/${loc}${path}`
      }

      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: { languages },
      })
    }
  }

  return entries
}
