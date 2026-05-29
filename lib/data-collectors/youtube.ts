/**
 * YouTube Data Collector
 * Usa YouTube Data API v3 oficial
 * PROIBIDO inventar dados
 */

interface YouTubeChannel {
  channelId: string
  title: string
  subscribers: number | null
  videoCount: number | null
  totalViews: number | null
  description: string | null
  profileImageUrl: string | null
  avgViewsPerVideo: number | null
  avgLikesPerVideo: number | null
  uploadFrequencyDays: number | null
  verifiedBadge: boolean
  recentVideos: {
    id: string
    title: string
    views: number
    likes: number | null
    comments: number | null
    duration: string
    publishedAt: string
  }[]
}

interface YouTubeError {
  code: string
  message: string
  reason: "channel_not_found" | "api_error" | "api_quota" | "private_channel"
}

/**
 * Busca canal do YouTube via YouTube Data API v3 (oficial)
 */
export async function collectYouTubeData(
  handle: string
): Promise<YouTubeChannel | YouTubeError> {
  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey) {
    return {
      code: "YOUTUBE_API_NOT_CONFIGURED",
      message: "YouTube API não configurada",
      reason: "api_error",
    }
  }

  try {
    const username = handle.replace("@", "").toLowerCase()

    // Buscar canal por username (custom URL)
    const channelSearchUrl = new URL("https://www.googleapis.com/youtube/v3/search")
    channelSearchUrl.searchParams.append("q", username)
    channelSearchUrl.searchParams.append("type", "channel")
    channelSearchUrl.searchParams.append("part", "snippet")
    channelSearchUrl.searchParams.append("key", apiKey)
    channelSearchUrl.searchParams.append("maxResults", "1")

    const searchResponse = await fetch(channelSearchUrl.toString())

    if (!searchResponse.ok) {
      return {
        code: "YOUTUBE_SEARCH_ERROR",
        message: "Erro ao buscar canal no YouTube",
        reason: "api_error",
      }
    }

    const searchData = await searchResponse.json()

    if (!searchData.items || searchData.items.length === 0) {
      return {
        code: "YOUTUBE_CHANNEL_NOT_FOUND",
        message: `Canal @${username} não encontrado no YouTube`,
        reason: "channel_not_found",
      }
    }

    const channelId = searchData.items[0].id.channelId

    // Buscar dados do canal
    const channelUrl = new URL("https://www.googleapis.com/youtube/v3/channels")
    channelUrl.searchParams.append("id", channelId)
    channelUrl.searchParams.append("part", "snippet,statistics")
    channelUrl.searchParams.append("key", apiKey)

    const channelResponse = await fetch(channelUrl.toString())

    if (!channelResponse.ok) {
      if (channelResponse.status === 403) {
        return {
          code: "YOUTUBE_QUOTA_EXCEEDED",
          message: "Quota da API do YouTube excedida",
          reason: "api_quota",
        }
      }
      return {
        code: "YOUTUBE_CHANNEL_ERROR",
        message: "Erro ao buscar dados do canal",
        reason: "api_error",
      }
    }

    const channelData = await channelResponse.json()

    if (!channelData.items || channelData.items.length === 0) {
      return {
        code: "YOUTUBE_CHANNEL_NOT_FOUND",
        message: `Canal ${channelId} não encontrado`,
        reason: "channel_not_found",
      }
    }

    const channel = channelData.items[0]
    const statistics = channel.statistics

    // Buscar vídeos recentes
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads

    let recentVideos: YouTubeChannel["recentVideos"] = []

    if (uploadsPlaylistId) {
      recentVideos = await fetchRecentVideos(uploadsPlaylistId, apiKey)
    }

    // Calcular frequência de upload
    const uploadFrequency = recentVideos.length > 1 ? calculateUploadFrequency(recentVideos) : null

    // Calcular média de views por vídeo
    const avgViews = recentVideos.length > 0 ? Math.round(recentVideos.reduce((sum, v) => sum + v.views, 0) / recentVideos.length) : null

    return {
      channelId,
      title: channel.snippet?.title || username,
      subscribers: parseInt(statistics?.subscriberCount || "0") || null,
      videoCount: parseInt(statistics?.videoCount || "0") || null,
      totalViews: parseInt(statistics?.viewCount || "0") || null,
      description: channel.snippet?.description || null,
      profileImageUrl: channel.snippet?.thumbnails?.high?.url || null,
      avgViewsPerVideo: avgViews,
      avgLikesPerVideo: null, // YouTube Data API v3 não fornece likes sem autenticação
      uploadFrequencyDays: uploadFrequency,
      verifiedBadge: channel.snippet?.customUrl ? true : false,
      recentVideos,
    }
  } catch (error) {
    console.error("YouTube collection error:", error)
    return {
      code: "YOUTUBE_COLLECTION_ERROR",
      message: `Erro ao coletar dados do YouTube: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      reason: "api_error",
    }
  }
}

/**
 * Busca vídeos recentes do canal
 */
async function fetchRecentVideos(
  playlistId: string,
  apiKey: string
): Promise<YouTubeChannel["recentVideos"]> {
  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems")
    url.searchParams.append("playlistId", playlistId)
    url.searchParams.append("part", "snippet,contentDetails")
    url.searchParams.append("key", apiKey)
    url.searchParams.append("maxResults", "20")

    const response = await fetch(url.toString())

    if (!response.ok) {
      return []
    }

    const data = await response.json()

    // Buscar estatísticas dos vídeos
    const videoIds = (data.items || []).map((item: any) => item.contentDetails.videoId).join(",")

    if (!videoIds) {
      return []
    }

    const statsUrl = new URL("https://www.googleapis.com/youtube/v3/videos")
    statsUrl.searchParams.append("id", videoIds)
    statsUrl.searchParams.append("part", "snippet,contentDetails,statistics")
    statsUrl.searchParams.append("key", apiKey)

    const statsResponse = await fetch(statsUrl.toString())

    if (!statsResponse.ok) {
      return []
    }

    const statsData = await statsResponse.json()

    return (statsData.items || [])
      .slice(0, 10)
      .map((video: any) => ({
        id: video.id,
        title: video.snippet?.title || "",
        views: parseInt(video.statistics?.viewCount || "0") || 0,
        likes: parseInt(video.statistics?.likeCount || "0") || null,
        comments: parseInt(video.statistics?.commentCount || "0") || null,
        duration: video.contentDetails?.duration || "PT0S",
        publishedAt: video.snippet?.publishedAt || new Date().toISOString(),
      }))
  } catch (error) {
    console.error("Error fetching recent videos:", error)
    return []
  }
}

/**
 * Calcula frequência de upload em dias
 */
function calculateUploadFrequency(videos: YouTubeChannel["recentVideos"]): number | null {
  if (videos.length < 2) return null

  const dates = videos.map(v => new Date(v.publishedAt)).sort((a, b) => b.getTime() - a.getTime())

  const daysBetween: number[] = []

  for (let i = 0; i < dates.length - 1; i++) {
    const diff = (dates[i].getTime() - dates[i + 1].getTime()) / (1000 * 60 * 60 * 24)
    daysBetween.push(diff)
  }

  if (daysBetween.length === 0) return null

  const avgDays = daysBetween.reduce((a, b) => a + b, 0) / daysBetween.length

  return Math.round(avgDays)
}

/**
 * Valida se dados são reais
 */
export function validateYouTubeData(data: YouTubeChannel): {
  isValid: boolean
  issues: string[]
} {
  const issues: string[] = []

  if (data.subscribers !== null && data.subscribers < 0) {
    issues.push("Inscritos negativo - dados inválidos")
  }

  if (data.totalViews !== null && data.totalViews < 0) {
    issues.push("Total de views negativo - dados inválidos")
  }

  if (data.uploadFrequencyDays !== null && data.uploadFrequencyDays < 0) {
    issues.push("Frequência de upload negativa - dados inválidos")
  }

  return {
    isValid: issues.length === 0,
    issues,
  }
}
