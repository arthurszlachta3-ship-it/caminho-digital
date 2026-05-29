/**
 * Website Data Collector
 * Analisa SEO, performance, UX
 * PROIBIDO inventar dados
 */

interface WebsiteAnalysis {
  url: string
  isAccessible: boolean
  title: string | null
  description: string | null
  hasContactForm: boolean
  hasCTA: boolean
  mobileFriendly: boolean
  performanceScore: number | null
  seoScore: number | null
  hasHTTPS: boolean
  loadTimeSeconds: number | null
  keywords: string[]
  headings: string[]
  socialLinks: {
    instagram?: string
    tiktok?: string
    youtube?: string
    twitter?: string
    linkedin?: string
  }
  metaTags: {
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
  }
}

interface WebsiteError {
  code: string
  message: string
  reason: "invalid_url" | "not_found" | "timeout" | "not_accessible"
}

/**
 * Analisa website
 * Coleta APENAS dados acessíveis publicamente
 */
export async function analyzeWebsite(
  websiteUrl: string
): Promise<WebsiteAnalysis | WebsiteError> {
  try {
    // Validar e normalizar URL
    const url = normalizeUrl(websiteUrl)

    if (!url) {
      return {
        code: "INVALID_URL",
        message: "URL do website inválida",
        reason: "invalid_url",
      }
    }

    // Verificar se site é acessível
    const headResponse = await fetch(url, {
      method: "HEAD",
      timeout: 10000,
    }).catch(() => null)

    if (!headResponse || headResponse.status === 404) {
      return {
        code: "WEBSITE_NOT_FOUND",
        message: `Website ${url} não encontrado`,
        reason: "not_found",
      }
    }

    // Buscar página completa
    const pageResponse = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 15000,
    })

    if (!pageResponse.ok) {
      return {
        code: "WEBSITE_NOT_ACCESSIBLE",
        message: `Website ${url} retornou erro ${pageResponse.status}`,
        reason: "not_accessible",
      }
    }

    const html = await pageResponse.text()

    // Extrair dados
    const title = extractMetaTag(html, "og:title") || extractTitle(html)
    const description = extractMetaTag(html, "og:description") || extractMetaTag(html, "description")
    const hasContactForm = html.includes("contact") && (html.includes("form") || html.includes("email"))
    const hasCTA = detectCTA(html)
    const mobileFriendly = html.includes("viewport") && html.includes("width=device-width")
    const keywords = extractKeywords(html)
    const headings = extractHeadings(html)
    const socialLinks = extractSocialLinks(html, url)
    const metaTags = extractOpenGraphTags(html)
    const hasHTTPS = url.startsWith("https://")

    return {
      url,
      isAccessible: true,
      title,
      description,
      hasContactForm,
      hasCTA,
      mobileFriendly,
      performanceScore: null, // Requer PageSpeed Insights API
      seoScore: calculateBasicSEOScore(html, title, description),
      hasHTTPS,
      loadTimeSeconds: null, // Requer teste de carga
      keywords,
      headings,
      socialLinks,
      metaTags,
    }
  } catch (error) {
    console.error("Website analysis error:", error)
    return {
      code: "WEBSITE_ANALYSIS_ERROR",
      message: `Erro ao analisar website: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      reason: "timeout",
    }
  }
}

/**
 * Normaliza URL
 */
function normalizeUrl(input: string): string | null {
  try {
    let urlString = input.trim()

    // Adicionar protocolo se não tiver
    if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
      urlString = "https://" + urlString
    }

    const url = new URL(urlString)
    return url.toString().replace(/\/$/, "") // Remove trailing slash
  } catch {
    return null
  }
}

/**
 * Extrai meta tag do HTML
 */
function extractMetaTag(html: string, name: string): string | null {
  const regex = new RegExp(`<meta\\s+(?:property|name)="?${name}"?\\s+content="([^"]*)"`, "i")
  const match = html.match(regex)
  return match ? match[1] : null
}

/**
 * Extrai título da página
 */
function extractTitle(html: string): string | null {
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i)
  return titleMatch ? titleMatch[1] : null
}

/**
 * Detecta chamadas à ação (CTA)
 */
function detectCTA(html: string): boolean {
  const ctaKeywords = ["buy", "compre", "contato", "contact", "saiba", "learn", "iniciar", "start", "subscribe", "inscrever"]
  return ctaKeywords.some(keyword => html.toLowerCase().includes(keyword))
}

/**
 * Extrai keywords
 */
function extractKeywords(html: string): string[] {
  const keywordsMeta = extractMetaTag(html, "keywords")
  if (keywordsMeta) {
    return keywordsMeta.split(",").map(k => k.trim()).slice(0, 10)
  }
  return []
}

/**
 * Extrai headings (H1, H2, H3)
 */
function extractHeadings(html: string): string[] {
  const h1Regex = /<h1[^>]*>([^<]*)<\/h1>/gi
  const h2Regex = /<h2[^>]*>([^<]*)<\/h2>/gi

  const headings: string[] = []

  let match
  while ((match = h1Regex.exec(html))) {
    headings.push(match[1].trim())
  }
  while ((match = h2Regex.exec(html))) {
    headings.push(match[1].trim())
  }

  return headings.slice(0, 10)
}

/**
 * Extrai links para redes sociais
 */
function extractSocialLinks(html: string, baseUrl: string): WebsiteAnalysis["socialLinks"] {
  const links: WebsiteAnalysis["socialLinks"] = {}

  const patterns: Record<keyof WebsiteAnalysis["socialLinks"], RegExp> = {
    instagram: /instagram\.com|@instagram/i,
    tiktok: /tiktok\.com|@tiktok/i,
    youtube: /youtube\.com|@youtube/i,
    twitter: /twitter\.com|@twitter|x\.com/i,
    linkedin: /linkedin\.com|@linkedin/i,
  }

  Object.entries(patterns).forEach(([platform, regex]) => {
    if (regex.test(html)) {
      links[platform as keyof WebsiteAnalysis["socialLinks"]] = `Encontrado link para ${platform}`
    }
  })

  return links
}

/**
 * Extrai tags Open Graph
 */
function extractOpenGraphTags(html: string): WebsiteAnalysis["metaTags"] {
  return {
    ogTitle: extractMetaTag(html, "og:title") || undefined,
    ogDescription: extractMetaTag(html, "og:description") || undefined,
    ogImage: extractMetaTag(html, "og:image") || undefined,
  }
}

/**
 * Calcula score SEO básico
 * Baseado em elementos visíveis (não requer ferramentas externas)
 */
function calculateBasicSEOScore(html: string, title: string | null, description: string | null): number {
  let score = 0

  // Title (20 pontos)
  if (title && title.length > 20 && title.length < 70) {
    score += 20
  } else if (title) {
    score += 10
  }

  // Meta description (20 pontos)
  if (description && description.length > 50 && description.length < 160) {
    score += 20
  } else if (description) {
    score += 10
  }

  // H1 tags (15 pontos)
  if (html.match(/<h1[^>]*>/gi)) {
    score += 15
  }

  // Responsive (15 pontos)
  if (html.includes('viewport')) {
    score += 15
  }

  // HTTPS (15 pontos)
  // (adicionado no returnda função principal)

  // SSL/Security headers (5 pontos)
  if (html.includes('X-UA-Compatible') || html.includes('Content-Security-Policy')) {
    score += 5
  }

  return Math.min(score, 100)
}

/**
 * Valida dados do website
 */
export function validateWebsiteData(data: WebsiteAnalysis): {
  isValid: boolean
  issues: string[]
} {
  const issues: string[] = []

  if (!data.url) {
    issues.push("URL não fornecida")
  }

  if (data.loadTimeSeconds !== null && data.loadTimeSeconds < 0) {
    issues.push("Tempo de carregamento negativo")
  }

  if (data.performanceScore !== null && (data.performanceScore < 0 || data.performanceScore > 100)) {
    issues.push("Score de performance fora do intervalo 0-100")
  }

  return {
    isValid: issues.length === 0,
    issues,
  }
}
