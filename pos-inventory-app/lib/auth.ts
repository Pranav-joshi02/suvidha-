import { User } from './types'

const TOKEN_KEY = 'pos_auth_token'
const USER_KEY = 'pos_user'

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
}

export function setUser(user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_KEY)
    if (userStr) {
      try {
        return JSON.parse(userStr) as User
      } catch {
        return null
      }
    }
  }
  return null
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

export function isAdmin(): boolean {
  const user = getUser()
  return user?.role === 'ADMIN'
}

export function isStaff(): boolean {
  const user = getUser()
  return user?.role === 'STAFF'
}