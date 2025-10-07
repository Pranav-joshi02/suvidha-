import { User, Product, Category, Sale, Settings, KPIData } from '@/types'

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@demo.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'staff@demo.com',
    name: 'Staff User',
    role: 'staff',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    email: 'john@demo.com',
    name: 'John Doe',
    role: 'staff',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Clothing',
    description: 'Apparel and fashion items',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-3',
    name: 'Books',
    description: 'Books and educational materials',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-4',
    name: 'Home & Garden',
    description: 'Home improvement and garden supplies',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-5',
    name: 'Food & Beverages',
    description: 'Food items and drinks',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Bluetooth Headphones',
    sku: 'WBH-001',
    category: 'Electronics',
    categoryId: 'cat-1',
    costPrice: 25.00,
    sellPrice: 49.99,
    stock: 15,
    status: 'active',
    lowStockThreshold: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Cotton T-Shirt',
    sku: 'CTS-001',
    category: 'Clothing',
    categoryId: 'cat-2',
    costPrice: 8.00,
    sellPrice: 19.99,
    stock: 50,
    status: 'active',
    lowStockThreshold: 20,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-3',
    name: 'Programming Book',
    sku: 'PB-001',
    category: 'Books',
    categoryId: 'cat-3',
    costPrice: 15.00,
    sellPrice: 29.99,
    stock: 8,
    status: 'active',
    lowStockThreshold: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-4',
    name: 'Coffee Mug',
    sku: 'CM-001',
    category: 'Home & Garden',
    categoryId: 'cat-4',
    costPrice: 3.00,
    sellPrice: 9.99,
    stock: 25,
    status: 'active',
    lowStockThreshold: 15,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-5',
    name: 'Organic Coffee Beans',
    sku: 'OCB-001',
    category: 'Food & Beverages',
    categoryId: 'cat-5',
    costPrice: 12.00,
    sellPrice: 24.99,
    stock: 3,
    status: 'active',
    lowStockThreshold: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-6',
    name: 'Smartphone Case',
    sku: 'SC-001',
    category: 'Electronics',
    categoryId: 'cat-1',
    costPrice: 5.00,
    sellPrice: 14.99,
    stock: 0,
    status: 'active',
    lowStockThreshold: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-7',
    name: 'Jeans',
    sku: 'J-001',
    category: 'Clothing',
    categoryId: 'cat-2',
    costPrice: 20.00,
    sellPrice: 59.99,
    stock: 12,
    status: 'active',
    lowStockThreshold: 8,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-8',
    name: 'Plant Pot',
    sku: 'PP-001',
    category: 'Home & Garden',
    categoryId: 'cat-4',
    costPrice: 4.00,
    sellPrice: 12.99,
    stock: 18,
    status: 'active',
    lowStockThreshold: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

// Mock Sales
export const mockSales: Sale[] = [
  {
    id: 'sale-1',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        product: mockProducts[0],
        quantity: 2,
        unitPrice: 49.99,
        totalPrice: 99.98,
        profit: 49.98,
      },
      {
        id: 'item-2',
        productId: 'prod-2',
        product: mockProducts[1],
        quantity: 1,
        unitPrice: 19.99,
        totalPrice: 19.99,
        profit: 11.99,
      },
    ],
    totalAmount: 119.97,
    totalCost: 58.00,
    totalProfit: 61.97,
    soldById: '1',
    soldBy: mockUsers[0],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sale-2',
    items: [
      {
        id: 'item-3',
        productId: 'prod-3',
        product: mockProducts[2],
        quantity: 1,
        unitPrice: 29.99,
        totalPrice: 29.99,
        profit: 14.99,
      },
    ],
    totalAmount: 29.99,
    totalCost: 15.00,
    totalProfit: 14.99,
    soldById: '2',
    soldBy: mockUsers[1],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sale-3',
    items: [
      {
        id: 'item-4',
        productId: 'prod-4',
        product: mockProducts[3],
        quantity: 3,
        unitPrice: 9.99,
        totalPrice: 29.97,
        profit: 20.97,
      },
      {
        id: 'item-5',
        productId: 'prod-5',
        product: mockProducts[4],
        quantity: 2,
        unitPrice: 24.99,
        totalPrice: 49.98,
        profit: 25.98,
      },
    ],
    totalAmount: 79.95,
    totalCost: 33.00,
    totalProfit: 46.95,
    soldById: '1',
    soldBy: mockUsers[0],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
]

// Mock Settings
export const mockSettings: Settings = {
  id: 'settings-1',
  lowStockThreshold: 10,
  shopName: 'Demo POS Store',
  shopAddress: '123 Main Street, City, State 12345',
  taxRate: 8.5,
  currency: 'USD',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

// Mock KPI Data
export const mockKPIData: KPIData = {
  totalProducts: mockProducts.length,
  dailyRevenue: mockSales
    .filter(sale => {
      const saleDate = new Date(sale.createdAt)
      const today = new Date()
      return saleDate.toDateString() === today.toDateString()
    })
    .reduce((sum, sale) => sum + sale.totalAmount, 0),
  dailyProfit: mockSales
    .filter(sale => {
      const saleDate = new Date(sale.createdAt)
      const today = new Date()
      return saleDate.toDateString() === today.toDateString()
    })
    .reduce((sum, sale) => sum + sale.totalProfit, 0),
  lowStockCount: mockProducts.filter(product => 
    product.stock <= (product.lowStockThreshold || 10)
  ).length,
}