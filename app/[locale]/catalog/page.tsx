import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Download, AlertCircle, FileText } from 'lucide-react'
import { FadeInView } from '@/components/motion/FadeInView'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { Section } from '@/components/ui/Section'
import { ContactCTA } from '@/components/ui/ContactCTA'
import { BreadcrumbJsonLd } from '@/components/shared/JsonLd'
import { BASE_URL } from '@/lib/constants'
import { CATALOG, type SpecValue } from '@/lib/catalog'

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

export default async function CatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'catalog' })
  const tProducts = await getTranslations({ locale, namespace: 'products' })
  const tItems = await getTranslations({ locale, namespace: 'catalog.items' })
  const tSpecs = await getTranslations({ locale, namespace: 'catalog.specs' })
  const tValues = await getTranslations({ locale, namespace: 'catalog.values' })
  const tGroups = await getTranslations({ locale, namespace: 'catalog.groups' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const tCta = await getTranslations({ locale, namespace: 'cta' })

  const specText = (value: SpecValue) =>
    typeof value === 'string' ? value : tValues(value.key, value.n ? { n: value.n } : undefined)

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
              {t('eyebrow')}
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
            <a
              href="/NOMAD_AGRO_PRODUCTS.pdf"
              download="Nomad-Agro-Catalog.pdf"
              className="inline-flex items-center gap-2 bg-brand-green text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-brand-green-hover transition-colors duration-200 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {t('download')}
            </a>
            <ContactCTA size="sm" label={tCta('requestQuote')} />
          </div>
        </FadeInView>
      </Section>

      {/* Catalog sections */}
      {CATALOG.map(({ id, slug, gradient, groups }) => (
        <Section
          key={id}
          id={slug}
          background={id === 'nuts' ? 'parchment' : 'cream'}
          className="scroll-mt-20"
        >
          <FadeInView>
            <h2 className="font-serif text-display-sm font-semibold text-soil mb-2">{t(`sections.${id}`)}</h2>
            <p className="text-bark text-base leading-relaxed max-w-2xl mb-10">
              {tProducts(`${id}.description`)}
            </p>
          </FadeInView>

          {groups.map((group) => (
            <div key={group.id} className="mb-12 last:mb-0">
              {groups.length > 1 && (
                <h3 className="font-serif text-xl font-semibold text-brand-green mb-5">
                  {tGroups(group.id)}
                </h3>
              )}

              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.05}>
                {group.products.map((product) => (
                  <div
                    key={product.id}
                    className="h-full bg-white rounded-2xl overflow-hidden shadow-sm border border-parchment hover:shadow-md transition-shadow duration-200"
                  >
                    <div className={`aspect-[4/3] bg-gradient-to-br ${gradient} relative`}>
                      <Image
                        src={`/images/catalog/${product.id}.webp`}
                        alt={tItems(product.id)}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw"
                        className="object-cover"
                      />
                      <div className="absolute top-2.5 right-2.5">
                        <span className="bg-black/50 backdrop-blur-sm text-white/90 text-[10px] font-medium px-2 py-0.5 rounded-full">
                          {tCommon('noPrice')}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-serif text-base font-semibold text-soil mb-3">
                        {tItems(product.id)}
                      </h4>
                      <dl className="space-y-1.5 text-xs">
                        {product.specs.map(([label, value]) => (
                          <div
                            key={label}
                            className="flex justify-between gap-4 border-b border-parchment/70 pb-1.5 last:border-0 last:pb-0"
                          >
                            <dt className="text-stone">{tSpecs(label)}</dt>
                            <dd className="text-soil font-medium text-right">{specText(value)}</dd>
                          </div>
                        ))}
                      </dl>
                      <Link
                        href={`/${locale}/contacts?spec=${product.id}#inquiry`}
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green hover:text-brand-green-hover transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {t('requestSpec')}
                      </Link>
                    </div>
                  </div>
                ))}
              </StaggerContainer>
            </div>
          ))}
        </Section>
      ))}

      {/* Final CTA */}
      <Section background="parchment">
        <FadeInView className="text-center">
          <h2 className="font-serif text-display-sm font-semibold text-soil mb-4">{t('finalCtaTitle')}</h2>
          <p className="text-bark text-lg max-w-xl mx-auto mb-8">
            {t('finalCtaText')}
          </p>
          <ContactCTA size="lg" />
        </FadeInView>
      </Section>
    </>
  )
}
