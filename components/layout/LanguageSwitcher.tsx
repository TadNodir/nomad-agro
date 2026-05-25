'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, Globe } from 'lucide-react'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'

const labels: Record<string, string> = {
  en: 'EN',
  ru: 'RU',
  uz: 'UZ',
}

const fullLabels: Record<string, string> = {
  en: 'English',
  ru: 'Русский',
  uz: "O'zbek",
}

interface LanguageSwitcherProps {
  light?: boolean
}

export function LanguageSwitcher({ light = false }: LanguageSwitcherProps) {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function switchLocale(next: string) {
    // Replace the current locale prefix in the pathname
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/') || `/${next}`)
    setOpen(false)
  }

  const textClasses = light
    ? 'text-cream/80 hover:text-cream'
    : 'text-bark hover:text-soil'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1.5 text-sm font-semibold cursor-pointer',
          'px-3 py-1.5 rounded-lg transition-colors duration-150',
          light ? 'hover:bg-white/10' : 'hover:bg-parchment',
          textClasses
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4" />
        <span>{labels[locale]}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3 h-3" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Select language"
            className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-parchment overflow-hidden min-w-[140px] z-50"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {routing.locales.map((loc) => (
              <li key={loc}>
                <button
                  role="option"
                  aria-selected={loc === locale}
                  onClick={() => switchLocale(loc)}
                  className={cn(
                    'w-full text-left px-4 py-3 text-sm transition-colors duration-150 cursor-pointer',
                    'flex items-center justify-between gap-3',
                    loc === locale
                      ? 'bg-parchment text-brand-green font-semibold'
                      : 'text-bark hover:bg-cream hover:text-soil'
                  )}
                >
                  <span>{fullLabels[loc]}</span>
                  <span className="text-xs font-bold text-stone">{labels[loc]}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
