'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

export function ContactForm() {
  const t = useTranslations('contact.form')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputClasses =
    'w-full rounded-xl border border-parchment bg-white px-4 py-3 text-soil text-sm placeholder:text-stone focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all duration-150'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot — hidden from sighted and screen-reader users, bots fill it in */}
      <div className="absolute left-[-9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-soil mb-1.5">
            {t('name')} *
          </label>
          <input id="name" name="name" type="text" required className={inputClasses} placeholder="John Smith" />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-soil mb-1.5">
            {t('company')}
          </label>
          <input id="company" name="company" type="text" className={inputClasses} placeholder="ACME Imports Ltd" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-soil mb-1.5">
            {t('email')} *
          </label>
          <input id="email" name="email" type="email" required className={inputClasses} placeholder="john@company.com" />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-soil mb-1.5">
            {t('country')}
          </label>
          <input id="country" name="country" type="text" className={inputClasses} placeholder="Germany" />
        </div>
      </div>
      <div>
        <label htmlFor="product" className="block text-sm font-medium text-soil mb-1.5">
          {t('product')}
        </label>
        <select id="product" name="product" className={inputClasses}>
          <option value="">Select a product…</option>
          <option value="dried-fruits">Dried Fruits</option>
          <option value="nuts">Nuts</option>
          <option value="mung-beans">Mung Beans (Mash)</option>
          <option value="multiple">Multiple products</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-soil mb-1.5">
          {t('message')}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={inputClasses}
          placeholder={t('messagePlaceholder')}
        />
      </div>

      {status === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-sm">
          {t('success')}
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-sm">
          {t('error')}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={status === 'submitting'}
        disabled={status === 'submitting'}
        className="w-full justify-center"
      >
        <Send className="w-4 h-4" />
        {status === 'submitting' ? t('submitting') : t('submit')}
      </Button>
    </form>
  )
}
