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
  const t = await getTranslations({ locale, namespace: 'seo.mungBeans' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/products/mung-beans`,
      languages: {
        en: `${BASE_URL}/en/products/mung-beans`,
        ru: `${BASE_URL}/ru/products/mung-beans`,
        uz: `${BASE_URL}/uz/products/mung-beans`,
      },
    },
  }
}

export default async function MungBeansPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'productsData.mungBeans' })
  const items = t.raw('items') as Array<{ name: string; description: string }>

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: `/${locale}` },
          { name: 'Products', href: `/${locale}/products` },
          { name: t('pageTitle'), href: `/${locale}/products/mung-beans` },
        ]}
      />
      <ProductCategoryJsonLd name={t('title')} description={t('description')} locale={locale} />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-brand-forest via-brand-green to-brand-green-mid grain-overlay" aria-label="Mung Beans hero">
        <div className="container-base">
          <FadeInView>
            <a href={`/${locale}/products`} className="text-brand-lime/70 text-sm hover:text-brand-lime transition-colors mb-4 inline-block">
              ← Back to Products
            </a>
            <h1 className="font-serif text-display-md text-cream font-semibold text-balance max-w-3xl mb-6">
              {t('title')}
            </h1>
            <p className="text-brand-lime/60 text-lg max-w-2xl leading-relaxed">{t('description')}</p>
          </FadeInView>
        </div>
      </section>

      {/* Product grid */}
      <Section>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.1}>
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-parchment hover:shadow-md transition-shadow duration-200">
              <div className="aspect-[4/3] bg-gradient-to-br from-brand-green to-brand-forest relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/20 text-xs tracking-widest uppercase">Photo: {item.name}</span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-black/30 backdrop-blur-sm text-white/70 text-[10px] font-medium px-2.5 py-1 rounded-full">
                    Contact for price
                  </span>
                </div>
              </div>
              <div className="p-5">
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
          <h2 className="font-serif text-display-sm font-semibold text-soil mb-4">Interested in our Mung Beans?</h2>
          <p className="text-bark text-lg max-w-xl mx-auto mb-8">
            Contact us for current pricing, grades, and availability. We respond within one business day.
          </p>
          <ContactCTA size="lg" />
        </FadeInView>
      </Section>
    </>
  )
}
