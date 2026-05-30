import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * DIAGNOSTIC MOCK - Retorna diagnóstico estruturado para teste
 * Simula análise real com dados de Augusto Cury
 */
export async function POST() {
  const result = {
    businessName: "Augusto Cury",
    businessType: "coaching",
    overallScore: 82,
    timestamp: new Date().toISOString(),
    channels: {
      instagram: {
        channel: "instagram",
        score: 85,
        grade: "A",
        problems: [
          {
            title: "Bio não otimizada para conversão",
            description: "Bio atual não possui CTA claro que direcione seguidores para website ou link comercial",
            impact: "medium",
            solution: "Reformular bio com proposta clara, CTA direto e link para landing page de ofertas"
          },
          {
            title: "Frequência de posts baixa para algoritmo 2025",
            description: "Publicações 1-2x por semana. Algoritmo do Instagram agora prioriza 3-5x diárias para crescimento",
            impact: "high",
            solution: "Aumentar para 3-5 posts/stories por dia, priorizando Reels (que crescem 40% mais rápido)"
          }
        ],
        quickWin: "Reformular bio com CTA em 15 minutos - resultará em +25% cliques para website"
      },
      tiktok: {
        channel: "tiktok",
        score: 78,
        grade: "B",
        problems: [
          {
            title: "Conteúdo não segue trends da plataforma",
            description: "Videos focam em áudio longo (coaching). TikTok prioriza vídeos curtos com trending sounds",
            impact: "high",
            solution: "Adaptar conteúdo para trending sounds, dubbing, efeitos e transições rápidas (max 30s)"
          },
          {
            title: "Baixa interatividade com audiência",
            description: "Sem duetos, desafios ou engajamento direto com comunidade",
            impact: "medium",
            solution: "Lançar desafios semanais, responder com vídeos de dueto, criar série de tendências"
          }
        ],
        quickWin: "Publicar 1 vídeo com trending sound hoje - potencial +100k views em 7 dias"
      },
      youtube: {
        channel: "youtube",
        score: 0,
        grade: "F",
        problems: [
          {
            title: "Canal não informado",
            description: "Sem presença no YouTube",
            impact: "high",
            solution: "Criar canal e publicar 1 vídeo semanal de conteúdo educacional longo (10-20min)"
          }
        ],
        quickWin: "Criar canal YouTube - leva 5 minutos, com potencial de 100k+ views ao redirecionar audiência"
      },
      website: {
        channel: "website",
        score: 0,
        grade: "F",
        problems: [
          {
            title: "Website não informado",
            description: "Sem landing page própria para capturar leads",
            impact: "high",
            solution: "Criar landing page com formulário de contato + link para agendar consulting"
          }
        ],
        quickWin: "Landing page básica em 2-3 horas pode capturar 50+ leads/mês"
      }
    },
    topPriorities: [
      {
        action: "Reformular bio do Instagram com CTA claro e link para website/agendamento",
        priority: 1,
        difficulty: "easy",
        timeToImplement: "15 minutos",
        potentialROI: "+25% cliques para conversão = +100-200 leads/mês",
        channel: "instagram"
      },
      {
        action: "Criar landing page de captura com formulário de contato/agendamento",
        priority: 2,
        difficulty: "medium",
        timeToImplement: "2-3 horas",
        potentialROI: "+300% ROAS em tráfego social = +50 vendas/mês",
        channel: "website"
      },
      {
        action: "Aumentar frequência Instagram para 5 posts/dia + 10 stories",
        priority: 3,
        difficulty: "medium",
        timeToImplement: "30 minutos/dia (repurposing de TikTok)",
        potentialROI: "+150% alcance, algoritmo favorece conteúdo frequente",
        channel: "instagram"
      },
      {
        action: "Adaptar conteúdo para trending sounds do TikTok (máximo 30s)",
        priority: 4,
        difficulty: "medium",
        timeToImplement: "1-2 horas de produção/dia",
        potentialROI: "+40% engagement rate, potencial viral 100k+views/vídeo",
        channel: "tiktok"
      },
      {
        action: "Criar canal YouTube com série de conteúdo de coaching 10-20min/semana",
        priority: 5,
        difficulty: "hard",
        timeToImplement: "4-6 horas/semana",
        potentialROI: "+200% autoridade, 50k subscribers em 6 meses = +500 clientes qualificados",
        channel: "youtube"
      }
    ],
    recommendation: "Augusto Cury tem presença digital forte em 2 canais (Instagram 8.5M, TikTok 2.3M), mas falta otimização para conversão e estrutura de vendas. Com pequenos ajustes de frequência e direcionamento, é possível 3-5x revenue dos canais atuais.",
    nextSteps: [
      "Semana 1: Reformular bio Instagram + criar landing page",
      "Semana 2: Aumentar frequência Instagram para 5x/dia + começar TikTok com trending sounds",
      "Semana 3: Lançar série de conteúdo + desafios de engajamento",
      "Semana 4: Análise de resultados + escalar o que funciona"
    ],
    businessTypeContext: "Para coaching, conteúdo é autoridade. O desafio não é gerar presença (Augusto já tem), é converter audiência em clientes. Foco deve ser em funnel: audiência → contato → venda. Landing page e CTA claros são críticos."
  }

  return NextResponse.json(result, {
    status: 200,
    headers: { 'Cache-Control': 'no-store' }
  })
}
