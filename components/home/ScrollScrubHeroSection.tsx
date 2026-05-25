'use client'

import { useTranslations, useLocale } from 'next-intl'
import { MessageCircle } from 'lucide-react'
import ScrollScrubHero from '@/components/ScrollScrubHero'
import { ContactCTA } from '@/components/ui/ContactCTA'
import { Button } from '@/components/ui/Button'

/**
 * Wraps ScrollScrubHero with the i18n hero overlay.
 * All copy comes from the 'hero' namespace — no hardcoded strings.
 * Rendered as a Client Component so useTranslations / useLocale work.
 */
export default function ScrollScrubHeroSection() {
  const t = useTranslations('hero')
  const locale = useLocale()

  return (
    <ScrollScrubHero
      trackVh={300}
      posterSrc="/frames/hero/frame_0001.jpg"
    >
      {/* Overlay: positioned in the sticky viewport, left-aligned like the old hero */}
      <div className="container-base w-full pb-20 lg:pb-24">
        <div className="max-w-2xl">

          {/* Badge */}
          <div className="mb-5">
            <span className="inline-flex items-center gap-2 bg-brand-lime/15 border border-brand-lime/30 text-brand-lime text-xs font-semibold tracking-[0.18em] uppercase px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse" />
              {t('badge')}
            </span>
          </div>

          {/* Tagline */}
          <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-4">
            {t('tagline')}
          </p>

          {/* Headline */}
          <h1 className="font-serif text-display-lg text-cream font-semibold text-balance mb-6 leading-[1.05]">
            {t('headline')}
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-white/75 leading-relaxed mb-10 max-w-xl">
            {t('subheadline')}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <ContactCTA variant="lime" size="lg" label={t('cta')} />
            <Button
              variant="ghost"
              size="lg"
              href={`/${locale}/products`}
            >
              {t('ctaSecondary')}
            </Button>
          </div>
        </div>
      </div>
    </ScrollScrubHero>
  )
}
