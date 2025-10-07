import { http, HttpResponse } from 'msw'
import { 
  UserRole, 
  ProductStatus,
  UserWithRole,
  ProductWithCategory,
  SaleWithDetails,
  KPIData,
  BalanceSheetResponse,
  SalesChartData,
  TopProductData
} from '@/types'

// Mock data
const mockUsers: UserWithRole[] = [
  {
    id: '1',
    email: 'admin@shop.com',
    password: 'password123',
    name: 'Admin User',
    role: UserRole.ADMIN,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'staff@shop.com',
    password: 'password123',
    name: 'Staff User',
    role: UserRole.STAFF,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

const mockCategories = [
  { id: '1', name: 'Electronics', description: 'Electronic items', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Clothing', description: 'Clothing items', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: 'Books', description: 'Books and magazines', createdAt: new Date(), updatedAt: new Date() },
]

const mockProducts: ProductWithCategory[] = [
  {
    id: '1',
    name: 'Laptop',
    sku: 'LAP001',
    categoryId: '1',
    costPrice: 800,
    sellPrice: 1200,
    stock: 5,
    status: ProductStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[0],
  },
  {
    id: '2',
    name: 'T-Shirt',
    sku: 'TSH001',
    categoryId: '2',
    costPrice: 10,
    sellPrice: 25,
    stock: 50,
    status: ProductStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[1],
  },
  {
    id: '3',
    name: 'Programming Book',
    sku: 'BK001',
    categoryId: '3',
    costPrice: 20,
    sellPrice: 35,
    stock: 2,
    status: ProductStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[2],
  },
]

const mockSales: SaleWithDetails[] = [
  {
    id: '1',
    totalAmount: 1250,
    totalCost: 820,
    totalProfit: 430,
    soldById: '2',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
    soldBy: mockUsers[1],
    saleItems: [
      {
        id: '1',
        saleId: '1',
        productId: '1',
        quantity: 1,
        unitPrice: 1200,
        totalPrice: 1200,
        unitCost: 800,
        totalCost: 800,
        profit: 400,
        product: mockProducts[0],
      },
      {
        id: '2',
        saleId: '1',
        productId: '2',
        quantity: 2,
        unitPrice: 25,
        totalPrice: 50,
        unitCost: 10,
        totalCost: 20,
        profit: 30,
        product: mockProducts[1],
      },
    ],
  },
]

export const handlers = [
  // Auth handlers
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json()
    const user = mockUsers.find(u => u.email === email && u.password === password)
    
    if (!user) {
      return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: { ...user, password: undefined },
    })
  }),

  http.get('/api/me', () => {
    return HttpResponse.json(mockUsers[0])
  }),

  // Product handlers
  http.get('/api/products', () => {
    return HttpResponse.json(mockProducts)
  }),

  http.get('/api/products/:id', ({ params }) => {
    const product = mockProducts.find(p => p.id === params.id)
    if (!product) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return HttpResponse.json(product)
  }),

  http.post('/api/products', async ({ request }) => {
    const data = await request.json()
    const category = mockCategories.find(c => c.id === data.categoryId)
    const newProduct: ProductWithCategory = {
      id: String(mockProducts.length + 1),
      ...data,
      status: ProductStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: category!,
    }
    mockProducts.push(newProduct)
    return HttpResponse.json(newProduct)
  }),

  http.put('/api/products/:id', async ({ request, params }) => {
    const data = await request.json()
    const index = mockProducts.findIndex(p => p.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    mockProducts[index] = { ...mockProducts[index], ...data, updatedAt: new Date() }
    return HttpResponse.json(mockProducts[index])
  }),

  http.delete('/api/products/:id', ({ params }) => {
    const index = mockProducts.findIndex(p => p.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    mockProducts.splice(index, 1)
    return HttpResponse.json({ success: true })
  }),

  // Sale handlers
  http.post('/api/sales', async ({ request }) => {
    const data = await request.json()
    const sale: SaleWithDetails = {
      id: String(mockSales.length + 1),
      totalAmount: 0,
      totalCost: 0,
      totalProfit: 0,
      soldById: data.soldById,
      createdAt: new Date(),
      updatedAt: new Date(),
      soldBy: mockUsers.find(u => u.id === data.soldById)!,
      saleItems: [],
    }

    // Calculate totals
    for (const item of data.items) {
      const product = mockProducts.find(p => p.id === item.productId)
      if (product) {
        const unitPrice = product.sellPrice
        const unitCost = product.costPrice
        const totalPrice = unitPrice * item.quantity
        const totalCost = unitCost * item.quantity
        const profit = totalPrice - totalCost

        sale.saleItems.push({
          id: String(sale.saleItems.length + 1),
          saleId: sale.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
          unitCost,
          totalCost,
          profit,
          product,
        })

        sale.totalAmount += totalPrice
        sale.totalCost += totalCost
        sale.totalProfit += profit
      }
    }

    mockSales.push(sale)
    return HttpResponse.json(sale)
  }),

  http.get('/api/sales', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const start = (page - 1) * limit
    const end = start + limit

    return HttpResponse.json({
      sales: mockSales.slice(start, end),
      total: mockSales.length,
      page,
      limit,
    })
  }),

  // Report handlers
  http.get('/api/reports/kpis', () => {
    const kpis: KPIData = {
      totalProducts: mockProducts.length,
      dailyRevenue: 1250,
      dailyProfit: 430,
      lowStockCount: mockProducts.filter(p => p.stock < 5).length,
    }
    return HttpResponse.json(kpis)
  }),

  http.get('/api/reports/balancesheet', ({ request }) => {
    const url = new URL(request.url)
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    const balanceSheet: BalanceSheetResponse = {
      lineItems: [
        {
          date: '2024-01-15',
          revenue: 1250,
          cost: 820,
          profit: 430,
        },
      ],
      totals: {
        totalRevenue: 1250,
        totalCost: 820,
        totalProfit: 430,
      },
    }
    return HttpResponse.json(balanceSheet)
  }),

  http.get('/api/reports/daily', ({ request }) => {
    const url = new URL(request.url)
    const date = url.searchParams.get('date')

    const salesData: SalesChartData[] = [
      { date: '2024-01-15', revenue: 1250, cost: 820, profit: 430 },
    ]

    const topProducts: TopProductData[] = [
      {
        product: mockProducts[0],
        totalSold: 1,
        totalRevenue: 1200,
        totalProfit: 400,
      },
    ]

    return HttpResponse.json({ sales: salesData, topProducts })
  }),

  http.get('/api/reports/monthly', ({ request }) => {
    const url = new URL(request.url)
    const year = url.searchParams.get('year')
    const month = url.searchParams.get('month')

    const salesData: SalesChartData[] = [
      { date: '2024-01-15', revenue: 1250, cost: 820, profit: 430 },
    ]

    const topProducts: TopProductData[] = [
      {
        product: mockProducts[0],
        totalSold: 1,
        totalRevenue: 1200,
        totalProfit: 400,
      },
    ]

    return HttpResponse.json({ sales: salesData, topProducts })
  }),

  // User management handlers
  http.get('/api/users', () => {
    return HttpResponse.json(mockUsers.map(u => ({ ...u, password: undefined })))
  }),

  http.post('/api/users', async ({ request }) => {
    const data = await request.json()
    const newUser: UserWithRole = {
      id: String(mockUsers.length + 1),
      ...data,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockUsers.push(newUser)
    return HttpResponse.json({ ...newUser, password: undefined })
  }),

  http.delete('/api/users/:id', ({ params }) => {
    const index = mockUsers.findIndex(u => u.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 })
    }
    mockUsers.splice(index, 1)
    return HttpResponse.json({ success: true })
  }),

  // Settings handlers
  http.get('/api/settings', () => {
    return HttpResponse.json({
      lowStockThreshold: 5,
      shopName: 'My Shop',
      shopAddress: '123 Main St, City, State 12345',
      taxRate: 0.08,
    })
  }),

  http.put('/api/settings', async ({ request }) => {
    const data = await request.json()
    return HttpResponse.json(data)
  }),

  // Categories
  http.get('/api/categories', () => {
    return HttpResponse.json(mockCategories)
  }),
]