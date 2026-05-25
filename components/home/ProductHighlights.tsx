import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { FadeInView } from '@/components/motion/FadeInView'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { SectionHeader } from '@/components/ui/Section'
import { ContactCTA } from '@/components/ui/ContactCTA'

const categoryConfig = [
  {
    key: 'driedFruits' as const,
    slug: 'dried-fruits',
    gradient: 'from-amber-900 via-amber-800 to-orange-900',
    accent: '#D4893A',
    items: ['Apricots', 'Raisins', 'Plums', 'Figs', 'Mulberries'],
  },
  {
    key: 'nuts' as const,
    slug: 'nuts',
    gradient: 'from-stone-700 via-stone-600 to-amber-900',
    accent: '#9C8878',
    items: ['Walnuts', 'Almonds', 'Pistachios', 'Hazelnuts'],
  },
  {
    key: 'mungBeans' as const,
    slug: 'mung-beans',
    gradient: 'from-brand-green via-brand-green-mid to-brand-forest',
    accent: '#5CE65C',
    items: ['Whole Green', 'Split (Dal)', 'Flour'],
  },
]

export default function ProductHighlights() {
  const t = useTranslations('products')
  const locale = useLocale()

  return (
    <section className="section-padding bg-cream" aria-labelledby="products-heading">
      <div className="container-base">
        <FadeInView>
          <SectionHeader
            tagline="Export Range"
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </FadeInView>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          stagger={0.12}
        >
          {categoryConfig.map(({ key, slug, gradient, items }) => {
            const name = t(`${key}.name`)
            const description = t(`${key}.description`)
            return (
              <article
                key={key}
                className="group relative rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300 border border-parchment cursor-pointer"
              >
                <a
                  href={`/${locale}/products/${slug}`}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-inset rounded-3xl"
                  aria-label={`${name} — ${t('learnMore')}`}
                >
                  {/* Image area */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-500 group-hover:scale-105`}
                    />
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Items list overlay */}
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
                      {items.map((item) => (
                        <span
                          key={item}
                          className="bg-black/30 backdrop-blur-sm text-white/90 text-[10px] font-medium px-2 py-0.5 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* No price badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/30 backdrop-blur-sm text-white/70 text-[10px] font-medium px-2.5 py-1 rounded-full tracking-wide">
                        {t('noPrice')}
                      </span>
                    </div>

                    {/* Placeholder label */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/20 text-xs font-medium tracking-wider uppercase">
                        Photo: {name}
                      </span>
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-semibold text-soil mb-2 group-hover:text-brand-green transition-colors duration-200">
                      {name}
                    </h3>
                    <p className="text-bark text-sm leading-relaxed mb-5 line-clamp-2">
                      {description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green group-hover:gap-3 transition-all duration-200">
                      {t('learnMore')} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </a>
              </article>
            )
          })}
        </StaggerContainer>

        <FadeInView delay={0.3} className="mt-12 text-center">
          <ContactCTA size="lg" label={t('requestQuote')} />
        </FadeInView>
      </div>
    </section>
  )
}
