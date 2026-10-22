import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [],
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
