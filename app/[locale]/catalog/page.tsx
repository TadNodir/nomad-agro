import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Download, AlertCircle } from 'lucide-react'
import { FadeInView } from '@/components/motion/FadeInView'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { Section, SectionHeader } from '@/components/ui/Section'
import { ContactCTA } from '@/components/ui/ContactCTA'
import { BreadcrumbJsonLd } from '@/components/shared/JsonLd'
import { BASE_URL } from '@/lib/constants'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.catalog' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/catalog`,
      languages: {
        en: `${BASE_URL}/en/catalog`,
        ru: `${BASE_URL}/ru/catalog`,
        uz: `${BASE_URL}/uz/catalog`,
      },
    },
  }
}

const catalogSections = [
  {
    sectionKey: 'driedFruits' as const,
    gradient: 'from-amber-800 to-orange-900',
    productKey: 'driedFruits' as const,
  },
  {
    sectionKey: 'nuts' as const,
    gradient: 'from-stone-700 to-amber-900',
    productKey: 'nuts' as const,
  },
  {
    sectionKey: 'mungBeans' as const,
    gradient: 'from-brand-green to-brand-forest',
    productKey: 'mungBeans' as const,
  },
]

export default async function CatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'catalog' })
  const tProducts = await getTranslations({ locale, namespace: 'productsData' })

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: `/${locale}` },
          { name: 'Catalog', href: `/${locale}/catalog` },
        ]}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-brand-forest grain-overlay" aria-label="Catalog hero">
        <div className="container-base">
          <FadeInView>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-lime block mb-4">
              Full Range
            </span>
            <h1 className="font-serif text-display-md text-cream font-semibold text-balance max-w-3xl mb-6">
              {t('title')}
            </h1>
            <p className="text-stone/80 text-lg max-w-2xl leading-relaxed mb-8">{t('subtitle')}</p>

            {/* No-price notice */}
            <div className="inline-flex items-start gap-3 bg-brand-lime/10 border border-brand-lime/20 rounded-2xl px-6 py-4 max-w-2xl">
              <AlertCircle className="w-5 h-5 text-brand-lime flex-shrink-0 mt-0.5" />
              <p className="text-brand-lime/80 text-sm leading-relaxed">{t('downloadNote')}</p>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Download CTA */}
      <Section background="parchment" noPadding className="py-10">
        <FadeInView className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white rounded-2xl p-6 shadow-sm border border-parchment">
          <div>
            <h2 className="font-serif text-lg font-semibold text-soil">{t('download')}</h2>
            <p className="text-bark text-sm mt-1">{t('downloadNote')}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {/* PDF download — TODO: add real /catalog.pdf to public/ */}
            <a
              href="/catalog.pdf"
              className="inline-flex items-center gap-2 bg-brand-green text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-brand-green-hover transition-colors duration-200 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {t('download')}
            </a>
            <ContactCTA size="sm" label={t('requestQuote')} />
          </div>
        </FadeInView>
      </Section>

      {/* Catalog sections */}
      {catalogSections.map(({ sectionKey, gradient, productKey }) => {
        const sectionLabel = t(`sections.${sectionKey}`)
        const items = tProducts.raw(`${productKey}.items`) as Array<{ name: string; description: string }>
        const categoryDesc = tProducts(`${productKey}.description`)

        return (
          <Section key={sectionKey} background={sectionKey === 'nuts' ? 'parchment' : 'cream'}>
            <FadeInView>
              <h2 className="font-serif text-display-sm font-semibold text-soil mb-2">{sectionLabel}</h2>
              <p className="text-bark text-base leading-relaxed max-w-2xl mb-10">{categoryDesc}</p>
            </FadeInView>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.07}>
              {items.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-parchment hover:shadow-md transition-shadow duration-200">
                  <div className={`aspect-[16/9] bg-gradient-to-br ${gradient} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/20 text-[10px] tracking-widest uppercase">{item.name}</span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span className="bg-black/30 text-white/70 text-[10px] font-medium px-2 py-0.5 rounded-full">
                        Contact for price
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-base font-semibold text-soil mb-1.5">{item.name}</h3>
                    <p className="text-bark text-xs leading-relaxed line-clamp-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </StaggerContainer>
          </Section>
        )
      })}

      {/* Final CTA */}
      <Section background="parchment">
        <FadeInView className="text-center">
          <h2 className="font-serif text-display-sm font-semibold text-soil mb-4">Request a Custom Quote</h2>
          <p className="text-bark text-lg max-w-xl mx-auto mb-8">
            Tell us which products and quantities you need — we will provide current pricing and shipping options within one business day.
          </p>
          <ContactCTA size="lg" />
        </FadeInView>
      </Section>
    </>
  )
}
