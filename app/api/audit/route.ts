/**
 * POST /api/audit
 *
 * Orquestra coleta de dados REAIS de todas as plataformas
 * Retorna JSON estruturado para diagnóstico baseado em dados reais
 *
 * PROIBIDO: Inventar dados
 */

import { orchestrateDataCollection, buildClaudePromptFromRealData } from "@/lib/data-collectors/orchestrator"
import { Anthropic } from "@anthropic-ai/sdk"

export const runtime = "nodejs"

interface AuditRequest {
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
  dataQuality: {
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

export async function POST(request: Request): Promise<Response> {
  try {
    const body: AuditRequest = await request.json()

    // Validar entrada
    if (!body.businessName) {
      return Response.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "businessName é obrigatório",
          },
        },
        { status: 400 }
      )
    }

    // 🔍 FASE 1: Coletar dados REAIS
    console.log(`[AUDIT] Iniciando coleta de dados para: ${body.businessName}`)

    const auditData = await orchestrateDataCollection(
      body.businessName,
      body.businessType || "unknown",
      body.instagramHandle,
      body.tiktokHandle,
      body.youtubeHandle,
      body.websiteUrl
    )

    // Verificar se tem dados suficientes
    if (!auditData.dataQuality.hassufficientData) {
      console.log(`[AUDIT] ❌ Dados insuficientes para ${body.businessName}:`, {
        completeness: auditData.dataQuality.completenessScore,
        warnings: auditData.dataQuality.warnings,
        platforms: {
          instagram: auditData.platforms.instagram.status,
          tiktok: auditData.platforms.tiktok.status,
          youtube: auditData.platforms.youtube.status,
          website: auditData.platforms.website.status,
        }
      })

      return Response.json(
        {
          success: false,
          businessName: body.businessName,
          businessType: body.businessType || "unknown",
          dataQuality: auditData.dataQuality,
          error: {
            code: "INSUFFICIENT_DATA",
            message:
              "Dados insuficientes. Forneça pelo menos 2 canais ou um website válido.",
          },
        },
        { status: 400 }
      )
    }

    // 🧠 FASE 2: Claude analisa dados REAIS
    console.log(`[AUDIT] Enviando dados para Claude...`)

    const claudePrompt = buildClaudePromptFromRealData(auditData)

    const client = new Anthropic()
    const message = await client.messages.create({
      model: "claude-3-opus",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: claudePrompt,
        },
      ],
    })

    // Parse resposta de Claude
    const claudeResponse = message.content[0]
    if (claudeResponse.type !== "text") {
      throw new Error("Unexpected Claude response type")
    }

    // Extrair análise estruturada
    const analysis = parseClaudeAnalysis(claudeResponse.text)

    return Response.json({
      success: true,
      businessName: body.businessName,
      businessType: body.businessType || "unknown",
      dataQuality: auditData.dataQuality,
      analysis,
    })
  } catch (error) {
    console.error("[AUDIT] Error:", error)

    return Response.json(
      {
        success: false,
        error: {
          code: "AUDIT_ERROR",
          message: error instanceof Error ? error.message : "Erro desconhecido na auditoria",
        },
      },
      { status: 500 }
    )
  }
}

/**
 * Parse análise estruturada da resposta do Claude
 */
function parseClaudeAnalysis(
  text: string
): AuditResponse["analysis"] {
  // Claude retorna texto estruturado
  // Este parser extrai seções e formata

  return {
    byChannel: text.includes("Análise por Canal")
      ? text.split("Análise por Canal")[1]?.split("##")[0]?.trim() || text
      : "Análise não disponível",
    strengths: text.includes("Pontos Fortes")
      ? text.split("Pontos Fortes")[1]?.split("##")[0]?.trim() || ""
      : "Não identificado",
    opportunities: text.includes("Oportunidades")
      ? text.split("Oportunidades")[1]?.split("##")[0]?.trim() || ""
      : "Não identificado",
    strategicScore: extractNumber(text, "Score") || 0,
    nextSteps: text.includes("Próximos Passos")
      ? text.split("Próximos Passos")[1]?.split("###")[0]?.trim() || ""
      : "Não identificado",
  }
}

/**
 * Extrai número do texto
 */
function extractNumber(text: string, keyword: string): number | null {
  const regex = new RegExp(`${keyword}[^0-9]*([0-9]+)`, "i")
  const match = text.match(regex)
  return match ? parseInt(match[1]) : null
}
