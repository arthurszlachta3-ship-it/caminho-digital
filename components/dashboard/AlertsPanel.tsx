'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, TrendingDown, Zap, CheckCircle } from 'lucide-react'

interface AlertsPanelProps {
  metrics: {
    churnRate: number
    aiUsagePercent: number
    aiCostsMonth: number
    avgResponseTime: number
  }
}

type AlertLevel = 'critical' | 'warning' | 'info' | 'success'

interface Alert {
  id: string
  level: AlertLevel
  title: string
  description: string
  action?: string
  icon: React.ReactNode
}

export function AlertsPanel({ metrics }: AlertsPanelProps) {
  const alerts: Alert[] = [
    {
      id: 'churn',
      level: 'warning',
      title: 'Taxa de Churn Elevada',
      description: `Churn mensal em ${metrics.churnRate}%. Recomendamos revisar estratégia de retenção.`,
      action: 'Analisar',
      icon: <TrendingDown className="w-5 h-5" />
    },
    {
      id: 'ai-usage',
      level: metrics.aiUsagePercent > 80 ? 'warning' : 'info',
      title: 'Uso de IA Alto',
      description: `${metrics.aiUsagePercent}% de capacidade utilizada. Considere otimizar prompts.`,
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 'response-time',
      level: metrics.avgResponseTime > 1500 ? 'critical' : 'success',
      title: metrics.avgResponseTime > 1500 ? 'Performance Degradada' : 'Sistema Estável',
      description: metrics.avgResponseTime > 1500
        ? `Tempo de resposta em ${metrics.avgResponseTime}ms. Escalabilidade pode estar comprometida.`
        : `Tempo de resposta de ${metrics.avgResponseTime}ms. Sistema operando normalmente.`,
      icon: metrics.avgResponseTime > 1500 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />
    },
    {
      id: 'ai-costs',
      level: 'info',
      title: 'Custo de IA Este Mês',
      description: `Gasto com API Claude: R$ ${metrics.aiCostsMonth.toFixed(2)}. Monitore para otimizar custos.`,
      icon: <Zap className="w-5 h-5" />
    }
  ]

  const getAlertColor = (level: AlertLevel) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/30 text-red-400'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
      case 'info':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
      case 'success':
        return 'bg-green-500/10 border-green-500/30 text-green-400'
    }
  }

  const getIconColor = (level: AlertLevel) => {
    switch (level) {
      case 'critical':
        return 'text-red-400'
      case 'warning':
        return 'text-yellow-400'
      case 'info':
        return 'text-blue-400'
      case 'success':
        return 'text-green-400'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.7
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold text-white mb-4">Alertas e Status</h3>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {alerts.map(alert => (
          <motion.div
            key={alert.id}
            variants={itemVariants}
            className={`rounded-lg p-4 border ${getAlertColor(alert.level)}`}
          >
            <div className="flex items-start gap-4">
              <div className={`${getIconColor(alert.level)} mt-1`}>
                {alert.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">{alert.title}</h4>
                <p className="text-sm text-gray-300 mb-3">{alert.description}</p>
                {alert.action && (
                  <button className="text-xs font-medium px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition">
                    {alert.action}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="mt-6 bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] rounded-lg p-4 border border-green-500/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <div>
              <p className="font-semibold text-green-400">Sistema Operacional</p>
              <p className="text-xs text-gray-400">Todos os serviços rodando normalmente</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Uptime: 99.98%</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
