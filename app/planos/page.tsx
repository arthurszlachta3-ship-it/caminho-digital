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
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PricingPlans />
      </div>
    </div>
  )
}
