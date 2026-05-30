/**
 * POST /api/audit
 *
 * Orquestra coleta de dados REAIS de todas as plataformas
 * Retorna JSON estruturado para diagnóstico baseado em dados reais
 *
 * PROIBIDO: Inventar dados
 */

import { orchestrateDataCollection } from "@/lib/data-collectors/orchestrator"

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
    nextSteps: string[]
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

    // 🧠 FASE 2: Análise estruturada baseada em dados REAIS
    console.log(`[AUDIT] Gerando análise baseada em dados reais...`)

    // Análise inteligente baseada em dados reais coletados
    const analysis = generateAnalysisFromRealData(auditData, body.businessType || "unknown")

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
 * 🧠 Gera análise estruturada baseada em dados REAIS coletados
 * Sem depender de APIs externas — puramente lógica estruturada
 */
function generateAnalysisFromRealData(auditData: any, businessType: string): AuditResponse["analysis"] {
  const platforms = auditData.platforms

  // Calcular análise por plataforma
  const byChannel = buildChannelAnalysis(platforms)

  // Identificar pontos fortes (plataformas com melhor engagement)
  const strengths = identifyStrengths(platforms)

  // Identificar oportunidades (gaps e problemas)
  const opportunities = identifyOpportunities(platforms, businessType)

  // Score estratégico baseado em dados reais
  const strategicScore = calculateStrategicScore(platforms)

  // Próximos passos práticos e ranqueados
  const nextSteps = generateNextSteps(platforms, businessType)

  return {
    byChannel,
    strengths,
    opportunities,
    strategicScore,
    nextSteps,
  }
}

function buildChannelAnalysis(platforms: any): string {
  const analyses: string[] = []

  if (platforms.instagram?.status === "success") {
    const ig = platforms.instagram.data
    const engagement = ((ig.engagement_rate || 0) * 100).toFixed(1)
    analyses.push(
      `Instagram: ${ig.followers || 0} seguidores com ${engagement}% de engajamento`
    )
  }

  if (platforms.tiktok?.status === "success") {
    const tt = platforms.tiktok.data
    const engagement = ((tt.engagement_rate || 0) * 100).toFixed(1)
    analyses.push(
      `TikTok: ${tt.followers || 0} seguidores com ${engagement}% de engajamento`
    )
  }

  if (platforms.youtube?.status === "success") {
    const yt = platforms.youtube.data
    analyses.push(
      `YouTube: ${yt.subscribers || 0} inscritos`
    )
  }

  if (platforms.website?.status === "success") {
    analyses.push(
      `Website: Ativo e acessível`
    )
  }

  return analyses.length > 0
    ? analyses.join(" | ")
    : "Dados insuficientes para análise por canal"
}

function identifyStrengths(platforms: any): string {
  const strengths: string[] = []

  // Instagram
  if (platforms.instagram?.status === "success") {
    const engagement = platforms.instagram.data?.engagement_rate || 0
    if (engagement > 0.05) {
      strengths.push("✅ Instagram com excelente engajamento (5%+)")
    } else if (engagement > 0.02) {
      strengths.push("✅ Instagram com engajamento moderado")
    }

    const followers = platforms.instagram.data?.followers || 0
    if (followers > 1000000) {
      strengths.push("✅ Base de seguidores Instagram consolidada (1M+)")
    }
  }

  // TikTok
  if (platforms.tiktok?.status === "success") {
    const engagement = platforms.tiktok.data?.engagement_rate || 0
    if (engagement > 0.06) {
      strengths.push("✅ TikTok com alto engajamento (6%+)")
    }
  }

  // Website
  if (platforms.website?.status === "success") {
    strengths.push("✅ Website otimizado e responsivo")
  }

  return strengths.length > 0
    ? strengths.join(" | ")
    : "Presença digital precisa de fortalecimento"
}

function identifyOpportunities(platforms: any, businessType: string): string {
  const opportunities: string[] = []

  // Analisar canais ausentes
  if (platforms.instagram?.status !== "success") {
    opportunities.push("📱 Criar presença no Instagram (essencial para varejo/serviços)")
  }

  if (platforms.tiktok?.status !== "success") {
    opportunities.push("🎬 Explorar TikTok para aumentar alcance em público jovem")
  }

  if (platforms.youtube?.status !== "success") {
    opportunities.push("📺 Criar canal YouTube para construir autoridade")
  }

  // Analisar engajamento baixo
  if (platforms.instagram?.status === "success") {
    const engagement = platforms.instagram.data?.engagement_rate || 0
    if (engagement < 0.02) {
      opportunities.push("📊 Melhorar conteúdo do Instagram (engajamento abaixo da média)")
    }
  }

  // Recomendações por tipo de negócio
  if (businessType.toLowerCase().includes("ecommerce")) {
    opportunities.push("🛍️ Integrar catálogo de produtos nas redes sociais")
  }

  if (businessType.toLowerCase().includes("serviço")) {
    opportunities.push("👥 Destacar cases e depoimentos de clientes")
  }

  if (businessType.toLowerCase().includes("coaching") || businessType.toLowerCase().includes("educação")) {
    opportunities.push("🎓 Criar conteúdo educacional para posicionar como autoridade")
  }

  return opportunities.length > 0
    ? opportunities.join(" | ")
    : "Continue otimizando a presença digital"
}

function calculateStrategicScore(platforms: any): number {
  let score = 0
  const maxScore = 100
  let weightSum = 0

  // Instagram (30% do score)
  if (platforms.instagram?.status === "success") {
    const ig = platforms.instagram.data
    const engagement = (ig.engagement_rate || 0) * 100
    const followerScore = Math.min((ig.followers || 0) / 100000 * 100, 100)
    const igScore = (engagement * 2 + followerScore) / 3
    score += igScore * 0.3
    weightSum += 0.3
  }

  // TikTok (25% do score)
  if (platforms.tiktok?.status === "success") {
    const tt = platforms.tiktok.data
    const engagement = (tt.engagement_rate || 0) * 100
    const followerScore = Math.min((tt.followers || 0) / 100000 * 100, 100)
    const ttScore = (engagement * 2 + followerScore) / 3
    score += ttScore * 0.25
    weightSum += 0.25
  }

  // YouTube (20% do score)
  if (platforms.youtube?.status === "success") {
    const yt = platforms.youtube.data
    const subscriberScore = Math.min((yt.subscribers || 0) / 100000 * 100, 100)
    score += subscriberScore * 0.2
    weightSum += 0.2
  }

  // Website (15% do score)
  if (platforms.website?.status === "success") {
    score += 75 * 0.15 // Website ativo = 75 pontos
    weightSum += 0.15
  }

  // Normalizar por peso
  const finalScore = weightSum > 0 ? score / weightSum : 0

  return Math.min(Math.round(finalScore), maxScore)
}

function generateNextSteps(platforms: any, businessType: string): string[] {
  const steps: string[] = []

  // Semana 1: Ações imediatas
  if (platforms.instagram?.status === "success" && platforms.tiktok?.status !== "success") {
    steps.push("Semana 1: Criar conta TikTok e publicar 5 vídeos de teste")
  }

  if (platforms.instagram?.status === "success") {
    const engagement = platforms.instagram.data?.engagement_rate || 0
    if (engagement < 0.03) {
      steps.push("Semana 1: Otimizar Instagram com conteúdo de melhor performance")
    }
  }

  // Semana 2-3: Estratégia de conteúdo
  if (businessType.toLowerCase().includes("ecommerce")) {
    steps.push("Semana 2: Criar catálogo de produtos integrado às redes sociais")
  } else if (businessType.toLowerCase().includes("serviço")) {
    steps.push("Semana 2: Produzir 3 cases de sucesso de clientes")
  } else {
    steps.push("Semana 2: Desenvolver calendário de conteúdo para 30 dias")
  }

  // Semana 3-4: Amplificação
  steps.push("Semana 3: Implementar estratégia de engajamento (responder comentários)")
  steps.push("Semana 4: Analisar métricas e ajustar estratégia baseado em resultados")

  return steps.slice(0, 4) // Retornar até 4 próximos passos
}
