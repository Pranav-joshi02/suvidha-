'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Product, ProductFormData, PaginatedResponse } from '@/lib/types'

export function useProducts(filters?: {
  categoryId?: string
  search?: string
  lowStock?: boolean
  page?: number
  limit?: number
}) {
  const queryParams = new URLSearchParams()
  if (filters?.categoryId) queryParams.append('categoryId', filters.categoryId)
  if (filters?.search) queryParams.append('search', filters.search)
  if (filters?.lowStock) queryParams.append('lowStock', 'true')
  if (filters?.page) queryParams.append('page', filters.page.toString())
  if (filters?.limit) queryParams.append('limit', filters.limit.toString())

  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => api.get<PaginatedResponse<Product>>(`/products?${queryParams}`),
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => api.get<Product>(`/products/${id}`),
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProductFormData) => api.post<Product>('/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<ProductFormData>) =>
      api.put<Product>(`/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['products', id] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}