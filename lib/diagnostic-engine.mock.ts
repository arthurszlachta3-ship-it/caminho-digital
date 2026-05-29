/**
 * Mock Diagnostic Engine for Development/Testing
 * Simulates Claude AI responses without requiring actual API calls
 */

import { DiagnosticInput, DiagnosticResult, ChannelScore, Channel, Problem, Priority } from './diagnostic-engine'

class MockDiagnosticEngine {
  async analyze(input: DiagnosticInput): Promise<DiagnosticResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const channels: Record<Channel, ChannelScore> = {
      instagram: this.generateChannelScore('instagram', input.instagram, input.businessType),
      tiktok: this.generateChannelScore('tiktok', input.tiktok, input.businessType),
      youtube: this.generateChannelScore('youtube', input.youtube, input.businessType),
      website: this.generateChannelScore('website', input.website, input.businessType)
    }

    const overallScore = Math.round(
      (channels.instagram.score + channels.tiktok.score + channels.youtube.score + channels.website.score) / 4
    )

    return {
      businessName: input.businessName,
      businessType: input.businessType,
      overallScore,
      timestamp: new Date().toISOString(),
      channels,
      topPriorities: this.generatePriorities(input.businessType),
      recommendation: this.generateRecommendation(overallScore, input.businessType),
      nextSteps: [
        'Semana 1: Definir 3 temas principais para seu conteúdo',
        'Semana 2: Criar calendário de postagens para próximas 4 semanas',
        'Semana 3: Analisar dados de seguidores que convertem em clientes'
      ],
      businessTypeContext: this.generateBusinessTypeContext(input.businessType)
    }
  }

  private generateChannelScore(channel: Channel, handle: string | undefined, _businessType: string): ChannelScore {
    const hasChannel = !!handle
    const score = hasChannel ? Math.random() * 40 + 50 : 30
    const grade = score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F'

    const quickWins: Record<Channel, string> = {
      instagram: 'Publique uma story com call-to-action (link clicável) para seus produtos',
      tiktok: 'Crie um desafio ou trend relacionado ao seu nicho',
      youtube: 'Faça um vídeo curto (shorts/reels) com dica rápida do seu setor',
      website: 'Adicione um formulário de contato na página inicial'
    }

    const problemsData: Record<Channel, Problem[]> = {
      instagram: [
        {
          title: 'Bio não tem call-to-action claro',
          description: 'Sua bio não direciona visitantes para a ação desejada (compra, agendamento, etc)',
          impact: 'high',
          solution: 'Reescreva a bio com: valor único + call-to-action + link direto'
        },
        {
          title: 'Posts antigos (última postagem há 2+ semanas)',
          description: 'O algoritmo penaliza contas inativas; seguidores perdem interesse',
          impact: 'high',
          solution: 'Publique no mínimo 3x por semana; use ferramenta de agendamento'
        },
        {
          title: 'Falta conteúdo diverso (reels, stories, carrosel)',
          description: 'O algoritmo prioriza reels; conteúdo diverso aumenta engajamento',
          impact: 'medium',
          solution: 'Reserve 50% dos posts para reels de 15-30s; use histórias daily'
        }
      ],
      tiktok: [
        {
          title: 'Conta ainda não ativada',
          description: 'Sem presença no TikTok, você deixa de alcançar 60% da sua audiência potencial',
          impact: 'high',
          solution: 'Crie conta e publique 5-10 vídeos antes de abandonar'
        },
        {
          title: 'Sem estratégia de hashtags trendy',
          description: 'Hashtags wrong reduzem alcance; trending tags aumentam visibilidade',
          impact: 'medium',
          solution: 'Use 3-5 hashtags trending + 3-5 de nicho em cada vídeo'
        },
        {
          title: 'Vídeos com baixíssimas views (<100)',
          description: 'Baixas views indicam conteúdo não alinhado com audiência ou qualidade ruim',
          impact: 'high',
          solution: 'Analise vídeos top; replique formato/estrutura; invista em hook nos primeiros 1s'
        }
      ],
      youtube: [
        {
          title: 'Canal com poucas inscrições',
          description: 'Canal inativo ou com estratégia fraca; potencial desperdiçado',
          impact: 'high',
          solution: 'Publique series temática (ex: "Dicas de Terça"); otimize thumbnails'
        },
        {
          title: 'Falta de playlists organizadas',
          description: 'Playlists aumentam tempo na plataforma e retorno de usuários',
          impact: 'medium',
          solution: 'Crie 3-4 playlists de temas principais; organize vídeos'
        },
        {
          title: 'Descrições e títulos não otimizados para SEO',
          description: 'Títulos genéricos e descrições vazias reduzem descoberta via busca',
          impact: 'medium',
          solution: 'Incluir keywords principais em título + descrição; add links relevantes'
        }
      ],
      website: [
        {
          title: 'Website não otimizado para mobile',
          description: '60% do tráfego é mobile; site lento ou confuso perde clientes',
          impact: 'high',
          solution: 'Teste responsividade; melhore velocidade de carregamento (PageSpeed)'
        },
        {
          title: 'Falta de formulário de contato',
          description: 'Sem formulário, visitantes interessados não conseguem entrar em contato',
          impact: 'high',
          solution: 'Adicione formulário com: nome, email, telefone, mensagem'
        },
        {
          title: 'Sem integração com redes sociais',
          description: 'Visitantes não conseguem seguir você; perdem oportunidade de retargeting',
          impact: 'medium',
          solution: 'Adicione botões de seguir; links para Instagram, TikTok, YouTube'
        }
      ]
    }

    return {
      channel,
      score: Math.round(score),
      grade,
      problems: hasChannel ? problemsData[channel] : [
        {
          title: 'Canal não configurado',
          description: 'Sem presença neste canal, você não alcança este público',
          impact: 'high',
          solution: 'Crie uma conta e publique conteúdo relevante'
        }
      ],
      quickWin: quickWins[channel],
      sentiment: grade === 'A' ? 'excellent' : grade === 'B' ? 'good' : grade === 'C' ? 'fair' : 'poor'
    }
  }

  private generatePriorities(_businessType: string): Priority[] {
    const baseePriorities: Priority[] = [
      {
        action: 'Otimizar bio com call-to-action claro e link direto para conversão',
        priority: 1,
        difficulty: 'easy',
        timeToImplement: '15 minutos',
        potentialROI: '+25-30% cliques no link',
        channel: 'instagram'
      },
      {
        action: 'Criar e publicar 5 reels/vídeos curtos (15-30s) com conteúdo educativo',
        priority: 2,
        difficulty: 'medium',
        timeToImplement: '2-4 horas',
        potentialROI: '+50% engajamento',
        channel: 'instagram'
      },
      {
        action: 'Implementar calendário de conteúdo (3-5 posts/semana)',
        priority: 3,
        difficulty: 'medium',
        timeToImplement: '3-4 horas',
        potentialROI: '+40% consistência e crescimento',
        channel: undefined
      },
      {
        action: 'Responder comentários em até 24h para aumentar engajamento',
        priority: 4,
        difficulty: 'easy',
        timeToImplement: '30 minutos/dia',
        potentialROI: '+35% taxa de resposta do algoritmo',
        channel: undefined
      },
      {
        action: 'Adicionar formulário de contato no website',
        priority: 5,
        difficulty: 'easy',
        timeToImplement: '1 hora',
        potentialROI: '+60% de contatos gerados',
        channel: 'website'
      },
      {
        action: 'Otimizar website para mobile (testar responsividade e velocidade)',
        priority: 6,
        difficulty: 'medium',
        timeToImplement: '2-3 horas',
        potentialROI: '+40% redução de bounce rate',
        channel: 'website'
      },
      {
        action: 'Criar 5-10 vídeos para TikTok seguindo formato de nicho trending',
        priority: 7,
        difficulty: 'hard',
        timeToImplement: '1 semana',
        potentialROI: '+200% novo alcance (TikTok virality)',
        channel: 'tiktok'
      }
    ]

    return baseePriorities
  }

  private generateRecommendation(score: number, businessType: string): string {
    const scoreLevel = score >= 70 ? 'em bom caminho' : score >= 50 ? 'regular, com potencial' : 'crítica, precisa de ação urgente'
    return `Sua presença digital está ${scoreLevel}. Para ${businessType}s, o foco deve ser em criar conteúdo autêntico que conecte com seu público-alvo e gere conversões.`
  }

  private generateBusinessTypeContext(businessType: string): string {
    const contexts: Record<string, string> = {
      ecommerce: 'Para e-commerce, a prioridade é direcionar tráfego para produtos e aumentar conversão. Use reels com produtos em ação, depoimentos de clientes, e call-to-action para compra.',
      servicos: 'Para serviços, construa autoridade através de conteúdo educativo. Mostre antes/depois, case studies, e depoimentos. Foco em gerar leads qualificados.',
      saas: 'Para SaaS, educação é chave. Crie tutoriais, comparações, e webinars. Use LinkedIn para B2B e TikTok/Instagram para B2C. Foco em demonstração de valor.',
      bloguista: 'Como bloguista, conteúdo long-form é sua moeda. Repurpose em short-form (reels, TikToks). Monetize através de afiliados, cursos e publicidade.',
      agencia: 'Para agências, case studies e resultados de clientes são cruciais. Mostre transformações, ROI alcançado, e use sociais para thought leadership.'
    }

    return contexts[businessType.toLowerCase()] || 'Sua estratégia digital deve ser alinhada com seus objetivos de negócio e tipo de público.'
  }
}

export const mockDiagnosticEngine = new MockDiagnosticEngine()
