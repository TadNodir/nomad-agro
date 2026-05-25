export const COMPANY = {
  name: '"Nomad Agro" Ltd',
  nameShort: 'Nomad Agro',
  ogrn: '888409',
  address: '100077, Sayram-7, 52, Tashkent, Republic of Uzbekistan',
  city: 'Tashkent',
  country: 'Uzbekistan',
  emails: {
    primary: 'info@nomadagro.uz',
    anvar: 'anvar@nomadagro.uz',
    ralif: 'ralif@nomadagro.uz',
    gmail: 'nomadagro.uz21@gmail.com',
  },
  phones: [
    { number: '+998909971615', display: '+998 90 997 16 15', primary: true },
    { number: '+998903259968', display: '+998 90 325 99 68', primary: false },
    { number: '+998911929002', display: '+998 91 192 90 02', primary: false },
  ],
  whatsapp: 'https://wa.me/998909971615',
  telegram: 'https://t.me/+998909971615',
  website: 'https://nomadagro.uz',
} as const

export const LOCALES = ['en', 'ru', 'uz'] as const
export const DEFAULT_LOCALE = 'en'

export const BASE_URL = 'https://nomadagro.uz'

export const NAV_LINKS = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/products', key: 'products' },
  { href: '/reviews', key: 'reviews' },
  { href: '/catalog', key: 'catalog' },
  { href: '/contacts', key: 'contact' },
] as const
