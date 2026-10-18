// Single source of truth for the product range: mirrors public/NOMAD_AGRO_PRODUCTS.pdf.
// Product names live in messages/*.json under catalog.items.<id>; spec labels under
// catalog.specs; worded spec values under catalog.values.

export type SpecLabel =
  | 'grade'
  | 'moisture'
  | 'size'
  | 'caliber'
  | 'sulphur'
  | 'splitBroken'
  | 'damaged'
  | 'foreignMaterial'
  | 'mold'
  | 'admixture'
  | 'packaging'
  | 'crop'

export type ValueKey =
  | 'absent'
  | 'notAllowed'
  | 'highest'
  | 'firstGrade'
  | 'secondGrade'
  | 'thirdIndustrial'
  | 'box10kg'
  | 'pcs100'
  | 'perOunce'
  | 'cm'
  | 'gKg'
  | 'noMoreThan'
  | 'mixedForOil'

/** Plain text (numbers, ranges) or a translated value, optionally with a number `n`. */
export type SpecValue = string | { key: ValueKey; n?: string }

export interface Product {
  id: string
  specs: Array<[SpecLabel, SpecValue]>
}

export type GroupId = 'raisins' | 'apricots' | 'prunes' | 'peanuts' | 'walnuts' | 'mungBeans'

export interface ProductGroup {
  id: GroupId
  products: Product[]
}

export type CategoryId = 'driedFruits' | 'nuts' | 'mungBeans'

export interface CatalogCategory {
  id: CategoryId
  /** URL anchor on /catalog, e.g. /en/catalog#nuts */
  slug: string
  gradient: string
  groups: ProductGroup[]
}

const absent: SpecValue = { key: 'absent' }
const notAllowed: SpecValue = { key: 'notAllowed' }
const box10kg: SpecValue = { key: 'box10kg' }
const pcs = (n: string): SpecValue => ({ key: 'pcs100', n })
const cm = (n: string): SpecValue => ({ key: 'cm', n })
const sulphur: SpecValue = { key: 'gKg', n: '1.7–2' }
const noMoreThan = (n: string): SpecValue => ({ key: 'noMoreThan', n })

const raisin = (
  id: string,
  grade: ValueKey,
  moisture: string,
  caliber?: string
): Product => ({
  id,
  specs: [
    ['grade', { key: grade }],
    ['moisture', moisture],
    ['foreignMaterial', absent],
    ['packaging', box10kg],
    ...(caliber ? ([['caliber', pcs(caliber)]] as Array<[SpecLabel, SpecValue]>) : []),
  ],
})

const apricot = (id: string, grade: ValueKey, size: string): Product => ({
  id,
  specs: [
    ['grade', { key: grade }],
    ['moisture', '16–24%'],
    ['size', cm(size)],
    ['sulphur', sulphur],
    ['foreignMaterial', absent],
    ['crop', '2024'],
  ],
})

const prune = (id: string): Product => ({
  id,
  specs: [
    ['grade', { key: 'highest' }],
    ['moisture', '18–26%'],
    ['damaged', '0.5%'],
    ['mold', absent],
  ],
})

const peanutKernel = (id: string, caliber: SpecValue): Product => ({
  id,
  specs: [
    ['caliber', caliber],
    ['moisture', '7%'],
    ['splitBroken', '1–2%'],
    ['foreignMaterial', absent],
    ['mold', absent],
    ['admixture', '0.5%'],
  ],
})

const walnut = (id: string, caliber: string): Product => ({
  id,
  specs: [
    ['caliber', caliber],
    ['mold', notAllowed],
    ['admixture', notAllowed],
  ],
})

/** Products with a downloadable-on-request specification sheet (prunes, apricots, golden and sultana raisins). */
export const hasSpecSheet = (id: string) =>
  id.startsWith('apricot') ||
  id.startsWith('prune') ||
  ['raisinGolden150', 'raisinGolden120', 'raisinSultana', 'raisinSultanaCalibrated'].includes(id)

export const CATALOG: CatalogCategory[] = [
  {
    id: 'driedFruits',
    slug: 'dried-fruits',
    gradient: 'from-amber-800 to-orange-900',
    groups: [
      {
        id: 'raisins',
        products: [
          raisin('raisinBlackRed', 'thirdIndustrial', '8–15%'),
          raisin('raisinBlackSun220', 'secondGrade', '10–15%', '220–240'),
          raisin('raisinBlackSmall', 'secondGrade', '8–15%', '400–440'),
          raisin('raisinBlackMedium', 'secondGrade', '8–15%', '300–400'),
          raisin('raisinBlackSun200', 'secondGrade', '10–15%', '200–220'),
          raisin('raisinSoyakiSmall', 'highest', '10–15%', '160–180'),
          raisin('raisinSoyakiMedium', 'highest', '10–15%', '140–160'),
          raisin('raisinSoyakiLarge120', 'highest', '10–15%', '120–130'),
          raisin('raisinSoyakiLarge100', 'highest', '10–15%', '100–110'),
          raisin('raisinSultana', 'firstGrade', '10–15%', '240–260'),
          raisin('raisinGolden150', 'highest', '10–15%', '150–160'),
          raisin('raisinGolden120', 'highest', '10–15%', '120–140'),
          raisin('raisinSultanaCalibrated', 'highest', '10–15%', '220–240'),
        ],
      },
      {
        id: 'apricots',
        products: [
          {
            id: 'apricotBakery',
            specs: [
              ['grade', { key: 'highest' }],
              ['moisture', '16–24%'],
              ['size', cm('2.5–3.5')],
              ['sulphur', sulphur],
              ['foreignMaterial', absent],
              ['crop', '2024'],
            ],
          },
          apricot('apricotSubhanaLarge', 'highest', '5.0–6.0'),
          apricot('apricotSubhanaMedium', 'firstGrade', '4.0–4.5'),
          apricot('apricotHandak', 'firstGrade', '4.0–4.5'),
        ],
      },
      {
        id: 'prunes',
        products: [prune('pruneSpain'), prune('pruneHungarian'), prune('pruneBalonchik')],
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
          {
            id: 'peanutInShell',
            specs: [
              ['grade', { key: 'firstGrade' }],
              ['moisture', '6–7%'],
              ['splitBroken', '1–2%'],
              ['foreignMaterial', absent],
              ['mold', absent],
            ],
          },
          peanutKernel('peanutKernel6070', { key: 'perOunce', n: '60/70' }),
          peanutKernel('peanutKernel5060', { key: 'perOunce', n: '50/60' }),
          {
            id: 'peanutKernelOil',
            specs: [
              ['caliber', { key: 'mixedForOil' }],
              ['moisture', '6–7%'],
              ['splitBroken', '40–50%'],
              ['foreignMaterial', absent],
              ['mold', absent],
              ['admixture', '1–5%'],
            ],
          },
        ],
      },
      {
        id: 'walnuts',
        products: [
          walnut('walnutButterfly', '100%'),
          walnut('walnutWhite', '70% / 30%'),
          walnut('walnutAmber', '60% / 40%'),
        ],
      },
    ],
  },
  {
    id: 'mungBeans',
    slug: 'mung-beans',
    gradient: 'from-brand-green to-brand-forest',
    groups: [
      {
        id: 'mungBeans',
        products: [
          {
            id: 'mungGreen',
            specs: [
              ['caliber', '3+'],
              ['moisture', noMoreThan('13%')],
              ['splitBroken', noMoreThan('2%')],
              ['foreignMaterial', noMoreThan('1%')],
              ['mold', notAllowed],
              ['admixture', notAllowed],
            ],
          },
        ],
      },
    ],
  },
]
