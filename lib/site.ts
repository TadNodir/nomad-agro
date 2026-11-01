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
  sameAs: ['https://www.linkedin.com/company/nomad-agro-ltd'],
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
