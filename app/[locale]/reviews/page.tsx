import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Star } from 'lucide-react'
import { FadeInView } from '@/components/motion/FadeInView'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { Section, SectionHeader } from '@/components/ui/Section'
import { ContactCTA } from '@/components/ui/ContactCTA'
import { BreadcrumbJsonLd } from '@/components/shared/JsonLd'
import { BASE_URL } from '@/lib/constants'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.reviews' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/reviews`,
      languages: {
        en: `${BASE_URL}/en/reviews`,
        ru: `${BASE_URL}/ru/reviews`,
        uz: `${BASE_URL}/uz/reviews`,
      },
    },
  }
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
  return (
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-green to-brand-forest flex items-center justify-center flex-shrink-0">
      <span className="text-brand-lime text-base font-bold font-serif">{initials}</span>
    </div>
  )
}

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'reviews' })
  const items = t.raw('items') as Array<{ name: string; company: string; country: string; text: string }>

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
              Partner Reviews
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
          {items.map((item, i) => (
            <blockquote
              key={i}
              className="bg-white rounded-2xl p-8 shadow-sm border border-parchment hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-apricot text-apricot" />
                ))}
              </div>
              <p className="text-bark text-base leading-relaxed italic flex-1 mb-6">
                &ldquo;{item.text}&rdquo;
              </p>
              <footer className="flex items-center gap-4 pt-4 border-t border-parchment">
                <Avatar name={item.name} />
                <div>
                  <cite className="not-italic font-semibold text-soil">{item.name}</cite>
                  <p className="text-stone text-sm mt-0.5">{item.company}</p>
                  <p className="text-stone text-xs">{item.country}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </StaggerContainer>
      </Section>

      {/* CTA */}
      <Section background="parchment">
        <FadeInView className="text-center">
          <h2 className="font-serif text-display-sm font-semibold text-soil mb-4">
            Ready to become a partner?
          </h2>
          <p className="text-bark text-lg max-w-xl mx-auto mb-8">
            Join our growing network of wholesale importers. Contact us to discuss your requirements.
          </p>
          <ContactCTA size="lg" />
        </FadeInView>
      </Section>
    </>
  )
}
