import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'platform-lookaside.fbsbx.com' },
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'turbinesuasredes.com.br' },
      { hostname: '*.turbinesuasredes.com.br' }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    unoptimized: false
  },

  compress: true,
  productionBrowserSourceMaps: false,

  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        }
      ]
    }
  ],

  redirects: async () => [
    {
      source: '/sitemap.xml',
      destination: '/api/sitemap',
      permanent: true
    },
    {
      source: '/robots.txt',
      destination: '/api/robots',
      permanent: true
    }
  ],

  typescript: {
    tsconfigPath: './tsconfig.json'
  },

  eslint: {
    ignoreDuringBuilds: false
  }
}

export default nextConfig
