'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Sale, CreateSaleData, PaginatedResponse } from '@/lib/types'

export function useSales(filters?: {
  from?: string
  to?: string
  productId?: string
  soldById?: string
  page?: number
  limit?: number
}) {
  const queryParams = new URLSearchParams()
  if (filters?.from) queryParams.append('from', filters.from)
  if (filters?.to) queryParams.append('to', filters.to)
  if (filters?.productId) queryParams.append('productId', filters.productId)
  if (filters?.soldById) queryParams.append('soldById', filters.soldById)
  if (filters?.page) queryParams.append('page', filters.page.toString())
  if (filters?.limit) queryParams.append('limit', filters.limit.toString())

  return useQuery({
    queryKey: ['sales', filters],
    queryFn: () => api.get<PaginatedResponse<Sale>>(`/sales?${queryParams}`),
  })
}

export function useSale(id: string) {
  return useQuery({
    queryKey: ['sales', id],
    queryFn: () => api.get<Sale>(`/sales/${id}`),
    enabled: !!id,
  })
}

export function useCreateSale() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSaleData) => api.post<Sale>('/sales', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}