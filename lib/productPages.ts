// One page per product group at /catalog/<slug> (all locales).
// Grade / caliber and packaging come from lib/catalog.ts, the same values the catalog cards show.
// The extra columns below (quality grade, moisture, sulphur, ...) are copied from the product
// catalog PDF (public/NOMAD_AGRO_PRODUCTS.pdf). Do not add a number here without a source.
import { CATALOG, type GroupId, type Product } from '@/lib/catalog'

export type ExtraColumn = 'quality' | 'moisture' | 'sulphur' | 'damaged' | 'splitBroken' | 'admixture'

export type CellKey = 'highest' | 'first' | 'second' | 'thirdIndustrial'

/** Plain text (numbers, ranges) or a translated value from productPages.shared.values. */
export type Cell = string | { key: CellKey } | { key: 'gPerKg'; n: string }

type Row = Partial<Record<ExtraColumn, Cell>>

export interface ProductPage {
  slug: string
  group: GroupId
  columns: ExtraColumn[]
  /** Values shared by every product in the group. */
  defaults: Row
  /** Per-product values, keyed by product id from lib/catalog.ts. */
  rows: Record<string, Row>
  /** Raisins only: the "raisins vs sultanas" explainer (productPages.groups.<group>.extra). */
  hasExtra?: boolean
}

const HIGHEST: Cell = { key: 'highest' }
const FIRST: Cell = { key: 'first' }
const SECOND: Cell = { key: 'second' }

export const PRODUCT_PAGES: ProductPage[] = [
  {
    slug: 'raisins',
    group: 'raisins',
    columns: ['quality', 'moisture'],
    defaults: { quality: HIGHEST, moisture: '10–15%' },
    rows: {
      raisinBlackRed: { quality: { key: 'thirdIndustrial' }, moisture: '8–15%' },
      raisinBlackSun220: { quality: SECOND },
      raisinBlackSmall: { quality: SECOND, moisture: '8–15%' },
      raisinBlackMedium: { quality: SECOND, moisture: '8–15%' },
      raisinBlackSun200: { quality: SECOND },
      raisinSultana: { quality: FIRST },
    },
    hasExtra: true,
  },
  {
    slug: 'dried-apricots',
    group: 'apricots',
    columns: ['quality', 'moisture', 'sulphur'],
    defaults: { quality: HIGHEST, moisture: '16–24%', sulphur: { key: 'gPerKg', n: '1.7–2' } },
    rows: {
      apricotSubhanaMedium: { quality: FIRST },
      apricotHandak: { quality: FIRST },
    },
  },
  {
    slug: 'prunes',
    group: 'prunes',
    columns: ['quality', 'moisture', 'damaged'],
    defaults: { quality: HIGHEST, moisture: '18–26%', damaged: '0.5%' },
    rows: {},
  },
  {
    slug: 'walnuts',
    group: 'walnuts',
    columns: [],
    defaults: {},
    rows: {},
  },
  {
    slug: 'peanuts',
    group: 'peanuts',
    columns: ['moisture', 'splitBroken', 'admixture'],
    defaults: { moisture: '7%', splitBroken: '1–2%', admixture: '0.5%' },
    rows: {
      peanutInShell: { moisture: '6–7%', admixture: '—' },
      peanutKernelOil: { moisture: '6–7%', splitBroken: '40–50%', admixture: '1–5%' },
    },
  },
]

export const productPage = (slug: string) => PRODUCT_PAGES.find((p) => p.slug === slug)

export const productPageSlug = (group: GroupId) => PRODUCT_PAGES.find((p) => p.group === group)?.slug

export const groupProducts = (group: GroupId): Product[] =>
  CATALOG.flatMap((c) => c.groups).find((g) => g.id === group)?.products ?? []

export const cellFor = (page: ProductPage, productId: string, column: ExtraColumn): Cell =>
  page.rows[productId]?.[column] ?? page.defaults[column] ?? '—'
