// Tell Bing, Yandex, Seznam, Naver (and through them Copilot / ChatGPT search) that pages
// changed, via IndexNow (https://www.indexnow.org). Google does not use IndexNow.
//
// Run after a production deploy that changed content:
//   node scripts/indexnow.mjs                      -> every URL in the live sitemap
//   node scripts/indexnow.mjs /catalog /ru/catalog -> only these paths
//
// The key is public by design: search engines verify it at https://nomadagro.uz/<key>.txt
// (file lives in public/). Don't change it without renaming that file too.

const HOST = 'nomadagro.uz'
const KEY = 'd729ec997abb4739b2dda2c3a59a35b2'
const ORIGIN = `https://${HOST}`

async function sitemapUrls() {
  const res = await fetch(`${ORIGIN}/sitemap.xml`)
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`)
  const xml = await res.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
}

const args = process.argv.slice(2)
const urlList = args.length ? args.map((p) => new URL(p, ORIGIN).href) : await sitemapUrls()

// Check the key file is live first, otherwise the submission is rejected (403).
const keyRes = await fetch(`${ORIGIN}/${KEY}.txt`)
if (!keyRes.ok || (await keyRes.text()).trim() !== KEY) {
  console.error(`Key file ${ORIGIN}/${KEY}.txt is not live yet. Deploy first.`)
  process.exit(1)
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList }),
})

const meaning = { 200: 'OK', 202: 'Accepted (key check pending)', 400: 'Bad request', 403: 'Key not valid', 422: 'URLs not on this host', 429: 'Too many requests' }
console.log(`IndexNow: ${res.status} ${meaning[res.status] ?? ''} for ${urlList.length} URLs`)
urlList.forEach((u) => console.log('  ' + u))
if (res.status >= 300) process.exit(1)
