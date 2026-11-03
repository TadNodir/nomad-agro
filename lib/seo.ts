import type { Metadata } from 'next'
import { SITE, siteUrl, alternatesFor } from '@/lib/site'

export const ogLocale = (locale: string) =>
  locale === 'ru' ? 'ru_RU' : locale === 'uz' ? 'uz_UZ' : 'en_US'

export const ogImage = {
  url: siteUrl('/og-image.jpg'),
  width: 1200,
  height: 630,
  alt: `${SITE.name} — ${SITE.positioning}`,
}

/**
 * Per-page metadata: title, description, canonical + hreflang, and a full Open Graph block
 * (og:url = canonical). Next.js does not deep-merge `openGraph`: a page that sets it replaces
 * the layout's block entirely, so this carries the site name, locale and image as well.
 */
export function pageMetadata({
  locale,
  path = '',
  title,
  description,
}: {
  locale: string
  path?: string
  title: string
  description: string
}): Metadata {
  const alternates = alternatesFor(locale, path)
  return {
    title,
    description,
    alternates,
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      locale: ogLocale(locale),
      alternateLocale: SITE.languages.map((l) => l.code).filter((c) => c !== locale).map(ogLocale),
      url: alternates.canonical,
      title,
      description,
      images: [ogImage],
    },
  }
}
