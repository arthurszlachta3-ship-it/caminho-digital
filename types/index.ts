export type Maybe<T> = T | null
export type Nullable<T> = T | null | undefined

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// User Types
export interface UserProfile {
  id: string
  email: string
  name?: string
  avatar?: string
  companyName?: string
  industry?: string
  instagramHandle?: string
  tiktokHandle?: string
  youtubeHandle?: string
  websiteUrl?: string
  primaryGoal?: string
  createdAt: Date
  updatedAt: Date
}

// Diagnostic Types
export interface DiagnosticResult {
  id: string
  userId: string
  overallScore: number
  instagramScore?: number
  tiktokScore?: number
  youtubeScore?: number
  websiteScore?: number
  insights?: Record<string, any>
  quickWins?: string[]
  createdAt: Date
  status: 'pending' | 'completed' | 'error'
}

// Alert Types
export interface ProactiveAlertType {
  id: string
  userId: string
  agentType: string
  alertType: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  isRead: boolean
  createdAt: Date
}
