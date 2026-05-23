'use client'

import { useDiagnostic } from '@/hooks/useDiagnostic'
import { DiagnosticForm } from './DiagnosticForm'
import { DiagnosticScore } from './DiagnosticScore'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function DiagnosticPageClient() {
  const { result, reset } = useDiagnostic()

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <DiagnosticScore result={result} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={reset}
            variant="outline"
            className="px-8 py-4 border-[#333] text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition"
          >
            ← Fazer Novo Diagnóstico
          </Button>

          <a
            href="/planos"
            className="px-8 py-4 bg-[#10b981] text-white font-semibold rounded-lg hover:bg-[#10b981]/90 transition shadow-lg text-center"
          >
            Ver Planos Premium →
          </a>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6"
        >
          <p className="text-blue-300 text-sm">
            <span className="font-semibold">Próximo Passo:</span> Acesse o painel para ver análises detalhadas, acompanhar evolução e receber recomendações dos nossos agentes de IA.
          </p>
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
      <DiagnosticForm />
    </motion.div>
  )
}
