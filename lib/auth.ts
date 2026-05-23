import { cookies } from 'next/headers'

export async function getSession() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return null
  }

  // TODO: Verify token with JWT
  return null
}
