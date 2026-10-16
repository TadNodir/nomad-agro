import { getTranslations, getLocale } from 'next-intl/server'
import { Button } from '@/components/ui/Button'

export default async function NotFound() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'notFound' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-cream">
      <div className="container-base text-center py-24">
        <p className="font-serif text-display-lg text-brand-green font-semibold mb-4">404</p>
        <h1 className="font-serif text-display-sm font-semibold text-soil mb-3">{t('title')}</h1>
        <p className="text-bark text-lg max-w-md mx-auto mb-8">{t('text')}</p>
        <Button href={`/${locale}`}>{tCommon('backToHome')}</Button>
      </div>
    </section>
  )
}
