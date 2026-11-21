// Re-encode the homepage scroll-scrub frames as WebP, keeping every Nth frame.
//
//   node scripts/encode-hero-frames.mjs <src-dir> <dst-dir> [quality=72] [step=2]
//   node scripts/encode-hero-frames.mjs public/frames/hero public/frames/hero-v2
//
// Source frames come from ffmpeg (see hero-source.mp4 / hero-source-mobile.mp4).
// Write a NEW folder per change: /frames/* is served with a one-year immutable cache.
import sharp from 'sharp'
import { readdirSync, mkdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const [, , src, dst, quality = '72', step = '2'] = process.argv
if (!src || !dst) {
  console.error('usage: node scripts/encode-hero-frames.mjs <src-dir> <dst-dir> [quality] [step]')
  process.exit(1)
}

mkdirSync(dst, { recursive: true })
const files = readdirSync(src).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()
let n = 0
let bytes = 0
for (let i = 0; i < files.length; i += Number(step)) {
  n++
  const out = join(dst, `frame_${String(n).padStart(4, '0')}.webp`)
  await sharp(join(src, files[i])).webp({ quality: Number(quality), effort: 6 }).toFile(out)
  bytes += statSync(out).size
}
console.log(`${dst}: ${n} frames, ${(bytes / 1048576).toFixed(2)} MB`)
