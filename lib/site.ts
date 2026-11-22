// Single source of truth for site identity. Every SEO surface (metadata,
// JSON-LD, robots, sitemap) reads from here — do not repeat these values.
export const SITE = {
  origin: 'https://nomadagro.uz',
  name: 'Nomad Agro',
  legalName: '"NOMAD AGRO" LLC',
  alternateName: '"NOMAD AGRO" Limited Liability Company',
  positioning: 'Dried Fruits and Nuts from Uzbekistan',
  description:
    'Nomad Agro exports dried fruits and nuts from the foothill regions of Uzbekistan for B2B wholesale buyers worldwide.',
  address: {
    postalCode: '100077',
    street: 'Sayram Street, Passage 7, House 52',
    locality: 'Tashkent',
    country: 'Uzbekistan',
    countryCode: 'UZ',
  },
  phone: '+998911929002',
  // Google Business Profile (permanent CID link; the share link maps.app.goo.gl/akjxWJxX7N4PS26c9 redirects here)
  googleMaps: 'https://www.google.com/maps?cid=15638142317987521674',
  sameAs: [
    // Canonical slug; /company/nomad-agro-ltd 301-redirects here.
    'https://www.linkedin.com/company/nomadagro',
    'https://eye.tridge.com/trade-hub/companies/onpsQwaBbDpNeRNDVVztb6gtRWknnKiXbcNZkB',
    'https://www.goldenpages.uz/en/company/?Id=99169',
    'https://www.yellowpages.uz/en/company/nomad-agro-ltd-llc',
    'https://www.google.com/maps?cid=15638142317987521674',
    // Company's own Alibaba storefront ("Nomad Agro LLC").
    'https://uz1576338360uwrb.trustpass.alibaba.com/',
  ],
  languages: [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Russian' },
    { code: 'uz', name: 'Uzbek' },
  ],
  defaultLocale: 'en',
} as const

export type SiteLocale = (typeof SITE.languages)[number]['code']

export const siteUrl = (path = '') => `${SITE.origin}${path}`

/** Site-relative path of a page in a locale. English (default) has no prefix: '/', '/catalog'. */
export const localePath = (locale: string, path = '') => {
  const p = path === '/' ? '' : path
  return locale === SITE.defaultLocale ? p || '/' : `/${locale}${p}`
}

export const localeUrl = (locale: string, path = '') => siteUrl(localePath(locale, path))

const LOCALE_PREFIX = new RegExp(`^/(${SITE.languages.map((l) => l.code).join('|')})(?=/|$)`)

/**
 * Locale-free path ('/', '/catalog/raisins') from a usePathname() value. English pages are
 * prerendered under /en/... but served at /..., so the server sees '/en/catalog' while the
 * browser sees '/catalog'; comparing raw pathnames made the HTML differ (React error #418).
 */
export const stripLocale = (pathname: string) => pathname.replace(LOCALE_PREFIX, '') || '/'

export const fullAddress = `${SITE.address.postalCode}, ${SITE.address.street}, ${SITE.address.locality}, ${SITE.address.country}`

// x-default = the English page, which lives at the unprefixed URL.
export const xDefaultUrl = (path = '') => localeUrl(SITE.defaultLocale, path)

/** canonical + hreflang alternates for a page path ('' for home). */
export const alternatesFor = (locale: string, path = '') => ({
  canonical: localeUrl(locale, path),
  languages: {
    'x-default': xDefaultUrl(path),
    ...Object.fromEntries(SITE.languages.map((l) => [l.code, localeUrl(l.code, path)])),
  },
})
