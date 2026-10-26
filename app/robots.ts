import type { MetadataRoute } from 'next'
import { SITE, siteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: siteUrl('/sitemap.xml'),
    host: SITE.origin,
  }
}
