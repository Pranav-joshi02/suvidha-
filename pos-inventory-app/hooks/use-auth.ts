'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { setAuthToken, removeAuthToken, setUser, getUser, isAuthenticated } from '@/lib/auth'
import { AuthResponse, LoginCredentials, User } from '@/lib/types'

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post<AuthResponse>('/auth/login', credentials)
      return response
    },
    onSuccess: (data) => {
      setAuthToken(data.token)
      setUser(data.user)
      queryClient.setQueryData(['user'], data.user)
      
      // Redirect based on role
      if (data.user.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/staff')
      }
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Could call API logout endpoint here
      removeAuthToken()
    },
    onSuccess: () => {
      queryClient.clear()
      router.push('/login')
    },
  })

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      if (!isAuthenticated()) {
        return null
      }
      
      try {
        return await api.get<User>('/me')
      } catch (error) {
        // If API call fails, fall back to stored user
        return getUser()
      }
    },
    initialData: getUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading || loginMutation.isPending,
    isAuthenticated: isAuthenticated(),
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    loginError: loginMutation.error,
  }
}