'use client'

import { DiagnosticResult } from '@/lib/diagnostic-engine'
import { motion } from 'framer-motion'

interface DiagnosticScoreProps {
  result: DiagnosticResult
}

export function DiagnosticScore({ result }: DiagnosticScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600'
    if (score >= 60) return 'from-yellow-500 to-orange-600'
    if (score >= 40) return 'from-orange-500 to-red-600'
    return 'from-red-500 to-red-700'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente'
    if (score >= 60) return 'Bom'
    if (score >= 40) return 'Regular'
    return 'Precisa Melhorar'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-white mb-2">
          Seu Diagnóstico
        </h2>
        <p className="text-gray-400 text-lg">
          {result.businessName} • Analisado em{' '}
          {new Date(result.timestamp).toLocaleDateString('pt-BR')}
        </p>
      </div>

      {/* Main Score Circle */}
      <div className="flex justify-center mb-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="relative"
        >
          {/* Outer Ring */}
          <div className={`w-48 h-48 rounded-full bg-gradient-to-br ${getScoreColor(result.overallScore)} p-1 flex items-center justify-center shadow-2xl`}>
            {/* Inner Circle */}
            <div className="w-full h-full rounded-full bg-[#0a0a0a] flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <div className="text-6xl font-bold text-white mb-2">
                  {result.overallScore}
                </div>
                <div className="text-sm text-gray-400">de 100</div>
              </motion.div>
            </div>
          </div>

          {/* Label Below Score */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6"
          >
            <p className="text-2xl font-semibold text-white">
              {getScoreLabel(result.overallScore)}
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {Object.entries(result.channels).map(([key, channel]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + Object.keys(result.channels).indexOf(key) * 0.1 }}
            className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl p-6 border border-[#222]"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white capitalize">
                  {channel.channel === 'tiktok' ? 'TikTok' :
                   channel.channel === 'youtube' ? 'YouTube' :
                   channel.channel === 'website' ? 'Website' : 'Instagram'}
                </h3>
                <p className="text-3xl font-bold text-white mt-2">
                  {channel.score}
                </p>
              </div>
              <div className={`text-3xl font-bold rounded-full w-12 h-12 flex items-center justify-center ${
                channel.grade === 'A' ? 'bg-green-500/20 text-green-400' :
                channel.grade === 'B' ? 'bg-blue-500/20 text-blue-400' :
                channel.grade === 'C' ? 'bg-yellow-500/20 text-yellow-400' :
                channel.grade === 'D' ? 'bg-orange-500/20 text-orange-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {channel.grade}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#222] rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${channel.score}%` }}
                transition={{ delay: 0.5 + Object.keys(result.channels).indexOf(key) * 0.1, duration: 1 }}
                className={`h-full bg-gradient-to-r ${getScoreColor(channel.score)}`}
              />
            </div>

            {/* Quick Win */}
            <div className="bg-[#0a0a0a]/50 rounded-lg p-3 border border-[#10b981]/30">
              <p className="text-xs text-gray-400 mb-1">💡 Dica Rápida:</p>
              <p className="text-sm text-gray-300">{channel.quickWin}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Priorities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl p-8 border border-[#222] mb-8"
      >
        <h3 className="text-xl font-semibold text-white mb-6">
          🎯 Principais Prioridades
        </h3>
        <ul className="space-y-3">
          {result.topPriorities.map((priority, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + idx * 0.1 }}
              className="flex items-start gap-3 text-gray-300"
            >
              <span className="text-[#10b981] font-bold mt-1">{idx + 1}.</span>
              <span>{priority}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r from-[#10b981]/20 to-emerald-500/20 rounded-xl p-6 border border-[#10b981]/50 text-center"
      >
        <p className="text-gray-300 italic text-lg">
          &quot;{result.recommendation}&quot;
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-400 mb-6">
          Quer um plano personalizado para alcançar seus objetivos?
        </p>
        <button className="px-8 py-4 bg-[#10b981] text-white font-semibold rounded-lg hover:bg-[#10b981]/90 transition shadow-lg hover:shadow-xl">
          Acessar Dashboard Premium
        </button>
      </motion.div>
    </motion.div>
  )
}
