'use client'

import { useState, useCallback } from 'react'

interface FormData {
  businessName: string
  businessType: string
  instagramHandle?: string
  tiktokHandle?: string
  youtubeHandle?: string
  websiteUrl?: string
}

interface AuditResponse {
  success: boolean
  businessName: string
  businessType: string
  dataQuality?: {
    completenessScore: number
    hassufficientData: boolean
    warnings: string[]
  }
  analysis?: {
    byChannel: string
    strengths: string
    opportunities: string
    strategicScore: number
    nextSteps: string
  }
  error?: {
    code: string
    message: string
  }
}

// Tipo compatível com DiagnosticScore
interface TransformedResult {
  overallScore: number
  businessName: string
  businessType: string
  timestamp: string
  channels: Record<string, any>
  topPriorities: any[]
  recommendation: string
  nextSteps: string[]
}

interface UseDiagnosticState {
  loading: boolean
  error: string | null
  result: TransformedResult | null
}

export function useDiagnostic() {
  const [state, setState] = useState<UseDiagnosticState>({
    loading: false,
    error: null,
    result: null
  })

  const analyze = useCallback(async (input: FormData): Promise<void> => {
    setState({ loading: true, error: null, result: null })

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMsg = errorData.error?.message || 'Erro ao processar diagnóstico'

        // Melhorar mensagem de erro para dados insuficientes
        if (errorData.error?.code === 'INSUFFICIENT_DATA') {
          console.log('[AUDIT] Dados insuficientes:', errorData.dataQuality)
          throw new Error(
            `❌ Dados insuficientes para análise. ${errorMsg}\n\n` +
            `Plataformas coletadas: ${errorData.dataQuality?.completenessScore || 0}% (mínimo 50% necessário)\n` +
            `Avisos: ${errorData.dataQuality?.warnings?.join('; ') || 'Nenhum'}`
          )
        }

        throw new Error(errorMsg)
      }

      const auditResult: AuditResponse = await response.json()

      // Transformar resposta do audit em DiagnosticResult compatível
      const transformed: TransformedResult = {
        overallScore: auditResult.analysis?.strategicScore || 0,
        businessName: auditResult.businessName,
        businessType: auditResult.businessType,
        timestamp: new Date().toISOString(),
        channels: {
          instagram: { channel: 'instagram', score: 0, grade: 'N/A', quickWin: '', problems: [] },
          tiktok: { channel: 'tiktok', score: 0, grade: 'N/A', quickWin: '', problems: [] },
          youtube: { channel: 'youtube', score: 0, grade: 'N/A', quickWin: '', problems: [] },
          website: { channel: 'website', score: 0, grade: 'N/A', quickWin: '', problems: [] }
        },
        topPriorities: [],
        recommendation: auditResult.analysis?.opportunities || 'Análise disponível no painel Premium',
        nextSteps: auditResult.analysis?.nextSteps ? [auditResult.analysis.nextSteps] : ['Acesse o painel Premium para recomendações detalhadas']
      }

      setState({ loading: false, error: null, result: transformed })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setState({ loading: false, error: errorMessage, result: null })
      throw err
    }
  }, [])

  const reset = useCallback(() => {
    setState({ loading: false, error: null, result: null })
  }, [])

  return {
    ...state,
    analyze,
    reset
  }
}
