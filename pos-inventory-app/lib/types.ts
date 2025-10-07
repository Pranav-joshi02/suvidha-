// User & Auth Types
export type UserRole = 'ADMIN' | 'STAFF'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

// Product Types
export type ProductStatus = 'ACTIVE' | 'INACTIVE'

export interface Category {
  id: string
  name: string
  createdAt: string
}

export interface Product {
  id: string
  name: string
  sku?: string
  category: Category
  categoryId: string
  costPrice: number
  sellPrice: number
  stock: number
  status: ProductStatus
  createdAt: string
  updatedAt: string
}

export interface ProductFormData {
  name: string
  sku?: string
  categoryId: string
  costPrice: number
  sellPrice: number
  stock: number
  status?: ProductStatus
}

// Sale Types
export interface SaleItem {
  id: string
  productId: string
  product: Product
  quantity: number
  unitPrice: number
  totalPrice: number
  profit: number
}

export interface Sale {
  id: string
  items: SaleItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  totalProfit: number
  soldBy: User
  soldById: string
  createdAt: string
}

export interface CreateSaleData {
  items: {
    productId: string
    quantity: number
  }[]
  soldById: string
  discount?: number
}

// Report Types
export interface DailyReport {
  date: string
  totalSales: number
  totalRevenue: number
  totalCost: number
  totalProfit: number
  salesCount: number
}

export interface MonthlyReport {
  month: string
  year: number
  totalSales: number
  totalRevenue: number
  totalCost: number
  totalProfit: number
  salesCount: number
  dailyBreakdown: DailyReport[]
}

export interface TopProduct {
  productId: string
  productName: string
  totalQuantity: number
  totalRevenue: number
  salesCount: number
}

export interface BalanceSheetData {
  from: string
  to: string
  totalRevenue: number
  totalCost: number
  totalProfit: number
  profitMargin: number
  lineItems: {
    date: string
    revenue: number
    cost: number
    profit: number
    salesCount: number
  }[]
}

// Settings Types
export interface Settings {
  id: string
  lowStockThreshold: number
  shopName: string
  shopAddress: string
  taxRate: number
}

// Dashboard KPI Types
export interface DashboardKPIs {
  totalProducts: number
  dailyRevenue: number
  dailyProfit: number
  lowStockCount: number
  totalSalesToday: number
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
}

// Sync Types
export interface SyncStatus {
  lastSync: string | null
  isSyncing: boolean
  pendingChanges: number
  status: 'online' | 'offline'
}