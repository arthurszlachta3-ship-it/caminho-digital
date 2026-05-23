import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] p-4">
      <div className="max-w-3xl w-full space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-[#10b981] rounded-lg" />
        </div>

        {/* Hero */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Caminho Digital
          </h1>
          <p className="text-xl text-gray-400">
            A gente cuida da sua internet pra você aparecer mais e conseguir mais clientes.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/diagnostico"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#10b981] text-white font-medium hover:bg-[#10b981]/90 transition gap-2"
          >
            Fazer Diagnóstico Gratuito
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/app/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#222] text-gray-300 font-medium hover:bg-[#111] transition"
          >
            Acessar Dashboard
          </Link>
        </div>

        {/* Status */}
        <div className="pt-8 border-t border-[#222]">
          <p className="text-sm text-gray-500">
            ✓ Sistema pronto para produção
          </p>
        </div>
      </div>
    </main>
  )
}
