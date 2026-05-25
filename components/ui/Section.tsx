import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type Background = 'cream' | 'parchment' | 'forest' | 'white'

interface SectionProps {
  children: ReactNode
  className?: string
  background?: Background
  id?: string
  narrow?: boolean
  noPadding?: boolean
}

const bgClasses: Record<Background, string> = {
  cream: 'bg-cream',
  parchment: 'bg-parchment',
  forest: 'bg-brand-forest',
  white: 'bg-white',
}

export function Section({
  children,
  className,
  background = 'cream',
  id,
  narrow = false,
  noPadding = false,
}: SectionProps) {
  return (
    <section id={id} className={cn(bgClasses[background], !noPadding && 'section-padding', className)}>
      <div className={cn(narrow ? 'container-narrow' : 'container-base')}>{children}</div>
    </section>
  )
}

interface SectionHeaderProps {
  tagline?: string
  title: string
  subtitle?: string
  centered?: boolean
  light?: boolean
  className?: string
}

export function SectionHeader({
  tagline,
  title,
  subtitle,
  centered = true,
  light = false,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 md:mb-16', centered && 'text-center', className)}>
      {tagline && (
        <span
          className={cn(
            'text-xs font-semibold tracking-[0.2em] uppercase mb-3 block',
            light ? 'text-brand-lime' : 'text-brand-green'
          )}
        >
          {tagline}
        </span>
      )}
      <h2
        className={cn(
          'font-serif text-display-sm md:text-display-md font-semibold text-balance',
          light ? 'text-cream' : 'text-soil'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-4 text-lg max-w-2xl',
            centered && 'mx-auto',
            light ? 'text-stone/80' : 'text-bark'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
