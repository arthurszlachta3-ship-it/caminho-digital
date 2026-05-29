'use client'

// Force Vercel rebuild - v2
import { DiagnosticResult } from '@/lib/diagnostic-engine'
import { generateDiagnosticPDF } from '@/lib/generateDiagnosticPDF'
import { motion } from 'framer-motion'
import { TrendingUp, Zap, Target, ArrowRight, Download } from 'lucide-react'

interface DiagnosticScoreProps {
  result: DiagnosticResult
}

export function DiagnosticScore({ result }: DiagnosticScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-teal-600'
    if (score >= 60) return 'from-blue-500 to-cyan-600'
    if (score >= 40) return 'from-yellow-500 to-orange-600'
    return 'from-red-500 to-pink-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500/20 to-teal-500/10'
    if (score >= 60) return 'from-blue-500/20 to-cyan-500/10'
    if (score >= 40) return 'from-yellow-500/20 to-orange-500/10'
    return 'from-red-500/20 to-pink-500/10'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Presença Forte'
    if (score >= 60) return 'Presença Sólida'
    if (score >= 40) return 'Presença em Desenvolvimento'
    return 'Presença com Oportunidades'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-300">Análise Completa de IA</span>
        </div>
        <h2 className="text-5xl font-black text-white mb-2">
          Diagnóstico da Presença Digital
        </h2>
        <p className="text-gray-400 text-lg">
          {result.businessName} • {new Date(result.timestamp).toLocaleDateString('pt-BR')}
        </p>
      </motion.div>

      {/* Main Score Circle - Premium Version */}
      <div className="flex justify-center mb-20">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 80, damping: 15 }}
          className="relative"
        >
          {/* Glow Background */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className={`absolute inset-0 rounded-full blur-3xl opacity-50 bg-gradient-to-r ${getScoreColor(result.overallScore)}`}
            style={{ width: 'calc(100% + 40px)', height: 'calc(100% + 40px)', left: '-20px', top: '-20px' }}
          />

          {/* Outer Ring with Gradient */}
          <div className={`relative w-64 h-64 rounded-full bg-gradient-to-br ${getScoreColor(result.overallScore)} p-2 flex items-center justify-center shadow-2xl`}>
            {/* Inner Circle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`w-full h-full rounded-full bg-gradient-to-br ${getScoreBgColor(result.overallScore)} flex flex-col items-center justify-center border border-white/10`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
                className="text-center"
              >
                <div className="text-7xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {result.overallScore}
                </div>
                <div className="text-sm text-gray-400 mt-2">de 100</div>
              </motion.div>
            </motion.div>
          </div>

          {/* Label Below Score */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8"
          >
            <p className={`text-2xl font-bold bg-gradient-to-r ${getScoreColor(result.overallScore)} bg-clip-text text-transparent`}>
              {getScoreLabel(result.overallScore)}
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Channels Grid - Premium */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mb-16"
      >
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          Análise por Canal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(result.channels).map(([key, channel]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + Object.keys(result.channels).indexOf(key) * 0.12 }}
              whileHover={{ translateY: -4, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)' }}
              className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all overflow-hidden"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-blue-500/10 group-hover:to-blue-500/5 transition-all" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Canal</p>
                    <h3 className="text-2xl font-bold text-white capitalize">
                      {channel.channel === 'tiktok' ? 'TikTok' :
                       channel.channel === 'youtube' ? 'YouTube' :
                       channel.channel === 'website' ? 'Website' : 'Instagram'}
                    </h3>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.3 + Object.keys(result.channels).indexOf(key) * 0.12 }}
                    className={`text-4xl font-black rounded-xl px-4 py-2 ${
                      channel.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400' :
                      channel.grade === 'B' ? 'bg-blue-500/20 text-blue-400' :
                      channel.grade === 'C' ? 'bg-yellow-500/20 text-yellow-400' :
                      channel.grade === 'D' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                    {channel.grade}
                  </motion.div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400 text-sm">Score</span>
                    <span className="text-3xl font-black text-white">{channel.score}</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${channel.score}%` }}
                      transition={{ delay: 1.4 + Object.keys(result.channels).indexOf(key) * 0.12, duration: 1.2, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r ${getScoreColor(channel.score)} rounded-full`}
                    />
                  </div>
                </div>

                {/* Problems & Quick Win */}
                <div className="space-y-3">
                  {/* Quick Win */}
                  <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
                    <p className="flex items-center gap-2 text-xs text-blue-300 mb-2 font-semibold">
                      <Zap className="w-3 h-3" />
                      Quick Win
                    </p>
                    <p className="text-sm text-gray-300">{channel.quickWin}</p>
                  </div>

                  {/* All Problems */}
                  {channel.problems.length > 0 && (
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/50">
                      <p className="text-xs text-gray-400 mb-3 font-semibold">Problemas Identificados:</p>
                      <div className="space-y-2">
                        {channel.problems.map((problem, pIdx) => {
                          const impactIcon = problem.impact === 'high' ? '🔴' : problem.impact === 'medium' ? '🟡' : '🟢'
                          return (
                            <div key={pIdx} className="text-sm">
                              <div className="flex items-start gap-2 mb-1">
                                <span>{impactIcon}</span>
                                <span className="font-semibold text-gray-200">{problem.title}</span>
                              </div>
                              <p className="text-gray-400 ml-6 text-xs mb-1">{problem.description}</p>
                              <p className="text-blue-300 ml-6 text-xs italic">↪ {problem.solution}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Top Priorities - COMPLETE PLAN */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700/50 mb-8"
      >
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <Target className="w-6 h-6 text-orange-400" />
          Plano de Ação ({result.topPriorities.length} ações)
        </h3>
        <ul className="space-y-4">
          {result.topPriorities.map((priority, idx) => {
            const difficultyIcon = priority.difficulty === 'easy' ? '🟢' : priority.difficulty === 'medium' ? '🟡' : '🔴'
            return (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.7 + idx * 0.08 }}
                className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold flex items-center justify-center text-sm">
                  {idx + 1}
                </span>
                <div className="flex-grow">
                  <p className="text-gray-100 font-semibold mb-2">{priority.action}</p>
                  <div className="flex flex-wrap gap-3 items-center text-sm">
                    <span className="text-gray-400">
                      {difficultyIcon} {priority.difficulty.charAt(0).toUpperCase() + priority.difficulty.slice(1)}
                    </span>
                    <span className="text-gray-400 flex items-center gap-1">
                      ⏱️ {priority.timeToImplement}
                    </span>
                    <span className="text-green-400 font-semibold">
                      {priority.potentialROI}
                    </span>
                    {priority.channel && (
                      <span className="text-blue-300 text-xs bg-blue-500/20 px-2 py-1 rounded">
                        {priority.channel}
                      </span>
                    )}
                  </div>
                </div>
              </motion.li>
            )
          })}
        </ul>
      </motion.div>

      {/* Recommendation - Premium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-emerald-500/20 rounded-2xl p-8 border border-cyan-500/30 mb-12 text-center"
      >
        <p className="text-lg text-gray-200 italic leading-relaxed">
          &quot;{result.recommendation}&quot;
        </p>
      </motion.div>

      {/* Download Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1 }}
        className="flex justify-center mb-12"
      >
        <motion.button
          onClick={async () => {
            try {
              await generateDiagnosticPDF(result)
            } catch (error) {
              console.error('Download error:', error)
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-blue-500/50 text-blue-300 font-semibold rounded-xl hover:bg-blue-500/10 transition-all"
        >
          <Download className="w-5 h-5" />
          Baixar Diagnóstico em PDF
        </motion.button>
      </motion.div>

      {/* CTA Section - Plan Upgrade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        className="mt-12 text-center"
      >
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/50 rounded-2xl p-8 mb-8">
          <h3 className="text-3xl font-bold text-white mb-4">
            Veja o Plano Completo
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Este é apenas um <span className="font-semibold text-blue-300">pré-visualização gratuita</span> do seu diagnóstico.
            Para ver a análise completa com <span className="font-semibold text-blue-300">plano de ação detalhado</span>,
            <span className="font-semibold text-blue-300"> 10 agentes de IA</span> e <span className="font-semibold text-blue-300">acompanhamento em tempo real</span>,
            escolha seu plano:
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <motion.a
              href="/planos"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all shadow-lg"
            >
              Ver Planos Premium
              <ArrowRight className="w-5 h-5" />
            </motion.a>

            <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-blue-500/50 text-blue-300 font-bold rounded-xl hover:bg-blue-500/10 transition-all"
            >
              Já tenho conta
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
