/**
 * Diagnostic Engine for Caminho Digital
 * Analyzes digital presence across channels using Claude AI
 */

import Anthropic from '@anthropic-ai/sdk'

export type Channel = 'instagram' | 'tiktok' | 'youtube' | 'website'
export type ImpactLevel = 'high' | 'medium' | 'low'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface DiagnosticInput {
  businessName: string
  businessType: string
  instagram?: string
  tiktok?: string
  youtube?: string
  website?: string
  currentFollowers?: {
    instagram: number
    tiktok: number
    youtube: number
  }
}

export interface Problem {
  title: string
  description: string
  impact: ImpactLevel
  solution: string
}

export interface Priority {
  action: string
  priority: number // 1, 2, 3, etc
  difficulty: Difficulty
  timeToImplement: string // ex: "15 minutos", "2 horas", "1 semana"
  potentialROI: string // ex: "+30% cliques", "Aumentar vendas em 25%"
  channel?: Channel // qual canal essa ação impacta principalmente
}

export interface ChannelScore {
  channel: Channel
  score: number // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  problems: Problem[] // EXPANDIDO: agora objetos com impacto e solução
  quickWin: string
  sentiment: 'excellent' | 'good' | 'fair' | 'poor'
}

export interface DiagnosticResult {
  businessName: string
  businessType: string // NOVO: para contexto
  overallScore: number // 0-100
  timestamp: string
  channels: Record<Channel, ChannelScore>
  topPriorities: Priority[] // EXPANDIDO: agora objetos com tempo/dificuldade/ROI
  recommendation: string
  nextSteps: string[]
  businessTypeContext?: string // NOVO: insights contextualizados por tipo de negócio
}

class DiagnosticEngine {
  private client: Anthropic | null = null
  private model = 'claude-opus'

  private getClient(): Anthropic {
    if (!this.client) {
      const apiKey = process.env.ANTHROPIC_API_KEY
      if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY not configured')
      }
      this.client = new Anthropic({ apiKey })
    }
    return this.client
  }

  async analyze(input: DiagnosticInput): Promise<DiagnosticResult> {
    const prompt = this.buildPrompt(input)
    const client = this.getClient()

    const message = await client.messages.create({
      model: this.model,
      max_tokens: 4000, // Aumentado para suportar análises mais detalhadas
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const response = message.content[0]
    if (response.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    const result = this.parseResponse(response.text, input.businessName)
    return result
  }

  private buildPrompt(input: DiagnosticInput): string {
    return `Você é um especialista em presença digital e marketing digital especializado em PMEs brasileiras.

Analise a seguinte presença digital:
- Empresa: ${input.businessName}
- Tipo de Negócio: ${input.businessType}
- Instagram: ${input.instagram || 'Não informado'}
- TikTok: ${input.tiktok || 'Não informado'}
- YouTube: ${input.youtube || 'Não informado'}
- Website: ${input.website || 'Não informado'}
- Seguidores Instagram: ${input.currentFollowers?.instagram || 'N/A'}
- Seguidores TikTok: ${input.currentFollowers?.tiktok || 'N/A'}
- Seguidores YouTube: ${input.currentFollowers?.youtube || 'N/A'}

Forneça uma análise DETALHADA e CONTEXTUALIZADA em JSON com a seguinte estrutura:

{
  "overallScore": <número 0-100>,
  "businessTypeContext": "Um parágrafo explicando insights específicos para este tipo de negócio",
  "channels": {
    "instagram": {
      "score": <0-100>,
      "grade": "<A|B|C|D|F>",
      "problems": [
        {
          "title": "Título do problema",
          "description": "Descrição breve do impacto",
          "impact": "<high|medium|low>",
          "solution": "Como resolver este problema"
        }
      ],
      "quickWin": "Uma ação rápida e fácil para melhorar imediatamente"
    },
    "tiktok": { ... },
    "youtube": { ... },
    "website": { ... }
  },
  "topPriorities": [
    {
      "action": "Descrição específica da ação",
      "priority": 1,
      "difficulty": "<easy|medium|hard>",
      "timeToImplement": "15 minutos" ou "2 horas" ou "1 semana",
      "potentialROI": "+30% de cliques" ou "Aumentar vendas em 25%",
      "channel": "instagram" (qual canal essa ação impacta)
    }
  ],
  "recommendation": "Uma frase conclusiva sobre o estado geral da presença digital",
  "nextSteps": ["Primeira coisa a fazer na semana 1", "Segunda coisa na semana 2", "Terceira coisa na semana 3"]
}

IMPORTANTE:
- Seja ESPECÍFICO: evite generalidades, cite o tipo de negócio (${input.businessType}) em suas recomendações
- Baseie-se em dados reais de marketing: crescimento típico de followers, taxas de engajamento, ROI médio
- Priorize por IMPACTO vs ESFORÇO: as primeiras ações devem ser fáceis e com alto impacto
- Para cada ação, estime realista o tempo necessário e o potencial de ROI
- Forneça 5-8 prioridades específicas (não genéricas)
- Diferencie entre problemas críticos (high), importantes (medium) e otimizações (low)`
  }

  private parseResponse(text: string, businessName: string): DiagnosticResult {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse diagnostic response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      businessName,
      businessType: parsed.businessType || 'unknown',
      overallScore: parsed.overallScore || 0,
      timestamp: new Date().toISOString(),
      channels: {
        instagram: this.buildChannelScore('instagram', parsed.channels?.instagram),
        tiktok: this.buildChannelScore('tiktok', parsed.channels?.tiktok),
        youtube: this.buildChannelScore('youtube', parsed.channels?.youtube),
        website: this.buildChannelScore('website', parsed.channels?.website)
      },
      topPriorities: (parsed.topPriorities || []).map((p: any) => ({
        action: p.action || '',
        priority: p.priority || 0,
        difficulty: p.difficulty || 'medium',
        timeToImplement: p.timeToImplement || '',
        potentialROI: p.potentialROI || '',
        channel: p.channel || undefined
      })),
      recommendation: parsed.recommendation || '',
      nextSteps: parsed.nextSteps || [],
      businessTypeContext: parsed.businessTypeContext
    }
  }

  private buildChannelScore(channel: Channel, data: any): ChannelScore {
    // Converter problemas de string (compatibilidade) para objetos Problem
    const problems = (data?.problems || []).map((p: any) => {
      if (typeof p === 'string') {
        // Compatibilidade com resposta antiga que retornava strings
        return {
          title: p,
          description: '',
          impact: 'medium' as ImpactLevel,
          solution: ''
        } as Problem
      }
      return {
        title: p.title || '',
        description: p.description || '',
        impact: p.impact || 'medium',
        solution: p.solution || ''
      } as Problem
    })

    return {
      channel,
      score: data?.score || 0,
      grade: data?.grade || 'F',
      problems,
      quickWin: data?.quickWin || '',
      sentiment: this.getGradeSentiment(data?.grade || 'F')
    }
  }

  private getGradeSentiment(grade: string): 'excellent' | 'good' | 'fair' | 'poor' {
    switch (grade) {
      case 'A':
        return 'excellent'
      case 'B':
        return 'good'
      case 'C':
        return 'fair'
      default:
        return 'poor'
    }
  }
}

export const diagnosticEngine = new DiagnosticEngine()
