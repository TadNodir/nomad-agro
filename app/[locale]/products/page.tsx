import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import { FadeInView } from '@/components/motion/FadeInView'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { Section, SectionHeader } from '@/components/ui/Section'
import { ContactCTA } from '@/components/ui/ContactCTA'
import { BreadcrumbJsonLd } from '@/components/shared/JsonLd'
import { BASE_URL } from '@/lib/constants'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.products' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/products`,
      languages: {
        en: `${BASE_URL}/en/products`,
        ru: `${BASE_URL}/ru/products`,
        uz: `${BASE_URL}/uz/products`,
      },
    },
  }
}

const categories = [
  {
    key: 'driedFruits' as const,
    slug: 'dried-fruits',
    gradient: 'from-amber-900 via-amber-800 to-orange-900',
    items: ['Apricots (Uryuk)', 'Raisins (Kishmish)', 'Prunes', 'Figs (Anjir)', 'Mulberries (Tut)', 'Dates'],
  },
  {
    key: 'nuts' as const,
    slug: 'nuts',
    gradient: 'from-stone-700 via-stone-600 to-amber-900',
    items: ['Walnuts', 'Almonds (Bodom)', 'Pistachios', 'Hazelnuts'],
  },
  {
    key: 'mungBeans' as const,
    slug: 'mung-beans',
    gradient: 'from-brand-green via-brand-green-mid to-brand-forest',
    items: ['Whole Green', 'Split (Mosh Dal)', 'Flour'],
  },
]

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'products' })

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: `/${locale}` },
          { name: 'Products', href: `/${locale}/products` },
        ]}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-brand-forest grain-overlay" aria-label="Products hero">
        <div className="container-base">
          <FadeInView>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-lime block mb-4">
              Export Range
            </span>
            <h1 className="font-serif text-display-md text-cream font-semibold text-balance max-w-3xl mb-6">
              {t('title')}
            </h1>
            <p className="text-stone/80 text-lg max-w-2xl leading-relaxed">{t('subtitle')}</p>
          </FadeInView>
        </div>
      </section>

      {/* Categories */}
      <Section>
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          stagger={0.12}
        >
          {categories.map(({ key, slug, gradient, items }) => {
            const name = t(`${key}.name`)
            const description = t(`${key}.description`)
            return (
              <article key={key} className="group rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-xl border border-parchment transition-shadow duration-300">
                <a
                  href={`/${locale}/products/${slug}`}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-inset rounded-3xl"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} group-hover:scale-105 transition-transform duration-500`} />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
                      {items.slice(0, 4).map((item) => (
                        <span key={item} className="bg-black/30 backdrop-blur-sm text-white/90 text-[10px] font-medium px-2 py-0.5 rounded-full">
                          {item}
                        </span>
                      ))}
                      {items.length > 4 && (
                        <span className="bg-black/30 backdrop-blur-sm text-white/90 text-[10px] font-medium px-2 py-0.5 rounded-full">
                          +{items.length - 4}
                        </span>
                      )}
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/30 backdrop-blur-sm text-white/70 text-[10px] font-medium px-2.5 py-1 rounded-full">
                        {t('noPrice')}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/20 text-xs tracking-widest uppercase">Photo: {name}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-7">
                    <h2 className="font-serif text-xl font-semibold text-soil mb-3 group-hover:text-brand-green transition-colors duration-200">
                      {name}
                    </h2>
                    <p className="text-bark text-sm leading-relaxed mb-5">{description}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green group-hover:gap-3 transition-all duration-200">
                      {t('learnMore')} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </a>
              </article>
            )
          })}
        </StaggerContainer>
      </Section>

      {/* CTA */}
      <Section background="parchment">
        <FadeInView className="text-center">
          <h2 className="font-serif text-display-sm font-semibold text-soil mb-4 text-balance">
            Interested in our products?
          </h2>
          <p className="text-bark text-lg max-w-xl mx-auto mb-8">
            {t('noPrice')} — prices update daily with crop availability. Contact us for a personalised quote.
          </p>
          <ContactCTA size="lg" />
        </FadeInView>
      </Section>
    </>
  )
}
