export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'staff'
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  sku?: string
  category: string
  categoryId: string
  costPrice: number
  sellPrice: number
  stock: number
  status: 'active' | 'inactive'
  lowStockThreshold?: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

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
  totalAmount: number
  totalProfit: number
  totalCost: number
  soldById: string
  soldBy: User
  createdAt: string
  updatedAt: string
}

export interface KPIData {
  totalProducts: number
  dailyRevenue: number
  dailyProfit: number
  lowStockCount: number
}

export interface ReportData {
  date: string
  revenue: number
  cost: number
  profit: number
  salesCount: number
}

export interface BalanceSheetData {
  period: string
  totalRevenue: number
  totalCost: number
  totalProfit: number
  profitMargin: number
  salesCount: number
  topProducts: Array<{
    product: Product
    quantity: number
    revenue: number
  }>
}

export interface Settings {
  id: string
  lowStockThreshold: number
  shopName: string
  shopAddress: string
  taxRate: number
  currency: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface CreateProductData {
  name: string
  sku?: string
  categoryId: string
  costPrice: number
  sellPrice: number
  stock: number
  lowStockThreshold?: number
}

export interface CreateSaleData {
  items: Array<{
    productId: string
    quantity: number
  }>
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  role: 'admin' | 'staff'
}

export interface DateRange {
  from: Date
  to: Date
}

export interface ExportPreset {
  label: string
  value: string
  range: DateRange
}

export type SyncStatus = 'online' | 'offline' | 'syncing' | 'error'

export interface SyncState {
  status: SyncStatus
  lastSync: Date | null
  pendingChanges: number
}