import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { alternatesFor } from '@/lib/site'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.privacy' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: alternatesFor(locale, '/privacy'),
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'privacy' })
  const sections = t.raw('sections') as Array<{ title: string; body: string[] }>

  return (
    <>
      <section className="pt-32 pb-12 bg-brand-forest grain-overlay" aria-label={t('title')}>
        <div className="container-narrow">
          <h1 className="font-serif text-display-md text-cream font-semibold mb-4">{t('title')}</h1>
          <p className="text-stone/80 text-sm">{t('updated')}</p>
        </div>
      </section>

      <Section narrow>
        <div className="max-w-3xl">
          <p className="text-bark text-lg leading-relaxed mb-10">{t('intro')}</p>
          {sections.map((section) => (
            <div key={section.title} className="mb-10 last:mb-0">
              <h2 className="font-serif text-2xl font-semibold text-soil mb-4">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-bark leading-relaxed mb-3 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
