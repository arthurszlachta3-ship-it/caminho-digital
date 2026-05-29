/**
 * Social Data Orchestrator
 * Coordena coleta de TODOS os dados reais
 * Retorna JSON estruturado para Claude
 * PROIBIDO INVENTAR DADOS
 */

import { collectInstagramData, validateInstagramData } from "./instagram"
import { collectTikTokData, validateTikTokData } from "./tiktok"
import { collectYouTubeData, validateYouTubeData } from "./youtube"
import { analyzeWebsite, validateWebsiteData } from "./website"

export interface RealAuditData {
  businessName: string
  businessType: string
  collectedAt: string
  platforms: {
    instagram: {
      status: "success" | "error"
      data?: any
      error?: {
        code: string
        message: string
      }
    }
    tiktok: {
      status: "success" | "error"
      data?: any
      error?: {
        code: string
        message: string
      }
    }
    youtube: {
      status: "success" | "error"
      data?: any
      error?: {
        code: string
        message: string
      }
    }
    website: {
      status: "success" | "error"
      data?: any
      error?: {
        code: string
        message: string
      }
    }
  }
  dataQuality: {
    completenessScore: number
    hassufficientData: boolean
    warnings: string[]
  }
}

/**
 * Orquestra coleta de dados reais de TODAS as plataformas
 * Retorna JSON estruturado que Claude pode analisar
 */
export async function orchestrateDataCollection(
  businessName: string,
  businessType: string,
  instagramHandle?: string,
  tiktokHandle?: string,
  youtubeHandle?: string,
  websiteUrl?: string
): Promise<RealAuditData> {
  const collectionStart = Date.now()

  // Coletar dados de forma paralela
  const [instagramResult, tiktokResult, youtubeResult, websiteResult] = await Promise.all([
    instagramHandle ? collectInstagramData(instagramHandle) : Promise.resolve(null),
    tiktokHandle ? collectTikTokData(tiktokHandle) : Promise.resolve(null),
    youtubeHandle ? collectYouTubeData(youtubeHandle) : Promise.resolve(null),
    websiteUrl ? analyzeWebsite(websiteUrl) : Promise.resolve(null),
  ])

  // Estruturar resultado
  const result: RealAuditData = {
    businessName,
    businessType,
    collectedAt: new Date().toISOString(),
    platforms: {
      instagram: formatPlatformResult("instagram", instagramResult, validateInstagramData),
      tiktok: formatPlatformResult("tiktok", tiktokResult, validateTikTokData),
      youtube: formatPlatformResult("youtube", youtubeResult, validateYouTubeData),
      website: formatPlatformResult("website", websiteResult, validateWebsiteData),
    },
    dataQuality: {
      completenessScore: 0,
      hassufficientData: false,
      warnings: [],
    },
  }

  // Calcular qualidade dos dados
  result.dataQuality = calculateDataQuality(result)

  return result
}

/**
 * Formata resultado de cada plataforma
 */
function formatPlatformResult(
  platform: string,
  result: any,
  validator: (data: any) => { isValid: boolean; issues: string[] }
): any {
  if (!result) {
    return {
      status: "error",
      error: {
        code: `${platform.toUpperCase()}_NOT_PROVIDED`,
        message: `${platform} não foi fornecido`,
      },
    }
  }

  // Verificar se é um erro
  if (result.code || result.reason) {
    return {
      status: "error",
      error: {
        code: result.code,
        message: result.message,
      },
    }
  }

  // Validar dados
  const validation = validator(result)

  if (!validation.isValid) {
    return {
      status: "error",
      error: {
        code: `${platform.toUpperCase()}_DATA_INVALID`,
        message: validation.issues.join("; "),
      },
    }
  }

  // Retornar dados validados
  return {
    status: "success",
    data: result,
  }
}

/**
 * Calcula qualidade dos dados coletados
 */
function calculateDataQuality(result: RealAuditData): RealAuditData["dataQuality"] {
  const platforms = Object.values(result.platforms)
  const successCount = platforms.filter(p => p.status === "success").length
  const completenessScore = Math.round((successCount / platforms.length) * 100)

  const warnings: string[] = []

  // Avisos específicos
  if (result.platforms.instagram.status === "error") {
    warnings.push("Dados do Instagram não disponíveis")
  }
  if (result.platforms.tiktok.status === "error") {
    warnings.push("Dados do TikTok não disponíveis")
  }
  if (result.platforms.youtube.status === "error") {
    warnings.push("Dados do YouTube não disponíveis")
  }
  if (result.platforms.website.status === "error") {
    warnings.push("Website não foi analisado")
  }

  // Verificar se tem dados suficientes
  const hasSufficientData = successCount >= 2 // Pelo menos 2 plataformas

  if (!hasSufficientData) {
    warnings.push(
      "Dados insuficientes para análise completa. Forneça pelo menos 2 canais sociais e/ou website."
    )
  }

  return {
    completenessScore,
    hassufficientData: hasSufficientData,
    warnings,
  }
}

/**
 * Cria prompt para Claude com dados REAIS
 * Claude NÃO pode inventar dados
 */
export function buildClaudePromptFromRealData(auditData: RealAuditData): string {
  const platformsSummary = Object.entries(auditData.platforms)
    .map(([platform, result]) => {
      if (result.status === "error") {
        return `${platform}: Erro - ${result.error?.message}`
      }
      return `${platform}: Dados coletados com sucesso`
    })
    .join("\n")

  return `## AUDITORIA DIGITAL REAL - ${auditData.businessName.toUpperCase()}

IMPORTANTE: Use SOMENTE os dados fornecidos abaixo.
Se um dado estiver ausente ou indisponível:
- NÃO invente informações
- Diga claramente: "Dado não disponível"
- Sugira coleta adicional se necessário

### Dados Coletados
Timestamp: ${auditData.collectedAt}
Tipo de Negócio: ${auditData.businessType}

Plataformas:
${platformsSummary}

Qualidade dos Dados:
- Completude: ${auditData.dataQuality.completenessScore}%
- Dados Suficientes: ${auditData.dataQuality.hassufficientData ? "Sim" : "Não"}
- Avisos: ${auditData.dataQuality.warnings.length > 0 ? auditData.dataQuality.warnings.join("; ") : "Nenhum"}

### Dados Brutos
\`\`\`json
${JSON.stringify(auditData, null, 2)}
\`\`\`

### Sua Análise
Com base SOMENTE nos dados reais acima:

1. **Análise por Canal**: Descreva o que você VÊ nos dados. NÃO suponha ou invente.

2. **Pontos Fortes**: Liste apenas fatos observáveis nos dados.

3. **Oportunidades**: Sugira melhorias baseadas em dados reais.

4. **Score Estratégico**: Calcule um score 0-100 baseado APENAS nos dados coletados.

5. **Próximos Passos**: Recomende ações específicas suportadas pelos dados.

### Regra Ouro
Se a informação não está nos dados:
❌ NÃO invente
✅ Diga "Dado não disponível" ou "Informação insuficiente para análise"`
}
