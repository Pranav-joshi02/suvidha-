import Cookies from 'js-cookie'
import { User } from '@/types'

const TOKEN_KEY = 'pos_auth_token'
const USER_KEY = 'pos_user'

export const authUtils = {
  setToken: (token: string) => {
    Cookies.set(TOKEN_KEY, token, { 
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
  },

  getToken: (): string | null => {
    return Cookies.get(TOKEN_KEY) || null
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY)
  },

  setUser: (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  getUser: (): User | null => {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  },

  removeUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_KEY)
    }
  },

  logout: () => {
    authUtils.removeToken()
    authUtils.removeUser()
  },

  isAuthenticated: (): boolean => {
    return !!authUtils.getToken()
  },

  isAdmin: (): boolean => {
    const user = authUtils.getUser()
    return user?.role === 'admin'
  },

  isStaff: (): boolean => {
    const user = authUtils.getUser()
    return user?.role === 'staff'
  }
}

export const getAuthHeaders = () => {
  const token = authUtils.getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}