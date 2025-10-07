'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { DashboardKPIs } from '@/lib/types'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get<DashboardKPIs>('/dashboard'),
    refetchInterval: 60000, // Refetch every minute
  })
}