'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, BarChart3, Zap, AlertCircle, Clock } from 'lucide-react'

interface MetricsGridProps {
  metrics: {
    mrr: number
    arr: number
    activeUsers: number
    diagnosticsPerformed: number
    conversionRate: number
    aiUsagePercent: number
    aiCostsMonth: number
    onlineUsers: number
    avgResponseTime: number
  }
}

interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  icon: React.ReactNode
  color: string
  trend?: number
  delay: number
}

function MetricCard({ label, value, unit, icon, color, trend, delay }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl p-6 border border-[#222] hover:border-[#333] transition"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold text-white">{value}</p>
            {unit && <p className="text-gray-500 text-sm">{unit}</p>}
          </div>
          {trend !== undefined && (
            <p className={`text-xs mt-2 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs mês anterior
            </p>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* MRR */}
      <MetricCard
        label="Receita Mensal (MRR)"
        value={formatCurrency(metrics.mrr)}
        icon={<TrendingUp className="w-6 h-6 text-green-400" />}
        color="bg-green-500/10"
        trend={12.5}
        delay={0}
      />

      {/* ARR */}
      <MetricCard
        label="Receita Anual (ARR)"
        value={formatCurrency(metrics.arr)}
        icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
        color="bg-blue-500/10"
        trend={15.2}
        delay={0.1}
      />

      {/* Active Users */}
      <MetricCard
        label="Usuários Ativos"
        value={metrics.activeUsers}
        icon={<Users className="w-6 h-6 text-purple-400" />}
        color="bg-purple-500/10"
        trend={8.3}
        delay={0.2}
      />

      {/* Diagnostics */}
      <MetricCard
        label="Diagnósticos Realizados"
        value={metrics.diagnosticsPerformed}
        icon={<BarChart3 className="w-6 h-6 text-cyan-400" />}
        color="bg-cyan-500/10"
        trend={22.1}
        delay={0.3}
      />

      {/* Conversion Rate */}
      <MetricCard
        label="Taxa de Conversão"
        value={metrics.conversionRate}
        unit="%"
        icon={<TrendingUp className="w-6 h-6 text-orange-400" />}
        color="bg-orange-500/10"
        trend={3.7}
        delay={0.4}
      />

      {/* Online Users */}
      <MetricCard
        label="Usuários Online Agora"
        value={metrics.onlineUsers}
        icon={<Zap className="w-6 h-6 text-yellow-400" />}
        color="bg-yellow-500/10"
        trend={undefined}
        delay={0.5}
      />

      {/* AI Usage */}
      <MetricCard
        label="Uso de IA"
        value={metrics.aiUsagePercent}
        unit="%"
        icon={<Zap className="w-6 h-6 text-pink-400" />}
        color="bg-pink-500/10"
        trend={5.2}
        delay={0.6}
      />

      {/* AI Costs */}
      <MetricCard
        label="Custo IA (este mês)"
        value={formatCurrency(metrics.aiCostsMonth)}
        icon={<AlertCircle className="w-6 h-6 text-red-400" />}
        color="bg-red-500/10"
        trend={-2.1}
        delay={0.7}
      />

      {/* Response Time */}
      <MetricCard
        label="Tempo Médio de Resposta"
        value={metrics.avgResponseTime}
        unit="ms"
        icon={<Clock className="w-6 h-6 text-indigo-400" />}
        color="bg-indigo-500/10"
        trend={-1.5}
        delay={0.8}
      />
    </div>
  )
}
