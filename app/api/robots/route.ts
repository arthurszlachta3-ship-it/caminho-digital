import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://turbinesuasredes.com.br'

  const robots = `# Robots.txt for Caminho Digital
# Generated dynamically

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /auth/
Disallow: /private/
Disallow: /.well-known/
Disallow: /admin
Disallow: /__nextjs_original-stack-frame
Disallow: /*?*sort=
Disallow: /*?*filter=
Disallow: /*.json$

# Specific crawlers
User-agent: Googlebot
Allow: /
Allow: /api/
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Block bad bots
User-agent: MJ12bot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Canonical domain
Host: ${baseUrl.replace('https://', '').replace('http://', '')}
`

  return new NextResponse(robots, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
