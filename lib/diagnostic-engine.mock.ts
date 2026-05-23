/**
 * Mock Diagnostic Engine for Development/Testing
 * Simulates Claude AI responses without requiring actual API calls
 */

import { DiagnosticInput, DiagnosticResult, ChannelScore, Channel } from './diagnostic-engine'

class MockDiagnosticEngine {
  async analyze(input: DiagnosticInput): Promise<DiagnosticResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const channels: Record<Channel, ChannelScore> = {
      instagram: this.generateChannelScore('instagram', input.instagram),
      tiktok: this.generateChannelScore('tiktok', input.tiktok),
      youtube: this.generateChannelScore('youtube', input.youtube),
      website: this.generateChannelScore('website', input.website)
    }

    const overallScore = Math.round(
      (channels.instagram.score + channels.tiktok.score + channels.youtube.score + channels.website.score) / 4
    )

    return {
      businessName: input.businessName,
      overallScore,
      timestamp: new Date().toISOString(),
      channels,
      topPriorities: [
        `Otimizar perfil no ${input.instagram ? 'Instagram' : 'TikTok'} com descrição clara e call-to-action`,
        'Implementar estratégia de conteúdo consistente (3x por semana mínimo)',
        'Aumentar engajamento respondendo comentários em até 24h',
        'Utilizar reels/vídeos curtos (tendência de algoritmo em 2024)'
      ],
      recommendation: `Sua presença digital está ${overallScore >= 70 ? 'em bom caminho' : overallScore >= 50 ? 'regular' : 'crítica'}. Foco deve ser em criar conteúdo autêntico que conecte com seu público-alvo.`,
      nextSteps: [
        'Definir 3 temas principais para seu conteúdo',
        'Criar calendário de postagens para próximas 4 semanas',
        'Analisar dados de seguidores que convertem em clientes'
      ]
    }
  }

  private generateChannelScore(channel: Channel, handle: string | undefined): ChannelScore {
    const hasChannel = !!handle
    const score = hasChannel ? Math.random() * 40 + 50 : 30
    const grade = score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F'

    const quickWins: Record<Channel, string> = {
      instagram: 'Publique uma story com call-to-action (link clicável) para seus produtos',
      tiktok: 'Crie um desafio ou trend relacionado ao seu nicho',
      youtube: 'Faça um video shorts (sob 60s) com dica rápida do seu setor',
      website: 'Adicione um formulário de contato na página inicial'
    }

    const problems: Record<Channel, string[]> = {
      instagram: [
        'Bio não tem call-to-action claro',
        'Posts antigos (última postagem há mais de 2 semanas)',
        'Falta conteúdo diverso (reels, stories, carrosel)'
      ],
      tiktok: [
        'Conta ainda não ativada',
        'Sem estratégia de hashtags trendy',
        'Nenhum vídeo com mais de 1000 views'
      ],
      youtube: [
        'Canal com poucas inscrições',
        'Falta de playlists organizadas',
        'Descrições e titles não otimizadas para SEO'
      ],
      website: [
        'Website não está otimizado para mobile',
        'Falta de formulário de contato',
        'Sem integração com redes sociais'
      ]
    }

    return {
      channel,
      score: Math.round(score),
      grade,
      problems: hasChannel ? problems[channel] : ['Canal não configurado'],
      quickWin: quickWins[channel],
      sentiment: grade === 'A' ? 'excellent' : grade === 'B' ? 'good' : grade === 'C' ? 'fair' : 'poor'
    }
  }
}

export const mockDiagnosticEngine = new MockDiagnosticEngine()
