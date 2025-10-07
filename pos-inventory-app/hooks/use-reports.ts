'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { DailyReport, MonthlyReport, TopProduct, BalanceSheetData } from '@/lib/types'

export function useDailyReports(date?: string) {
  const queryParams = new URLSearchParams()
  if (date) queryParams.append('date', date)

  return useQuery({
    queryKey: ['reports', 'daily', date],
    queryFn: () => api.get<DailyReport[]>(`/reports/daily?${queryParams}`),
  })
}

export function useMonthlyReports(year?: number, month?: number) {
  const queryParams = new URLSearchParams()
  if (year) queryParams.append('year', year.toString())
  if (month) queryParams.append('month', month.toString())

  return useQuery({
    queryKey: ['reports', 'monthly', year, month],
    queryFn: () => api.get<MonthlyReport>(`/reports/monthly?${queryParams}`),
  })
}

export function useTopProducts(limit: number = 5, from?: string, to?: string) {
  const queryParams = new URLSearchParams()
  queryParams.append('limit', limit.toString())
  if (from) queryParams.append('from', from)
  if (to) queryParams.append('to', to)

  return useQuery({
    queryKey: ['reports', 'top-products', limit, from, to],
    queryFn: () => api.get<TopProduct[]>(`/reports/top-products?${queryParams}`),
  })
}

export function useBalanceSheet(from: string, to: string) {
  const queryParams = new URLSearchParams()
  queryParams.append('from', from)
  queryParams.append('to', to)

  return useQuery({
    queryKey: ['reports', 'balance-sheet', from, to],
    queryFn: () => api.get<BalanceSheetData>(`/reports/balancesheet?${queryParams}`),
    enabled: !!from && !!to,
  })
}