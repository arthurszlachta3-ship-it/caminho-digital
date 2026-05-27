import { Metadata } from 'next'
import { PricingPlans } from '@/components/pricing/PricingPlans'

export const metadata: Metadata = {
  title: 'Planos e Preços | Caminho Digital',
  description: 'Escolha o plano perfeito para sua empresa. Diagnóstico grátis, Estratégia e Premium com IA.',
  openGraph: {
    title: 'Planos e Preços | Caminho Digital',
    description: 'Escolha o plano perfeito para sua empresa',
    url: 'https://turbinesuasredes.com.br/planos',
    type: 'website'
  }
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <PricingPlans />
      </div>
    </div>
  )
}
