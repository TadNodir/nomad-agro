import { COMPANY } from '@/lib/constants'
import { SITE, siteUrl } from '@/lib/site'

// Escape '<' so a value can never close the <script> tag early.
const toJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')

export function OrganizationJsonLd({ locale }: { locale: string }) {
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
          width: 280,
          height: 80,
        },
        description: SITE.description,
        address: {
          '@type': 'PostalAddress',
          streetAddress: SITE.address.street,
          addressLocality: SITE.address.locality,
          postalCode: SITE.address.postalCode,
          addressCountry: SITE.address.countryCode,
        },
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
        foundingLocation: {
          '@type': 'Place',
          name: `${SITE.address.locality}, ${SITE.address.country}`,
        },
        knowsAbout: ['Dried Fruits', 'Nuts Export', 'Agricultural Export', 'Uzbekistan Agricultural Products'],
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
      item: siteUrl(item.href),
    })),
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
