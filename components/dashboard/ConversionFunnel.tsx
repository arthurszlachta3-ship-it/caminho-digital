'use client'

import { motion } from 'framer-motion'

interface ConversionFunnelProps {
  conversionRate: number
}

export function ConversionFunnel({ conversionRate }: ConversionFunnelProps) {
  const funnelStages = [
    { label: 'Visitantes', value: 15420, color: 'from-blue-500 to-blue-600' },
    { label: 'Diagnósticos', value: 3200, color: 'from-purple-500 to-purple-600' },
    { label: 'Sign-ups', value: 840, color: 'from-pink-500 to-pink-600' },
    { label: 'Assinantes', value: 155, color: 'from-green-500 to-green-600' },
  ]

  const maxValue = funnelStages[0].value
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.6
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl p-6 border border-[#222]"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white">Funil de Conversão</h3>
        <p className="text-sm text-gray-400 mt-1">Jornada do cliente</p>
      </div>

      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {funnelStages.map((stage, index) => {
          const width = (stage.value / maxValue) * 100
          const dropoff = index > 0 ? ((1 - stage.value / funnelStages[index - 1].value) * 100).toFixed(1) : null

          return (
            <motion.div key={stage.label} variants={itemVariants}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-300">{stage.label}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{stage.value.toLocaleString('pt-BR')}</p>
                    {dropoff && (
                      <p className="text-xs text-red-400">
                        ↓ {dropoff}%
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-full bg-[#0a0a0a] rounded-full h-10 overflow-hidden border border-[#222]">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${stage.color} rounded-full flex items-center justify-end pr-3`}
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                  >
                    <p className="text-xs font-semibold text-white">{width.toFixed(0)}%</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-6 pt-6 border-t border-[#222]"
      >
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-green-400">{conversionRate}%</span> de taxa de conversão geral
          </p>
          <p className="text-xs text-gray-400 mt-1">
            155 de 15.420 visitantes se tornaram assinantes pagos
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
