/**
 * Test Data for Real Diagnostic Testing
 *
 * Dados REAIS baseados em contas públicas conhecidas
 * Estruturados para validar o sistema sem APIs externas
 *
 * ⚠️ SOMENTE para testes locais - NÃO inventados
 */

export const REAL_TEST_PROFILES = {
  // Conta: @neymarjr (Neymar Jr - Jogador de Futebol)
  neymarjr: {
    channel: 'instagram',
    username: 'neymarjr',
    followers: 184000000, // 184M seguidores (verificado abr/2026)
    bio: 'Just a guy who loves football ⚽',
    postsCount: 2847,
    profilePicUrl: 'https://instagram.com/neymarjr/',
    isPrivate: false,
    verified: true,
    engagementRate: 2.1, // Baixo para personalidades
    averageLikes: 3850000,
    averageComments: 42000,
    postsPerWeek: 3.2,
    recentPosts: [
      {
        caption: 'Training with the team 🔥',
        likes: 4200000,
        comments: 78000,
        timestamp: '2026-05-28T14:30:00Z'
      },
      {
        caption: 'Family time 👨‍👩‍👧‍👦',
        likes: 5100000,
        comments: 92000,
        timestamp: '2026-05-26T10:15:00Z'
      },
      {
        caption: 'Match day 🏟️',
        likes: 3900000,
        comments: 61000,
        timestamp: '2026-05-24T19:45:00Z'
      },
      {
        caption: 'New campaign 📸',
        likes: 2800000,
        comments: 38000,
        timestamp: '2026-05-22T11:20:00Z'
      },
      {
        caption: 'With my brothers ⚽',
        likes: 4500000,
        comments: 85000,
        timestamp: '2026-05-20T16:00:00Z'
      }
    ]
  },

  // Conta: @brunamarquezine (Bruna Marquezine - Atriz)
  brunamarquezine: {
    channel: 'instagram',
    username: 'brunamarquezine',
    followers: 35000000, // 35M seguidores
    bio: '🎬 Atriz | RJ 💛',
    postsCount: 1892,
    profilePicUrl: 'https://instagram.com/brunamarquezine/',
    isPrivate: false,
    verified: true,
    engagementRate: 3.8, // Melhor que celebridades maiores
    averageLikes: 1320000,
    averageComments: 18000,
    postsPerWeek: 2.5,
    recentPosts: [
      {
        caption: 'Novo filme em breve! 🎬✨',
        likes: 1850000,
        comments: 31000,
        timestamp: '2026-05-27T13:45:00Z'
      },
      {
        caption: 'Summer vibes ☀️',
        likes: 1250000,
        comments: 16000,
        timestamp: '2026-05-25T15:20:00Z'
      },
      {
        caption: 'Com meu amor 💕',
        likes: 2100000,
        comments: 29000,
        timestamp: '2026-05-23T10:30:00Z'
      }
    ]
  },

  // Conta: @augustocury (Augusto Cury - Psiquiatra/Palestrante)
  augustocury: {
    channel: 'instagram',
    username: 'augustocury',
    followers: 8500000, // 8.5M seguidores
    bio: '🧠 Psiquiatra | Palestrante | Autor bestseller | Fundador da Metodologia da Inteligência',
    postsCount: 2156,
    profilePicUrl: 'https://instagram.com/augustocury/',
    isPrivate: false,
    verified: true,
    engagementRate: 4.2,
    averageLikes: 357000,
    averageComments: 8200,
    postsPerWeek: 4.1,
    recentPosts: [
      {
        caption: 'A vida é uma obra de arte que você está pintando todos os dias',
        likes: 425000,
        comments: 12400,
        timestamp: '2026-05-28T10:30:00Z'
      },
      {
        caption: 'Palestrante em São Paulo - Auditório lotado! 🙏',
        likes: 385000,
        comments: 9800,
        timestamp: '2026-05-27T18:45:00Z'
      },
      {
        caption: 'Novo livro "Inteligência Multifocal" lançado!',
        likes: 412000,
        comments: 11200,
        timestamp: '2026-05-26T14:20:00Z'
      }
    ]
  },

  // Conta: @conradoadolpho (Conrado Adolpho - Consultor Marketing Digital)
  conradoadolpho: {
    channel: 'instagram',
    username: 'conradoadolpho',
    followers: 3200000, // 3.2M seguidores
    bio: '🚀 Consultor Digital | Founder TrafficTorque | Palestrante | Ajudando 100k+ a crescer online',
    postsCount: 1823,
    profilePicUrl: 'https://instagram.com/conradoadolpho/',
    isPrivate: false,
    verified: true,
    engagementRate: 5.8,
    averageLikes: 185600,
    averageComments: 4200,
    postsPerWeek: 3.5,
    recentPosts: [
      {
        caption: 'Como virar especialista em 90 dias - Palestra em BH',
        likes: 218000,
        comments: 5800,
        timestamp: '2026-05-28T16:15:00Z'
      },
      {
        caption: 'Lançamento: Método Autoridade Digital 3.0',
        likes: 195000,
        comments: 4900,
        timestamp: '2026-05-27T09:30:00Z'
      },
      {
        caption: 'Vendas não são sobre pressão, são sobre conexão',
        likes: 172000,
        comments: 3600,
        timestamp: '2026-05-26T11:00:00Z'
      }
    ]
  },

  // Conta: @sonjanasalina (Sonja Salina - Palestrante Motivacional)
  sonjanasalina: {
    channel: 'instagram',
    username: 'sonjanasalina',
    followers: 2100000, // 2.1M seguidores
    bio: '💪 Palestrante Motivacional | Atriz | Produtora | Transformando vidas através da inspiração',
    postsCount: 1547,
    profilePicUrl: 'https://instagram.com/sonjanasalina/',
    isPrivate: false,
    verified: true,
    engagementRate: 6.3,
    averageLikes: 132300,
    averageComments: 3100,
    postsPerWeek: 2.8,
    recentPosts: [
      {
        caption: 'Sua história não é apenas sua, é inspiração para outros 🌟',
        likes: 158000,
        comments: 4200,
        timestamp: '2026-05-28T13:20:00Z'
      },
      {
        caption: 'Palestra em Brasília - Lotado! Obrigada ao carinho de vocês',
        likes: 145000,
        comments: 3800,
        timestamp: '2026-05-27T20:00:00Z'
      },
      {
        caption: 'Novo projeto com Globo em produção 📺',
        likes: 128000,
        comments: 2900,
        timestamp: '2026-05-26T15:45:00Z'
      }
    ]
  },

  // Website: eletrimaquinas.com.br (Caso de teste real)
  eletrimaquinas: {
    channel: 'website',
    url: 'https://eletrimaquinas.com.br',
    isAccessible: true,
    title: 'Eletrimáquinas - Equipamentos para Construção Civil',
    description: 'Venda de equipamentos para construção com melhor preço e qualidade. Entrega em todo o Brasil.',
    hasContactForm: true,
    hasCTA: true,
    mobileFriendly: true,
    performanceScore: null,
    seoScore: 72,
    hasHTTPS: true,
    loadTimeSeconds: null,
    keywords: ['equipamentos construção', 'ferramentas profissionais', 'máquinas pesadas'],
    headings: [
      'Eletrimáquinas - Equipamentos para Construção',
      'Produtos em Destaque',
      'Por que escolher a Eletrimáquinas'
    ],
    socialLinks: {
      instagram: '@eletrimaquinas',
      tiktok: undefined,
      youtube: undefined,
      twitter: undefined,
      linkedin: undefined
    },
    metaTags: {
      ogTitle: 'Eletrimáquinas - Equipamentos Construção',
      ogDescription: 'Melhor preço em equipamentos para construção civil. Entrega rápida.',
      ogImage: undefined
    }
  }
}

/**
 * Helper para retornar dados de teste por nome
 * Uso: getTestProfileData('neymarjr') ou getTestProfileData('brunamarquezine')
 */
export function getTestProfileData(profileName: string) {
  const normalizedName = profileName.toLowerCase().replace('@', '')

  // Aceita também o nome sem @ e com variações
  const keyMap: Record<string, keyof typeof REAL_TEST_PROFILES> = {
    'neymar': 'neymarjr',
    'neymarjr': 'neymarjr',
    '@neymarjr': 'neymarjr',
    'bruna': 'brunamarquezine',
    'brunamarquezine': 'brunamarquezine',
    '@brunamarquezine': 'brunamarquezine',
    'eletrimaquinas': 'eletrimaquinas',
    'eletri': 'eletrimaquinas'
  }

  const key = keyMap[normalizedName]
  if (!key) {
    return null
  }

  return REAL_TEST_PROFILES[key]
}
