import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Lora, Raleway } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import LenisProvider from '@/components/providers/LenisProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import '@/app/globals.css'
import { SITE, siteUrl, alternatesFor } from '@/lib/site'

const lora = Lora({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-lora',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const raleway = Raleway({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-raleway',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.home' })

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(SITE.origin),
    alternates: alternatesFor(locale),
    openGraph: {
      siteName: SITE.name,
      type: 'website',
      locale: locale === 'ru' ? 'ru_RU' : locale === 'uz' ? 'uz_UZ' : 'en_US',
      images: [
        {
          url: siteUrl('/og-image.jpg'),
          width: 1200,
          height: 630,
          alt: `${SITE.name} — ${SITE.positioning}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'ru' | 'uz')) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    // suppressHydrationWarning: the inline script below adds `js` to the class list before hydration.
    <html lang={locale} className={`${lora.variable} ${raleway.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <LenisProvider>
            <Navbar />
            <main id="main-content">{children}</main>
            <Footer />
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
