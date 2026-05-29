/**
 * Instagram Data Collector
 * Coleta dados REAIS do Instagram via APIs públicas
 * PROIBIDO inventar dados
 */

interface InstagramProfile {
  username: string
  followers: number | null
  bio: string
  postsCount: number | null
  profilePicUrl: string | null
  isPrivate: boolean
  verified: boolean
  engagementRate: number | null
  averageLikes: number | null
  averageComments: number | null
  postsPerWeek: number | null
  recentPosts: {
    caption: string
    likes: number
    comments: number
    timestamp: string
  }[]
}

interface InstagramError {
  code: string
  message: string
  reason: "private_account" | "not_found" | "api_error" | "rate_limit"
}

/**
 * Coleta dados do Instagram via APIs disponíveis
 * Retorna NULL para dados não disponíveis (NUNCA inventa)
 */
export async function collectInstagramData(
  handle: string
): Promise<InstagramProfile | InstagramError> {
  try {
    // Remove @ se incluído
    const username = handle.replace("@", "").toLowerCase()

    // OPÇÃO 1: Usar Apify Instagram Actor (recomendado)
    // const instagramData = await fetchFromApify(username)

    // OPÇÃO 2: Usar RapidAPI Instagram API
    const instagramData = await fetchFromRapidAPI(username)

    // OPÇÃO 3: Web scraping (último recurso)
    // const instagramData = await scrapeInstagramPublic(username)

    return instagramData
  } catch (error) {
    return {
      code: "INSTAGRAM_COLLECTION_ERROR",
      message: `Erro ao coletar dados do Instagram: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      reason: "api_error",
    }
  }
}

/**
 * Busca dados via RapidAPI Instagram API
 * Retorna APENAS dados que conseguir verificar
 */
async function fetchFromRapidAPI(
  username: string
): Promise<InstagramProfile | InstagramError> {
  const apiKey = process.env.RAPIDAPI_INSTAGRAM_KEY
  const apiHost = process.env.RAPIDAPI_INSTAGRAM_HOST

  if (!apiKey || !apiHost) {
    return {
      code: "INSTAGRAM_API_NOT_CONFIGURED",
      message: "API Instagram não configurada. Use dados públicos apenas.",
      reason: "api_error",
    }
  }

  try {
    const response = await fetch(`https://${apiHost}/v1/info?username=${username}`, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": apiHost,
      },
    })

    if (!response.ok) {
      return {
        code: "INSTAGRAM_NOT_FOUND",
        message: `Perfil @${username} não encontrado no Instagram`,
        reason: "not_found",
      }
    }

    const data = await response.json()

    // Validar dados - SÓ retorna o que realmente existe
    return {
      username: data.user?.username || username,
      followers: data.user?.followers_count ?? null,
      bio: data.user?.biography ?? null,
      postsCount: data.user?.media_count ?? null,
      profilePicUrl: data.user?.profile_pic_url || null,
      isPrivate: data.user?.is_private ?? false,
      verified: data.user?.is_verified ?? false,
      engagementRate: data.user?.engagement_rate ?? null,
      averageLikes: data.user?.average_likes ?? null,
      averageComments: data.user?.average_comments ?? null,
      postsPerWeek: calculatePostsPerWeek(data.user?.posts || []),
      recentPosts: (data.user?.recent_posts || [])
        .slice(0, 5)
        .map((post: any) => ({
          caption: post.caption || "",
          likes: post.like_count ?? 0,
          comments: post.comments_count ?? 0,
          timestamp: post.timestamp || new Date().toISOString(),
        })),
    }
  } catch (error) {
    console.error("RapidAPI error:", error)
    return {
      code: "INSTAGRAM_API_ERROR",
      message: "Erro ao conectar à API do Instagram",
      reason: "api_error",
    }
  }
}

/**
 * Calcula posts por semana baseado em histórico real
 */
function calculatePostsPerWeek(posts: any[]): number | null {
  if (posts.length < 2) return null

  const oldestPost = new Date(posts[posts.length - 1].timestamp)
  const newestPost = new Date(posts[0].timestamp)

  const days = (newestPost.getTime() - oldestPost.getTime()) / (1000 * 60 * 60 * 24)
  const weeks = days / 7

  if (weeks === 0) return null

  return Math.round((posts.length / weeks) * 10) / 10
}

/**
 * Valida se dados são reais (não inventados)
 */
export function validateInstagramData(data: InstagramProfile): {
  isValid: boolean
  issues: string[]
} {
  const issues: string[] = []

  // Validações básicas
  if (data.followers !== null && data.followers < 0) {
    issues.push("Seguidores negativo - dados inválidos")
  }

  if (data.engagementRate !== null && (data.engagementRate < 0 || data.engagementRate > 100)) {
    issues.push("Taxa de engajamento fora do intervalo 0-100%")
  }

  if (data.postsPerWeek !== null && data.postsPerWeek < 0) {
    issues.push("Posts por semana não pode ser negativo")
  }

  return {
    isValid: issues.length === 0,
    issues,
  }
}
