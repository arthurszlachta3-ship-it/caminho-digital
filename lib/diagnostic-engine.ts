/**
 * Diagnostic Engine for Caminho Digital
 * Analyzes digital presence across channels using Claude AI
 */

import Anthropic from '@anthropic-ai/sdk'

export type Channel = 'instagram' | 'tiktok' | 'youtube' | 'website'

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

export interface ChannelScore {
  channel: Channel
  score: number // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  problems: string[]
  quickWin: string
  sentiment: 'excellent' | 'good' | 'fair' | 'poor'
}

export interface DiagnosticResult {
  businessName: string
  overallScore: number // 0-100
  timestamp: string
  channels: Record<Channel, ChannelScore>
  topPriorities: string[]
  recommendation: string
  nextSteps: string[]
}

class DiagnosticEngine {
  private client: Anthropic | null = null
  private model = 'claude-3-opus-20250219'

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
      max_tokens: 2000,
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
    return `Você é um especialista em presença digital e marketing para PMEs brasileiras.

Analise a seguinte presença digital:
- Empresa: ${input.businessName}
- Tipo: ${input.businessType}
- Instagram: ${input.instagram || 'Não informado'}
- TikTok: ${input.tiktok || 'Não informado'}
- YouTube: ${input.youtube || 'Não informado'}
- Website: ${input.website || 'Não informado'}
- Seguidores Instagram: ${input.currentFollowers?.instagram || 'N/A'}
- Seguidores TikTok: ${input.currentFollowers?.tiktok || 'N/A'}
- Seguidores YouTube: ${input.currentFollowers?.youtube || 'N/A'}

Forneça um diagnóstico em JSON com a seguinte estrutura:
{
  "overallScore": <número 0-100>,
  "channels": {
    "instagram": {
      "score": <0-100>,
      "grade": "<A|B|C|D|F>",
      "problems": ["problema1", "problema2"],
      "quickWin": "uma ação rápida para melhorar"
    },
    "tiktok": { ... },
    "youtube": { ... },
    "website": { ... }
  },
  "topPriorities": ["prioridade1", "prioridade2"],
  "recommendation": "uma frase sobre o estado geral",
  "nextSteps": ["passo1", "passo2", "passo3"]
}

Seja específico, construtivo e baseado em práticas reais de marketing digital.`
  }

  private parseResponse(text: string, businessName: string): DiagnosticResult {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse diagnostic response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      businessName,
      overallScore: parsed.overallScore || 0,
      timestamp: new Date().toISOString(),
      channels: {
        instagram: this.buildChannelScore('instagram', parsed.channels.instagram),
        tiktok: this.buildChannelScore('tiktok', parsed.channels.tiktok),
        youtube: this.buildChannelScore('youtube', parsed.channels.youtube),
        website: this.buildChannelScore('website', parsed.channels.website)
      },
      topPriorities: parsed.topPriorities || [],
      recommendation: parsed.recommendation || '',
      nextSteps: parsed.nextSteps || []
    }
  }

  private buildChannelScore(channel: Channel, data: any): ChannelScore {
    return {
      channel,
      score: data.score || 0,
      grade: data.grade || 'F',
      problems: data.problems || [],
      quickWin: data.quickWin || '',
      sentiment: this.getGradeSentiment(data.grade || 'F')
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
