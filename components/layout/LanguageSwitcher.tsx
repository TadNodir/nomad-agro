'use client'

import { useState, useRef, useEffect, useId } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { ChevronDown, Globe } from 'lucide-react'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { localePath, stripLocale } from '@/lib/site'

const labels: Record<string, string> = {
  en: 'EN',
  ru: 'RU',
  uz: 'UZ',
}

const fullLabels: Record<string, string> = {
  en: 'English',
  ru: 'Русский',
  uz: 'Oʻzbek',
}

interface LanguageSwitcherProps {
  light?: boolean
}

export function LanguageSwitcher({ light = false }: LanguageSwitcherProps) {
  const locale = useLocale()
  // Locale-free, so the server (/en/...) and browser (/...) render the same hrefs.
  const path = stripLocale(usePathname())
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const textClasses = light ? 'text-cream/80 hover:text-cream' : 'text-bark hover:text-soil'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1.5 text-sm font-semibold cursor-pointer',
          'px-3 py-1.5 rounded-lg transition-colors duration-150',
          light ? 'hover:bg-white/10' : 'hover:bg-parchment',
          textClasses
        )}
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`Language: ${fullLabels[locale]}`}
      >
        <Globe className="w-4 h-4" aria-hidden="true" />
        <span>{labels[locale]}</span>
        <ChevronDown
          className={cn('w-3 h-3 transition-transform duration-200', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {/* Always in the HTML as real links (hidden until opened), so crawlers can follow
          the language versions of every page, not only hreflang and the sitemap. */}
      <ul
        id={listId}
        className={cn(
          'absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-parchment overflow-hidden min-w-[140px] z-50',
          'transition-[opacity,transform,visibility] duration-150',
          open ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 -translate-y-2'
        )}
      >
        {routing.locales.map((loc) => (
          <li key={loc}>
            <Link
              href={localePath(loc, path)}
              hrefLang={loc}
              lang={loc}
              aria-current={loc === locale ? 'true' : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                'w-full px-4 py-3 text-sm transition-colors duration-150',
                'flex items-center justify-between gap-3',
                loc === locale
                  ? 'bg-parchment text-brand-green font-semibold'
                  : 'text-bark hover:bg-cream hover:text-soil'
              )}
            >
              <span>{fullLabels[loc]}</span>
              <span className="text-xs font-bold text-stone">{labels[loc]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
