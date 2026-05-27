'use client'

import { motion } from 'framer-motion'
import { Check, ArrowRight, Sparkles } from 'lucide-react'

interface PlanFeature {
  feature: string
  included: boolean
}

interface Plan {
  name: string
  price: string
  period: string
  description: string
  cta: string
  ctaVariant: 'primary' | 'secondary'
  features: PlanFeature[]
  highlight?: boolean
}

const plans: Plan[] = [
  {
    name: 'Diagnóstico',
    price: 'Grátis',
    period: 'sempre',
    description: 'Comece analisando sua presença digital',
    cta: 'Fazer Diagnóstico',
    ctaVariant: 'secondary',
    features: [
      { feature: 'Análise de 4 canais (Instagram, TikTok, YouTube, Website)', included: true },
      { feature: 'Score 0-100 com detalhamento por canal', included: true },
      { feature: 'Problemas identificados', included: true },
      { feature: 'Uma dica rápida de melhoria', included: true },
      { feature: 'Acesso ao dashboard', included: false },
      { feature: 'Plano estratégico completo', included: false },
      { feature: 'Agentes de IA personalizados', included: false },
      { feature: 'Suporte prioritário', included: false }
    ]
  },
  {
    name: 'Estratégia',
    price: 'R$ 497',
    period: '/mês',
    description: 'Acesso completo ao ERP e agentes especializados',
    cta: 'Começar Teste',
    ctaVariant: 'primary',
    highlight: true,
    features: [
      { feature: 'Tudo do plano Diagnóstico', included: true },
      { feature: 'Acesso ao dashboard completo', included: true },
      { feature: 'Histórico de diagnósticos', included: true },
      { feature: 'Plano estratégico personalizado', included: true },
      { feature: 'Agentes especializados por canal', included: true },
      { feature: 'Recomendações diárias de conteúdo', included: true },
      { feature: 'Análise de concorrentes', included: false },
      { feature: 'Execução automática de estratégia', included: false }
    ]
  },
  {
    name: 'Premium',
    price: 'R$ 1.197',
    period: '/mês',
    description: 'IA Master orquestra tudo automaticamente',
    cta: 'Acessar Premium',
    ctaVariant: 'secondary',
    features: [
      { feature: 'Tudo do plano Estratégia', included: true },
      { feature: 'IA Master orquestrador', included: true },
      { feature: 'Execução automática de estratégia', included: true },
      { feature: 'Análise de concorrentes em tempo real', included: true },
      { feature: 'Geração automática de conteúdo', included: true },
      { feature: 'Agendamento inteligente de posts', included: true },
      { feature: 'Otimização contínua', included: true },
      { feature: 'Suporte prioritário 24/7', included: true }
    ]
  }
]

function PlanCard({ plan, delay }: { plan: Plan; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`relative rounded-2xl overflow-hidden transition-all group ${
        plan.highlight
          ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-600/10 to-transparent'
          : 'bg-gradient-to-br from-blue-500/5 to-transparent hover:from-blue-500/10'
      } border ${plan.highlight ? 'border-blue-500/50' : 'border-blue-500/20 group-hover:border-blue-500/40'}`}
    >
      {plan.highlight && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold px-4 py-2 rounded-bl-lg shadow-lg shadow-blue-500/50">
          ⭐ MAIS POPULAR
        </div>
      )}

      {plan.highlight && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition duration-300"></div>
      )}

      <div className="relative p-8">
        {/* Header */}
        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
        <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

        {/* Price */}
        <div className="mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">{plan.price}</span>
            {plan.price !== 'Grátis' && <span className="text-gray-400">{plan.period}</span>}
          </div>
        </div>

        {/* CTA Button */}
        <button
          className={`w-full py-3 rounded-xl font-bold transition mb-8 overflow-hidden relative group/btn ${
            plan.ctaVariant === 'primary'
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/50'
              : 'bg-blue-500/10 border border-blue-500/50 text-white hover:bg-blue-500/20 hover:border-blue-500/80'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            {plan.cta}
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition" />
          </span>
        </button>

        {/* Features */}
        <div className="space-y-3 border-t border-blue-500/20 pt-8">
          {plan.features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + idx * 0.05, duration: 0.3 }}
              className="flex items-start gap-3"
            >
              {feature.included ? (
                <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              ) : (
                <div className="w-5 h-5 border border-blue-500/20 rounded flex-shrink-0 mt-0.5" />
              )}
              <span className={feature.included ? 'text-gray-300 text-sm' : 'text-gray-500 line-through text-sm'}>
                {feature.feature}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function PricingPlans() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-300">Planos Transparentes</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-black text-white mb-6">
          Escolha seu caminho
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Comece grátis com diagnóstico, evolua com estratégia inteligente e automatize tudo com IA Master. Sem surpresas, sem contratos.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <PlanCard key={plan.name} plan={plan} delay={idx * 0.2} />
        ))}
      </div>

      {/* FAQ-style Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="relative group mt-16"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition duration-300"></div>
        <div className="relative bg-blue-500/5 rounded-2xl p-8 border border-blue-500/30 group-hover:border-blue-500/50 transition duration-300 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-white mb-8">Perguntas Frequentes</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="font-semibold text-blue-300 mb-3">💳 Posso cancelar a qualquer momento?</p>
              <p className="text-gray-400">Sim, sem penalidades ou multas. O cancelamento é imediato.</p>
            </div>
            <div>
              <p className="font-semibold text-blue-300 mb-3">🎯 Existe período de teste?</p>
              <p className="text-gray-400">Sim, 7 dias grátis nos planos Estratégia e Premium. Sem cartão necessário.</p>
            </div>
            <div>
              <p className="font-semibold text-blue-300 mb-3">📱 Quais canais são analisados?</p>
              <p className="text-gray-400">Instagram, TikTok, YouTube, Website e mais. Atualizamos conforme demanda.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="text-center py-12"
      >
        <h2 className="text-3xl font-bold text-white mb-4">Dúvidas sobre os planos?</h2>
        <p className="text-gray-400 mb-8">Converse com nosso time para entender qual plano se encaixa melhor no seu negócio.</p>
        <a
          href="https://wa.me/554195976278"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition duration-300"
        >
          💬 Conversar no WhatsApp
          <ArrowRight className="w-5 h-5" />
        </a>
      </motion.div>
    </div>
  )
}
