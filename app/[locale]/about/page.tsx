import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { MapPin, Leaf, Award, TrendingUp } from 'lucide-react'
import { FadeInView } from '@/components/motion/FadeInView'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { Section, SectionHeader } from '@/components/ui/Section'
import { ContactCTA } from '@/components/ui/ContactCTA'
import { OrganizationJsonLd, BreadcrumbJsonLd } from '@/components/shared/JsonLd'
import { BASE_URL } from '@/lib/constants'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.about' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/about`,
      languages: {
        en: `${BASE_URL}/en/about`,
        ru: `${BASE_URL}/ru/about`,
        uz: `${BASE_URL}/uz/about`,
      },
    },
  }
}

const processSteps = [
  { icon: Leaf, title: 'Organic Farming', description: 'Partnered farmers use traditional methods — no mineral fertilizers, no chemical treatments.' },
  { icon: Award, title: 'Quality Inspection', description: 'Every batch is inspected for grade, cleanliness, moisture, and export specifications.' },
  { icon: TrendingUp, title: 'Export & Delivery', description: 'We handle all documentation, logistics, and phytosanitary certification for your destination market.' },
]

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  const stats = t.raw('stats') as Array<{ value: string; label: string }>
  const regions = t.raw('regions.regionsList') as string[]

  return (
    <>
      <OrganizationJsonLd locale={locale} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: `/${locale}` },
          { name: 'About', href: `/${locale}/about` },
        ]}
      />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-brand-forest grain-overlay relative overflow-hidden" aria-label="About hero">
        <div className="absolute inset-0 bg-gradient-radial from-brand-green/10 to-transparent pointer-events-none" />
        <div className="container-base relative z-10">
          <FadeInView>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-lime block mb-4">
              {t('teaser.tagline')}
            </span>
            <h1 className="font-serif text-display-md text-cream font-semibold text-balance max-w-3xl mb-6">
              {t('title')}
            </h1>
            <p className="text-stone/80 text-lg max-w-2xl leading-relaxed">{t('pageSubtitle')}</p>
          </FadeInView>
        </div>
      </section>

      {/* Stats */}
      <Section background="parchment" noPadding className="py-10">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6" stagger={0.08}>
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-serif text-4xl font-bold text-brand-green mb-1">{value}</div>
              <div className="text-xs text-stone uppercase tracking-wider font-medium">{label}</div>
            </div>
          ))}
        </StaggerContainer>
      </Section>

      {/* Story */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <FadeInView direction="left">
            <h2 className="font-serif text-display-sm font-semibold text-soil mb-6">{t('story.title')}</h2>
            <p className="text-bark text-lg leading-relaxed mb-6">{t('story.text')}</p>
          </FadeInView>
          <FadeInView direction="right" delay={0.1}>
            {/* Story image placeholder */}
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-brand-green-hover to-brand-forest flex items-center justify-center shadow-xl">
              <span className="text-cream/20 text-xs tracking-widest uppercase">Company Story Photo</span>
            </div>
          </FadeInView>
        </div>
      </Section>

      {/* Growing regions */}
      <Section background="parchment">
        <FadeInView className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="font-serif text-display-sm font-semibold text-soil mb-4">{t('regions.title')}</h2>
          <p className="text-bark text-lg leading-relaxed">{t('regions.text')}</p>
        </FadeInView>
        <FadeInView delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions.map((region) => (
              <div key={region} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-parchment">
                <MapPin className="w-5 h-5 text-brand-green flex-shrink-0" />
                <span className="text-soil font-medium text-sm">{region}</span>
              </div>
            ))}
          </div>
        </FadeInView>
      </Section>

      {/* Process */}
      <Section>
        <FadeInView>
          <SectionHeader title={t('process.title')} tagline="How We Work" />
        </FadeInView>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" stagger={0.1}>
          {processSteps.map(({ icon: Icon, title, description }, i) => (
            <div key={i} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand-green" />
                </div>
                <span className="text-3xl font-bold font-serif text-parchment select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-soil mb-2">{title}</h3>
              <p className="text-bark text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </StaggerContainer>
      </Section>

      {/* Certifications */}
      <Section background="parchment">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeInView>
            <h2 className="font-serif text-display-sm font-semibold text-soil mb-4">{t('certifications.title')}</h2>
            <p className="text-bark text-lg leading-relaxed mb-8">{t('certifications.text')}</p>
            <ContactCTA size="lg" />
          </FadeInView>
          <FadeInView delay={0.1}>
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-parchment to-white border border-parchment flex items-center justify-center shadow-inner">
              <span className="text-stone text-xs tracking-widest uppercase">Certifications / Quality marks</span>
            </div>
          </FadeInView>
        </div>
      </Section>
    </>
  )
}
