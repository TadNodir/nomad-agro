import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Lora, Raleway } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'
import { routing } from '@/i18n/routing'
import LenisProvider from '@/components/providers/LenisProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import '@/app/globals.css'
import { SITE, alternatesFor } from '@/lib/site'
import { OrganizationJsonLd } from '@/components/shared/JsonLd'
import { ogImage, ogLocale } from '@/lib/seo'

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

// Only en/ru/uz exist. The middleware skips dotted paths (/llms.txt, /wp-login.php), which
// otherwise reached this layout as locale "llms.txt" and rendered a 404 with page metadata.
export const dynamicParams = false

const isLocale = (locale: string): locale is (typeof routing.locales)[number] =>
  (routing.locales as readonly string[]).includes(locale)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return { robots: { index: false } }
  const t = await getTranslations({ locale, namespace: 'seo.home' })

  // Fallback for routes without their own metadata (e.g. 404); pages use pageMetadata().
  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(SITE.origin),
    alternates: alternatesFor(locale),
    openGraph: {
      siteName: SITE.name,
      type: 'website',
      locale: ogLocale(locale),
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
    },
    // No explicit robots: index/follow is the default, and an explicit tag here was
    // emitted next to the 404's noindex.
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

  if (!isLocale(locale)) {
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
        <OrganizationJsonLd />
        <NextIntlClientProvider messages={messages}>
          <LenisProvider>
            <Navbar />
            <main id="main-content">{children}</main>
            <Footer />
          </LenisProvider>
        </NextIntlClientProvider>
        {/* Cookieless visitor stats, served from this domain (/_vercel/insights), so the CSP allows it. */}
        <Analytics />
      </body>
    </html>
  )
}
