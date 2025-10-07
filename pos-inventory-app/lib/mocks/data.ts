import {
  User,
  Product,
  Category,
  Sale,
  DashboardKPIs,
  BalanceSheetData,
  TopProduct,
  Settings,
} from '../types'

// Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@pos.com',
    name: 'Nirmal Kumar P',
    role: 'ADMIN',
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'user-2',
    email: 'staff@pos.com',
    name: 'John Doe',
    role: 'STAFF',
    createdAt: new Date('2024-01-15').toISOString(),
  },
]

// Categories
export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Electronics', createdAt: new Date('2024-01-01').toISOString() },
  { id: 'cat-2', name: 'Clothing', createdAt: new Date('2024-01-01').toISOString() },
  { id: 'cat-3', name: 'Food & Beverage', createdAt: new Date('2024-01-01').toISOString() },
  { id: 'cat-4', name: 'Home & Garden', createdAt: new Date('2024-01-01').toISOString() },
]

// Products
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Mouse',
    sku: 'WM-001',
    category: mockCategories[0],
    categoryId: 'cat-1',
    costPrice: 15,
    sellPrice: 29.99,
    stock: 45,
    status: 'ACTIVE',
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-05').toISOString(),
  },
  {
    id: 'prod-2',
    name: 'USB-C Cable',
    sku: 'USB-002',
    category: mockCategories[0],
    categoryId: 'cat-1',
    costPrice: 5,
    sellPrice: 12.99,
    stock: 120,
    status: 'ACTIVE',
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-05').toISOString(),
  },
  {
    id: 'prod-3',
    name: 'T-Shirt (Blue)',
    sku: 'TS-003',
    category: mockCategories[1],
    categoryId: 'cat-2',
    costPrice: 8,
    sellPrice: 19.99,
    stock: 35,
    status: 'ACTIVE',
    createdAt: new Date('2024-01-06').toISOString(),
    updatedAt: new Date('2024-01-06').toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Coffee Beans 1kg',
    sku: 'CB-004',
    category: mockCategories[2],
    categoryId: 'cat-3',
    costPrice: 12,
    sellPrice: 24.99,
    stock: 8,
    status: 'ACTIVE',
    createdAt: new Date('2024-01-07').toISOString(),
    updatedAt: new Date('2024-01-07').toISOString(),
  },
  {
    id: 'prod-5',
    name: 'Plant Pot (Medium)',
    sku: 'PP-005',
    category: mockCategories[3],
    categoryId: 'cat-4',
    costPrice: 10,
    sellPrice: 22.99,
    stock: 25,
    status: 'ACTIVE',
    createdAt: new Date('2024-01-08').toISOString(),
    updatedAt: new Date('2024-01-08').toISOString(),
  },
  {
    id: 'prod-6',
    name: 'Bluetooth Speaker',
    sku: 'BS-006',
    category: mockCategories[0],
    categoryId: 'cat-1',
    costPrice: 25,
    sellPrice: 49.99,
    stock: 15,
    status: 'ACTIVE',
    createdAt: new Date('2024-01-09').toISOString(),
    updatedAt: new Date('2024-01-09').toISOString(),
  },
  {
    id: 'prod-7',
    name: 'Jeans (Black)',
    sku: 'JN-007',
    category: mockCategories[1],
    categoryId: 'cat-2',
    costPrice: 20,
    sellPrice: 45.99,
    stock: 20,
    status: 'ACTIVE',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: 'prod-8',
    name: 'Green Tea (Box)',
    sku: 'GT-008',
    category: mockCategories[2],
    categoryId: 'cat-3',
    costPrice: 6,
    sellPrice: 14.99,
    stock: 50,
    status: 'ACTIVE',
    createdAt: new Date('2024-01-11').toISOString(),
    updatedAt: new Date('2024-01-11').toISOString(),
  },
]

// Sales
export const mockSales: Sale[] = [
  {
    id: 'sale-1',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        product: mockProducts[0],
        quantity: 2,
        unitPrice: 29.99,
        totalPrice: 59.98,
        profit: 29.98,
      },
    ],
    subtotal: 59.98,
    tax: 0,
    discount: 0,
    total: 59.98,
    totalProfit: 29.98,
    soldBy: mockUsers[0],
    soldById: 'user-1',
    createdAt: new Date('2024-10-07T10:30:00').toISOString(),
  },
  {
    id: 'sale-2',
    items: [
      {
        id: 'item-2',
        productId: 'prod-2',
        product: mockProducts[1],
        quantity: 3,
        unitPrice: 12.99,
        totalPrice: 38.97,
        profit: 23.97,
      },
      {
        id: 'item-3',
        productId: 'prod-3',
        product: mockProducts[2],
        quantity: 1,
        unitPrice: 19.99,
        totalPrice: 19.99,
        profit: 11.99,
      },
    ],
    subtotal: 58.96,
    tax: 0,
    discount: 5,
    total: 53.96,
    totalProfit: 30.96,
    soldBy: mockUsers[1],
    soldById: 'user-2',
    createdAt: new Date('2024-10-07T14:15:00').toISOString(),
  },
]

// Dashboard KPIs
export const mockDashboardKPIs: DashboardKPIs = {
  totalProducts: mockProducts.filter((p) => p.status === 'ACTIVE').length,
  dailyRevenue: 2859,
  dailyProfit: 1245,
  lowStockCount: mockProducts.filter((p) => p.stock < 10).length,
  totalSalesToday: 12,
}

// Balance Sheet
export const mockBalanceSheet: BalanceSheetData = {
  from: new Date('2024-10-01').toISOString(),
  to: new Date('2024-10-07').toISOString(),
  totalRevenue: 15420,
  totalCost: 8650,
  totalProfit: 6770,
  profitMargin: 43.9,
  lineItems: [
    {
      date: new Date('2024-10-01').toISOString(),
      revenue: 2100,
      cost: 1200,
      profit: 900,
      salesCount: 8,
    },
    {
      date: new Date('2024-10-02').toISOString(),
      revenue: 1850,
      cost: 1050,
      profit: 800,
      salesCount: 6,
    },
    {
      date: new Date('2024-10-03').toISOString(),
      revenue: 2450,
      cost: 1400,
      profit: 1050,
      salesCount: 10,
    },
    {
      date: new Date('2024-10-04').toISOString(),
      revenue: 2200,
      cost: 1250,
      profit: 950,
      salesCount: 9,
    },
    {
      date: new Date('2024-10-05').toISOString(),
      revenue: 1920,
      cost: 1100,
      profit: 820,
      salesCount: 7,
    },
    {
      date: new Date('2024-10-06').toISOString(),
      revenue: 2050,
      cost: 1150,
      profit: 900,
      salesCount: 8,
    },
    {
      date: new Date('2024-10-07').toISOString(),
      revenue: 2850,
      cost: 1500,
      profit: 1350,
      salesCount: 12,
    },
  ],
}

// Top Products
export const mockTopProducts: TopProduct[] = [
  {
    productId: 'prod-1',
    productName: 'Wireless Mouse',
    totalQuantity: 45,
    totalRevenue: 1349.55,
    salesCount: 15,
  },
  {
    productId: 'prod-2',
    productName: 'USB-C Cable',
    totalQuantity: 38,
    totalRevenue: 493.62,
    salesCount: 12,
  },
  {
    productId: 'prod-6',
    productName: 'Bluetooth Speaker',
    totalQuantity: 22,
    totalRevenue: 1099.78,
    salesCount: 11,
  },
  {
    productId: 'prod-7',
    productName: 'Jeans (Black)',
    totalQuantity: 18,
    totalRevenue: 827.82,
    salesCount: 9,
  },
  {
    productId: 'prod-3',
    productName: 'T-Shirt (Blue)',
    totalQuantity: 25,
    totalRevenue: 499.75,
    salesCount: 8,
  },
]

// Settings
export const mockSettings: Settings = {
  id: 'settings-1',
  lowStockThreshold: 10,
  shopName: 'POS System Store',
  shopAddress: '123 Main Street, City, State 12345',
  taxRate: 0,
}