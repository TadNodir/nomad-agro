'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

interface FadeInViewProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  once?: boolean
  amount?: number
}

// Keyframes, not `initial`: the server renders no inline opacity:0, so no-JS
// clients see the content. Pre-animation hiding is done in CSS via
// `.js [data-reveal]` (see globals.css), which only applies once JS runs.
const keyframesMap = {
  up: { y: [36, 0] },
  down: { y: [-36, 0] },
  left: { x: [36, 0] },
  right: { x: [-36, 0] },
  none: {},
}

export function FadeInView({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.65,
  once = true,
  amount = 0.15,
}: FadeInViewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount })
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      data-reveal={direction}
      initial={false}
      animate={isInView ? { opacity: [0, 1], ...keyframesMap[direction] } : {}}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
