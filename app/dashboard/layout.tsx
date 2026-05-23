import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Caminho Digital',
  robots: {
    index: false,
    follow: false
  }
}

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  // TODO: Implementar autenticação real com NextAuth
  // Por enquanto, permitir acesso irrestrito para teste
  // Em produção: verificar sessão NextAuth e redirecionar se não autenticado

  return (
    <>
      {children}
    </>
  )
}
