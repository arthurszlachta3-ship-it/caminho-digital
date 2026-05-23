import { NextRequest, NextResponse } from 'next/server'
import { diagnosticEngine, DiagnosticInput } from '@/lib/diagnostic-engine'
import { mockDiagnosticEngine } from '@/lib/diagnostic-engine.mock'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar inputs obrigatórios
    if (!body.businessName || !body.businessType) {
      return NextResponse.json(
        { error: 'businessName e businessType são obrigatórios' },
        { status: 400 }
      )
    }

    const input: DiagnosticInput = {
      businessName: body.businessName,
      businessType: body.businessType,
      instagram: body.instagram,
      tiktok: body.tiktok,
      youtube: body.youtube,
      website: body.website,
      currentFollowers: body.currentFollowers
    }

    // Usar mock em desenvolvimento se ANTHROPIC_API_KEY não estiver configurado
    const useRealApi = !!process.env.ANTHROPIC_API_KEY && process.env.NODE_ENV === 'production'
    const engine = useRealApi ? diagnosticEngine : mockDiagnosticEngine

    // Executar análise
    const result = await engine.analyze(input)

    // Salvar resultado no Supabase (opcional - implementar depois)
    // await saveDiagnosticResult(result, userId)

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store'
      }
    })
  } catch (error) {
    console.error('Diagnostic error:', error)

    return NextResponse.json(
      {
        error: 'Erro ao processar diagnóstico',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
