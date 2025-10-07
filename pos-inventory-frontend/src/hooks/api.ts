import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { 
  LoginCredentials,
  CreateProductData,
  CreateSaleData,
  CreateUserData
} from '@/types'

// Query Keys
export const queryKeys = {
  me: ['me'],
  products: ['products'],
  product: (id: string) => ['products', id],
  categories: ['categories'],
  sales: ['sales'],
  sale: (id: string) => ['sales', id],
  kpi: ['kpi'],
  dailyReports: ['reports', 'daily'],
  monthlyReports: ['reports', 'monthly'],
  balanceSheet: ['reports', 'balancesheet'],
  users: ['users'],
  settings: ['settings'],
}

// Auth hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => apiClient.login(credentials),
  })
}

export const useMe = () => {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => apiClient.getMe(),
  })
}

// Product hooks
export const useProducts = (params?: {
  category?: string
  lowStock?: boolean
  search?: string
  page?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: [...queryKeys.products, params],
    queryFn: () => apiClient.getProducts(params),
  })
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => apiClient.getProduct(id),
    enabled: !!id,
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProductData) => apiClient.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products })
      queryClient.invalidateQueries({ queryKey: queryKeys.kpi })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductData> }) =>
      apiClient.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products })
      queryClient.invalidateQueries({ queryKey: queryKeys.product(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.kpi })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products })
      queryClient.invalidateQueries({ queryKey: queryKeys.kpi })
    },
  })
}

// Category hooks
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => apiClient.getCategories(),
  })
}

// Sale hooks
export const useCreateSale = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSaleData) => apiClient.createSale(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sales })
      queryClient.invalidateQueries({ queryKey: queryKeys.products })
      queryClient.invalidateQueries({ queryKey: queryKeys.kpi })
      queryClient.invalidateQueries({ queryKey: queryKeys.dailyReports })
      queryClient.invalidateQueries({ queryKey: queryKeys.monthlyReports })
      queryClient.invalidateQueries({ queryKey: queryKeys.balanceSheet })
    },
  })
}

export const useSales = (params?: {
  from?: string
  to?: string
  productId?: string
  soldById?: string
  page?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: [...queryKeys.sales, params],
    queryFn: () => apiClient.getSales(params),
  })
}

export const useSale = (id: string) => {
  return useQuery({
    queryKey: queryKeys.sale(id),
    queryFn: () => apiClient.getSale(id),
    enabled: !!id,
  })
}

// Reports hooks
export const useKPIData = () => {
  return useQuery({
    queryKey: queryKeys.kpi,
    queryFn: () => apiClient.getKPIData(),
  })
}

export const useDailyReports = (params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: [...queryKeys.dailyReports, params],
    queryFn: () => apiClient.getDailyReports(params),
  })
}

export const useMonthlyReports = (params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: [...queryKeys.monthlyReports, params],
    queryFn: () => apiClient.getMonthlyReports(params),
  })
}

export const useBalanceSheet = (params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: [...queryKeys.balanceSheet, params],
    queryFn: () => apiClient.getBalanceSheet(params),
  })
}

// User management hooks
export const useUsers = () => {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => apiClient.getUsers(),
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUserData) => apiClient.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users })
    },
  })
}

// Settings hooks
export const useSettings = () => {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => apiClient.getSettings(),
  })
}

export const useUpdateSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CreateProductData>) => apiClient.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings })
    },
  })
}