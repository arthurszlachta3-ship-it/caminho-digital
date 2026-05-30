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
 * Claude NÃO pode inventar dados - PROIBIDO CATEGORICAMENTE
 */
export function buildClaudePromptFromRealData(auditData: RealAuditData): string {
  const platformsSummary = Object.entries(auditData.platforms)
    .map(([platform, result]) => {
      if (result.status === "error") {
        return `❌ ${platform.toUpperCase()}: Erro - ${result.error?.message}`
      }
      return `✅ ${platform.toUpperCase()}: Dados coletados`
    })
    .join("\n")

  return `# ⚠️ AUDITORIA DIGITAL - DADOS REAIS SOMENTE ⚠️

## RESTRIÇÃO ABSOLUTA: NÃO INVENTE NENHUM DADO

Você está analisando dados reais de ${auditData.businessName}. Você recebe dados estruturados abaixo.

**SE A INFORMAÇÃO NÃO ESTIVER NOS DADOS: VOCÊ NÃO PODE INVENTAR**

Exemplos de INVENÇÃO (PROIBIDO):
❌ "O perfil tem 5.000 seguidores" (se ninguém forneceu esse número)
❌ "Fez 10 posts no mês passado" (se o dado não foi coletado)
❌ "O engajamento é baixo" (sem dados de engajamento)
❌ "Recomendo fazer X" (sem evidência nos dados para fazer X)

---

## Plataformas Coletadas
${platformsSummary}

## Qualidade dos Dados
- Completude: ${auditData.dataQuality.completenessScore}%
- Suficientes: ${auditData.dataQuality.hassufficientData ? "✅ Sim" : "❌ Não"}
- Avisos: ${auditData.dataQuality.warnings.length > 0 ? auditData.dataQuality.warnings.join("; ") : "Nenhum"}

---

## Dados Estruturados (FONTE ABSOLUTA)
\`\`\`json
${JSON.stringify(auditData, null, 2)}
\`\`\`

---

## Sua Tarefa - SOMENTE COM DADOS REAIS

Analise APENAS o que está nos dados. Para cada seção:

1. **Análise por Canal**
   - Liste SOMENTE o que você VÊ nos dados
   - Se um canal tem erro: diga "Canal não configurado"
   - Não suponha números, atividade ou problemas

2. **Pontos Fortes**
   - SOMENTE fatos observáveis nos dados
   - Se não há dados: escreva "Sem dados para avaliar"

3. **Oportunidades**
   - Baseadas APENAS no que você ve nos dados
   - Não sugira ações sem base factual

4. **Score Estratégico**
   - Calcule baseado SOMENTE nos dados (ex: completenessScore)
   - Não invente um score "artístico"

5. **Próximos Passos**
   - Recomendações suportadas pelos dados
   - Não adicione recomendações genéricas

---

## PROIBIÇÕES ABSOLUTAS

❌ NÃO diga "tem X seguidores" se ninguém coletou esse dado
❌ NÃO diga "posted 3x por semana" sem dados de posts
❌ NÃO invente problemas que não apareçem nos dados
❌ NÃO adicione análises criativas ou suposições
❌ NÃO faça perguntas retóricas que criem ilusão de dados

## MANDATÓRIA

✅ Se um canal retornou erro: reporte claramente
✅ Se faltam dados: diga "Informação não coletada"
✅ Seja específico: cite os números que você realmente vê
✅ Seja humilde: reconheça limitações dos dados

---

**Comece agora. Analise SOMENTE com os dados reais acima.**`
}
