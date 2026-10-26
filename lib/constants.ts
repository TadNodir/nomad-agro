import { SITE, fullAddress } from '@/lib/site'

export const COMPANY = {
  name: SITE.legalName,
  nameShort: SITE.name,
  tin: '307 699 304',
  address: fullAddress,
  city: SITE.address.locality,
  country: SITE.address.country,
  emails: {
    primary: 'info@nomadagro.uz',
    anvar: 'anvar@nomadagro.uz',
    ralif: 'ralif@nomadagro.uz',
    gmail: 'nomadagro.uz21@gmail.com',
  },
  phones: [
    { number: SITE.phone, display: '+998 (91) 192-90-02', primary: true },
    { number: '+998909971615', display: '+998 (90) 997-16-15', primary: false },
    { number: '+998903259968', display: '+998 (90) 325-99-68', primary: false },
  ],
  whatsapp: `https://wa.me/${SITE.phone.slice(1)}`,
  telegram: `https://t.me/${SITE.phone}`,
  linkedin: SITE.sameAs[0],
  // Sayram 7th passage, Mirzo Ulug'bek district, Tashkent (street-level; house 52 not geocoded)
  coordinates: { lat: 41.33299, lng: 69.31952 },
} as const

export const LOCALES = SITE.languages.map((l) => l.code)
export const DEFAULT_LOCALE = SITE.defaultLocale

export const NAV_LINKS = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/reviews', key: 'reviews' },
  { href: '/catalog', key: 'catalog' },
  { href: '/contacts', key: 'contact' },
] as const
