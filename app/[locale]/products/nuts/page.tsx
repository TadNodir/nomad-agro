import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { FadeInView } from '@/components/motion/FadeInView'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { Section } from '@/components/ui/Section'
import { ContactCTA } from '@/components/ui/ContactCTA'
import { BreadcrumbJsonLd, ProductCategoryJsonLd } from '@/components/shared/JsonLd'
import { BASE_URL } from '@/lib/constants'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.nuts' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/products/nuts`,
      languages: {
        en: `${BASE_URL}/en/products/nuts`,
        ru: `${BASE_URL}/ru/products/nuts`,
        uz: `${BASE_URL}/uz/products/nuts`,
      },
    },
  }
}

export default async function NutsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'productsData.nuts' })
  const items = t.raw('items') as Array<{ name: string; description: string }>

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: `/${locale}` },
          { name: 'Products', href: `/${locale}/products` },
          { name: t('pageTitle'), href: `/${locale}/products/nuts` },
        ]}
      />
      <ProductCategoryJsonLd name={t('title')} description={t('description')} locale={locale} />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-stone-800 via-stone-700 to-amber-900 grain-overlay" aria-label="Nuts hero">
        <div className="container-base">
          <FadeInView>
            <a href={`/${locale}/products`} className="text-stone-300/70 text-sm hover:text-stone-200 transition-colors mb-4 inline-block">
              ← Back to Products
            </a>
            <h1 className="font-serif text-display-md text-cream font-semibold text-balance max-w-3xl mb-6">
              {t('title')}
            </h1>
            <p className="text-stone-300/70 text-lg max-w-2xl leading-relaxed">{t('description')}</p>
          </FadeInView>
        </div>
      </section>

      {/* Product grid */}
      <Section>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6" stagger={0.08}>
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-parchment hover:shadow-md transition-shadow duration-200">
              <div className="aspect-[16/9] bg-gradient-to-br from-stone-700 to-amber-900 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/20 text-xs tracking-widest uppercase">Photo: {item.name}</span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-black/30 backdrop-blur-sm text-white/70 text-[10px] font-medium px-2.5 py-1 rounded-full">
                    Contact for price
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="font-serif text-lg font-semibold text-soil mb-2">{item.name}</h2>
                <p className="text-bark text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </StaggerContainer>
      </Section>

      {/* CTA */}
      <Section background="parchment">
        <FadeInView className="text-center">
          <h2 className="font-serif text-display-sm font-semibold text-soil mb-4">Interested in our Nuts?</h2>
          <p className="text-bark text-lg max-w-xl mx-auto mb-8">
            Contact us for current pricing, grades, and availability. We respond within one business day.
          </p>
          <ContactCTA size="lg" />
        </FadeInView>
      </Section>
    </>
  )
}
