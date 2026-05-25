import { Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FadeInView } from '@/components/motion/FadeInView'
import { StaggerContainer } from '@/components/motion/StaggerContainer'
import { SectionHeader } from '@/components/ui/Section'

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-apricot text-apricot" />
      ))}
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-green to-brand-forest flex items-center justify-center flex-shrink-0">
      <span className="text-brand-lime text-sm font-bold font-serif">{initials}</span>
    </div>
  )
}

export default function Testimonials() {
  const t = useTranslations('reviews')
  const items = t.raw('items') as Array<{
    name: string
    company: string
    country: string
    text: string
  }>

  return (
    <section className="section-padding bg-brand-forest grain-overlay" aria-labelledby="reviews-heading">
      <div className="container-base relative z-10">
        <FadeInView>
          <SectionHeader
            tagline="Partner Reviews"
            title={t('title')}
            subtitle={t('subtitle')}
            light
          />
        </FadeInView>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          stagger={0.12}
        >
          {items.map((item, i) => (
            <blockquote
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-7 backdrop-blur-sm hover:bg-white/8 transition-colors duration-300"
            >
              <StarRating />
              <p className="text-cream/85 text-sm leading-relaxed mt-4 mb-6 italic">
                &ldquo;{item.text}&rdquo;
              </p>
              <footer className="flex items-center gap-3">
                <Avatar name={item.name} />
                <div>
                  <cite className="not-italic font-semibold text-cream text-sm">{item.name}</cite>
                  <p className="text-stone text-xs mt-0.5">
                    {item.company} · {item.country}
                  </p>
                </div>
              </footer>
            </blockquote>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
