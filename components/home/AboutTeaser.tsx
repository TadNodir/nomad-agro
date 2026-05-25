import { ArrowRight, MapPin } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { FadeInView } from '@/components/motion/FadeInView'
import { ParallaxDiv } from '@/components/motion/ParallaxDiv'

export default function AboutTeaser() {
  const t = useTranslations('about.teaser')
  const locale = useLocale()

  return (
    <section className="section-padding bg-cream overflow-hidden" aria-labelledby="about-teaser-heading">
      <div className="container-base">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image side */}
          <FadeInView direction="left" className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-none">
              {/* Main image placeholder */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-brand-green-hover via-brand-green to-brand-forest shadow-2xl">
                <ParallaxDiv offset={20} className="absolute inset-0">
                  <div className="w-full h-[115%] -mt-[7.5%] bg-gradient-to-br from-brand-forest-2/80 via-brand-green/60 to-brand-green-mid/80" />
                </ParallaxDiv>
                {/* Placeholder */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                  <span className="text-cream/30 text-xs font-medium tracking-widest uppercase block mb-2">About Image</span>
                  <span className="text-cream/20 text-xs">Uzbekistan foothill landscape<br />or farming scene photo</span>
                </div>
              </div>

              {/* Floating info card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 max-w-[200px] border border-parchment">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-brand-green" />
                  <span className="text-xs font-semibold text-brand-green uppercase tracking-wider">Origin</span>
                </div>
                <p className="text-soil text-sm font-semibold font-serif leading-snug">
                  Foothill regions of Uzbekistan
                </p>
                <p className="text-stone text-xs mt-1">Grown organically since foundation</p>
              </div>

              {/* Accent blob */}
              <div className="absolute -top-6 -left-6 w-24 h-24 blob bg-apricot/20 -z-10" />
            </div>
          </FadeInView>

          {/* Text side */}
          <div className="order-1 lg:order-2">
            <FadeInView direction="right">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-green block mb-4">
                {t('tagline')}
              </span>
              <h2
                id="about-teaser-heading"
                className="font-serif text-display-sm md:text-display-md font-semibold text-soil text-balance mb-6"
              >
                {t('title')}
              </h2>
              <p className="text-bark text-lg leading-relaxed mb-8">{t('text')}</p>

              {/* Organic regions */}
              <div className="mb-8 p-5 bg-parchment rounded-2xl border border-parchment/60">
                <p className="text-xs font-semibold tracking-wider uppercase text-stone mb-3">Growing Regions</p>
                <div className="flex flex-wrap gap-2">
                  {['Fergana Valley', 'Surkhandarya', 'Kashkadarya', 'Namangan', 'Samarkand'].map((r) => (
                    <span key={r} className="text-xs bg-white border border-parchment text-bark px-3 py-1.5 rounded-full font-medium">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 text-brand-green font-semibold hover:gap-4 transition-all duration-200"
              >
                {t('cta')} <ArrowRight className="w-4 h-4" />
              </a>
            </FadeInView>
          </div>
        </div>
      </div>
    </section>
  )
}
