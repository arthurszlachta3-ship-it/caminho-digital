/**
 * OAuth Callbacks Configuration
 *
 * REQUIRED: Update OAuth Provider Dashboards with these URLs:
 *
 * GOOGLE OAUTH:
 * - Authorized Redirect URIs:
 *   * https://turbinesuasredes.com.br/api/auth/callback/google
 *   * https://turbinesuasredes.com.br/auth/callback/google
 *   * http://localhost:3000/api/auth/callback/google (dev)
 *
 * META/FACEBOOK OAUTH:
 * - Valid OAuth Redirect URIs:
 *   * https://turbinesuasredes.com.br/api/auth/callback/meta
 *   * https://turbinesuasredes.com.br/auth/callback/meta
 *   * http://localhost:3000/api/auth/callback/meta (dev)
 */

export const getOAuthCallbackUrl = (provider: 'google' | 'meta'): string => {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://turbinesuasredes.com.br'

  return `${baseUrl}/api/auth/callback/${provider}`
}

export const getSupabaseOAuthCallbackUrl = (provider: 'google' | 'meta'): string => {
  const baseUrl = process.env.SUPABASE_AUTH_REDIRECT_TO || 'https://turbinesuasredes.com.br'

  return `${baseUrl}/auth/callback/${provider}`
}

export const oAuthConfig = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackUrl: getOAuthCallbackUrl('google'),
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },
  meta: {
    clientId: process.env.META_CLIENT_ID || '',
    clientSecret: process.env.META_CLIENT_SECRET || '',
    callbackUrl: getOAuthCallbackUrl('meta'),
    authorizationUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.instagram.com/v18.0/oauth/access_token',
    userInfoUrl: 'https://graph.instagram.com/me?fields=id,username,name,profile_picture_url',
  },
}

// Validate OAuth configuration
export const validateOAuthConfig = (): boolean => {
  const errors: string[] = []

  if (!oAuthConfig.google.clientId) {
    errors.push('GOOGLE_CLIENT_ID is missing')
  }
  if (!oAuthConfig.google.clientSecret) {
    errors.push('GOOGLE_CLIENT_SECRET is missing')
  }
  if (!oAuthConfig.meta.clientId) {
    errors.push('META_CLIENT_ID is missing')
  }
  if (!oAuthConfig.meta.clientSecret) {
    errors.push('META_CLIENT_SECRET is missing')
  }

  if (errors.length > 0) {
    console.warn('OAuth Configuration Warnings:', errors)
    return false
  }

  return true
}
