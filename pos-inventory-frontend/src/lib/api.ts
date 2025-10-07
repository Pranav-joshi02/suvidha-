import { 
  LoginRequest, 
  LoginResponse, 
  UserWithRole, 
  ProductWithCategory, 
  CreateProductRequest, 
  UpdateProductRequest,
  CreateSaleRequest,
  CreateSaleResponse,
  SalesQueryParams,
  SaleWithDetails,
  BalanceSheetResponse,
  CreateUserRequest,
  UpdateSettingsRequest,
  KPIData
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    this.setToken(response.token)
    return response
  }

  async getMe(): Promise<UserWithRole> {
    return this.request<UserWithRole>('/me')
  }

  async logout(): Promise<void> {
    this.clearToken()
  }

  // Product endpoints
  async getProducts(): Promise<ProductWithCategory[]> {
    return this.request<ProductWithCategory[]>('/products')
  }

  async getProduct(id: string): Promise<ProductWithCategory> {
    return this.request<ProductWithCategory>(`/products/${id}`)
  }

  async createProduct(data: CreateProductRequest): Promise<ProductWithCategory> {
    return this.request<ProductWithCategory>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProduct(data: UpdateProductRequest): Promise<ProductWithCategory> {
    return this.request<ProductWithCategory>(`/products/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request<void>(`/products/${id}`, {
      method: 'DELETE',
    })
  }

  // Sale endpoints
  async createSale(data: CreateSaleRequest): Promise<CreateSaleResponse> {
    return this.request<CreateSaleResponse>('/sales', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getSales(params?: SalesQueryParams): Promise<{
    sales: SaleWithDetails[]
    total: number
    page: number
    limit: number
  }> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }
    const query = searchParams.toString()
    return this.request(`/sales${query ? `?${query}` : ''}`)
  }

  // Report endpoints
  async getKPIs(): Promise<KPIData> {
    return this.request<KPIData>('/reports/kpis')
  }

  async getBalanceSheet(from: string, to: string): Promise<BalanceSheetResponse> {
    return this.request<BalanceSheetResponse>(`/reports/balancesheet?from=${from}&to=${to}`)
  }

  async getDailyReport(date: string): Promise<{
    sales: SalesChartData[]
    topProducts: TopProductData[]
  }> {
    return this.request(`/reports/daily?date=${date}`)
  }

  async getMonthlyReport(year: number, month: number): Promise<{
    sales: SalesChartData[]
    topProducts: TopProductData[]
  }> {
    return this.request(`/reports/monthly?year=${year}&month=${month}`)
  }

  // User management endpoints
  async getUsers(): Promise<UserWithRole[]> {
    return this.request<UserWithRole[]>('/users')
  }

  async createUser(data: CreateUserRequest): Promise<UserWithRole> {
    return this.request<UserWithRole>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    })
  }

  // Settings endpoints
  async getSettings(): Promise<Record<string, any>> {
    return this.request<Record<string, any>>('/settings')
  }

  async updateSettings(data: UpdateSettingsRequest): Promise<Record<string, any>> {
    return this.request<Record<string, any>>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories')
  }
}

export const apiClient = new ApiClient(API_BASE_URL)