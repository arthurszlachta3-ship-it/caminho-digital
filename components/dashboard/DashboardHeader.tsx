'use client'

import { RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

interface DashboardHeaderProps {
  onRefresh: () => void
  loading: boolean
  lastUpdated: Date
}

export function DashboardHeader({ onRefresh, loading, lastUpdated }: DashboardHeaderProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] border-b border-[#222] sticky top-0 z-40 backdrop-blur-sm"
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard ERP</h1>
            <p className="text-sm text-gray-400 mt-1">
              Última atualização: {formatTime(lastUpdated)}
            </p>
          </div>

          <motion.button
            onClick={onRefresh}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#10b981]/20 hover:bg-[#10b981]/30 text-[#10b981] rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed border border-[#10b981]/50"
          >
            <motion.div
              animate={{ rotate: loading ? 360 : 0 }}
              transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
            >
              <RefreshCw className="w-4 h-4" />
            </motion.div>
            {loading ? 'Atualizando...' : 'Atualizar'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
