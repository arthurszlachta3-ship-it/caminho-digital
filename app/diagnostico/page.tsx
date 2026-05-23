import { Metadata } from 'next'
import { DiagnosticPageClient } from '@/components/diagnostic/DiagnosticPageClient'

export const metadata: Metadata = {
  title: 'Diagnóstico de Presença Digital | Caminho Digital',
  description: 'Análise gratuita da sua presença digital em todas as redes sociais',
  openGraph: {
    title: 'Diagnóstico de Presença Digital',
    description: 'Análise gratuita da sua presença digital em todas as redes sociais',
    url: 'https://turbinesuasredes.com.br/diagnostico',
    type: 'website'
  }
}

export default function DiagnosticPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <DiagnosticPageClient />
      </div>
    </div>
  )
}
