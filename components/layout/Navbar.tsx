'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ContactCTA } from '@/components/ui/ContactCTA'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/lib/constants'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isLight = isHomePage && !scrolled && !mobileOpen

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-parchment'
            : isHomePage
            ? 'bg-transparent'
            : 'bg-cream/95 backdrop-blur-md border-b border-parchment'
        )}
        initial={prefersReducedMotion ? {} : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="container-base">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="flex-shrink-0 focus-visible:outline-brand-green rounded-lg"
              aria-label="Nomad Agro — Home"
            >
              <Image
                src="/logotype1.webp"
                alt="Nomad Agro"
                width={140}
                height={40}
                className="h-8 md:h-10 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map(({ href, key }) => {
                const fullHref = `/${locale}${href}`
                const isActive =
                  pathname === fullHref || (href !== '/' && pathname.startsWith(`${fullHref}/`))
                return (
                  <Link
                    key={key}
                    href={fullHref}
                    className={cn(
                      'relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green',
                      isLight
                        ? isActive
                          ? 'text-brand-lime'
                          : 'text-cream/80 hover:text-cream hover:bg-white/10'
                        : isActive
                        ? 'text-brand-green'
                        : 'text-bark hover:text-soil hover:bg-parchment'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {t(key as 'home' | 'about' | 'products' | 'reviews' | 'catalog' | 'contact')}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className={cn(
                          'absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full',
                          isLight ? 'bg-brand-lime' : 'bg-brand-green'
                        )}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageSwitcher light={isLight} />
              <ContactCTA
                variant={isLight ? 'ghost' : 'primary'}
                size="sm"
                label={t('requestQuote')}
              />
            </div>

            {/* Mobile right */}
            <div className="flex lg:hidden items-center gap-2">
              <LanguageSwitcher light={isLight} />
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className={cn(
                  'p-2 rounded-xl cursor-pointer transition-colors duration-150',
                  isLight ? 'text-cream hover:bg-white/10' : 'text-bark hover:bg-parchment hover:text-soil'
                )}
                aria-label={mobileOpen ? t('close') : t('menu')}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-cream pt-20 pb-8 px-4 flex flex-col overflow-y-auto lg:hidden"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <nav className="flex flex-col gap-1 mb-8" aria-label="Mobile navigation">
              {NAV_LINKS.map(({ href, key }, i) => {
                const fullHref = `/${locale}${href}`
                const isActive =
                  pathname === fullHref || (href !== '/' && pathname.startsWith(`${fullHref}/`))
                return (
                  <motion.div
                    key={key}
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={fullHref}
                      className={cn(
                        'block px-4 py-4 rounded-xl text-lg font-medium transition-colors duration-150',
                        isActive
                          ? 'text-brand-green bg-parchment font-semibold'
                          : 'text-bark hover:text-soil hover:bg-parchment'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {t(key as 'home' | 'about' | 'products' | 'reviews' | 'catalog' | 'contact')}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>
            <div className="mt-auto">
              <ContactCTA size="lg" label={t('requestQuote')} className="w-full justify-center" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
