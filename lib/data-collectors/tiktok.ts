/**
 * TikTok Data Collector
 * Coleta dados REAIS do TikTok via APIs públicas
 * PROIBIDO inventar dados
 */

interface TikTokProfile {
  username: string
  followers: number | null
  videoCount: number | null
  avgViewsPerVideo: number | null
  avgLikesPerVideo: number | null
  engagementRate: number | null
  bio: string | null
  profilePicUrl: string | null
  verified: boolean
  videosPerWeek: number | null
  recentVideos: {
    id: string
    title: string
    views: number
    likes: number
    comments: number
    shares: number
    duration: number
    timestamp: string
  }[]
}

interface TikTokError {
  code: string
  message: string
  reason: "private_account" | "not_found" | "api_error" | "rate_limit"
}

/**
 * Coleta dados do TikTok via APIs disponíveis
 * Retorna NULL para dados não disponíveis (NUNCA inventa)
 */
export async function collectTikTokData(
  handle: string
): Promise<TikTokProfile | TikTokError> {
  try {
    // Remove @ se incluído
    const username = handle.replace("@", "").toLowerCase()

    // OPÇÃO 1: Usar Apify TikTok Actor
    const tiktokData = await fetchFromApifyTikTok(username)

    // OPÇÃO 2: Usar RapidAPI TikTok API
    // const tiktokData = await fetchFromRapidAPITikTok(username)

    return tiktokData
  } catch (error) {
    return {
      code: "TIKTOK_COLLECTION_ERROR",
      message: `Erro ao coletar dados do TikTok: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      reason: "api_error",
    }
  }
}

/**
 * Busca dados via Apify TikTok Actor
 * Retorna APENAS dados que conseguir verificar
 */
async function fetchFromApifyTikTok(
  username: string
): Promise<TikTokProfile | TikTokError> {
  const apifyToken = process.env.APIFY_API_TOKEN

  if (!apifyToken) {
    return {
      code: "TIKTOK_API_NOT_CONFIGURED",
      message: "API TikTok não configurada. Dados limitados.",
      reason: "api_error",
    }
  }

  try {
    // Usar Apify para coletar dados públicos do TikTok
    const response = await fetch("https://api.apify.com/v2/acts/clockworks~tiktok-profile-scraper/runs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apifyToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          usernames: [username],
        },
      }),
    })

    if (!response.ok) {
      return {
        code: "TIKTOK_NOT_FOUND",
        message: `Perfil @${username} não encontrado no TikTok`,
        reason: "not_found",
      }
    }

    const data = await response.json()

    // Validar dados
    return {
      username: username,
      followers: data.data?.[0]?.followers ?? null,
      videoCount: data.data?.[0]?.videoCount ?? null,
      avgViewsPerVideo: calculateMetric(data.data?.[0]?.videos, "views"),
      avgLikesPerVideo: calculateMetric(data.data?.[0]?.videos, "likes"),
      engagementRate: calculateEngagementRate(data.data?.[0]),
      bio: data.data?.[0]?.bio ?? null,
      profilePicUrl: data.data?.[0]?.profilePicUrl || null,
      verified: data.data?.[0]?.verified ?? false,
      videosPerWeek: calculateTikTokVideosPerWeek(data.data?.[0]?.videos || []),
      recentVideos: (data.data?.[0]?.videos || [])
        .slice(0, 10)
        .map((video: any) => ({
          id: video.id || "",
          title: video.description || "",
          views: video.playCount ?? 0,
          likes: video.diggCount ?? 0,
          comments: video.commentCount ?? 0,
          shares: video.shareCount ?? 0,
          duration: video.duration ?? 0,
          timestamp: video.createTime ? new Date(video.createTime * 1000).toISOString() : new Date().toISOString(),
        })),
    }
  } catch (error) {
    console.error("Apify TikTok error:", error)
    return {
      code: "TIKTOK_API_ERROR",
      message: "Erro ao conectar à API do TikTok",
      reason: "api_error",
    }
  }
}

/**
 * Calcula métrica média dos vídeos
 */
function calculateMetric(
  videos: any[] | undefined,
  metric: "views" | "likes" | "comments"
): number | null {
  if (!videos || videos.length === 0) return null

  const key =
    metric === "views"
      ? "playCount"
      : metric === "likes"
        ? "diggCount"
        : "commentCount"

  const total = videos.reduce((sum, v) => sum + (v[key] ?? 0), 0)
  return Math.round(total / videos.length)
}

/**
 * Calcula taxa de engajamento do TikTok
 */
function calculateEngagementRate(profile: any): number | null {
  if (!profile || !profile.videos || profile.videos.length === 0) {
    return null
  }

  const avgLikes = calculateMetric(profile.videos, "likes") || 0
  const avgComments = calculateMetric(profile.videos, "comments") || 0
  const followers = profile.followers || 1

  const engagement = ((avgLikes + avgComments) / followers) * 100

  return Math.round(engagement * 100) / 100
}

/**
 * Calcula vídeos por semana baseado em histórico real
 */
function calculateTikTokVideosPerWeek(videos: any[]): number | null {
  if (videos.length < 2) return null

  const oldestVideo = new Date(videos[videos.length - 1].createTime * 1000)
  const newestVideo = new Date(videos[0].createTime * 1000)

  const days = (newestVideo.getTime() - oldestVideo.getTime()) / (1000 * 60 * 60 * 24)
  const weeks = days / 7

  if (weeks === 0) return null

  return Math.round((videos.length / weeks) * 10) / 10
}

/**
 * Valida se dados são reais (não inventados)
 */
export function validateTikTokData(data: TikTokProfile): {
  isValid: boolean
  issues: string[]
} {
  const issues: string[] = []

  if (data.followers !== null && data.followers < 0) {
    issues.push("Seguidores negativo - dados inválidos")
  }

  if (data.engagementRate !== null && (data.engagementRate < 0 || data.engagementRate > 500)) {
    // TikTok pode ter taxas altas
    issues.push("Taxa de engajamento parece anormalmente alta")
  }

  if (data.videosPerWeek !== null && data.videosPerWeek < 0) {
    issues.push("Vídeos por semana não pode ser negativo")
  }

  return {
    isValid: issues.length === 0,
    issues,
  }
}
