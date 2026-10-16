'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'lime'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  asChild?: boolean
  href?: string
  external?: boolean
  isLoading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-green text-white hover:bg-brand-green-hover border-2 border-transparent focus-visible:ring-brand-green',
  secondary:
    'bg-transparent text-brand-green border-2 border-brand-green hover:bg-brand-green hover:text-white focus-visible:ring-brand-green',
  ghost:
    'bg-transparent text-cream border-2 border-cream/40 hover:border-cream hover:bg-cream/10 focus-visible:ring-cream',
  lime:
    'bg-brand-lime text-brand-forest border-2 border-transparent hover:bg-opacity-90 focus-visible:ring-brand-lime',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  href,
  external,
  isLoading,
  disabled,
  ...props
}: ButtonProps) {
  const prefersReducedMotion = useReducedMotion()
  const isDisabled = disabled || isLoading

  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
    'transition-all duration-200 cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    className
  )

  const motionProps = prefersReducedMotion
    ? {}
    : {
        whileHover: isDisabled ? {} : { y: -2, transition: { duration: 0.15 } },
        whileTap: isDisabled ? {} : { scale: 0.97 },
      }

  if (href) {
    // Internal links get client-side navigation via next/link (no full page
    // reload). External links stay as plain anchors with target/rel.
    if (external) {
      return (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
          {...motionProps}
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : null}
          {children}
        </motion.a>
      )
    }

    return (
      <Link
        href={href}
        className={cn(
          baseClasses,
          !prefersReducedMotion && 'hover:-translate-y-0.5 active:scale-[0.97]'
        )}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </Link>
    )
  }

  return (
    <motion.button
      className={baseClasses}
      disabled={isDisabled}
      {...motionProps}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </motion.button>
  )
}
