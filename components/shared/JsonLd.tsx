import { COMPANY, ISO_CERT } from '@/lib/constants'
import { SITE, siteUrl } from '@/lib/site'

// Escape '<' so a value can never close the <script> tag early.
const toJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')

/** Organization + WebSite, rendered once per page by app/[locale]/layout.tsx so every
 *  page's @id references (#organization, #website) resolve on that page. */
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'Corporation'],
        '@id': siteUrl('/#organization'),
        name: SITE.name,
        legalName: SITE.legalName,
        alternateName: SITE.alternateName,
        url: SITE.origin,
        logo: {
          '@type': 'ImageObject',
          url: siteUrl('/logotype1.webp'),
          width: 250,
          height: 90,
        },
        description: SITE.description,
        address: {
          '@type': 'PostalAddress',
          streetAddress: SITE.address.street,
          addressLocality: SITE.address.locality,
          postalCode: SITE.address.postalCode,
          addressCountry: SITE.address.countryCode,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: COMPANY.coordinates.lat,
          longitude: COMPANY.coordinates.lng,
        },
        hasMap: SITE.googleMaps,
        telephone: SITE.phone,
        contactPoint: COMPANY.phones.map((phone) => ({
          '@type': 'ContactPoint',
          telephone: phone.number,
          contactType: 'sales',
          email: COMPANY.emails.primary,
          availableLanguage: SITE.languages.map((l) => l.name),
        })),
        email: COMPANY.emails.primary,
        taxID: COMPANY.tin,
        areaServed: 'Worldwide',
        foundingDate: '2020',
        foundingLocation: {
          '@type': 'Place',
          name: `${SITE.address.locality}, ${SITE.address.country}`,
        },
        knowsAbout: ['Dried Fruits', 'Nuts Export', 'Agricultural Export', 'Uzbekistan Agricultural Products'],
        hasCertification: {
          '@type': 'Certification',
          name: ISO_CERT.name,
          issuedBy: { '@type': 'Organization', name: ISO_CERT.issuer },
          certificationIdentification: ISO_CERT.number,
        },
        sameAs: SITE.sameAs,
      },
      {
        '@type': 'WebSite',
        '@id': siteUrl('/#website'),
        name: SITE.name,
        url: SITE.origin,
        inLanguage: SITE.languages.map((l) => l.code),
        publisher: { '@id': siteUrl('/#organization') },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: toJsonLd(data) }}
    />
  )
}

type PageType = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'ItemPage'

/**
 * The page itself (typed WebPage with its language, linked to the site and company) plus its
 * BreadcrumbList. The last breadcrumb is the page; names are localized by the caller.
 */
export function PageJsonLd({
  type = 'WebPage',
  name,
  locale,
  breadcrumbs,
}: {
  type?: PageType
  name: string
  locale: string
  breadcrumbs: Array<{ name: string; href: string }>
}) {
  const url = siteUrl(breadcrumbs[breadcrumbs.length - 1].href)
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': type,
        '@id': `${url}#webpage`,
        url,
        name,
        inLanguage: locale,
        isPartOf: { '@id': siteUrl('/#website') },
        about: { '@id': siteUrl('/#organization') },
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: breadcrumbs.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: siteUrl(item.href),
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: toJsonLd(data) }}
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
      dangerouslySetInnerHTML={{ __html: toJsonLd(data) }}
    />
  )
}

/**
 * A product group page as a Product entity (brand, origin, photos). Deliberately no offers,
 * price or ratings: the site publishes no prices, and invented values would be misleading.
 */
export function ProductJsonLd({
  name,
  description,
  href,
  category,
  images,
}: {
  name: string
  description: string
  href: string
  category: string
  images: string[]
}) {
  const url = siteUrl(href)
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name,
    description,
    url,
    category,
    image: images.map((src) => siteUrl(src)),
    brand: { '@type': 'Brand', name: SITE.name },
    countryOfOrigin: { '@type': 'Country', name: SITE.address.country },
    mainEntityOfPage: { '@id': `${url}#webpage` },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: toJsonLd(data) }}
    />
  )
}

/** The product pages listed on /catalog, so search engines and AI see the range as one list. */
export function ItemListJsonLd({ name, items }: { name: string; items: Array<{ name: string; href: string }> }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: siteUrl(item.href),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: toJsonLd(data) }}
    />
  )
}
