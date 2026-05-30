/**
 * Diagnostic Engine for Caminho Digital
 * Analyzes digital presence across channels using structured analysis
 */

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
  async analyze(input: DiagnosticInput): Promise<DiagnosticResult> {
    // Gerar análise estruturada sem depender de APIs externas
    const result = this.generateStructuredAnalysis(input)
    return result
  }

  private generateStructuredAnalysis(input: DiagnosticInput): DiagnosticResult {
    const overallScore = this.calculateScore(input)
    const topPriorities = this.generatePriorities(input)
    const businessTypeContext = this.generateBusinessContext(input)

    return {
      businessName: input.businessName,
      businessType: input.businessType,
      overallScore,
      timestamp: new Date().toISOString(),
      channels: {
        instagram: this.analyzeChannel('instagram', input),
        tiktok: this.analyzeChannel('tiktok', input),
        youtube: this.analyzeChannel('youtube', input),
        website: this.analyzeChannel('website', input)
      },
      topPriorities,
      recommendation: this.generateRecommendation(overallScore, input),
      nextSteps: this.generateNextSteps(input),
      businessTypeContext
    }
  }

  private calculateScore(input: DiagnosticInput): number {
    let score = 0
    let weight = 0

    if (input.instagram) {
      const followers = (input.currentFollowers as any)?.instagram || 0
      score += followers > 10000 ? 85 : 65
      weight++
    }
    if (input.tiktok) {
      const followers = (input.currentFollowers as any)?.tiktok || 0
      score += followers > 10000 ? 80 : 60
      weight++
    }
    if (input.youtube) {
      const followers = (input.currentFollowers as any)?.youtube || 0
      score += followers > 5000 ? 75 : 55
      weight++
    }
    if (input.website) {
      score += 70
      weight++
    }

    return weight > 0 ? Math.round(score / weight) : 30
  }

  private analyzeChannel(channel: Channel, input: DiagnosticInput): ChannelScore {
    const followerCount = channel !== 'website' ? ((input.currentFollowers as any)?.[channel] || 0) : 0
    let score = 0
    let problems: Problem[] = []

    switch (channel) {
      case 'instagram':
        if (!input.instagram) {
          return {
            channel,
            score: 0,
            grade: 'F',
            problems: [{
              title: 'Canal não configurado',
              description: 'Instagram não foi informado',
              impact: 'high',
              solution: 'Adicionar conta do Instagram'
            }],
            quickWin: 'Criar presença no Instagram',
            sentiment: 'poor'
          }
        }
        score = followerCount > 10000 ? 85 : followerCount > 1000 ? 70 : 50
        problems = this.generateInstagramProblems(followerCount)
        break

      case 'tiktok':
        if (!input.tiktok) {
          return {
            channel,
            score: 0,
            grade: 'F',
            problems: [{
              title: 'Canal não configurado',
              description: 'TikTok não foi informado',
              impact: 'high',
              solution: 'Criar conta e começar a publicar'
            }],
            quickWin: 'Lançar TikTok para público jovem',
            sentiment: 'poor'
          }
        }
        score = followerCount > 10000 ? 80 : followerCount > 1000 ? 65 : 45
        problems = this.generateTikTokProblems()
        break

      case 'youtube':
        if (!input.youtube) {
          return {
            channel,
            score: 0,
            grade: 'F',
            problems: [{
              title: 'Canal não configurado',
              description: 'YouTube não foi informado',
              impact: 'medium',
              solution: 'Criar canal YouTube'
            }],
            quickWin: 'Lançar canal YouTube',
            sentiment: 'poor'
          }
        }
        score = followerCount > 5000 ? 75 : followerCount > 500 ? 60 : 40
        problems = this.generateYouTubeProblems()
        break

      case 'website':
        if (!input.website) {
          return {
            channel,
            score: 0,
            grade: 'F',
            problems: [{
              title: 'Website não configurado',
              description: 'Nenhum website foi informado',
              impact: 'high',
              solution: 'Criar website profissional'
            }],
            quickWin: 'Criar website básico',
            sentiment: 'poor'
          }
        }
        score = 70
        problems = this.generateWebsiteProblems()
        break
    }

    const grade = this.scoreToGrade(score)
    return {
      channel,
      score,
      grade,
      problems,
      quickWin: this.generateQuickWin(channel),
      sentiment: this.gradeSentiment(grade)
    }
  }

  private generateInstagramProblems(followers: number): Problem[] {
    const problems: Problem[] = []

    if (followers < 1000) {
      problems.push({
        title: 'Base de seguidores pequena',
        description: 'Menos de 1000 seguidores limita o alcance',
        impact: 'high',
        solution: 'Criar conteúdo consistente 3x por semana e usar hashtags relevantes'
      })
    }

    problems.push({
      title: 'Bio não otimizada',
      description: 'Bio padrão não atrai cliques para website',
      impact: 'medium',
      solution: 'Adicionar CTA claro + link de contato ou website'
    })

    problems.push({
      title: 'Falta de estratégia de conteúdo',
      description: 'Posts não têm consistência visual ou temática',
      impact: 'high',
      solution: 'Definir calendário de conteúdo com 4 pilares'
    })

    return problems
  }

  private generateTikTokProblems(): Problem[] {
    return [
      {
        title: 'Presença subotimizada',
        description: 'TikTok requer vídeos frequentes (diariamente)',
        impact: 'high',
        solution: 'Publicar 1 vídeo por dia, repurposing de conteúdo do Instagram'
      },
      {
        title: 'Falta de tendências',
        description: 'Não segue trends da plataforma',
        impact: 'high',
        solution: 'Acompanhar Discover e adaptar trending sounds'
      }
    ]
  }

  private generateYouTubeProblems(): Problem[] {
    return [
      {
        title: 'Descrição de vídeos fraca',
        description: 'Descrições curtas não ajudam em SEO',
        impact: 'medium',
        solution: 'Escrever descrições com 200+ caracteres + tags relevantes'
      },
      {
        title: 'Falta de playlist',
        description: 'Vídeos desorganizados reduzem permanência',
        impact: 'medium',
        solution: 'Criar playlists temáticas para aumentar tempo de visualização'
      }
    ]
  }

  private generateWebsiteProblems(): Problem[] {
    return [
      {
        title: 'Mobile não otimizado',
        description: '60% do tráfego vem de mobile',
        impact: 'high',
        solution: 'Testar e otimizar responsividade completa'
      },
      {
        title: 'Velocidade de carregamento',
        description: 'Sites lentos têm 40% mais abandono',
        impact: 'medium',
        solution: 'Otimizar imagens e scripts'
      }
    ]
  }

  private scoreToGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 85) return 'A'
    if (score >= 70) return 'B'
    if (score >= 55) return 'C'
    if (score >= 40) return 'D'
    return 'F'
  }

  private gradeSentiment(grade: 'A' | 'B' | 'C' | 'D' | 'F'): 'excellent' | 'good' | 'fair' | 'poor' {
    switch (grade) {
      case 'A': return 'excellent'
      case 'B': return 'good'
      case 'C': return 'fair'
      default: return 'poor'
    }
  }

  private generateQuickWin(channel: Channel): string {
    const quickWins: Record<Channel, string> = {
      instagram: 'Criar 5 posts com imagens profissionais esta semana',
      tiktok: 'Publicar um vídeo usando trending sound hoje',
      youtube: 'Otimizar a descrição dos 3 últimos vídeos',
      website: 'Testar velocidade de carregamento no mobile'
    }
    return quickWins[channel]
  }

  private generatePriorities(input: DiagnosticInput): Priority[] {
    const priorities: Priority[] = []

    // Sempre priorizar presença em múltiplos canais
    if (!input.tiktok && input.instagram) {
      priorities.push({
        action: 'Criar conta TikTok e publicar 5 vídeos iniciais',
        priority: 1,
        difficulty: 'easy',
        timeToImplement: '2 horas',
        potentialROI: '+40% alcance em público 18-34',
        channel: 'tiktok'
      })
    }

    if (!input.website) {
      priorities.push({
        action: 'Criar landing page com informações de contato',
        priority: 2,
        difficulty: 'medium',
        timeToImplement: '1 semana',
        potentialROI: '+60% conversão de redes para vendas',
        channel: 'website'
      })
    }

    if (input.instagram) {
      priorities.push({
        action: 'Otimizar bio do Instagram com CTA e link',
        priority: 3,
        difficulty: 'easy',
        timeToImplement: '15 minutos',
        potentialROI: '+25% cliques para website',
        channel: 'instagram'
      })
    }

    priorities.push({
      action: 'Definir calendário de conteúdo por 30 dias',
      priority: 4,
      difficulty: 'medium',
      timeToImplement: '3 horas',
      potentialROI: '+50% consistência e alcance',
      channel: 'instagram'
    })

    priorities.push({
      action: 'Implementar sistema de resposta a comentários',
      priority: 5,
      difficulty: 'easy',
      timeToImplement: '1 hora',
      potentialROI: '+35% engajamento e comunidade',
      channel: 'instagram'
    })

    return priorities.slice(0, 5)
  }

  private generateRecommendation(score: number, input: DiagnosticInput): string {
    if (score >= 80) {
      return `${input.businessName} tem uma presença digital sólida. O foco deve ser em escalabilidade e refinamento da estratégia.`
    } else if (score >= 60) {
      return `${input.businessName} tem presença estabelecida. Melhorar consistência de conteúdo e engajamento pode aumentar resultados.`
    } else if (score >= 40) {
      return `${input.businessName} precisa expandir para múltiplos canais e estruturar uma estratégia de conteúdo clara.`
    } else {
      return `${input.businessName} está nos primeiros passos. Comece com um canal forte e escale gradualmente.`
    }
  }

  private generateNextSteps(input: DiagnosticInput): string[] {
    return [
      'Semana 1: Otimizar perfis existentes (bio, foto, descrição)',
      'Semana 2: Definir 4 pilares de conteúdo do negócio',
      'Semana 3: Publicar consistentemente (2-3x por semana)',
      'Semana 4: Analisar métricas e ajustar estratégia'
    ]
  }

  private generateBusinessContext(input: DiagnosticInput): string {
    const type = input.businessType.toLowerCase()

    if (type.includes('ecommerce')) {
      return 'Para e-commerce, o foco deve ser em conteúdo que dirija tráfego para produtos e usar Instagram Shopping e TikTok Shop. Priorize vídeos de produtos e lives de vendas.'
    } else if (type.includes('serviço')) {
      return 'Para negócios de serviços, construir confiança através de cases e depoimentos é crucial. Destaque resultados de clientes e use vídeos curtos para demonstrar expertise.'
    } else if (type.includes('coaching') || type.includes('educação')) {
      return 'Para coaching e educação, posicione-se como autoridade compartilhando conhecimento. Conteúdo educacional gera engajamento alto e cria comunidade fiel.'
    } else if (type.includes('saúde') || type.includes('bem-estar')) {
      return 'Para saúde e bem-estar, crie conteúdo que agregue valor e eduque seu público. Saiba as restrições legais para publicidade médica na sua rede.'
    } else {
      return `Para um negócio de ${input.businessType}, o foco deve ser em autenticidade e consistência para construir confiança com seu público.`
    }
  }

}

export const diagnosticEngine = new DiagnosticEngine()
