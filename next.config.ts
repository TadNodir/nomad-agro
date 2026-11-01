import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

// Static (SSG) pages can't carry per-request nonces, so inline scripts are allowed;
// everything else is locked to this origin plus the two third parties the site uses.
const isDev = process.env.NODE_ENV === 'development'

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self' https://api.web3forms.com",
  'frame-src https://www.openstreetmap.org',
  "frame-ancestors 'none'",
  "form-action 'self' https://api.web3forms.com",
  "base-uri 'self'",
  "object-src 'none'",
  // Production only: over plain http on a LAN IP (dev server) the browser would
  // upgrade every /_next asset to https and load the page without CSS or JS.
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [],
    dangerouslyAllowSVG: false,
    // Cache optimized images for 31 days so repeat requests don't re-run the optimizer.
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  async redirects() {
    return [
      // /en is gone: English lives at the root. Permanent, so old /en links keep working.
      { source: '/en', destination: '/', permanent: true },
      { source: '/en/products/dried-fruits', destination: '/catalog#dried-fruits', permanent: true },
      { source: '/en/products/nuts', destination: '/catalog#nuts', permanent: true },
      { source: '/en/products/:rest*', destination: '/catalog', permanent: true },
      { source: '/en/:path*', destination: '/:path*', permanent: true },

      { source: '/products/dried-fruits', destination: '/catalog#dried-fruits', permanent: true },
      { source: '/products/nuts', destination: '/catalog#nuts', permanent: true },
      { source: '/products/:rest*', destination: '/catalog', permanent: true },
      { source: '/:locale(ru|uz)/products/dried-fruits', destination: '/:locale/catalog#dried-fruits', permanent: true },
      { source: '/:locale(ru|uz)/products/nuts', destination: '/:locale/catalog#nuts', permanent: true },
      { source: '/:locale(ru|uz)/products/:rest*', destination: '/:locale/catalog', permanent: true },

      // Old Russian site (pre-2026, from the Wayback Machine). Point each old page at its
      // closest new Russian page. TODO when product pages exist: izyum -> /ru/catalog/raisins,
      // kuraga -> /ru/catalog/dried-apricots, orehi -> /ru/catalog/walnuts (keep one hop).
      // '/' and '/about' are the English pages now, so they are not redirected.
      { source: '/izyum', destination: '/ru/catalog#dried-fruits', permanent: true },
      { source: '/kuraga', destination: '/ru/catalog#dried-fruits', permanent: true },
      { source: '/suhofrukty', destination: '/ru/catalog#dried-fruits', permanent: true },
      { source: '/orehi', destination: '/ru/catalog#nuts', permanent: true },
      { source: '/mash', destination: '/ru/catalog', permanent: true },
      { source: '/produkciya', destination: '/ru/catalog', permanent: true },
      { source: '/kontakty', destination: '/ru/contacts', permanent: true },
      { source: '/napishite-nam', destination: '/ru/contacts', permanent: true },
      { source: '/otzyvy-o-nas', destination: '/ru/reviews', permanent: true },
      { source: '/karta-sayta', destination: '/ru', permanent: true },
      { source: '/search', destination: '/ru', permanent: true },
      { source: '/user/agreement', destination: '/ru/privacy', permanent: true },
      { source: '/user', destination: '/ru', permanent: true },
    ]
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default withNextIntl(nextConfig)
