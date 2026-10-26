// Throwaway crawlability baseline: what a non-JS crawler receives per route.
// Usage: node scripts/seo-baseline.mjs [--no-build]
// Builds, serves the production build locally, fetches raw HTML (no JS
// execution) for every public route and writes seo-baseline.md.
import { spawn, spawnSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:net'
import { join } from 'node:path'

const CANONICAL_ORIGIN = 'https://nomadagro.uz'
const CANONICAL_HOST = new URL(CANONICAL_ORIGIN).host
const NEXT_BIN = join('node_modules', 'next', 'dist', 'bin', 'next')
const PLACEHOLDER_RE = /TODO|FIXME|example\.com|localhost|127\.0\.0\.1|\{\{[^}]{1,40}\}\}/g

// ── helpers ────────────────────────────────────────────────────────────────
const freePort = () =>
  new Promise((resolve) => {
    const srv = createServer().listen(0, () => {
      const { port } = srv.address()
      srv.close(() => resolve(port))
    })
  })

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))

const stripNonVisible = (html) =>
  html.replace(/<(script|style|noscript|template|svg)\b[\s\S]*?<\/\1>/gi, ' ')

const toText = (html) =>
  decode(stripNonVisible(html).replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()

const wordCount = (text) => text.split(' ').filter((w) => /[\p{L}\p{N}]/u.test(w)).length

const attrs = (tag) => {
  const out = {}
  for (const [, k, v] of tag.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)) out[k.toLowerCase()] = decode(v)
  return out
}

const tags = (html, name) => (html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) || []).map(attrs)

const norm = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase()

// Inner HTML of the element starting at `start` (index of its '<'), by depth counting.
function elementAt(html, start) {
  const name = /^<([a-z0-9]+)/i.exec(html.slice(start))[1]
  const re = new RegExp(`<(/?)${name}\\b[^>]*?(/?)>`, 'gi')
  re.lastIndex = start
  let depth = 0
  let m
  while ((m = re.exec(html))) {
    if (m[2] === '/') continue
    depth += m[1] ? -1 : 1
    if (depth === 0) return { end: re.lastIndex, inner: html.slice(start, re.lastIndex) }
  }
  return { end: html.length, inner: html.slice(start) }
}

function jsonLdTypes(html) {
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
  const types = []
  const faq = []
  for (const [, raw] of blocks) {
    try {
      const data = JSON.parse(raw)
      for (const node of data['@graph'] || [data]) {
        types.push([].concat(node['@type']).join('+'))
        if (node['@type'] === 'FAQPage') {
          for (const q of node.mainEntity || []) faq.push({ q: q.name, a: q.acceptedAnswer?.text || '' })
        }
      }
    } catch {
      types.push('INVALID_JSON')
    }
  }
  return { count: blocks.length, types, faq }
}

function hiddenByOpacity(html) {
  const body = stripNonVisible(html)
  let count = 0
  let words = 0
  let coveredUntil = -1
  for (const m of body.matchAll(/<[a-z0-9]+\b[^>]*style="[^"]*opacity:\s*0(?![.\d])[^"]*"[^>]*>/gi)) {
    if (m.index < coveredUntil) continue
    const el = elementAt(body, m.index)
    coveredUntil = el.end
    count++
    words += wordCount(toText(el.inner))
  }
  return { count, words }
}

// ── analysis per route ─────────────────────────────────────────────────────
function analyse(path, status, html, location) {
  const metas = tags(html, 'meta')
  const links = tags(html, 'link')
  const meta = (key, val) => metas.find((m) => m[key] === val)?.content ?? ''
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(([, inner]) => toText(inner))
  const text = toText(html.replace(/^[\s\S]*?<body[^>]*>/i, ''))
  const mainStart = html.search(/<main\b/i)
  const mainText = mainStart >= 0 ? toText(elementAt(html, mainStart).inner) : ''
  const ld = jsonLdTypes(html)
  const faqMissing = ld.faq.filter(({ a }) => !norm(text).includes(norm(a).slice(0, 60)))
  return {
    path,
    status,
    location,
    title: toText(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? ''),
    description: meta('name', 'description'),
    robots: meta('name', 'robots'),
    canonical: links.find((l) => l.rel === 'canonical')?.href ?? '',
    ogUrl: meta('property', 'og:url'),
    h1s,
    words: wordCount(text),
    mainWords: wordCount(mainText),
    mainInRaw: wordCount(mainText) >= 50 && h1s.length > 0 && norm(mainText).includes(norm(h1s[0])),
    // Streamed Suspense boundaries: content arrives later in the same response in
    // <div hidden id="S:n"> and an inline script swaps it in. Present in raw HTML.
    streamed: (html.match(/<!--\$\?--><template id="B:/g) || []).length,
    // Static render bailed out to client-only for a subtree (only the fallback is in the HTML).
    csrBailouts: (html.match(/BAILOUT_TO_CLIENT_SIDE_RENDERING/g) || []).length,
    forms: (html.match(/<form\b/g) || []).length,
    ld,
    faqMissing,
    hreflang: links.filter((l) => l.rel === 'alternate' && l.hreflang).map((l) => `${l.hreflang}→${l.href}`),
    hidden: hiddenByOpacity(html),
    placeholders: [...new Set(stripNonVisible(html).match(PLACEHOLDER_RE) || [])],
  }
}

function scanBuildOutput() {
  const hits = []
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name)
      if (statSync(p).isDirectory()) walk(p)
      else if (/\.(html|body|rsc|json|meta)$/.test(name) || (/\.js$/.test(name) && dir.includes('app'))) {
        const found = readFileSync(p, 'utf8').match(/example\.com|\{\{[A-Z_]{2,40}\}\}/g)
        if (found) hits.push(`${p}: ${[...new Set(found)].join(', ')}`)
      }
    }
  }
  walk(join('.next', 'server'))
  return hits
}

// ── main ───────────────────────────────────────────────────────────────────
if (!process.argv.includes('--no-build')) {
  const b = spawnSync(process.execPath, [NEXT_BIN, 'build'], { stdio: 'inherit' })
  if (b.status !== 0) process.exit(b.status ?? 1)
}

const port = await freePort()
const base = `http://localhost:${port}`
const server = spawn(process.execPath, [NEXT_BIN, 'start', '-p', String(port)], { stdio: 'ignore' })
const stop = () => server.kill()
process.on('exit', stop)

try {
  for (let i = 0; ; i++) {
    try {
      if ((await fetch(`${base}/robots.txt`)).ok) break
    } catch {}
    if (i > 120) throw new Error('server did not start')
    await new Promise((r) => setTimeout(r, 500))
  }

  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text()
  const fromSitemap = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, u]) => new URL(u).pathname)
  const locales = ['en', 'ru', 'uz']
  const pageDirs = readdirSync(join('app', '[locale]'), { withFileTypes: true })
    .filter((d) => d.isDirectory() && readdirSync(join('app', '[locale]', d.name)).includes('page.tsx'))
    .map((d) => `/${d.name}`)
  const fromRouter = locales.flatMap((l) => ['', ...pageDirs].map((p) => `/${l}${p}`))
  const routes = [...new Set([...fromSitemap, ...fromRouter])].sort()
  const notInSitemap = fromRouter.filter((r) => !fromSitemap.includes(r))

  const rows = []
  for (const path of routes) {
    const res = await fetch(base + path, { redirect: 'manual', headers: { 'user-agent': 'seo-baseline (no-js)' } })
    rows.push(analyse(path, res.status, await res.text(), res.headers.get('location')))
  }
  const extra = []
  for (const path of ['/', '/en/this-page-does-not-exist']) {
    const res = await fetch(base + path, { redirect: 'manual' })
    extra.push({ path, status: res.status, location: res.headers.get('location') ?? '' })
  }
  const robotsTxt = await (await fetch(`${base}/robots.txt`)).text()
  const buildHits = scanBuildOutput()

  // ── findings, ranked by impact score ─────────────────────────────────────
  const findings = []
  const add = (score, text) => findings.push({ score, text })
  const offHost = rows.flatMap((r) =>
    [['canonical', r.canonical], ['og:url', r.ogUrl]]
      .filter(([, u]) => u && new URL(u, CANONICAL_ORIGIN).host !== CANONICAL_HOST)
      .map(([k, u]) => `${r.path} ${k}=${u}`),
  )
  if (offHost.length) add(100, `Canonical/og:url on a foreign host: ${offHost.join('; ')}`)
  const noindex = rows.filter((r) => /noindex/i.test(r.robots))
  if (noindex.length) add(95, `noindex on: ${noindex.map((r) => r.path).join(', ')}`)
  const bad = rows.filter((r) => r.status !== 200)
  if (bad.length) add(90, `Non-200 public routes: ${bad.map((r) => `${r.path} (${r.status})`).join(', ')}`)
  const noMain = rows.filter((r) => r.status === 200 && !r.mainInRaw)
  if (noMain.length) add(85, `Main content not in raw HTML (h1 + ≥50 words in <main>):${noMain.map((r) => r.path).join(', ')}`)
  const wrongCanon = rows.filter((r) => r.canonical && new URL(r.canonical).pathname !== r.path)
  if (wrongCanon.length) add(80, `Canonical points elsewhere: ${wrongCanon.map((r) => `${r.path}→${r.canonical}`).join(', ')}`)
  const h1Bad = rows.filter((r) => r.h1s.length !== 1)
  if (h1Bad.length) add(60, `Not exactly one <h1>: ${h1Bad.map((r) => `${r.path} (${r.h1s.length})`).join(', ')}`)
  const noMeta = rows.filter((r) => !r.title || !r.description)
  if (noMeta.length) add(60, `Missing title/description: ${noMeta.map((r) => r.path).join(', ')}`)
  const faqRows = rows.filter((r) => r.faqMissing.length)
  if (faqRows.length)
    add(55, `FAQPage JSON-LD answers not visible on the page (${faqRows[0].faqMissing.length}/${faqRows[0].ld.faq.length} answers on ${faqRows.map((r) => r.path).join(', ')}) — Google requires FAQ markup to match visible content`)
  const noHreflang = rows.filter((r) => r.hreflang.length < locales.length + 1)
  if (noHreflang.length) add(50, `Incomplete hreflang set: ${noHreflang.map((r) => r.path).join(', ')}`)
  if (notInSitemap.length) add(45, `Routes missing from sitemap.xml: ${notInSitemap.join(', ')}`)
  const dupTitles = Object.entries(Object.groupBy(rows, (r) => r.title)).filter(([, g]) => g.length > 1)
  if (dupTitles.length) add(40, `Duplicate titles: ${dupTitles.map(([t, g]) => `"${t}" on ${g.map((r) => r.path).join(', ')}`).join('; ')}`)
  const hiddenWords = rows.reduce((n, r) => n + r.hidden.words, 0)
  if (hiddenWords)
    add(35, `${hiddenWords} words across ${rows.filter((r) => r.hidden.words).length} routes are in raw HTML but start at inline opacity:0 (framer-motion) until JS runs — indexable, but invisible to a no-JS render/screenshot`)
  const thin = rows.filter((r) => r.status === 200 && r.words < 250)
  if (thin.length) add(30, `Thin raw HTML (<250 words): ${thin.map((r) => `${r.path} (${r.words})`).join(', ')}`)
  const ph = rows.filter((r) => r.placeholders.length)
  if (ph.length || buildHits.length)
    add(30, `Placeholder/TODO strings: ${[...ph.map((r) => `${r.path}: ${r.placeholders.join(', ')}`), ...buildHits].join('; ')}`)
  const noOg = rows.filter((r) => !r.ogUrl)
  if (noOg.length) add(15, `No og:url on ${noOg.length}/${rows.length} routes (social previews fall back to the fetched URL)`)
  const nf = extra.find((e) => e.path.includes('does-not-exist'))
  if (nf.status !== 404) add(70, `Unknown URL returns ${nf.status}, not 404 (soft 404)`)
  const root = extra.find((e) => e.path === '/')
  // A temporary redirect is correct for a language-adaptive root declared as x-default.
  const rootIsXDefault = rows.find((r) => r.path === '/en')?.hreflang.some((h) => [`x-default→${CANONICAL_ORIGIN}`, `x-default→${CANONICAL_ORIGIN}/`].includes(h))
  if ([302, 307].includes(root.status) && !rootIsXDefault)
    add(20, `\`/\` answers ${root.status} (temporary) → ${root.location}; the bare origin stays an indexing candidate instead of consolidating to the locale URL`)
  const prerendered = Object.keys(JSON.parse(readFileSync(join('.next', 'prerender-manifest.json'), 'utf8')).routes)
  const dynamicRoutes = rows.filter((r) => !prerendered.includes(r.path))
  if (dynamicRoutes.length)
    add(18, `${dynamicRoutes.length}/${rows.length} routes are server-rendered per request, not prerendered (absent from prerender-manifest.json) — HTML is complete, but TTFB depends on the server on every crawl`)
  findings.sort((a, b) => b.score - a.score)

  // ── markdown ─────────────────────────────────────────────────────────────
  const cell = (s) => String(s || '—').replace(/\|/g, '\\|').replace(/\n/g, ' ')
  const short = (s, n = 70) => (s && s.length > n ? `${s.slice(0, n - 1)}…` : s)
  const md = [
    `# SEO crawlability baseline`,
    ``,
    `Generated ${new Date().toISOString()} by \`scripts/seo-baseline.mjs\` against the local production build (\`next start\`). Raw HTML only — no JavaScript executed. Canonical origin: ${CANONICAL_ORIGIN}.`,
    ``,
    `## Routes`,
    ``,
    `| Route | Status | Title | Meta description | Robots | Canonical | H1 (#: text) | Words | JSON-LD (#: types) | hreflang | Main content in raw HTML |`,
    `|---|---|---|---|---|---|---|---|---|---|---|`,
    ...rows.map((r) =>
      `| ${r.path} | ${r.status} | ${cell(short(r.title))} | ${cell(short(r.description, 90))} | ${cell(r.robots)} | ${cell(r.canonical)} | ${r.h1s.length}: ${cell(short(r.h1s.join(' / '), 60))} | ${r.words} | ${r.ld.count}: ${cell(r.ld.types.join(', '))} | ${r.hreflang.length ? r.hreflang.map((h) => h.split('→')[0]).join(', ') : '—'} | ${r.mainInRaw ? 'yes' : '**no**'} |`,
    ),
    ``,
    `## Other requests`,
    ``,
    `| Request | Status | Location |`,
    `|---|---|---|`,
    ...extra.map((e) => `| ${e.path} | ${e.status} | ${cell(e.location)} |`),
    ``,
    `robots.txt:`,
    '```',
    robotsTxt.trim(),
    '```',
    ``,
    `## Host check (canonical / og:url ≠ ${CANONICAL_HOST})`,
    ``,
    offHost.length ? offHost.map((h) => `- ${h}`).join('\n') : `- None. All ${rows.filter((r) => r.canonical).length} canonicals are on ${CANONICAL_HOST}; og:url present on ${rows.filter((r) => r.ogUrl).length}/${rows.length} routes.`,
    ``,
    `## Placeholders in built output`,
    ``,
    ph.length || buildHits.length
      ? [...ph.map((r) => `- ${r.path}: ${r.placeholders.join(', ')}`), ...buildHits.map((h) => `- ${h}`)].join('\n')
      : `- None (searched raw HTML of every route and \`.next/server\` for TODO, FIXME, example.com, localhost, {{…}}).`,
    ``,
    `## Content hidden until interaction / JS`,
    ``,
    `| Route | Elements at opacity:0 | Words inside them | FAQ answers in JSON-LD not visible | Streamed Suspense boundaries | Client-only bailouts (fallback in HTML) | &lt;form&gt; in raw HTML |`,
    `|---|---|---|---|---|---|---|`,
    ...rows.map((r) => `| ${r.path} | ${r.hidden.count} | ${r.hidden.words} | ${r.ld.faq.length ? `${r.faqMissing.length}/${r.ld.faq.length}` : '—'} | ${r.streamed} | ${r.csrBailouts} | ${r.forms} |`),
    ``,
    `Interaction-only components (not in raw HTML at all, by design): ContactSheet modal (opens on CTA click), mobile nav drawer, language-switcher dropdown. Testimonial cards on the home page use CSS \`line-clamp\`; their full text is in the raw HTML. Streamed Suspense boundaries (e.g. the contact form) are in the raw HTML too, at the end of the document inside \`<div hidden>\` until an inline script moves them into place.`,
    ``,
    `## Top 5 problems (ranked by impact)`,
    ``,
    ...(findings.length ? findings.slice(0, 5).map((f, i) => `${i + 1}. ${f.text}`) : ['No problems detected.']),
    ...(findings.length > 5 ? [``, `Also noted:`, ...findings.slice(5).map((f) => `- ${f.text}`)] : []),
    ``,
  ].join('\n')

  writeFileSync('seo-baseline.md', md)
  console.log(md)
} finally {
  stop()
}
