'use client'

import { useRef, useEffect, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react'
import { useTranslations, useLocale } from 'next-intl'
import { Mail, Phone } from 'lucide-react'
import { ContactCTA } from '@/components/ui/ContactCTA'
import { Button } from '@/components/ui/Button'
import { COMPANY } from '@/lib/constants'

/* ─────────────────────────────────────────────────────────────────────────
   Frame constants
   ───────────────────────────────────────────────────────────────────────── */
const FRAME_COUNT = 120
const FRAME_W = 1600
const FRAME_H = 900
const TRACK_VH = 500
const FRAME_PATH = (i: number) =>
  `/frames/hero/frame_${String(i + 1).padStart(4, '0')}.jpg`

/* ─────────────────────────────────────────────────────────────────────────
   Panel ranges — strictly sequential, NO overlap.
   Each panel owns [start, end] of scrollYProgress exclusively.
   Gaps between panels = pure-video breathing room.

   Layout (scrollYProgress 0 → 1):
     [0.00 – 0.14]  hero          (14 %)
     [0.14 – 0.17]  ── gap ──      (3 %)
     [0.17 – 0.31]  products      (14 %)
     [0.31 – 0.34]  ── gap ──      (3 %)
     [0.34 – 0.48]  whyUs         (14 %)
     [0.48 – 0.51]  ── gap ──      (3 %)
     [0.51 – 0.65]  about         (14 %)
     [0.65 – 0.68]  ── gap ──      (3 %)
     [0.68 – 0.83]  reviews       (15 %)
     [0.83 – 0.86]  ── gap ──      (3 %)
     [0.86 – 1.00]  contact       (14 %)
   ───────────────────────────────────────────────────────────────────────── */
const PANELS = {
  hero:     [0.00, 0.14] as const,
  products: [0.17, 0.31] as const,
  whyUs:    [0.34, 0.48] as const,
  about:    [0.51, 0.65] as const,
  reviews:  [0.68, 0.83] as const,
  contact:  [0.86, 1.00] as const,
}

/** Fade ramp inside each panel — must be < (end-start)/2 */
const FADE = 0.025

/* ─────────────────────────────────────────────────────────────────────────
   PanelLayer
   Fades + lifts children within its own range.  Keys are clamped so they
   never bleed into a neighbour's range.
   ───────────────────────────────────────────────────────────────────────── */
function PanelLayer({
  scrollYProgress,
  start,
  end,
  className = '',
  children,
}: {
  scrollYProgress: MotionValue<number>
  start: number
  end: number
  className?: string
  children: React.ReactNode
}) {
  // Clamp keys to [start, end] so animation never extends into gaps
  const k0 = start
  const k1 = Math.min(start + FADE, (start + end) / 2)
  const k2 = Math.max(end - FADE, (start + end) / 2)
  const k3 = end

  const opacity = useTransform(scrollYProgress, [k0, k1, k2, k3], [0, 1, 1, 0])
  const y       = useTransform(scrollYProgress, [k0, k1, k2, k3], [18, 0, 0, -18])

  return (
    <motion.div
      className={`absolute inset-0 flex items-center ${className}`}
      style={{ opacity, y }}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Inline channel icons
   ───────────────────────────────────────────────────────────────────────── */
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
)

/* ─────────────────────────────────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────────────────────────────────── */
export default function ScrollScrubFullPage() {
  const tHero     = useTranslations('hero')
  const tProducts = useTranslations('products')
  const tWhyUs    = useTranslations('whyUs')
  const tAbout    = useTranslations('about')
  const tReviews  = useTranslations('reviews')
  const tContact  = useTranslations('contact')
  const locale    = useLocale()
  const prefersReducedMotion = useReducedMotion()

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const imagesRef    = useRef<HTMLImageElement[]>([])

  const [progress, setProgress] = useState(0)
  const [ready,    setReady]    = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1])

  /* ── canvas helper ──────────────────────────────────────────────────── */
  const paintFrame = (raw: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const lo = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(raw)))
    const hi = Math.max(0, Math.min(FRAME_COUNT - 1, lo + 1))
    const frac = raw - lo

    const imgLo = imagesRef.current[lo]
    if (!imgLo?.complete) return

    const dpr = window.devicePixelRatio || 1
    const cw  = canvas.clientWidth
    const ch  = canvas.clientHeight

    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width  = cw * dpr
      canvas.height = ch * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const scale = Math.max(cw / FRAME_W, ch / FRAME_H)
    const dw = FRAME_W * scale
    const dh = FRAME_H * scale
    const dx = (cw - dw) / 2
    const dy = (ch - dh) / 2

    ctx.clearRect(0, 0, cw, ch)

    // Draw base frame
    ctx.globalAlpha = 1
    ctx.drawImage(imgLo, dx, dy, dw, dh)

    // Cross-fade into next frame proportional to fractional position
    if (frac > 0.01 && hi !== lo) {
      const imgHi = imagesRef.current[hi]
      if (imgHi?.complete) {
        ctx.globalAlpha = frac
        ctx.drawImage(imgHi, dx, dy, dw, dh)
        ctx.globalAlpha = 1
      }
    }
  }

  /* ── preload all frames ─────────────────────────────────────────────── */
  useEffect(() => {
    if (prefersReducedMotion) { setReady(true); return }
    let loaded = 0
    let cancelled = false
    const imgs: HTMLImageElement[] = []

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.src = FRAME_PATH(i)
      img.onload = img.onerror = () => {
        if (cancelled) return
        loaded++
        setProgress(loaded / FRAME_COUNT)
        if (loaded === FRAME_COUNT) {
          setReady(true)
          paintFrame(0)
        }
      }
      imgs.push(img)
    }
    imagesRef.current = imgs
    return () => { cancelled = true }
  }, [prefersReducedMotion]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── continuous RAF loop — smooth frame interpolation ──────────────── */
  useEffect(() => {
    if (!ready || prefersReducedMotion) return

    let rafId: number
    let prevRaw = -1

    const tick = () => {
      const raw = frameIndex.get()
      // Only repaint when scroll position actually changed
      if (Math.abs(raw - prevRaw) > 0.0005) {
        prevRaw = raw
        paintFrame(raw)
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [ready, frameIndex, prefersReducedMotion]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── redraw on resize ───────────────────────────────────────────────── */
  useEffect(() => {
    if (prefersReducedMotion) return
    const onResize = () => paintFrame(frameIndex.get())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [prefersReducedMotion, frameIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── translation data ───────────────────────────────────────────────── */
  const pillars = tWhyUs.raw('pillars') as Array<{ title: string; description: string }>
  const reviews = tReviews.raw('items')  as Array<{
    name: string; company: string; country: string; text: string
  }>
  const productCategories = [
    { href: `/${locale}/products/${tProducts('driedFruits.slug')}`, name: tProducts('driedFruits.name'), desc: tProducts('driedFruits.description') },
    { href: `/${locale}/products/${tProducts('nuts.slug')}`,        name: tProducts('nuts.name'),        desc: tProducts('nuts.description') },
    { href: `/${locale}/products/${tProducts('mungBeans.slug')}`,   name: tProducts('mungBeans.name'),   desc: tProducts('mungBeans.description') },
  ]

  /* ── reduced-motion fallback ────────────────────────────────────────── */
  if (prefersReducedMotion) {
    return (
      <section className="relative h-screen w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={FRAME_PATH(0)}
          alt="Nomad Agro premium organic products"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex h-full items-center">
          <div className="container-base pb-16">
            <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-4">{tHero('tagline')}</p>
            <h1 className="font-serif text-display-lg text-cream font-semibold text-balance mb-6 leading-[1.05]">{tHero('headline')}</h1>
            <p className="text-lg text-white/75 leading-relaxed mb-10 max-w-xl">{tHero('subheadline')}</p>
            <div className="flex flex-wrap items-center gap-4">
              <ContactCTA variant="lime" size="lg" label={tHero('cta')} />
              <Button variant="ghost" size="lg" href={`/${locale}/products`}>{tHero('ctaSecondary')}</Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* ── main render ────────────────────────────────────────────────────── */
  return (
    <section
      ref={containerRef}
      style={{ height: `${TRACK_VH}vh` }}
      className="relative w-full"
      aria-label="Nomad Agro — scroll to explore"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Video canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />

        {/* Persistent dark gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

        {/* Loading screen */}
        {!ready && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-neutral-900 text-white">
            <div className="h-1 w-48 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full bg-[#5CE65C] transition-[width] duration-150"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="mt-3 text-sm tracking-wide text-white/70">{Math.round(progress * 100)}%</p>
          </div>
        )}

        {/* ── Panel layers — each in its own non-overlapping range ─────── */}
        <div className="absolute inset-0 z-10">

          {/* 1 ── HERO ────────────────────────────────────────────────── */}
          <PanelLayer scrollYProgress={scrollYProgress} start={PANELS.hero[0]} end={PANELS.hero[1]}>
            <div className="container-base w-full pb-16">
              <div className="max-w-2xl">
                <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-4">
                  {tHero('tagline')}
                </p>
                <h1 className="font-serif text-display-lg text-cream font-semibold text-balance mb-6 leading-[1.05]">
                  {tHero('headline')}
                </h1>
                <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-xl">
                  {tHero('subheadline')}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <ContactCTA variant="lime" size="lg" label={tHero('cta')} />
                  <Button variant="ghost" size="lg" href={`/${locale}/products`}>
                    {tHero('ctaSecondary')}
                  </Button>
                </div>
              </div>
            </div>
          </PanelLayer>

          {/* 2 ── OUR PRODUCTS ────────────────────────────────────────── */}
          <PanelLayer scrollYProgress={scrollYProgress} start={PANELS.products[0]} end={PANELS.products[1]} className="justify-center">
            <div className="container-base w-full text-center">
              <p className="text-brand-lime text-xs font-semibold tracking-[0.22em] uppercase mb-3">
                Export Range
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl text-cream font-semibold mb-4">
                {tProducts('title')}
              </h2>
              <p className="text-white/60 text-base mb-8 max-w-xl mx-auto">
                {tProducts('subtitle')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mb-8">
                {productCategories.map(({ href, name, desc }) => (
                  <a
                    key={href}
                    href={href}
                    className="group block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-left hover:bg-white/18 transition-colors duration-200 cursor-pointer"
                  >
                    <h3 className="text-cream font-semibold text-base mb-2">{name}</h3>
                    <p className="text-white/55 text-sm leading-relaxed line-clamp-2">{desc}</p>
                    <span className="mt-3 inline-block text-brand-lime text-sm group-hover:translate-x-1 transition-transform duration-150">→</span>
                  </a>
                ))}
              </div>
              <Button variant="ghost" size="md" href={`/${locale}/products`}>
                {tProducts('viewAll')}
              </Button>
            </div>
          </PanelLayer>

          {/* 3 ── WHY CHOOSE NOMAD AGRO ───────────────────────────────── */}
          <PanelLayer scrollYProgress={scrollYProgress} start={PANELS.whyUs[0]} end={PANELS.whyUs[1]} className="justify-center">
            <div className="container-base w-full text-center">
              <p className="text-brand-lime text-xs font-semibold tracking-[0.22em] uppercase mb-3">
                Our Advantage
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl text-cream font-semibold mb-8">
                {tWhyUs('title')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {pillars.map((pillar, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-left">
                    <h3 className="text-cream font-semibold text-sm mb-1.5">{pillar.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </PanelLayer>

          {/* 4 ── ROOTED IN UZBEKISTAN ────────────────────────────────── */}
          <PanelLayer scrollYProgress={scrollYProgress} start={PANELS.about[0]} end={PANELS.about[1]}>
            <div className="container-base w-full pb-16">
              <div className="max-w-2xl">
                <p className="text-brand-lime text-xs font-semibold tracking-[0.22em] uppercase mb-3">
                  {tAbout('teaser.tagline')}
                </p>
                <h2 className="font-serif text-4xl lg:text-5xl text-cream font-semibold mb-6 leading-[1.1] text-balance">
                  {tAbout('teaser.title')}
                </h2>
                <p className="text-lg text-white/75 leading-relaxed mb-10">
                  {tAbout('teaser.text')}
                </p>
                <Button variant="ghost" size="md" href={`/${locale}/about`}>
                  {tAbout('teaser.cta')}
                </Button>
              </div>
            </div>
          </PanelLayer>

          {/* 5 ── WHAT OUR PARTNERS SAY ───────────────────────────────── */}
          <PanelLayer scrollYProgress={scrollYProgress} start={PANELS.reviews[0]} end={PANELS.reviews[1]} className="justify-center">
            <div className="container-base w-full text-center">
              <p className="text-brand-lime text-xs font-semibold tracking-[0.22em] uppercase mb-3">
                Partner Reviews
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl text-cream font-semibold mb-8">
                {tReviews('title')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto">
                {reviews.map((review, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-left">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <svg key={j} className="w-3.5 h-3.5 text-brand-lime fill-current" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed italic mb-3">"{review.text}"</p>
                    <p className="text-cream font-semibold text-sm">{review.name}</p>
                    <p className="text-white/50 text-xs">{review.company} · {review.country}</p>
                  </div>
                ))}
              </div>
            </div>
          </PanelLayer>

          {/* 6 ── GET IN TOUCH ────────────────────────────────────────── */}
          <PanelLayer scrollYProgress={scrollYProgress} start={PANELS.contact[0]} end={PANELS.contact[1]} className="justify-center">
            <div className="container-base w-full text-center">
              <p className="text-brand-lime text-xs font-semibold tracking-[0.22em] uppercase mb-3">
                Get in Touch
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl text-cream font-semibold mb-4">
                {tContact('channels.title')}
              </h2>
              <p className="text-white/65 text-lg mb-10 max-w-md mx-auto">
                {tContact('subtitle')}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                <a href={`mailto:${COMPANY.emails.primary}`}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-cream text-sm font-medium px-5 py-3 rounded-xl hover:bg-white/20 transition-colors duration-200 cursor-pointer">
                  <Mail className="w-4 h-4" />{COMPANY.emails.primary}
                </a>
                <a href={COMPANY.whatsapp} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-cream text-sm font-medium px-5 py-3 rounded-xl hover:bg-white/20 transition-colors duration-200 cursor-pointer">
                  <WhatsAppIcon />WhatsApp
                </a>
                <a href={COMPANY.telegram} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-cream text-sm font-medium px-5 py-3 rounded-xl hover:bg-white/20 transition-colors duration-200 cursor-pointer">
                  <TelegramIcon />Telegram
                </a>
                <a href={`tel:${COMPANY.phones[0].number}`}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-cream text-sm font-medium px-5 py-3 rounded-xl hover:bg-white/20 transition-colors duration-200 cursor-pointer">
                  <Phone className="w-4 h-4" />{COMPANY.phones[0].display}
                </a>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <ContactCTA variant="lime" size="lg" label={tContact('channels.whatsappLabel')} />
                <Button variant="ghost" size="lg" href={`/${locale}/contacts`}>
                  {tContact('title')}
                </Button>
              </div>
            </div>
          </PanelLayer>

        </div>{/* /panels */}
      </div>{/* /sticky */}
    </section>
  )
}
