'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

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
      className={`relative rounded-2xl overflow-hidden transition-all ${
        plan.highlight
          ? 'ring-2 ring-[#10b981] bg-gradient-to-br from-[#10b981]/10 to-transparent'
          : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
      } border ${plan.highlight ? 'border-[#10b981]/50' : 'border-[#222]'}`}
    >
      {plan.highlight && (
        <div className="absolute top-0 right-0 bg-[#10b981] text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
          MAIS POPULAR
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
        <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{plan.price}</span>
            {plan.price !== 'Grátis' && <span className="text-gray-400">{plan.period}</span>}
          </div>
        </div>

        {/* CTA Button */}
        <button
          className={`w-full py-3 rounded-lg font-semibold transition mb-8 ${
            plan.ctaVariant === 'primary'
              ? 'bg-[#10b981] text-white hover:bg-[#10b981]/90'
              : 'bg-[#1a1a1a] border border-[#333] text-gray-300 hover:bg-[#252525]'
          }`}
        >
          {plan.cta}
        </button>

        {/* Features */}
        <div className="space-y-4 border-t border-[#222] pt-8">
          {plan.features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + idx * 0.05, duration: 0.3 }}
              className="flex items-start gap-3"
            >
              {feature.included ? (
                <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
              ) : (
                <div className="w-5 h-5 border border-[#333] rounded flex-shrink-0 mt-0.5" />
              )}
              <span className={feature.included ? 'text-gray-300' : 'text-gray-500 line-through'}>
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
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Planos Transparentes para Seu Negócio
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Comece grátis com diagnóstico, evolua com estratégia e automatize com IA Master
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
        className="bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] rounded-xl p-8 border border-[#222] mt-12"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Perguntas Frequentes</h3>
        <div className="space-y-4">
          <div>
            <p className="font-medium text-gray-300 mb-2">Posso cancelar a qualquer momento?</p>
            <p className="text-gray-400 text-sm">Sim, sem penalidades. Cancelamento ocorre no fim do ciclo de cobrança.</p>
          </div>
          <div>
            <p className="font-medium text-gray-300 mb-2">Existe período de teste?</p>
            <p className="text-gray-400 text-sm">Sim, 7 dias grátis nos planos Estratégia e Premium. Sem necessidade de cartão.</p>
          </div>
          <div>
            <p className="font-medium text-gray-300 mb-2">Quais canais são analisados?</p>
            <p className="text-gray-400 text-sm">Instagram, TikTok, YouTube e Website. Atualizamos para novos canais conforme demanda.</p>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="text-center pt-8"
      >
        <p className="text-gray-400 mb-4">Dúvidas? Fale com nosso time:</p>
        <a
          href="https://wa.me/554195976278"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
        >
          💬 Conversar no WhatsApp
        </a>
      </motion.div>
    </div>
  )
}
