'use client'

import { useDiagnostic } from '@/hooks/useDiagnostic'
import { DiagnosticForm } from './DiagnosticForm'
import { DiagnosticScore } from './DiagnosticScore'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export function DiagnosticPageClient() {
  const { result, reset, loading, error, analyze } = useDiagnostic()

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        {/* Result Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-4">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Diagnóstico Completo</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            Sua presença digital
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">foi analisada</span>
          </h1>
        </div>

        <DiagnosticScore result={result} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={reset}
            className="px-8 py-4 rounded-xl border border-blue-500/50 text-white font-bold hover:bg-blue-500/10 hover:border-blue-400 transition duration-300 backdrop-blur-sm"
          >
            ← Fazer Novo Diagnóstico
          </button>

          <a
            href="/planos"
            className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition duration-300 flex items-center justify-center gap-2 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Ver Planos Premium
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </span>
          </a>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="relative group mt-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition duration-300"></div>
          <div className="relative bg-blue-500/5 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm group-hover:border-blue-500/50 transition duration-300">
            <div className="flex gap-4">
              <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-blue-300 font-semibold mb-2">
                  Próximo Passo: Vire Membro Premium
                </p>
                <p className="text-gray-300">
                  Acesse seu painel completo com análises detalhadas em tempo real, acompanhe a evolução de suas redes e receba recomendações personalizadas dos nossos 10 agentes de IA especializados.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-black mb-4">
          Diagnóstico Gratuito
        </h1>
        <p className="text-xl text-gray-400">
          Analise sua presença digital em tempo real. Sem compromisso, sem cartão de crédito.
        </p>
      </div>
      <DiagnosticForm loading={loading} error={error} onAnalyze={analyze} />
    </motion.div>
  )
}
