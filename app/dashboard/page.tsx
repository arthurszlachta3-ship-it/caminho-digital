import { Metadata } from 'next'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export const metadata: Metadata = {
  title: 'Dashboard ERP | Caminho Digital',
  description: 'Painel de controle com métricas de receita, usuários e desempenho',
  robots: {
    index: false,
    follow: false
  }
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <DashboardClient />
    </div>
  )
}
