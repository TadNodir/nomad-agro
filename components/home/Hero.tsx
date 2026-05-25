'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { ContactCTA } from '@/components/ui/ContactCTA'

const stagger = {
  container: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  },
  item: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
    },
  },
}

export default function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const prefersReducedMotion = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] bg-brand-forest overflow-hidden flex items-center grain-overlay"
      aria-label="Hero"
    >
      {/* Radial ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(45, 139, 45, 0.18) 0%, transparent 70%)',
        }}
      />

      {/* Decorative organic blob — top left */}
      <motion.div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-brand-green/10 blur-3xl pointer-events-none"
        animate={prefersReducedMotion ? {} : { scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Decorative blob — bottom right */}
      <motion.div
        className="absolute -bottom-24 -right-24 w-[400px] h-[400px] blob bg-brand-lime/8 blur-3xl pointer-events-none"
        animate={prefersReducedMotion ? {} : { scale: [1, 1.12, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Decorative organic ring */}
      <div className="absolute top-1/2 right-[8%] -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-brand-lime/10 hidden xl:block pointer-events-none" />
      <div className="absolute top-1/2 right-[8%] -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-brand-lime/15 hidden xl:block pointer-events-none" />

      {/* Product visual placeholder (parallax) */}
      <motion.div
        className="absolute right-[5%] top-1/2 -translate-y-1/2 w-80 h-80 xl:w-[420px] xl:h-[420px] hidden lg:flex items-center justify-center"
        style={prefersReducedMotion ? {} : { y: imageY }}
      >
        <div className="relative w-full h-full blob-2 overflow-hidden bg-gradient-to-br from-brand-green-mid/60 via-brand-green/40 to-brand-forest-2/80 border border-brand-lime/20 shadow-2xl">
          {/* PLACEHOLDER — replace with real product photo */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <span className="text-brand-lime/40 text-xs font-medium tracking-widest uppercase block mb-2">
              Hero Image
            </span>
            <span className="text-cream/30 text-xs">
              Replace with high-quality<br />product photograph
            </span>
          </div>
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-tl from-brand-lime/5 to-transparent" />
        </div>
        {/* Floating accent dots */}
        <motion.div
          className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-brand-lime/20 blur-xl"
          animate={prefersReducedMotion ? {} : { scale: [1, 1.3, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-6 left-4 w-10 h-10 rounded-full bg-apricot/20 blur-lg"
          animate={prefersReducedMotion ? {} : { scale: [1, 1.4, 1] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        />
      </motion.div>

      {/* Main content */}
      <motion.div
        className="relative z-10 container-base w-full pt-28 pb-20 lg:pt-32 lg:pb-24"
        style={prefersReducedMotion ? {} : { y: contentY, opacity }}
      >
        <motion.div
          className="max-w-2xl"
          variants={stagger.container}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={stagger.item} className="mb-5">
            <span className="inline-flex items-center gap-2 bg-brand-lime/15 border border-brand-lime/30 text-brand-lime text-xs font-semibold tracking-[0.18em] uppercase px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse" />
              {t('badge')}
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={stagger.item}
            className="text-stone/70 text-sm font-medium tracking-widest uppercase mb-4"
          >
            {t('tagline')}
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={stagger.item}
            className="font-serif text-display-lg text-cream font-semibold text-balance mb-6 leading-[1.05]"
          >
            {t('headline')}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={stagger.item}
            className="text-lg text-stone/80 leading-relaxed mb-10 max-w-xl"
          >
            {t('subheadline')}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={stagger.item} className="flex flex-wrap items-center gap-4">
            <ContactCTA variant="lime" size="lg" label={t('cta')} />
            <Button
              variant="ghost"
              size="lg"
              href={`/${locale}/products`}
            >
              {t('ctaSecondary')}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <span className="text-stone/50 text-xs tracking-widest uppercase">{t('scrollHint')}</span>
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-stone/40" />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream/5 to-transparent pointer-events-none" />
    </section>
  )
}
