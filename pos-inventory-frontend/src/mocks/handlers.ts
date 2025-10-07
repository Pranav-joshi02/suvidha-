import { http, HttpResponse } from 'msw'
import { 
  mockUsers, 
  mockProducts, 
  mockCategories, 
  mockSales, 
  mockSettings, 
  mockKPIData 
} from './data'
import { CreateProductData, CreateSaleData, LoginCredentials } from '@/types'

// Helper function to generate ID
const generateId = () => Math.random().toString(36).substr(2, 9)

// In-memory storage (resets on page refresh)
const users = [...mockUsers]
const products = [...mockProducts]
const categories = [...mockCategories]
const sales = [...mockSales]
const settings = { ...mockSettings }

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const credentials = await request.json() as LoginCredentials
    
    const user = users.find(u => u.email === credentials.email)
    
    if (user && credentials.password === 'password') {
      return HttpResponse.json({
        token: 'mock-jwt-token-' + user.id,
        user,
      })
    }
    
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  http.get('/api/me', () => {
    // In a real app, you'd verify the JWT token here
    return HttpResponse.json(users[0]) // Return admin user for demo
  }),

  // Product endpoints
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase()
    const category = url.searchParams.get('category')
    const lowStock = url.searchParams.get('lowStock') === 'true'
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '50')

    let filteredProducts = [...products]

    if (search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.sku?.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
      )
    }

    if (category) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === category)
    }

    if (lowStock) {
      filteredProducts = filteredProducts.filter(p => 
        p.stock <= (p.lowStockThreshold || 10)
      )
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return HttpResponse.json(paginatedProducts)
  }),

  http.get('/api/products/:id', ({ params }) => {
    const product = products.find(p => p.id === params.id)
    if (!product) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return HttpResponse.json(product)
  }),

  http.post('/api/products', async ({ request }) => {
    const data = await request.json() as CreateProductData
    
    const category = categories.find(c => c.id === data.categoryId)
    if (!category) {
      return HttpResponse.json({ error: 'Category not found' }, { status: 400 })
    }

    const newProduct = {
      id: 'prod-' + generateId(),
      ...data,
      category: category.name,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    products.push(newProduct)
    return HttpResponse.json(newProduct, { status: 201 })
  }),

  http.put('/api/products/:id', async ({ params, request }) => {
    const data = await request.json() as Partial<CreateProductData>
    const productIndex = products.findIndex(p => p.id === params.id)
    
    if (productIndex === -1) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    let category = products[productIndex].category
    if (data.categoryId) {
      const cat = categories.find(c => c.id === data.categoryId)
      if (cat) category = cat.name
    }

    products[productIndex] = {
      ...products[productIndex],
      ...data,
      category,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json(products[productIndex])
  }),

  http.delete('/api/products/:id', ({ params }) => {
    const productIndex = products.findIndex(p => p.id === params.id)
    if (productIndex === -1) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    products.splice(productIndex, 1)
    return HttpResponse.json({ success: true })
  }),

  // Category endpoints
  http.get('/api/categories', () => {
    return HttpResponse.json(categories)
  }),

  // Sale endpoints
  http.post('/api/sales', async ({ request }) => {
    const data = await request.json() as CreateSaleData
    
    const saleItems = data.items.map(item => {
      const product = products.find(p => p.id === item.productId)
      if (!product) {
        throw new Error(`Product ${item.productId} not found`)
      }

      // Update product stock
      const productIndex = products.findIndex(p => p.id === item.productId)
      products[productIndex].stock -= item.quantity

      const totalPrice = product.sellPrice * item.quantity
      const profit = (product.sellPrice - product.costPrice) * item.quantity

      return {
        id: 'item-' + generateId(),
        productId: item.productId,
        product,
        quantity: item.quantity,
        unitPrice: product.sellPrice,
        totalPrice,
        profit,
      }
    })

    const totalAmount = saleItems.reduce((sum, item) => sum + item.totalPrice, 0)
    const totalCost = saleItems.reduce((sum, item) => sum + (item.product.costPrice * item.quantity), 0)
    const totalProfit = totalAmount - totalCost

    const newSale = {
      id: 'sale-' + generateId(),
      items: saleItems,
      totalAmount,
      totalCost,
      totalProfit,
      soldById: '1', // Mock current user
      soldBy: users[0], // Mock current user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    sales.push(newSale)
    return HttpResponse.json(newSale, { status: 201 })
  }),

  http.get('/api/sales', ({ request }) => {
    const url = new URL(request.url)
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')
    const productId = url.searchParams.get('productId')
    const soldById = url.searchParams.get('soldById')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '50')

    let filteredSales = [...sales]

    if (from) {
      filteredSales = filteredSales.filter(s => new Date(s.createdAt) >= new Date(from))
    }

    if (to) {
      filteredSales = filteredSales.filter(s => new Date(s.createdAt) <= new Date(to))
    }

    if (productId) {
      filteredSales = filteredSales.filter(s => 
        s.items.some(item => item.productId === productId)
      )
    }

    if (soldById) {
      filteredSales = filteredSales.filter(s => s.soldById === soldById)
    }

    // Sort by date (newest first)
    filteredSales.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedSales = filteredSales.slice(startIndex, endIndex)

    return HttpResponse.json(paginatedSales)
  }),

  http.get('/api/sales/:id', ({ params }) => {
    const sale = sales.find(s => s.id === params.id)
    if (!sale) {
      return HttpResponse.json({ error: 'Sale not found' }, { status: 404 })
    }
    return HttpResponse.json(sale)
  }),

  // Reports endpoints
  http.get('/api/reports/kpi', () => {
    // Recalculate KPI data based on current state
    const today = new Date()
    const todaySales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt)
      return saleDate.toDateString() === today.toDateString()
    })

    const kpiData = {
      totalProducts: products.length,
      dailyRevenue: todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0),
      dailyProfit: todaySales.reduce((sum, sale) => sum + sale.totalProfit, 0),
      lowStockCount: products.filter(product => 
        product.stock <= (product.lowStockThreshold || 10)
      ).length,
    }

    return HttpResponse.json(kpiData)
  }),

  http.get('/api/reports/daily', ({ request }) => {
    const url = new URL(request.url)
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    // Generate daily reports for the last 30 days
    const reports = []
    const endDate = to ? new Date(to) : new Date()
    const startDate = from ? new Date(from) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]
      const daySales = sales.filter(sale => 
        sale.createdAt.split('T')[0] === dateStr
      )

      const revenue = daySales.reduce((sum, sale) => sum + sale.totalAmount, 0)
      const cost = daySales.reduce((sum, sale) => sum + sale.totalCost, 0)
      const profit = revenue - cost

      reports.push({
        date: dateStr,
        revenue,
        cost,
        profit,
        salesCount: daySales.length,
      })
    }

    return HttpResponse.json(reports)
  }),

  http.get('/api/reports/monthly', ({ request }) => {
    const url = new URL(request.url)
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    // Generate monthly reports for the last 12 months
    const reports = []
    const endDate = to ? new Date(to) : new Date()
    const startDate = from ? new Date(from) : new Date(endDate.getFullYear() - 1, endDate.getMonth(), 1)

    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    while (current <= endDate) {
      const year = current.getFullYear()
      const month = current.getMonth()
      const monthStart = new Date(year, month, 1)
      const monthEnd = new Date(year, month + 1, 0)

      const monthSales = sales.filter(sale => {
        const saleDate = new Date(sale.createdAt)
        return saleDate >= monthStart && saleDate <= monthEnd
      })

      const revenue = monthSales.reduce((sum, sale) => sum + sale.totalAmount, 0)
      const cost = monthSales.reduce((sum, sale) => sum + sale.totalCost, 0)
      const profit = revenue - cost

      reports.push({
        date: `${year}-${String(month + 1).padStart(2, '0')}`,
        revenue,
        cost,
        profit,
        salesCount: monthSales.length,
      })

      current.setMonth(current.getMonth() + 1)
    }

    return HttpResponse.json(reports)
  }),

  http.get('/api/reports/balancesheet', ({ request }) => {
    const url = new URL(request.url)
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    const startDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = to ? new Date(to) : new Date()

    const periodSales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt)
      return saleDate >= startDate && saleDate <= endDate
    })

    const totalRevenue = periodSales.reduce((sum, sale) => sum + sale.totalAmount, 0)
    const totalCost = periodSales.reduce((sum, sale) => sum + sale.totalCost, 0)
    const totalProfit = totalRevenue - totalCost

    // Calculate top products
    const productSales = new Map()
    periodSales.forEach(sale => {
      sale.items.forEach(item => {
        const existing = productSales.get(item.productId) || { 
          product: item.product, 
          quantity: 0, 
          revenue: 0 
        }
        existing.quantity += item.quantity
        existing.revenue += item.totalPrice
        productSales.set(item.productId, existing)
      })
    })

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    return HttpResponse.json({
      period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
      salesCount: periodSales.length,
      topProducts,
    })
  }),

  // User management endpoints
  http.get('/api/users', () => {
    return HttpResponse.json(users)
  }),

  http.post('/api/users', async ({ request }) => {
    const data = await request.json() as any
    
    const newUser = {
      id: 'user-' + generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    users.push(newUser)
    return HttpResponse.json(newUser, { status: 201 })
  }),

  http.delete('/api/users/:id', ({ params }) => {
    const userIndex = users.findIndex(u => u.id === params.id)
    if (userIndex === -1) {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 })
    }

    users.splice(userIndex, 1)
    return HttpResponse.json({ success: true })
  }),

  // Settings endpoints
  http.get('/api/settings', () => {
    return HttpResponse.json(settings)
  }),

  http.put('/api/settings', async ({ request }) => {
    const data = await request.json() as Partial<typeof settings>
    settings = {
      ...settings,
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json(settings)
  }),
]