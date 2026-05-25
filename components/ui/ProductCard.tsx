'use client'

import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  name: string
  description: string
  categorySlug: string
  gradient?: string
  className?: string
  onQuote?: () => void
  locale: string
}

const categoryGradients: Record<string, string> = {
  'dried-fruits': 'from-amber-800 via-amber-700 to-orange-800',
  nuts: 'from-stone-700 via-stone-600 to-amber-800',
  'mung-beans': 'from-brand-green via-brand-green-mid to-brand-forest',
}

export function ProductCard({
  name,
  description,
  categorySlug,
  gradient,
  className,
  onQuote,
  locale,
}: ProductCardProps) {
  const t = useTranslations('products')
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()
  const bg = gradient ?? categoryGradients[categorySlug] ?? 'from-brand-green to-brand-forest'

  return (
    <motion.article
      className={cn(
        'group relative bg-white rounded-2xl overflow-hidden cursor-pointer',
        'shadow-md hover:shadow-xl border border-parchment',
        'transition-shadow duration-300',
        className
      )}
      whileHover={prefersReducedMotion ? {} : { y: -6 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => router.push(`/${locale}/products/${categorySlug}`)}
    >
      {/* Image placeholder */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br transition-transform duration-500',
            'group-hover:scale-105',
            bg
          )}
        />
        <div className="absolute inset-0 bg-black/20" />
        {/* Placeholder text — replace with next/image when photos are available */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/40 text-xs font-medium tracking-wider uppercase">
            Photo: {name}
          </span>
        </div>
        {/* "No price" badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-black/40 backdrop-blur-sm text-white/80 text-[10px] font-medium px-2 py-1 rounded-full tracking-wide">
            {t('noPrice')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-serif text-xl font-semibold text-soil mb-2 group-hover:text-brand-green transition-colors duration-200">
          {name}
        </h3>
        <p className="text-bark text-sm leading-relaxed mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onQuote?.()
            }}
            className="text-sm font-semibold text-brand-green hover:text-brand-green-hover cursor-pointer transition-colors duration-150"
          >
            {t('requestQuote')}
          </button>
          <span className="flex items-center gap-1 text-sm text-stone group-hover:text-brand-green group-hover:gap-2 transition-all duration-200">
            {t('learnMore')} <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </motion.article>
  )
}
