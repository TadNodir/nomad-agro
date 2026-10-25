// Single source of truth for the product range (mirrors public/NOMAD_AGRO_PRODUCTS.pdf).
// Each card shows only two facts: grade / caliber and packaging.
// Product names live in messages/*.json under catalog.items.<id>; labels under
// catalog.specs; worded values under catalog.values.

export type SpecLabel = 'grade' | 'packaging'

export type ValueKey =
  | 'firstGrade'
  | 'thirdIndustrial'
  | 'box5or10'
  | 'pcs100'
  | 'pcsKg'
  | 'perOunce'
  | 'gradeACount'
  | 'mixedForOil'

/** Plain text or a translated value, optionally with a number/range `n`. */
export type SpecValue = string | { key: ValueKey; n?: string }

export interface Product {
  id: string
  specs: Array<[SpecLabel, SpecValue]>
}

export type GroupId = 'raisins' | 'apricots' | 'prunes' | 'peanuts' | 'walnuts'

export interface ProductGroup {
  id: GroupId
  products: Product[]
}

export type CategoryId = 'driedFruits' | 'nuts'

export interface CatalogCategory {
  id: CategoryId
  /** URL anchor on /catalog, e.g. /en/catalog#nuts */
  slug: string
  gradient: string
  groups: ProductGroup[]
}

const box: SpecValue = { key: 'box5or10' }

const product = (id: string, grade: SpecValue): Product => ({
  id,
  specs: [
    ['grade', grade],
    ['packaging', box],
  ],
})

const pcs100 = (n: string): SpecValue => ({ key: 'pcs100', n })

// Values below follow the product specification sheets where one exists
// (Soyaki black, golden, sultana, apricots, prunes); other products use the catalog PDF.
const SOYAKI = pcs100('160–200')
const GOLDEN = pcs100('280–330')
const SULTANA = pcs100('280–320')
const APRICOT: SpecValue = { key: 'pcsKg', n: '100–220' }
const PRUNE: SpecValue = { key: 'gradeACount', n: '70/80' }

export const CATALOG: CatalogCategory[] = [
  {
    id: 'driedFruits',
    slug: 'dried-fruits',
    gradient: 'from-amber-800 to-orange-900',
    groups: [
      {
        id: 'raisins',
        products: [
          product('raisinBlackRed', { key: 'thirdIndustrial' }),
          product('raisinBlackSun220', pcs100('220–240')),
          product('raisinBlackSmall', pcs100('400–440')),
          product('raisinBlackMedium', pcs100('300–400')),
          product('raisinBlackSun200', pcs100('200–220')),
          product('raisinSoyakiSmall', SOYAKI),
          product('raisinSoyakiMedium', SOYAKI),
          product('raisinSoyakiLarge120', SOYAKI),
          product('raisinSoyakiLarge100', SOYAKI),
          product('raisinSultana', SULTANA),
          product('raisinGolden150', GOLDEN),
          product('raisinGolden120', GOLDEN),
          product('raisinSultanaCalibrated', SULTANA),
        ],
      },
      {
        id: 'apricots',
        products: [
          product('apricotBakery', APRICOT),
          product('apricotSubhanaLarge', APRICOT),
          product('apricotSubhanaMedium', APRICOT),
          product('apricotHandak', APRICOT),
        ],
      },
      {
        id: 'prunes',
        products: [product('pruneSpain', PRUNE), product('pruneHungarian', PRUNE), product('pruneBalonchik', PRUNE)],
      },
    ],
  },
  {
    id: 'nuts',
    slug: 'nuts',
    gradient: 'from-stone-700 to-amber-900',
    groups: [
      {
        id: 'peanuts',
        products: [
          product('peanutInShell', { key: 'firstGrade' }),
          product('peanutKernel6070', { key: 'perOunce', n: '60/70' }),
          product('peanutKernel5060', { key: 'perOunce', n: '50/60' }),
          product('peanutKernelOil', { key: 'mixedForOil' }),
        ],
      },
      {
        id: 'walnuts',
        products: [
          product('walnutButterfly', '100%'),
          product('walnutWhite', '70% / 30%'),
          product('walnutAmber', '60% / 40%'),
        ],
      },
    ],
  },
]
