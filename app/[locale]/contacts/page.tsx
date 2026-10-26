import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Mail, Phone, MapPin } from 'lucide-react'
import { FadeInView } from '@/components/motion/FadeInView'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { Section } from '@/components/ui/Section'
import { ContactForm } from '@/components/contacts/ContactForm'
import { BreadcrumbJsonLd } from '@/components/shared/JsonLd'
import { COMPANY } from '@/lib/constants'
import { alternatesFor } from '@/lib/site'

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
)

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.contacts' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: alternatesFor(locale, '/contacts'),
  }
}

export default async function ContactsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  const { lat, lng } = COMPANY.coordinates

  const directChannels = [
    {
      Icon: Mail,
      label: t('channels.email'),
      value: COMPANY.emails.primary,
      href: `mailto:${COMPANY.emails.primary}`,
      external: false,
    },
    {
      Icon: WhatsAppIcon,
      label: t('channels.whatsapp'),
      value: t('channels.whatsappLabel'),
      href: COMPANY.whatsapp,
      external: true,
    },
    {
      Icon: TelegramIcon,
      label: t('channels.telegram'),
      value: t('channels.telegramLabel'),
      href: COMPANY.telegram,
      external: true,
    },
    {
      Icon: Phone,
      label: t('channels.phone'),
      value: COMPANY.phones[0].display,
      href: `tel:${COMPANY.phones[0].number}`,
      external: false,
    },
  ]

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: `/${locale}` },
          { name: 'Contacts', href: `/${locale}/contacts` },
        ]}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-brand-forest grain-overlay" aria-label="Contact hero">
        <div className="container-base">
          <FadeInView>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-lime block mb-4">
              {t('channels.title')}
            </span>
            <h1 className="font-serif text-display-md text-cream font-semibold text-balance max-w-3xl mb-6">
              {t('title')}
            </h1>
            <p className="text-stone/80 text-lg max-w-2xl leading-relaxed">{t('subtitle')}</p>
          </FadeInView>
        </div>
      </section>

      {/* Channel cards */}
      <Section background="parchment" noPadding className="py-10">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4" stagger={0.08}>
          {directChannels.map(({ Icon, label, value, href, external }) => (
            <a
              key={label}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-parchment hover:border-brand-green/30 hover:shadow-md transition-all duration-200 cursor-pointer text-center"
            >
              <span className="text-brand-green group-hover:text-brand-green-hover transition-colors duration-150">
                <Icon />
              </span>
              <div>
                <div className="font-semibold text-soil text-sm">{label}</div>
                <div className="text-stone text-xs mt-0.5 break-all">{value}</div>
              </div>
            </a>
          ))}
        </StaggerContainer>
      </Section>

      {/* Form + Info */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <div id="inquiry" className="lg:col-span-3 scroll-mt-24">
            <FadeInView direction="left">
              <h2 className="font-serif text-display-sm font-semibold text-soil mb-6">
                {t('form.title')}
              </h2>
              <Suspense>
                <ContactForm />
              </Suspense>
            </FadeInView>
          </div>

          {/* Contact info */}
          <div className="lg:col-span-2">
            <FadeInView direction="right" delay={0.1}>
              <div className="space-y-8">
                {/* All emails */}
                <div>
                  <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-green mb-3">
                    {t('allEmails')}
                  </h3>
                  <ul className="space-y-2">
                    {Object.values(COMPANY.emails).map((email) => (
                      <li key={email}>
                        <a
                          href={`mailto:${email}`}
                          className="flex items-center gap-2 text-bark hover:text-brand-green text-sm transition-colors duration-150"
                        >
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          {email}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* All phones */}
                <div>
                  <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-green mb-3">
                    {t('allPhones')}
                  </h3>
                  <ul className="space-y-2">
                    {COMPANY.phones.map((p) => (
                      <li key={p.number}>
                        <a
                          href={`tel:${p.number}`}
                          className="flex items-center gap-2 text-bark hover:text-brand-green text-sm transition-colors duration-150"
                        >
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          {p.display}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-green mb-3">
                    {t('address')}
                  </h3>
                  <address className="not-italic text-bark text-sm flex items-start gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-green" />
                    <div>
                      <p className="font-medium text-soil">{t('company')}</p>
                      <p className="mt-1">{t('addressValue')}</p>
                      <p className="mt-1 text-stone">{t('registration')}</p>
                    </div>
                  </address>
                </div>

                {/* Map */}
                <div>
                  <div className="rounded-2xl overflow-hidden border border-parchment h-64 bg-parchment">
                    <iframe
                      title={t('address')}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.003}%2C${lat - 0.0018}%2C${lng + 0.003}%2C${lat + 0.0018}&layer=mapnik&marker=${lat}%2C${lng}`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full border-0"
                    />
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:text-brand-green-hover transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    {t('openInMaps')}
                  </a>
                </div>
              </div>
            </FadeInView>
          </div>
        </div>
      </Section>
    </>
  )
}
