'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'motion/react'
import { X, Mail, Phone, Linkedin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { COMPANY } from '@/lib/constants'

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
)

interface ContactSheetProps {
  isOpen: boolean
  onClose: () => void
}

const channels = [
  {
    key: 'email',
    Icon: Mail,
    label: 'Email',
    sublabel: COMPANY.emails.primary,
    href: `mailto:${COMPANY.emails.primary}`,
    color: 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700',
    iconColor: 'text-blue-600',
  },
  {
    key: 'whatsapp',
    Icon: WhatsAppIcon,
    label: 'WhatsApp',
    sublabel: COMPANY.phones[0].display,
    href: COMPANY.whatsapp,
    color: 'hover:bg-green-50 hover:border-green-200 hover:text-green-700',
    iconColor: 'text-green-600',
  },
  {
    key: 'telegram',
    Icon: TelegramIcon,
    label: 'Telegram',
    sublabel: COMPANY.phones[0].display,
    href: COMPANY.telegram,
    color: 'hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700',
    iconColor: 'text-sky-500',
  },
  {
    key: 'linkedin',
    Icon: Linkedin,
    label: 'LinkedIn',
    sublabel: 'nomad-agro-ltd',
    href: COMPANY.linkedin,
    color: 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700',
    iconColor: 'text-blue-700',
  },
  {
    key: 'phone',
    Icon: Phone,
    label: 'Phone',
    sublabel: COMPANY.phones[0].display,
    href: `tel:${COMPANY.phones[0].number}`,
    color: 'hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700',
    iconColor: 'text-amber-600',
  },
]

export function ContactSheet({ isOpen, onClose }: ContactSheetProps) {
  const t = useTranslations('contact')
  const prefersReducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const sheetVariants: Variants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { y: '100%', opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 400, damping: 40 } },
        exit: { y: '100%', opacity: 0, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as [number, number, number, number] } },
      }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-soil/60 backdrop-blur-sm z-50 cursor-pointer"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet — flex wrapper centres it (bottom sheet on mobile, centred dialog on md+);
              framer-motion's inline transform would override Tailwind translate centring. */}
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('channels.title')}
            className="pointer-events-auto w-full bg-cream rounded-t-3xl shadow-2xl max-h-[90dvh] overflow-y-auto md:rounded-3xl md:max-w-md"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 bg-stone/40 rounded-full" />
            </div>

            <div className="p-6 pt-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-serif text-xl font-semibold text-soil">
                    {t('channels.title')}
                  </h2>
                  <p className="text-sm text-bark mt-1">{t('subtitle')}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-parchment transition-colors duration-150 cursor-pointer text-stone hover:text-soil"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Channels */}
              <div className="grid grid-cols-1 gap-3">
                {channels.map(({ key, Icon, label, sublabel, href, color, iconColor }) => (
                  <a
                    key={key}
                    href={href}
                    target={key !== 'phone' ? '_blank' : undefined}
                    rel={key !== 'phone' ? 'noopener noreferrer' : undefined}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-transparent bg-parchment/60
                      transition-all duration-200 cursor-pointer group ${color}`}
                  >
                    <span className={`flex-shrink-0 ${iconColor}`}>
                      <Icon />
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-soil text-sm">{label}</div>
                      <div className="text-bark text-sm truncate">{sublabel}</div>
                    </div>
                    <span className="ml-auto text-stone group-hover:translate-x-1 transition-transform duration-150">
                      →
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-parchment grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <ul className="space-y-1">
                  {Object.values(COMPANY.emails).map((email) => (
                    <li key={email}>
                      <a href={`mailto:${email}`} className="text-bark hover:text-brand-green break-all">
                        {email}
                      </a>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-1">
                  {COMPANY.phones.map((p) => (
                    <li key={p.number}>
                      <a href={`tel:${p.number}`} className="text-bark hover:text-brand-green">
                        {p.display}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
