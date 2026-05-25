import { COMPANY, BASE_URL } from '@/lib/constants'

export function OrganizationJsonLd({ locale }: { locale: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'Corporation'],
        '@id': `${BASE_URL}/#organization`,
        name: 'Nomad Agro Ltd',
        alternateName: '"Nomad Agro" Ltd',
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/logotype1.webp`,
          width: 280,
          height: 80,
        },
        description:
          'Nomad Agro exports certified organic dried fruits, nuts, and mung beans from the foothill regions of Uzbekistan for B2B wholesale buyers worldwide.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Sayram-7, 52',
          addressLocality: 'Tashkent',
          postalCode: '100077',
          addressCountry: 'UZ',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: `+${COMPANY.phones[0].number}`,
            contactType: 'sales',
            email: COMPANY.emails.primary,
            availableLanguage: ['English', 'Russian', 'Uzbek'],
          },
        ],
        email: COMPANY.emails.primary,
        identifier: {
          '@type': 'PropertyValue',
          name: 'OGRN',
          value: COMPANY.ogrn,
        },
        areaServed: 'Worldwide',
        foundingLocation: {
          '@type': 'Place',
          name: 'Tashkent, Uzbekistan',
        },
        knowsAbout: ['Organic Dried Fruits', 'Nuts Export', 'Mung Beans', 'Agricultural Export', 'Uzbekistan Organic Products'],
        sameAs: [],
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        name: 'Nomad Agro',
        url: BASE_URL,
        inLanguage: ['en', 'ru', 'uz'],
        publisher: { '@id': `${BASE_URL}/#organization` },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; href: string }>
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function FaqJsonLd({
  items,
}: {
  items: Array<{ question: string; answer: string }>
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function ProductCategoryJsonLd({
  name,
  description,
  locale,
}: {
  name: string
  description: string
  locale: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: 'Nomad Agro',
    },
    manufacturer: {
      '@id': `${BASE_URL}/#organization`,
    },
    countryOfOrigin: {
      '@type': 'Country',
      name: 'Uzbekistan',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      seller: { '@id': `${BASE_URL}/#organization` },
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'PriceSpecification',
        description: 'Contact for pricing — rates updated daily with crop availability',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
