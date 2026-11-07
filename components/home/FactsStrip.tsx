import { getTranslations } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { ISO_CERT } from '@/lib/constants'

// Server-rendered and unanimated so the facts are in the raw HTML.
// Only facts already stated on /about — reuses its strings.
export async function FactsStrip({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'about' })
  const [, countries, established] = t.raw('stats') as Array<{ value: string; label: string }>

  const facts = [
    { value: established.value, label: established.label },
    { value: ISO_CERT.name, label: t('badges.isoSub') },
    { value: 'HACCP', label: t('badges.haccpSub') },
    { value: t('badges.fda'), label: t('badges.fdaSub') },
    { value: t('badges.china'), label: t('badges.chinaSub') },
    { value: countries.value, label: countries.label },
  ]

  return (
    <Section background="parchment" noPadding className="py-10">
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {facts.map(({ value, label }) => (
          <li key={label} className="text-center">
            <div className="font-serif text-lg font-semibold text-soil">{value}</div>
            <div className="text-xs text-bark">{label}</div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
