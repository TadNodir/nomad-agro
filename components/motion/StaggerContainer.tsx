'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  stagger?: number
  delay?: number
  once?: boolean
  direction?: 'up' | 'none'
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.1,
  delay = 0,
  once = true,
  direction = 'up',
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: 0.1 })
  const prefersReducedMotion = useReducedMotion()

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : stagger,
        delayChildren: delay,
      },
    },
  }

  // Keyframes instead of a hidden `initial` so the server renders no inline
  // opacity:0; `.js [data-reveal]` in globals.css hides items until they animate.
  const itemVariants = {
    hidden: {},
    visible: {
      ...(prefersReducedMotion
        ? { opacity: 1, y: 0 }
        : { opacity: [0, 1], ...(direction === 'up' ? { y: [32, 0] } : {}) }),
      transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
    },
  }
  const reveal = direction === 'up' ? 'stagger' : 'none'

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial={false}
      animate={isInView ? 'visible' : 'hidden'}
      className={cn(className)}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} data-reveal={reveal} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : <motion.div data-reveal={reveal} variants={itemVariants}>{children}</motion.div>}
    </motion.div>
  )
}
