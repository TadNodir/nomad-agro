'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { CATALOG } from '@/lib/catalog'

// Web3Forms only accepts submissions made directly from the browser (their
// free plan rejects server-proxied requests), so this key is submitted
// client-side by design — it's public, protected by domain restriction in
// the Web3Forms dashboard rather than secrecy.
const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY

export function ContactForm() {
  const t = useTranslations('contact.form')
  const tItems = useTranslations('catalog.items')
  const searchParams = useSearchParams()

  // Arriving from a catalog "Request spec sheet" link: prefill product and message.
  const specId = searchParams.get('spec')
  const specCategory = CATALOG.find((c) => c.groups.some((g) => g.products.some((p) => p.id === specId)))
  const defaultProduct = specCategory?.slug ?? ''
  const defaultMessage = specCategory && specId ? t('specMessage', { product: tItems(specId) }) : ''
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    // Honeypot (Web3Forms' own convention) — bots fill hidden fields, humans don't.
    if (formData.get('botcheck')) {
      setStatus('success')
      form.reset()
      return
    }

    if (!WEB3FORMS_ACCESS_KEY) {
      console.error('[Contact form] NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set.')
      setStatus('error')
      return
    }

    setStatus('submitting')
    formData.append('access_key', WEB3FORMS_ACCESS_KEY)

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })
      const result = (await res.json()) as { success: boolean }
      if (result.success) {
        setStatus('success')
        form.reset()
        ;(form.elements.namedItem('message') as HTMLTextAreaElement).value = ''
        ;(form.elements.namedItem('product') as HTMLSelectElement).value = ''
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
      {/* Honeypot (Web3Forms' "botcheck" convention) — hidden from sighted and screen-reader users, bots fill it in */}
      <input
        type="checkbox"
        name="botcheck"
        className="hidden"
        style={{ display: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
      />

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
        <select id="product" name="product" defaultValue={defaultProduct} className={inputClasses}>
          <option value="">Select a product…</option>
          <option value="dried-fruits">Dried Fruits</option>
          <option value="nuts">Nuts</option>
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
          defaultValue={defaultMessage}
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
