import { 
  User, 
  Product, 
  Sale, 
  AuthResponse, 
  LoginCredentials,
  CreateProductData,
  CreateSaleData,
  CreateUserData,
  KPIData,
  ReportData,
  BalanceSheetData,
  Settings,
  Category
} from '@/types'
import { getAuthHeaders } from './auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async getMe(): Promise<User> {
    return this.request<User>('/me')
  }

  // Product endpoints
  async getProducts(params?: {
    category?: string
    lowStock?: boolean
    search?: string
    page?: number
    limit?: number
  }): Promise<Product[]> {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set('category', params.category)
    if (params?.lowStock) searchParams.set('lowStock', 'true')
    if (params?.search) searchParams.set('search', params.search)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const query = searchParams.toString()
    return this.request<Product[]>(`/products${query ? `?${query}` : ''}`)
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`)
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProduct(id: string, data: Partial<CreateProductData>): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request<void>(`/products/${id}`, {
      method: 'DELETE',
    })
  }

  // Category endpoints
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories')
  }

  // Sale endpoints
  async createSale(data: CreateSaleData): Promise<Sale> {
    return this.request<Sale>('/sales', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getSales(params?: {
    from?: string
    to?: string
    productId?: string
    soldById?: string
    page?: number
    limit?: number
  }): Promise<Sale[]> {
    const searchParams = new URLSearchParams()
    if (params?.from) searchParams.set('from', params.from)
    if (params?.to) searchParams.set('to', params.to)
    if (params?.productId) searchParams.set('productId', params.productId)
    if (params?.soldById) searchParams.set('soldById', params.soldById)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const query = searchParams.toString()
    return this.request<Sale[]>(`/sales${query ? `?${query}` : ''}`)
  }

  async getSale(id: string): Promise<Sale> {
    return this.request<Sale>(`/sales/${id}`)
  }

  // Reports endpoints
  async getKPIData(): Promise<KPIData> {
    return this.request<KPIData>('/reports/kpi')
  }

  async getDailyReports(params?: { from?: string; to?: string }): Promise<ReportData[]> {
    const searchParams = new URLSearchParams()
    if (params?.from) searchParams.set('from', params.from)
    if (params?.to) searchParams.set('to', params.to)

    const query = searchParams.toString()
    return this.request<ReportData[]>(`/reports/daily${query ? `?${query}` : ''}`)
  }

  async getMonthlyReports(params?: { from?: string; to?: string }): Promise<ReportData[]> {
    const searchParams = new URLSearchParams()
    if (params?.from) searchParams.set('from', params.from)
    if (params?.to) searchParams.set('to', params.to)

    const query = searchParams.toString()
    return this.request<ReportData[]>(`/reports/monthly${query ? `?${query}` : ''}`)
  }

  async getBalanceSheet(params?: { from?: string; to?: string }): Promise<BalanceSheetData> {
    const searchParams = new URLSearchParams()
    if (params?.from) searchParams.set('from', params.from)
    if (params?.to) searchParams.set('to', params.to)

    const query = searchParams.toString()
    return this.request<BalanceSheetData>(`/reports/balancesheet${query ? `?${query}` : ''}`)
  }

  // User management endpoints
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users')
  }

  async createUser(data: CreateUserData): Promise<User> {
    return this.request<User>('/users', {
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
  async getSettings(): Promise<Settings> {
    return this.request<Settings>('/settings')
  }

  async updateSettings(data: Partial<Settings>): Promise<Settings> {
    return this.request<Settings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient()