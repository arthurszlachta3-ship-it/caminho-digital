'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

interface DiagnosticFormData {
  businessName: string
  businessType: string
  instagramHandle?: string
  tiktokHandle?: string
  youtubeHandle?: string
  websiteUrl?: string
}

interface DiagnosticFormProps {
  loading: boolean
  error: string | null
  onAnalyze: (data: DiagnosticFormData) => Promise<void>
}

export function DiagnosticForm({ loading, error, onAnalyze }: DiagnosticFormProps) {
  const [formData, setFormData] = useState<DiagnosticFormData>({
    businessName: '',
    businessType: '',
    instagramHandle: '',
    tiktokHandle: '',
    youtubeHandle: '',
    websiteUrl: ''
  })

  const [validationError, setValidationError] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setValidationError('')
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    if (!formData.businessName.trim()) {
      setValidationError('Nome da empresa é obrigatório')
      return
    }

    if (!formData.businessType.trim()) {
      setValidationError('Tipo de negócio é obrigatório')
      return
    }

    // Verificar se ao menos um canal foi fornecido
    const hasAtLeastOneChannel = formData.instagramHandle?.trim() ||
                                 formData.tiktokHandle?.trim() ||
                                 formData.youtubeHandle?.trim() ||
                                 formData.websiteUrl?.trim()

    if (!hasAtLeastOneChannel) {
      setValidationError('Forneça pelo menos um canal ou website')
      return
    }

    try {
      await onAnalyze(formData)
    } catch (err) {
      setValidationError('Erro ao processar diagnóstico. Tente novamente.')
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto space-y-5 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl p-6 border border-[#222]"
    >
      {/* Header - Minimalista */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">
          Diagnóstico Digital Gratuito
        </h2>
        <p className="text-sm text-gray-400">
          Preencha os dados essenciais para análise IA
        </p>
      </div>

      {/* Error Display */}
      {(validationError || error) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-500/10 border border-red-500/50 rounded-lg p-3"
        >
          <p className="text-red-400 text-xs">
            {validationError || error}
          </p>
        </motion.div>
      )}

      {/* Business Info - Compacto */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Nome da Empresa *
          </label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Ex: Loja Premium"
            className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/50 transition"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Tipo de Negócio *
          </label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-sm text-white focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/50 transition"
            disabled={loading}
          >
            <option value="">Selecione...</option>
            <option value="ecommerce">E-commerce</option>
            <option value="servicos">Serviços</option>
            <option value="varejo">Varejo</option>
            <option value="saude">Saúde</option>
            <option value="educacao">Educação</option>
            <option value="beleza">Beleza</option>
            <option value="alimentacao">Alimentação</option>
            <option value="outros">Outros</option>
          </select>
        </div>
      </div>

      {/* Social Channels - Grid compacto 2x2 */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-300">Canais Digitais (opcional)</p>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="text"
              name="instagramHandle"
              value={formData.instagramHandle}
              onChange={handleChange}
              placeholder="Instagram @user"
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/50 transition"
              disabled={loading}
            />
          </div>

          <div>
            <input
              type="text"
              name="tiktokHandle"
              value={formData.tiktokHandle}
              onChange={handleChange}
              placeholder="TikTok @user"
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/50 transition"
              disabled={loading}
            />
          </div>

          <div>
            <input
              type="text"
              name="youtubeHandle"
              value={formData.youtubeHandle}
              onChange={handleChange}
              placeholder="YouTube @channel"
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/50 transition"
              disabled={loading}
            />
          </div>

          <div>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              placeholder="Website URL"
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/50 transition"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="button"
        onClick={() => handleSubmit()}
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-sm rounded-lg transition shadow-lg hover:shadow-blue-500/50 disabled:opacity-50"
      >
        {loading ? (
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center justify-center gap-2"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              <Zap className="w-4 h-4" />
            </motion.span>
            Analisando...
          </motion.span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" />
            Gerar Diagnóstico
          </span>
        )}
      </motion.button>

      <p className="text-xs text-gray-500 text-center">
        Forneça ao menos um canal para análise completa
      </p>
    </motion.form>
  )
}
