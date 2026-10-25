import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { MapPin, Leaf, Award, TrendingUp, ExternalLink, ShieldCheck, Globe2 } from 'lucide-react'
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
        'x-default': `${BASE_URL}/en/about`,
        en: `${BASE_URL}/en/about`,
        ru: `${BASE_URL}/ru/about`,
        uz: `${BASE_URL}/uz/about`,
      },
    },
  }
}

const processIcons = [Leaf, Award, TrendingUp]

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  const stats = t.raw('stats') as Array<{ value: string; label: string }>
  const regions = t.raw('regions.regionsList') as string[]
  const processSteps = t.raw('process.steps') as Array<{ title: string; description: string }>

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

      {/* Certifications & approvals at a glance */}
      <Section noPadding className="py-10">
        <FadeInView>
          <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-brand-green mb-6">
            {t('badges.title')}
          </p>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <li>
              <a
                href="#certifications"
                className="h-full flex flex-col items-center text-center gap-2 bg-white rounded-2xl border border-parchment p-5 hover:shadow-md transition-shadow"
              >
                <ShieldCheck className="w-14 h-14 text-brand-green" aria-hidden="true" />
                <span className="font-serif text-lg font-semibold text-soil">ISO 22000:2018</span>
                <span className="text-xs text-bark">{t('badges.isoSub')}</span>
              </a>
            </li>
            <li className="h-full flex flex-col items-center text-center gap-2 bg-white rounded-2xl border border-parchment p-5">
              <Image
                src="/images/haccp-certified.webp"
                alt="HACCP certified — food safety"
                width={400}
                height={293}
                className="h-14 w-auto"
              />
              <span className="font-serif text-lg font-semibold text-soil">HACCP</span>
              <span className="text-xs text-bark">{t('badges.haccpSub')}</span>
            </li>
            <li className="h-full flex flex-col items-center text-center gap-2 bg-white rounded-2xl border border-parchment p-5">
              <Image
                src="/images/fda-registered.webp"
                alt="FDA registered"
                width={300}
                height={300}
                className="h-14 w-14"
              />
              <span className="font-serif text-lg font-semibold text-soil">{t('badges.fda')}</span>
              <span className="text-xs text-bark">{t('badges.fdaSub')}</span>
            </li>
            <li className="h-full flex flex-col items-center text-center gap-2 bg-white rounded-2xl border border-parchment p-5">
              <Globe2 className="w-14 h-14 text-brand-green" aria-hidden="true" />
              <span className="font-serif text-lg font-semibold text-soil">{t('badges.china')}</span>
              <span className="text-xs text-bark">{t('badges.chinaSub')}</span>
            </li>
          </ul>
        </FadeInView>
      </Section>

      {/* Story */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <FadeInView direction="left">
            <h2 className="font-serif text-display-sm font-semibold text-soil mb-6">{t('story.title')}</h2>
            <p className="text-bark text-lg leading-relaxed mb-6">{t('story.text')}</p>
          </FadeInView>
          <FadeInView direction="right" delay={0.1}>
            <div className="aspect-[848/464] rounded-3xl overflow-hidden bg-black shadow-xl">
              <video
                controls
                playsInline
                preload="none"
                poster="/images/about-video-poster.webp"
                aria-label={t('video.title')}
                className="w-full h-full"
              >
                <source src="/video_presentation.mp4" type="video/mp4" />
              </video>
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
          <SectionHeader title={t('process.title')} tagline={t('process.tagline')} />
        </FadeInView>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" stagger={0.1}>
          {processSteps.map(({ title, description }, i) => {
            const Icon = processIcons[i]
            return (
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
          )})}
        </StaggerContainer>
      </Section>

      {/* Certifications */}
      <Section id="certifications" background="parchment" className="scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeInView>
            <h2 className="font-serif text-display-sm font-semibold text-soil mb-4">{t('certifications.title')}</h2>
            <p className="text-bark text-lg leading-relaxed mb-8">{t('certifications.text')}</p>
            <ContactCTA size="lg" />
          </FadeInView>
          <FadeInView delay={0.1}>
            <div className="bg-white rounded-3xl border border-parchment shadow-sm p-6 sm:p-8">
              <div className="flex items-start gap-5">
                <a
                  href="/documents/ISO-22000-Nomad-Agro.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 block w-28 sm:w-36 rounded-lg overflow-hidden border border-parchment shadow-sm hover:shadow-md transition-shadow"
                >
                  <Image
                    src="/images/iso-22000-certificate.webp"
                    alt={`ISO 22000:2018 — ${t('certifications.cardSubtitle')}`}
                    width={974}
                    height={1351}
                    className="w-full h-auto"
                  />
                </a>
                <div className="min-w-0">
                  <p className="font-serif text-2xl font-semibold text-brand-green">ISO 22000:2018</p>
                  <p className="text-bark text-sm mb-4">{t('certifications.cardSubtitle')}</p>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-stone text-xs">{t('certifications.issuerLabel')}</dt>
                      <dd className="text-soil font-medium">First Quality Certification (FQC)</dd>
                    </div>
                    <div>
                      <dt className="text-stone text-xs">{t('certifications.numberLabel')}</dt>
                      <dd className="text-soil font-medium break-all">12.25.77812.99182.I</dd>
                    </div>
                    <div>
                      <dt className="text-stone text-xs">{t('certifications.issuedLabel')}</dt>
                      <dd className="text-soil font-medium">29.08.2025</dd>
                    </div>
                    <div>
                      <dt className="text-stone text-xs">{t('certifications.scopeLabel')}</dt>
                      <dd className="text-soil font-medium">{t('certifications.scopeValue')}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-parchment space-y-3">
                <a
                  href="/documents/ISO-22000-Nomad-Agro.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:text-brand-green-hover transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t('certifications.view')}
                </a>
                <p className="text-bark text-sm">{t('certifications.specsNote')}</p>
                <p className="text-stone text-xs">{t('certifications.registered')}</p>
              </div>
            </div>
          </FadeInView>
        </div>
      </Section>
    </>
  )
}
