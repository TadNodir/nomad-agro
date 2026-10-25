import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

// Static (SSG) pages can't carry per-request nonces, so inline scripts are allowed;
// everything else is locked to this origin plus the two third parties the site uses.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}`,
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
  'upgrade-insecure-requests',
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
      { source: '/:locale(en|ru|uz)/products/dried-fruits', destination: '/:locale/catalog#dried-fruits', permanent: true },
      { source: '/:locale(en|ru|uz)/products/nuts', destination: '/:locale/catalog#nuts', permanent: true },
      { source: '/:locale(en|ru|uz)/products/mung-beans', destination: '/:locale/catalog', permanent: true },
      { source: '/:locale(en|ru|uz)/products', destination: '/:locale/catalog', permanent: true },
    ]
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default withNextIntl(nextConfig)
