'use client'

import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface RevenueChartProps {
  mrr: number
  arr: number
}

export function RevenueChart({ mrr }: RevenueChartProps) {
  const data = [
    { month: 'Jan', revenue: 8200 },
    { month: 'Fev', revenue: 9100 },
    { month: 'Mar', revenue: 9850 },
    { month: 'Abr', revenue: 10500 },
    { month: 'Mai', revenue: 11200 },
    { month: 'Jun', revenue: 12100 },
    { month: 'Jul', revenue: Math.round(mrr) },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl p-6 border border-[#222]"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white">Receita (Últimos 7 Meses)</h3>
        <p className="text-sm text-gray-400 mt-1">Evolução mensal de MRR</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          <XAxis dataKey="month" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a0a0a',
              border: '1px solid #222',
              borderRadius: '8px'
            }}
            formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
