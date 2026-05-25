'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from './Button'
import { ContactSheet } from './ContactSheet'

interface ContactCTAProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'lime'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

export function ContactCTA({ variant = 'primary', size = 'md', label, className }: ContactCTAProps) {
  const t = useTranslations('cta')
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setOpen(true)}
      >
        <MessageCircle className="w-4 h-4" />
        {label ?? t('requestQuote')}
      </Button>
      <ContactSheet isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
