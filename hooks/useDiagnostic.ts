'use client'

import { useState, useCallback } from 'react'
import { DiagnosticInput, DiagnosticResult } from '@/lib/diagnostic-engine'

interface UseDiagnosticState {
  loading: boolean
  error: string | null
  result: DiagnosticResult | null
}

export function useDiagnostic() {
  const [state, setState] = useState<UseDiagnosticState>({
    loading: false,
    error: null,
    result: null
  })

  const analyze = useCallback(async (input: DiagnosticInput) => {
    setState({ loading: true, error: null, result: null })

    try {
      const response = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao processar diagnóstico')
      }

      const result: DiagnosticResult = await response.json()
      setState({ loading: false, error: null, result })
      return result
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
