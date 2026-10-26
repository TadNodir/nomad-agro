'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react'
import { useTranslations, useLocale } from 'next-intl'
import { Mail, Phone, Linkedin } from 'lucide-react'
import { ContactCTA } from '@/components/ui/ContactCTA'
import { Button } from '@/components/ui/Button'
import { COMPANY } from '@/lib/constants'

/* ─────────────────────────────────────────────────────────────────────────
   Frame sets
   desktop  — landscape cinemascope 1600×600  (hero-source.mp4)
   mobile   — portrait  9:16       750×1274   (hero-source-mobile.mp4)
   Both use cover fit; the matching bg colour fills any sub-pixel gaps.
   ───────────────────────────────────────────────────────────────────────── */
type FrameSet = { count: number; w: number; h: number; bg: string; path: (i: number) => string }

const FRAME_SETS: Record<'desktop' | 'mobile', FrameSet> = {
  desktop: {
    count: 192, w: 1600, h: 600, bg: '#CEBB9D',
    path: (i) => `/frames/hero/frame_${String(i + 1).padStart(4, '0')}.jpg`,
  },
  mobile: {
    count: 187, w: 750, h: 1274, bg: '#C8B499',
    path: (i) => `/frames/hero-mobile/frame_${String(i + 1).padStart(4, '0')}.jpg`,
  },
}

const TRACK_VH = 500

/* ─────────────────────────────────────────────────────────────────────────
   Panel ranges — strictly sequential, NO overlap.
   ───────────────────────────────────────────────────────────────────────── */
const PANELS = {
  hero:     [0.00, 0.14] as const,
  products: [0.17, 0.31] as const,
  whyUs:    [0.34, 0.48] as const,
  about:    [0.51, 0.65] as const,
  reviews:  [0.68, 0.83] as const,
  contact:  [0.86, 1.00] as const,
}

const FADE = 0.025

/* ─────────────────────────────────────────────────────────────────────────
   Liquid-Glass shared classes
   Apple-style: heavy backdrop-blur + backdrop-saturate + specular top edge
   ───────────────────────────────────────────────────────────────────────── */
// Slightly higher opacity (0.14) than the dark-video version so the card
// remains distinct against the new light cream background frames.
const glass =
  'bg-white/[0.14] backdrop-blur-2xl backdrop-saturate-[1.8] ' +
  'border border-white/30 rounded-2xl ' +
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(0,0,0,0.08),0_4px_28px_rgba(0,0,0,0.28)] ' +
  'transition-all duration-200'

const glassInteractive =
  glass +
  ' cursor-pointer hover:bg-white/[0.22] hover:border-white/40 ' +
  'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.40),0_8px_36px_rgba(0,0,0,0.35)]'

/* ─────────────────────────────────────────────────────────────────────────
   PanelLayer
   mobileTop=true  → items-start + pt-[72px] on mobile, items-center on sm+
                     Use for panels whose card grids exceed ~60 vh on mobile.
   mobileTop=false → items-center on all sizes (default; fine for short panels)
   ───────────────────────────────────────────────────────────────────────── */
function PanelLayer({
  scrollYProgress,
  start,
  end,
  className = '',
  mobileTop = false,
  first = false,
  last = false,
  children,
}: {
  scrollYProgress: MotionValue<number>
  start: number
  end: number
  className?: string
  /** Pin to top on mobile so the heading is never clipped by the sticky frame */
  mobileTop?: boolean
  /** Visible from scroll position 0 (no fade-in) */
  first?: boolean
  /** Stays visible at the end of the track (no fade-out) */
  last?: boolean
  children: React.ReactNode
}) {
  const k0 = start
  const k1 = Math.min(start + FADE, (start + end) / 2)
  const k2 = Math.max(end - FADE, (start + end) / 2)
  const k3 = end

  const opacity = useTransform(scrollYProgress, [k0, k1, k2, k3], [first ? 1 : 0, 1, 1, last ? 1 : 0])
  const y       = useTransform(scrollYProgress, [k0, k1, k2, k3], [first ? 0 : 18, 0, 0, last ? 0 : -18])
  // Panels are stacked on top of each other; an invisible panel must not
  // swallow clicks meant for the visible one underneath.
  const visibility = useTransform(opacity, (v) => (v > 0.02 ? 'visible' : 'hidden') as 'visible' | 'hidden')

  return (
    <motion.div
      className={[
        'absolute inset-0 flex',
        mobileTop
          ? 'items-start pt-[72px] sm:items-center sm:pt-0'
          : 'items-center',
        className,
      ].join(' ')}
      style={{ opacity, y, visibility }}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Channel icons
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
  const tCta      = useTranslations('cta')
  const locale   = useLocale()
  const prefersReducedMotion = useReducedMotion()

  const containerRef  = useRef<HTMLDivElement>(null)
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const imagesRef     = useRef<HTMLImageElement[]>([])
  const lastDrawnIdx  = useRef<number>(-1)
  // Holds the active frame set config; updated synchronously in the
  // matchMedia handler so paintFrame always reads the correct dimensions.
  const frameSetRef   = useRef<FrameSet>(FRAME_SETS.desktop)

  const [isPortrait, setIsPortrait] = useState(false)
  const [progress,   setProgress]   = useState(0)
  const [ready,      setReady]      = useState(false)
  const [isSlowConnection, setIsSlowConnection] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  // scrollYProgress is already 0→1 — we use it directly; each frame set
  // scales it to its own count inside paintFrame.

  // Skip the ~190-frame-per-breakpoint preload on reduced motion OR a slow /
  // metered connection (Save-Data, 2G) — both get the static poster fallback.
  const skipHeroAnimation = prefersReducedMotion || isSlowConnection

  /* ── slow/metered connection detection ──────────────────────────────── */
  useEffect(() => {
    type NetworkInformation = {
      saveData?: boolean
      effectiveType?: string
      addEventListener?: (type: 'change', cb: () => void) => void
      removeEventListener?: (type: 'change', cb: () => void) => void
    }
    const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection
    if (!conn) return
    const update = () => {
      setIsSlowConnection(
        Boolean(conn.saveData) || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g'
      )
    }
    update()
    conn.addEventListener?.('change', update)
    return () => conn.removeEventListener?.('change', update)
  }, [])

  /* ── orientation detection ──────────────────────────────────────────── */
  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait)')
    const handler = (e: MediaQueryList | MediaQueryListEvent) => {
      // Update the ref synchronously so paintFrame sees the right set
      // even before React re-renders.
      frameSetRef.current = e.matches ? FRAME_SETS.mobile : FRAME_SETS.desktop
      setIsPortrait(e.matches)
    }
    handler(mq)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  /* ── canvas helper ──────────────────────────────────────────────────── */
  // progress: normalised scroll position 0→1 (= scrollYProgress.get())
  const paintFrame = (progress: number) => {
    const set = frameSetRef.current
    // Map 0→1 progress to the frame set's frame count
    const idx = Math.max(0, Math.min(set.count - 1, Math.round(progress * (set.count - 1))))
    if (idx === lastDrawnIdx.current) return   // nothing changed, skip work

    const img = imagesRef.current[idx]
    if (!img?.complete) return

    const canvas = canvasRef.current
    const ctx    = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const dpr = window.devicePixelRatio || 1
    const cw  = canvas.clientWidth
    const ch  = canvas.clientHeight

    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width  = cw * dpr
      canvas.height = ch * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Both sets use cover — the desktop set is widescreen (fills landscape
    // viewports edge-to-edge) and the mobile set is 9:16 (fills portrait
    // phones edge-to-edge).  Fill with the set's bg colour first to cover
    // any sub-pixel gaps.
    const scale = Math.max(cw / set.w, ch / set.h)
    const dw = set.w * scale
    const dh = set.h * scale
    const dx = (cw - dw) / 2
    const dy = (ch - dh) / 2

    ctx.fillStyle = set.bg
    ctx.fillRect(0, 0, cw, ch)
    ctx.drawImage(img, dx, dy, dw, dh)
    lastDrawnIdx.current = idx
  }

  /* ── preload frames for the current orientation ─────────────────────── */
  // Re-runs whenever isPortrait flips (phone rotated) — clears the old
  // frame set, resets ready, and loads the new one.
  useEffect(() => {
    if (skipHeroAnimation) { setReady(true); return }
    setReady(false)
    setProgress(0)
    lastDrawnIdx.current = -1
    imagesRef.current = []

    const set = frameSetRef.current
    let loaded = 0, cancelled = false
    const imgs: HTMLImageElement[] = new Array(set.count)

    for (let i = 0; i < set.count; i++) {
      const img = new Image()
      img.src = set.path(i)
      img.onload = img.onerror = () => {
        if (cancelled) return
        loaded++
        setProgress(loaded / set.count)
        if (loaded === set.count) { setReady(true); paintFrame(scrollYProgress.get()) }
      }
      imgs[i] = img
    }
    imagesRef.current = imgs
    return () => { cancelled = true; imagesRef.current = [] }
  }, [isPortrait, skipHeroAnimation]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── continuous RAF loop ────────────────────────────────────────────── */
  useEffect(() => {
    if (!ready || skipHeroAnimation) return
    let rafId: number
    const tick = () => { paintFrame(scrollYProgress.get()); rafId = requestAnimationFrame(tick) }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [ready, scrollYProgress, skipHeroAnimation]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── redraw on resize ───────────────────────────────────────────────── */
  useEffect(() => {
    if (skipHeroAnimation) return
    const onResize = () => {
      lastDrawnIdx.current = -1
      paintFrame(scrollYProgress.get())
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [skipHeroAnimation, scrollYProgress]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── translation data ───────────────────────────────────────────────── */
  const pillars = tWhyUs.raw('pillars') as Array<{ title: string; description: string }>
  const customers = tReviews.raw('items') as Array<{
    company: string; country: string; products: string; text: string
  }>
  const productCategories = [
    { href: `/${locale}/catalog#${tProducts('driedFruits.slug')}`, name: tProducts('driedFruits.name'), desc: tProducts('driedFruits.description') },
    { href: `/${locale}/catalog#${tProducts('nuts.slug')}`,        name: tProducts('nuts.name'),        desc: tProducts('nuts.description') },
  ]

  /* ── reduced-motion / slow-connection fallback ───────────────────────── */
  if (skipHeroAnimation) {
    return (
      <section className="relative h-screen w-full overflow-hidden"
        style={{ backgroundColor: frameSetRef.current.bg }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={frameSetRef.current.path(0)} alt="Nomad Agro dried fruits and nuts"
          className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex h-full items-center">
          <div className="container-base pb-16">
            <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-4">{tHero('tagline')}</p>
            <h1 className="font-serif text-display-lg text-cream font-semibold text-balance mb-6 leading-[1.05]">{tHero('headline')}</h1>
            <p className="text-lg text-white/75 leading-relaxed mb-10 max-w-xl">{tHero('subheadline')}</p>
            <div className="flex flex-wrap items-center gap-4">
              <ContactCTA variant="lime" size="lg" label={tHero('cta')} />
              <Button variant="ghost" size="lg" href={`/${locale}/catalog`}>{tHero('ctaSecondary')}</Button>
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
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

        {/* Persistent gradient — new video has a light cream background so
            we need a stronger veil to keep white text legible at all panels */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:
            'linear-gradient(to bottom,' +
            'rgba(0,0,0,0.55) 0%,' +    /* navbar zone */
            'rgba(0,0,0,0.35) 25%,' +   /* upper mid */
            'rgba(0,0,0,0.40) 50%,' +   /* center */
            'rgba(0,0,0,0.45) 75%,' +   /* lower mid */
            'rgba(0,0,0,0.65) 100%)'    /* bottom CTAs */
          }} />

        {/* Loading screen */}
        {!ready && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-neutral-900 text-white">
            <div className="h-1 w-48 overflow-hidden rounded-full bg-white/20">
              <div className="h-full bg-[#5CE65C] transition-[width] duration-150"
                style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
            <p className="mt-3 text-sm tracking-wide text-white/70">{Math.round(progress * 100)}%</p>
          </div>
        )}

        {/* ── Panel layers ─────────────────────────────────────────────── */}
        <div className="absolute inset-0 z-10">

          {/* 1 ── HERO ────────────────────────────────────────────────── */}
          <PanelLayer scrollYProgress={scrollYProgress} start={PANELS.hero[0]} end={PANELS.hero[1]} first>
            <div className="container-base w-full pt-24 pb-12">
              <div className="max-w-3xl">
                <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-4
                  [text-shadow:_0_1px_8px_rgba(0,0,0,0.6)]">
                  {tHero('tagline')}
                </p>
                <h1 className="font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] text-cream font-semibold text-balance mb-6 leading-[1.05]
                  [text-shadow:_0_2px_16px_rgba(0,0,0,0.55)]">
                  {tHero('headline')}
                </h1>
                <p className="text-lg text-white/85 leading-relaxed mb-10 max-w-xl
                  [text-shadow:_0_1px_10px_rgba(0,0,0,0.5)]">
                  {tHero('subheadline')}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <ContactCTA variant="lime" size="lg" label={tHero('cta')} />
                  <Button variant="ghost" size="lg" href={`/${locale}/catalog`}>
                    {tHero('ctaSecondary')}
                  </Button>
                </div>
              </div>
            </div>
          </PanelLayer>

          {/* 2 ── OUR PRODUCTS ───────────────────────────────────────── */}
          {/* mobileTop: heading visible below the navbar on small screens */}
          <PanelLayer scrollYProgress={scrollYProgress} start={PANELS.products[0]} end={PANELS.products[1]}
            className="justify-center" mobileTop>
            <div className="container-base w-full text-center px-4 sm:px-6 pb-4 sm:pb-0">
              <p className="text-brand-lime text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-2 sm:mb-3
                [text-shadow:_0_1px_8px_rgba(0,0,0,0.7)]">
                {tProducts('eyebrow')}
              </p>
              <h2 className="font-serif text-[1.65rem] sm:text-4xl lg:text-5xl text-cream font-semibold mb-3 sm:mb-4
                [text-shadow:_0_2px_14px_rgba(0,0,0,0.6)]">
                {tProducts('title')}
              </h2>
              {/* Subtitle hidden on mobile to reclaim vertical space */}
              <p className="hidden sm:block text-white/65 text-base mb-8 max-w-xl mx-auto
                [text-shadow:_0_1px_8px_rgba(0,0,0,0.5)]">
                {tProducts('subtitle')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-2xl mx-auto mb-4 sm:mb-8">
                {productCategories.map(({ href, name, desc }) => (
                  <Link key={href} href={href}
                    className={`group block ${glassInteractive} p-3 sm:p-5 text-left`}>
                    <h3 className="text-cream font-semibold text-sm sm:text-base mb-1 sm:mb-2
                      [text-shadow:_0_1px_6px_rgba(0,0,0,0.4)]">
                      {name}
                    </h3>
                    <p className="text-white/65 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {desc}
                    </p>
                    <span className="mt-2 sm:mt-3 inline-block text-brand-lime text-sm
                      group-hover:translate-x-1 transition-transform duration-150">→</span>
                  </Link>
                ))}
              </div>
              <Button variant="ghost" size="md" href={`/${locale}/catalog`}>
                {tProducts('viewAll')}
              </Button>
            </div>
          </PanelLayer>

          {/* 3 ── WHY CHOOSE NOMAD AGRO ──────────────────────────────── */}
          <PanelLayer scrollYProgress={scrollYProgress} start={PANELS.whyUs[0]} end={PANELS.whyUs[1]}
            className="justify-center" mobileTop>
            <div className="container-base w-full text-center px-4 sm:px-6 pb-4 sm:pb-0">
              <p className="text-brand-lime text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-2 sm:mb-3
                [text-shadow:_0_1px_8px_rgba(0,0,0,0.7)]">
                {tWhyUs('eyebrow')}
              </p>
              <h2 className="font-serif text-[1.65rem] sm:text-4xl lg:text-5xl text-cream font-semibold mb-5 sm:mb-8
                [text-shadow:_0_2px_14px_rgba(0,0,0,0.6)]">
                {tWhyUs('title')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-2xl mx-auto">
                {pillars.map((pillar, i) => (
                  <div key={i} className={`${glass} p-3 sm:p-5 text-left`}>
                    <h3 className="text-cream font-semibold text-sm mb-1 sm:mb-1.5
                      [text-shadow:_0_1px_6px_rgba(0,0,0,0.4)]">
                      {pillar.title}
                    </h3>
                    <p className="text-white/65 text-xs sm:text-sm leading-relaxed">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </PanelLayer>

          {/* 4 ── ROOTED IN UZBEKISTAN ───────────────────────────────── */}
          <PanelLayer scrollYProgress={scrollYProgress} start={PANELS.about[0]} end={PANELS.about[1]}>
            <div className="container-base w-full pb-16">
              <div className="max-w-2xl">
                <p className="text-brand-lime text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-3
                  [text-shadow:_0_1px_8px_rgba(0,0,0,0.7)]">
                  {tAbout('teaser.tagline')}
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-cream font-semibold mb-6 leading-[1.1] text-balance
                  [text-shadow:_0_2px_14px_rgba(0,0,0,0.6)]">
                  {tAbout('teaser.title')}
                </h2>
                <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-10
                  [text-shadow:_0_1px_8px_rgba(0,0,0,0.5)]">
                  {tAbout('teaser.text')}
                </p>
                <Button variant="ghost" size="md" href={`/${locale}/about`}>
                  {tAbout('teaser.cta')}
                </Button>
              </div>
            </div>
          </PanelLayer>

          {/* 5 ── WHAT OUR PARTNERS SAY ──────────────────────────────── */}
          <PanelLayer scrollYProgress={scrollYProgress} start={PANELS.reviews[0]} end={PANELS.reviews[1]}
            className="justify-center" mobileTop>
            <div className="container-base w-full text-center px-4 sm:px-6 pb-4 sm:pb-0">
              <p className="text-brand-lime text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-2 sm:mb-3
                [text-shadow:_0_1px_8px_rgba(0,0,0,0.7)]">
                {tReviews('eyebrow')}
              </p>
              <h2 className="font-serif text-[1.65rem] sm:text-4xl lg:text-5xl text-cream font-semibold mb-5 sm:mb-8
                [text-shadow:_0_2px_14px_rgba(0,0,0,0.6)]">
                {tReviews('title')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 max-w-4xl mx-auto mb-4 sm:mb-8">
                {customers.slice(0, 3).map((customer) => (
                  <div key={customer.company} className={`${glass} p-3 sm:p-4 text-left`}>
                    <p className="text-white/85 text-xs leading-relaxed italic mb-2 line-clamp-3 sm:line-clamp-5">
                      &ldquo;{customer.text}&rdquo;
                    </p>
                    <p className="text-cream font-semibold text-xs sm:text-sm
                      [text-shadow:_0_1px_6px_rgba(0,0,0,0.4)]">
                      {customer.company}
                    </p>
                    <p className="text-white/55 text-[10px] sm:text-xs">{customer.country}</p>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="md" href={`/${locale}/reviews`}>
                {tReviews('viewAll')}
              </Button>
            </div>
          </PanelLayer>

          {/* 6 ── GET IN TOUCH ───────────────────────────────────────── */}
          <PanelLayer scrollYProgress={scrollYProgress} start={PANELS.contact[0]} end={PANELS.contact[1]}
            className="justify-center" mobileTop last>
            <div className="container-base w-full text-center px-4 sm:px-6 pb-4 sm:pb-0">
              <p className="text-brand-lime text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-2 sm:mb-3
                [text-shadow:_0_1px_8px_rgba(0,0,0,0.7)]">
                {tContact('title')}
              </p>
              <h2 className="font-serif text-[1.65rem] sm:text-4xl lg:text-5xl text-cream font-semibold mb-3 sm:mb-4
                [text-shadow:_0_2px_14px_rgba(0,0,0,0.6)]">
                {tContact('channels.title')}
              </h2>
              <p className="hidden sm:block text-white/70 text-lg mb-10 max-w-md mx-auto
                [text-shadow:_0_1px_8px_rgba(0,0,0,0.5)]">
                {tContact('subtitle')}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-5 sm:mb-8">
                <a href={`mailto:${COMPANY.emails.primary}`}
                  className={`inline-flex items-center gap-2 ${glassInteractive} text-cream text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 sm:py-3`}>
                  <Mail className="w-4 h-4" />{COMPANY.emails.primary}
                </a>
                <a href={COMPANY.whatsapp} target="_blank" rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 ${glassInteractive} text-cream text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 sm:py-3`}>
                  <WhatsAppIcon />WhatsApp
                </a>
                <a href={COMPANY.telegram} target="_blank" rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 ${glassInteractive} text-cream text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 sm:py-3`}>
                  <TelegramIcon />Telegram
                </a>
                <a href={COMPANY.linkedin} target="_blank" rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 ${glassInteractive} text-cream text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 sm:py-3`}>
                  <Linkedin className="w-4 h-4" />LinkedIn
                </a>
                <a href={`tel:${COMPANY.phones[0].number}`}
                  className={`inline-flex items-center gap-2 ${glassInteractive} text-cream text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 sm:py-3`}>
                  <Phone className="w-4 h-4" />{COMPANY.phones[0].display}
                </a>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <ContactCTA variant="lime" size="lg" label={tCta('contactUs')} />
                <Button variant="ghost" size="lg" href={`/${locale}/contacts`}>
                  {tCta('sendInquiry')}
                </Button>
              </div>
            </div>
          </PanelLayer>

        </div>{/* /panels */}
      </div>{/* /sticky */}
    </section>
  )
}
