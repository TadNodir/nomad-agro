import { Leaf, Award, Globe, Shield } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FadeInView } from '@/components/motion/FadeInView'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { SectionHeader } from '@/components/ui/Section'

const icons = [Award, Leaf, Globe, Shield]
const accentColors = [
  'text-apricot bg-apricot/10',
  'text-brand-green bg-brand-green/10',
  'text-blue-600 bg-blue-50',
  'text-purple-600 bg-purple-50',
]

export default function WhyUs() {
  const t = useTranslations('whyUs')
  const pillars = t.raw('pillars') as Array<{ title: string; description: string }>

  return (
    <section className="section-padding bg-parchment" aria-labelledby="why-us-heading">
      <div className="container-base">
        <FadeInView>
          <SectionHeader
            tagline="Our Advantage"
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </FadeInView>

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          stagger={0.1}
        >
          {pillars.map((pillar, i) => {
            const Icon = icons[i]
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md border border-parchment/80 transition-shadow duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl mb-5 ${accentColors[i]}`}>
                  <Icon className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-soil mb-3">
                  {pillar.title}
                </h3>
                <p className="text-bark text-sm leading-relaxed">{pillar.description}</p>
              </div>
            )
          })}
        </StaggerContainer>

        {/* Trust bar */}
        <FadeInView delay={0.3} className="mt-14">
          <div className="bg-white rounded-2xl px-8 py-6 shadow-sm border border-parchment flex flex-wrap items-center justify-between gap-6">
            {[
              { num: '3+', label: 'Product categories' },
              { num: '10+', label: 'Countries served' },
              { num: '100%', label: 'Organic methods' },
              { num: 'B2B', label: 'Wholesale focus' },
            ].map(({ num, label }) => (
              <div key={label} className="text-center flex-1 min-w-[80px]">
                <div className="font-serif text-3xl font-bold text-brand-green mb-1">{num}</div>
                <div className="text-xs text-stone uppercase tracking-wider font-medium">{label}</div>
              </div>
            ))}
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
