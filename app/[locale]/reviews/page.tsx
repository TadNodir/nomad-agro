import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Package, Quote } from 'lucide-react'
import { FadeInView } from '@/components/motion/FadeInView'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { Section, SectionHeader } from '@/components/ui/Section'
import { ContactCTA } from '@/components/ui/ContactCTA'
import { BreadcrumbJsonLd } from '@/components/shared/JsonLd'
import { alternatesFor } from '@/lib/site'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.reviews' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: alternatesFor(locale, '/reviews'),
  }
}

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'reviews' })
  const items = t.raw('items') as Array<{ company: string; country: string; products: string; text: string }>

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: `/${locale}` },
          { name: 'Reviews', href: `/${locale}/reviews` },
        ]}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-brand-forest grain-overlay" aria-label="Reviews hero">
        <div className="container-base">
          <FadeInView>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-lime block mb-4">
              {t('eyebrow')}
            </span>
            <h1 className="font-serif text-display-md text-cream font-semibold text-balance max-w-3xl mb-6">
              {t('title')}
            </h1>
            <p className="text-stone/80 text-lg max-w-2xl leading-relaxed">{t('subtitle')}</p>
          </FadeInView>
        </div>
      </section>

      {/* Reviews grid */}
      <Section>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.1}>
          {items.map((item) => (
            <blockquote
              key={item.company}
              className="h-full bg-white rounded-2xl p-8 shadow-sm border border-parchment hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              <Quote className="w-7 h-7 text-brand-green/30 mb-4" aria-hidden="true" />
              <p className="text-bark text-base leading-relaxed italic flex-1 mb-6">
                &ldquo;{item.text}&rdquo;
              </p>
              <footer className="pt-4 border-t border-parchment">
                <cite className="not-italic font-semibold text-soil block">{item.company}</cite>
                <p className="text-stone text-sm mt-0.5">{item.country}</p>
                <p className="flex items-start gap-1.5 text-stone text-xs mt-2">
                  <Package className="w-3.5 h-3.5 text-brand-green flex-shrink-0 mt-0.5" />
                  {item.products}
                </p>
              </footer>
            </blockquote>
          ))}
        </StaggerContainer>
      </Section>

      {/* CTA */}
      <Section background="parchment">
        <FadeInView className="text-center">
          <h2 className="font-serif text-display-sm font-semibold text-soil mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="text-bark text-lg max-w-xl mx-auto mb-8">
            {t('ctaText')}
          </p>
          <ContactCTA size="lg" />
        </FadeInView>
      </Section>
    </>
  )
}
