'use client'

import { useState, useEffect } from 'react'
import { DashboardHeader } from './DashboardHeader'
import { MetricsGrid } from './MetricsGrid'
import { RevenueChart } from './RevenueChart'
import { ConversionFunnel } from './ConversionFunnel'
import { AlertsPanel } from './AlertsPanel'
import { motion } from 'framer-motion'

interface DashboardMetrics {
  mrr: number
  arr: number
  activeUsers: number
  diagnosticsPerformed: number
  conversionRate: number
  churnRate: number
  aiUsagePercent: number
  aiCostsMonth: number
  onlineUsers: number
  avgResponseTime: number
}

export function DashboardClient() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    mrr: 12450.00,
    arr: 149400.00,
    activeUsers: 248,
    diagnosticsPerformed: 1052,
    conversionRate: 18.5,
    churnRate: 2.1,
    aiUsagePercent: 78,
    aiCostsMonth: 2340.50,
    onlineUsers: 34,
    avgResponseTime: 1240
  })

  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Simular atualização de dados em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        onlineUsers: Math.max(5, Math.floor(Math.random() * 80)),
        mrr: prev.mrr + (Math.random() - 0.5) * 500,
        activeUsers: Math.max(200, prev.activeUsers + Math.floor((Math.random() - 0.5) * 10)),
        diagnosticsPerformed: prev.diagnosticsPerformed + Math.floor(Math.random() * 3)
      }))
      setLastUpdated(new Date())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setMetrics(prev => ({
      ...prev,
      mrr: prev.mrr + (Math.random() - 0.5) * 1000,
      activeUsers: Math.max(200, prev.activeUsers + Math.floor((Math.random() - 0.5) * 15))
    }))
    setLastUpdated(new Date())
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Header */}
      <DashboardHeader onRefresh={handleRefresh} loading={loading} lastUpdated={lastUpdated} />

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Grid */}
        <MetricsGrid metrics={metrics} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <RevenueChart mrr={metrics.mrr} arr={metrics.arr} />
          </div>
          <ConversionFunnel conversionRate={metrics.conversionRate} />
        </div>

        {/* Alerts and Additional Info */}
        <div className="mt-8">
          <AlertsPanel metrics={metrics} />
        </div>
      </div>
    </motion.div>
  )
}
