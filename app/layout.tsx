import type { Metadata } from 'next'
import './globals.css'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://turbinesuasredes.com.br'

export const metadata: Metadata = {
  title: {
    default: 'Caminho Digital - Turbine Suas Redes',
    template: '%s | Caminho Digital',
  },
  description:
    'ERP de Presença Digital com Agentes IA. Monitore e otimize Instagram, TikTok, YouTube e Website em um só lugar.',
  keywords: [
    'ERP Presença Digital',
    'Agentes IA',
    'Marketing Digital',
    'Social Media',
    'Gestão de Redes Sociais',
    'Automação Marketing',
  ],
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: baseUrl,
    title: 'Caminho Digital - Turbine Suas Redes',
    description:
      'ERP de Presença Digital com Agentes IA. Monitore e otimize suas redes sociais.',
    siteName: 'Caminho Digital',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Caminho Digital',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caminho Digital - Turbine Suas Redes',
    description:
      'ERP de Presença Digital com Agentes IA. Monitore e otimize suas redes sociais.',
    images: [`${baseUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head />
      <body className="bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
