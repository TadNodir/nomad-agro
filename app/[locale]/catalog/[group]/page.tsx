import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowRight, FileText } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { ContactCTA } from '@/components/ui/ContactCTA'
import { BreadcrumbJsonLd, FaqJsonLd } from '@/components/shared/JsonLd'
import { localePath } from '@/lib/site'
import type { SpecValue } from '@/lib/catalog'
import { PRODUCT_PAGES, productPage, groupProducts, cellFor, type Cell } from '@/lib/productPages'
import { pageMetadata } from '@/lib/seo'

type Params = Promise<{ locale: string; group: string }>
type Faq = { question: string; answer: string }

// Only the product groups listed in lib/productPages.ts exist; anything else is a 404.
export const dynamicParams = false

export function generateStaticParams() {
  return PRODUCT_PAGES.map((p) => ({ group: p.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, group } = await params
  const page = productPage(group)
  if (!page) return {}
  const t = await getTranslations({ locale, namespace: `productPages.groups.${page.group}` })
  return pageMetadata({
    locale,
    path: `/catalog/${page.slug}`,
    title: t('title'),
    description: t('description'),
  })
}

export default async function ProductGroupPage({ params }: { params: Params }) {
  const { locale, group } = await params
  const page = productPage(group)
  if (!page) notFound()
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: `productPages.groups.${page.group}` })
  const tShared = await getTranslations({ locale, namespace: 'productPages.shared' })
  const tCatalog = await getTranslations({ locale, namespace: 'catalog' })
  const tItems = await getTranslations({ locale, namespace: 'catalog.items' })
  const tSpecs = await getTranslations({ locale, namespace: 'catalog.specs' })
  const tValues = await getTranslations({ locale, namespace: 'catalog.values' })
  const tGroups = await getTranslations({ locale, namespace: 'catalog.groups' })

  const products = groupProducts(page.group)
  const specText = (value: SpecValue) =>
    typeof value === 'string' ? value : tValues(value.key, value.n ? { n: value.n } : undefined)
  const cellText = (cell: Cell) =>
    typeof cell === 'string' ? cell : tShared(`values.${cell.key}`, 'n' in cell ? { n: cell.n } : undefined)

  const faqs: Faq[] = [...(t.raw('faq') as Faq[]), ...(tShared.raw('faq') as Faq[])]
  const others = PRODUCT_PAGES.filter((p) => p.slug !== page.slug)
  const hasQuality = page.columns.includes('quality')
  const th = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-bark'
  const td = 'px-4 py-3 text-sm text-soil align-middle'

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tShared('home'), href: localePath(locale) },
          { name: tShared('catalog'), href: localePath(locale, '/catalog') },
          { name: tGroups(page.group), href: localePath(locale, `/catalog/${page.slug}`) },
        ]}
      />
      <FaqJsonLd items={faqs} />

      {/* Hero: plain HTML, no entrance animation, so the H1 and intro are readable without JS. */}
      <section className="pt-32 pb-16 bg-brand-forest grain-overlay" aria-label={t('h1')}>
        <div className="container-base">
          <nav aria-label="Breadcrumb" className="text-xs text-stone/70 mb-6">
            <Link href={localePath(locale)} className="hover:text-cream">
              {tShared('home')}
            </Link>
            <span className="mx-2">/</span>
            <Link href={localePath(locale, '/catalog')} className="hover:text-cream">
              {tShared('catalog')}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-cream/90">{tGroups(page.group)}</span>
          </nav>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-lime block mb-4">
            {tShared('eyebrow')}
          </span>
          <h1 className="font-serif text-display-md text-cream font-semibold text-balance max-w-3xl mb-6">
            {t('h1')}
          </h1>
          <p className="text-stone/80 text-lg max-w-2xl leading-relaxed mb-8">{t('intro')}</p>
          <ContactCTA variant="lime" size="lg" />
        </div>
      </section>

      {/* Spec table */}
      <Section background="cream">
        <h2 className="font-serif text-display-sm font-semibold text-soil mb-6">{tShared('specTitle')}</h2>
        <div className="relative overflow-x-auto bg-white rounded-2xl border border-parchment shadow-sm">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="bg-parchment/60">
                <th scope="col" className={th}>
                  {tShared('columns.product')}
                </th>
                {page.columns.includes('quality') && (
                  <th scope="col" className={th}>
                    {tShared('columns.quality')}
                  </th>
                )}
                <th scope="col" className={th}>
                  {tSpecs('grade')}
                </th>
                {page.columns
                  .filter((c) => c !== 'quality')
                  .map((c) => (
                    <th key={c} scope="col" className={th}>
                      {tShared(`columns.${c}`)}
                    </th>
                  ))}
                <th scope="col" className={th}>
                  {tSpecs('packaging')}
                </th>
                <th scope="col" className={th}>
                  <span className="sr-only">{tCatalog('requestSpec')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const [, grade] = product.specs.find(([label]) => label === 'grade')!
                const [, packaging] = product.specs.find(([label]) => label === 'packaging')!
                return (
                  <tr key={product.id} className="border-t border-parchment">
                    <th scope="row" className={`${td} text-left font-semibold`}>
                      <span className="flex items-center gap-3">
                        <Image
                          src={`/images/catalog/${product.id}.webp`}
                          alt=""
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                        />
                        {tItems(product.id)}
                      </span>
                    </th>
                    {page.columns.includes('quality') && (
                      <td className={td}>{cellText(cellFor(page, product.id, 'quality'))}</td>
                    )}
                    <td className={td}>
                      {/* Ungraded-by-size products repeat the quality grade here; show a dash instead. */}
                      {hasQuality && typeof grade !== 'string' && grade.key === 'thirdIndustrial' ? '—' : specText(grade)}
                    </td>
                    {page.columns
                      .filter((c) => c !== 'quality')
                      .map((c) => (
                        <td key={c} className={td}>
                          {cellText(cellFor(page, product.id, c))}
                        </td>
                      ))}
                    <td className={td}>{specText(packaging)}</td>
                    <td className={td}>
                      <Link
                        href={localePath(locale, `/contacts#spec-${product.id}`)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green hover:text-brand-green-hover whitespace-nowrap"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {tCatalog('requestSpec')}
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-bark text-sm leading-relaxed max-w-3xl mt-5">{t('specNote')}</p>
        <p className="text-bark text-sm leading-relaxed max-w-3xl mt-2">{tShared('priceNote')}</p>
      </Section>

      {page.hasExtra && (
        <Section background="white" narrow>
          <h2 className="font-serif text-display-sm font-semibold text-soil mb-4">{t('extra.title')}</h2>
          <p className="text-bark text-base leading-relaxed">{t('extra.text')}</p>
        </Section>
      )}

      {/* Quality + shipping */}
      <Section background="parchment">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="font-serif text-display-sm font-semibold text-soil mb-4">{tShared('qualityTitle')}</h2>
            <p className="text-bark text-base leading-relaxed mb-4">{tShared('qualityText')}</p>
            <a
              href="/documents/ISO-22000-Nomad-Agro.pdf"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:text-brand-green-hover"
            >
              <FileText className="w-4 h-4" />
              {tShared('isoLink')}
            </a>
          </div>
          <div>
            <h2 className="font-serif text-display-sm font-semibold text-soil mb-4">{tShared('shippingTitle')}</h2>
            <p className="text-bark text-base leading-relaxed">{tShared('shippingText')}</p>
          </div>
        </div>
      </Section>

      {/* FAQ: every answer is visible in the HTML (no accordion). */}
      <Section background="cream" narrow>
        <h2 className="font-serif text-display-sm font-semibold text-soil mb-8">{tShared('faqTitle')}</h2>
        <dl className="space-y-6">
          {faqs.map(({ question, answer }) => (
            <div key={question} className="border-b border-parchment pb-6 last:border-0">
              <dt className="font-serif text-lg font-semibold text-soil mb-2">{question}</dt>
              <dd className="text-bark text-base leading-relaxed">{answer}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Other products */}
      <Section background="parchment">
        <h2 className="font-serif text-display-sm font-semibold text-soil mb-6">{tShared('related')}</h2>
        <ul className="flex flex-wrap gap-3 mb-8">
          {others.map((p) => (
            <li key={p.slug}>
              <Link
                href={localePath(locale, `/catalog/${p.slug}`)}
                className="inline-flex items-center gap-2 bg-white border border-parchment rounded-xl px-5 py-3 text-sm font-semibold text-soil hover:border-brand-green hover:text-brand-green transition-colors"
              >
                {tGroups(p.group)}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-sm">
          <Link href={localePath(locale, '/catalog')} className="font-semibold text-brand-green hover:text-brand-green-hover">
            {tShared('backToCatalog')}
          </Link>
          <span className="mx-3 text-stone">·</span>
          <Link href={localePath(locale, '/about')} className="font-semibold text-brand-green hover:text-brand-green-hover">
            {tShared('about')}
          </Link>
        </p>
      </Section>

      {/* Final CTA */}
      <Section background="cream">
        <div className="text-center">
          <h2 className="font-serif text-display-sm font-semibold text-soil mb-4">{tCatalog('finalCtaTitle')}</h2>
          <p className="text-bark text-lg max-w-xl mx-auto mb-8">{tCatalog('finalCtaText')}</p>
          <ContactCTA size="lg" />
        </div>
      </Section>
    </>
  )
}
