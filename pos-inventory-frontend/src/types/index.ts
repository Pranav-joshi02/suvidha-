import { User, Product, Sale, SaleItem, Category, Setting, UserRole, ProductStatus } from '@prisma/client'

// Base types from Prisma
export type { User, Product, Sale, SaleItem, Category, Setting, UserRole, ProductStatus }

// Extended types for API responses
export interface UserWithRole extends User {
  role: UserRole
}

export interface ProductWithCategory extends Product {
  category: Category
}

export interface SaleWithDetails extends Sale {
  soldBy: User
  saleItems: (SaleItem & {
    product: Product
  })[]
}

export interface SaleItemWithProduct extends SaleItem {
  product: Product
}

// API Request/Response types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: UserWithRole
}

export interface CreateProductRequest {
  name: string
  sku?: string
  categoryId: string
  costPrice: number
  sellPrice: number
  stock: number
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string
}

export interface CreateSaleRequest {
  items: {
    productId: string
    quantity: number
  }[]
  soldById: string
}

export interface CreateSaleResponse extends Sale {
  saleItems: SaleItemWithProduct[]
}

export interface SalesQueryParams {
  from?: string
  to?: string
  productId?: string
  soldById?: string
  page?: number
  limit?: number
}

export interface BalanceSheetResponse {
  lineItems: {
    date: string
    revenue: number
    cost: number
    profit: number
  }[]
  totals: {
    totalRevenue: number
    totalCost: number
    totalProfit: number
  }
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface UpdateSettingsRequest {
  lowStockThreshold?: number
  shopName?: string
  shopAddress?: string
  taxRate?: number
}

// UI State types
export interface CartItem {
  product: ProductWithCategory
  quantity: number
  unitPrice: number
  totalPrice: number
  unitCost: number
  totalCost: number
  profit: number
}

export interface KPIData {
  totalProducts: number
  dailyRevenue: number
  dailyProfit: number
  lowStockCount: number
}

export interface DateRange {
  from: Date
  to: Date
}

export interface ExportPreset {
  label: string
  from: Date
  to: Date
}

// Form types
export interface ProductFormData {
  name: string
  sku: string
  categoryId: string
  costPrice: number
  sellPrice: number
  stock: number
}

export interface UserFormData {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface SettingsFormData {
  lowStockThreshold: number
  shopName: string
  shopAddress: string
  taxRate: number
}

// Chart data types
export interface SalesChartData {
  date: string
  revenue: number
  cost: number
  profit: number
}

export interface TopProductData {
  product: Product
  totalSold: number
  totalRevenue: number
  totalProfit: number
}

// Sync types
export interface SyncStatus {
  isOnline: boolean
  lastSync: Date | null
  pendingChanges: number
}

export interface OfflineData {
  products: Product[]
  sales: Sale[]
  users: User[]
  categories: Category[]
  settings: Setting[]
}