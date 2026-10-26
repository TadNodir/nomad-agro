import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
// import Hero from '@/components/home/Hero'                   // original hero
// import ScrollScrubHeroSection from '@/components/home/ScrollScrubHeroSection' // single-panel hero
import ScrollScrubFullPage from '@/components/home/ScrollScrubFullPage'
// import ProductHighlights from '@/components/home/ProductHighlights' // folded into ScrollScrubFullPage
// import WhyUs from '@/components/home/WhyUs'                         // folded into ScrollScrubFullPage
// import AboutTeaser from '@/components/home/AboutTeaser'             // folded into ScrollScrubFullPage
// import Testimonials from '@/components/home/Testimonials'           // folded into ScrollScrubFullPage
// import ContactSection from '@/components/home/ContactSection'       // folded into ScrollScrubFullPage
import { OrganizationJsonLd, FaqJsonLd } from '@/components/shared/JsonLd'
import { alternatesFor } from '@/lib/site'

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
    alternates: alternatesFor(locale),
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'faq' })
  const faqItems = t.raw('items') as Array<{ question: string; answer: string }>

  return (
    <>
      <OrganizationJsonLd locale={locale} />
      <FaqJsonLd items={faqItems} />
      {/*
        ScrollScrubFullPage contains all six section heroes in a 500vh
        scroll-scrub track with the video frame sequence as the background.
        Sections: Hero → Products → Why Us → About → Reviews → Contact
      */}
      <ScrollScrubFullPage />
    </>
  )
}
