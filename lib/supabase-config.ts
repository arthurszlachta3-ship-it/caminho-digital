/**
 * Supabase Configuration for turbinesuasredes.com.br
 *
 * REQUIRED SETUP IN SUPABASE DASHBOARD:
 *
 * 1. Authentication → URL Configuration
 *    - Site URL: https://turbinesuasredes.com.br
 *    - Redirect URLs:
 *      * https://turbinesuasredes.com.br/auth/callback
 *      * https://www.turbinesuasredes.com.br/auth/callback
 *      * http://localhost:3000/auth/callback (development)
 *
 * 2. OAuth Providers → Google
 *    - Redirect URL: https://turbinesuasredes.com.br/auth/callback/google
 *
 * 3. OAuth Providers → Meta
 *    - Redirect URL: https://turbinesuasredes.com.br/auth/callback/meta
 *
 * 4. API Settings
 *    - JWT Secret: (auto-generated, keep secure)
 *    - CORS Enabled: true
 *    - JWT Expiration: 3600
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'caminho-digital@0.1.0',
    },
  },
})

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export const getAuthUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error('Auth error:', error)
    return null
  }

  return user
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Sign out error:', error)
    return false
  }

  return true
}
