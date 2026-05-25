'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

interface ParallaxDivProps {
  children: React.ReactNode
  className?: string
  offset?: number
  scale?: [number, number]
}

export function ParallaxDiv({ children, className, offset = 60, scale }: ParallaxDivProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset])
  const scaleVal = useTransform(
    scrollYProgress,
    [0, 1],
    scale ?? [1, 1]
  )

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div ref={ref} style={{ y, scale: scale ? scaleVal : undefined }} className={cn(className)}>
      {children}
    </motion.div>
  )
}
