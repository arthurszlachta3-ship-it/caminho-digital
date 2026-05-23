'use client'

import { useState } from 'react'
import { useDiagnostic } from '@/hooks/useDiagnostic'
import { DiagnosticInput } from '@/lib/diagnostic-engine'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function DiagnosticForm() {
  const { loading, error, analyze } = useDiagnostic()
  const [formData, setFormData] = useState<DiagnosticInput>({
    businessName: '',
    businessType: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    website: '',
    currentFollowers: {
      instagram: 0,
      tiktok: 0,
      youtube: 0
    }
  })

  const [validationError, setValidationError] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setValidationError('')

    if (name.startsWith('followers_')) {
      const platform = name.replace('followers_', '') as 'instagram' | 'tiktok' | 'youtube'
      setFormData(prev => ({
        ...prev,
        currentFollowers: {
          instagram: prev.currentFollowers?.instagram || 0,
          tiktok: prev.currentFollowers?.tiktok || 0,
          youtube: prev.currentFollowers?.youtube || 0,
          [platform]: parseInt(value) || 0
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.businessName.trim()) {
      setValidationError('Nome da empresa é obrigatório')
      return
    }

    if (!formData.businessType.trim()) {
      setValidationError('Tipo de negócio é obrigatório')
      return
    }

    try {
      await analyze(formData)
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
      className="w-full max-w-2xl mx-auto space-y-6 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl p-8 border border-[#222]"
    >
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Análise de Presença Digital
        </h2>
        <p className="text-gray-400">
          Preencha os dados da sua empresa para receber um diagnóstico completo
        </p>
      </div>

      {/* Error Display */}
      {(validationError || error) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-500/10 border border-red-500/50 rounded-lg p-4"
        >
          <p className="text-red-400 text-sm">
            {validationError || error}
          </p>
        </motion.div>
      )}

      {/* Business Info Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Informações da Empresa</h3>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nome da Empresa *
          </label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Ex: Loja Premium"
            className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/50 transition"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tipo de Negócio *
          </label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/50 transition"
            disabled={loading}
          >
            <option value="">Selecione uma categoria</option>
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

      {/* Social Media Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Redes Sociais</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Instagram
            </label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="@seuusuario"
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/50 transition"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              TikTok
            </label>
            <input
              type="text"
              name="tiktok"
              value={formData.tiktok}
              onChange={handleChange}
              placeholder="@seuusuario"
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/50 transition"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              YouTube
            </label>
            <input
              type="text"
              name="youtube"
              value={formData.youtube}
              onChange={handleChange}
              placeholder="@seucanal"
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/50 transition"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://seusite.com.br"
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/50 transition"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Followers Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Seguidores</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Instagram
            </label>
            <input
              type="number"
              name="followers_instagram"
              value={formData.currentFollowers?.instagram || 0}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/50 transition"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              TikTok
            </label>
            <input
              type="number"
              name="followers_tiktok"
              value={formData.currentFollowers?.tiktok || 0}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/50 transition"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              YouTube
            </label>
            <input
              type="number"
              name="followers_youtube"
              value={formData.currentFollowers?.youtube || 0}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/50 transition"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#10b981] hover:bg-[#10b981]/90 text-white font-semibold rounded-lg transition shadow-lg"
      >
        {loading ? (
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center justify-center gap-2"
          >
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Analisando sua presença...
          </motion.span>
        ) : (
          'Gerar Diagnóstico'
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        * Campos obrigatórios
      </p>
    </motion.form>
  )
}
