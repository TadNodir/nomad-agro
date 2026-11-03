import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

// No `Host:` line: it was a Yandex-only directive (dropped by Yandex in 2018) and
// Bing's robots.txt tester reports it as "Syntax not understood".
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: siteUrl('/sitemap.xml'),
  }
}
