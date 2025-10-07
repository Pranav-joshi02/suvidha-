import { http, HttpResponse } from 'msw'
import {
  mockUsers,
  mockProducts,
  mockCategories,
  mockSales,
  mockDashboardKPIs,
  mockBalanceSheet,
  mockTopProducts,
  mockSettings,
} from './data'
import { Product, Sale } from '../types'

const API_BASE = '/api'

// Helper to generate IDs
let productCounter = 100
let saleCounter = 100

export const handlers = [
  // Auth - Login
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    
    // Simple mock authentication
    const user = mockUsers.find((u) => u.email === body.email)
    
    if (user && (body.password === 'admin123' || body.password === 'staff123')) {
      return HttpResponse.json({
        token: 'mock-jwt-token-' + user.id,
        user,
      })
    }
    
    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  // Get current user
  http.get(`${API_BASE}/me`, () => {
    return HttpResponse.json(mockUsers[0])
  }),

  // Get all products
  http.get(`${API_BASE}/products`, ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase()
    const categoryId = url.searchParams.get('categoryId')
    const lowStock = url.searchParams.get('lowStock') === 'true'
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    let filtered = [...mockProducts]

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.sku?.toLowerCase().includes(search)
      )
    }

    if (categoryId) {
      filtered = filtered.filter((p) => p.categoryId === categoryId)
    }

    if (lowStock) {
      filtered = filtered.filter((p) => p.stock < 10)
    }

    const start = (page - 1) * limit
    const end = start + limit
    const paginatedData = filtered.slice(start, end)

    return HttpResponse.json({
      data: paginatedData,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    })
  }),

  // Get single product
  http.get(`${API_BASE}/products/:id`, ({ params }) => {
    const product = mockProducts.find((p) => p.id === params.id)
    
    if (!product) {
      return HttpResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json(product)
  }),

  // Create product
  http.post(`${API_BASE}/products`, async ({ request }) => {
    const body = await request.json() as Partial<Product>
    
    const category = mockCategories.find((c) => c.id === body.categoryId)
    
    const newProduct: Product = {
      id: `prod-${productCounter++}`,
      name: body.name!,
      sku: body.sku,
      category: category!,
      categoryId: body.categoryId!,
      costPrice: body.costPrice!,
      sellPrice: body.sellPrice!,
      stock: body.stock!,
      status: body.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    mockProducts.push(newProduct)
    return HttpResponse.json(newProduct)
  }),

  // Update product
  http.put(`${API_BASE}/products/:id`, async ({ params, request }) => {
    const body = await request.json() as Partial<Product>
    const index = mockProducts.findIndex((p) => p.id === params.id)
    
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }
    
    const category = body.categoryId
      ? mockCategories.find((c) => c.id === body.categoryId)
      : mockProducts[index].category
    
    mockProducts[index] = {
      ...mockProducts[index],
      ...body,
      category: category!,
      updatedAt: new Date().toISOString(),
    }
    
    return HttpResponse.json(mockProducts[index])
  }),

  // Delete product
  http.delete(`${API_BASE}/products/:id`, ({ params }) => {
    const index = mockProducts.findIndex((p) => p.id === params.id)
    
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }
    
    mockProducts.splice(index, 1)
    return HttpResponse.json({ message: 'Product deleted' })
  }),

  // Get all sales
  http.get(`${API_BASE}/sales`, ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    const start = (page - 1) * limit
    const end = start + limit
    const paginatedData = mockSales.slice(start, end)

    return HttpResponse.json({
      data: paginatedData,
      total: mockSales.length,
      page,
      limit,
      totalPages: Math.ceil(mockSales.length / limit),
    })
  }),

  // Get single sale
  http.get(`${API_BASE}/sales/:id`, ({ params }) => {
    const sale = mockSales.find((s) => s.id === params.id)
    
    if (!sale) {
      return HttpResponse.json(
        { message: 'Sale not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json(sale)
  }),

  // Create sale
  http.post(`${API_BASE}/sales`, async ({ request }) => {
    const body = await request.json() as {
      items: { productId: string; quantity: number }[]
      soldById: string
      discount?: number
    }
    
    const soldBy = mockUsers.find((u) => u.id === body.soldById)
    
    const items = body.items.map((item, index) => {
      const product = mockProducts.find((p) => p.id === item.productId)!
      const totalPrice = product.sellPrice * item.quantity
      const profit = (product.sellPrice - product.costPrice) * item.quantity
      
      return {
        id: `item-${Date.now()}-${index}`,
        productId: item.productId,
        product,
        quantity: item.quantity,
        unitPrice: product.sellPrice,
        totalPrice,
        profit,
      }
    })
    
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
    const discount = body.discount || 0
    const total = subtotal - discount
    const totalProfit = items.reduce((sum, item) => sum + item.profit, 0)
    
    const newSale: Sale = {
      id: `sale-${saleCounter++}`,
      items,
      subtotal,
      tax: 0,
      discount,
      total,
      totalProfit,
      soldBy: soldBy!,
      soldById: body.soldById,
      createdAt: new Date().toISOString(),
    }
    
    mockSales.unshift(newSale)
    
    // Update product stock
    body.items.forEach((item) => {
      const product = mockProducts.find((p) => p.id === item.productId)
      if (product) {
        product.stock -= item.quantity
      }
    })
    
    return HttpResponse.json(newSale)
  }),

  // Dashboard KPIs
  http.get(`${API_BASE}/dashboard`, () => {
    return HttpResponse.json(mockDashboardKPIs)
  }),

  // Balance Sheet
  http.get(`${API_BASE}/reports/balancesheet`, () => {
    return HttpResponse.json(mockBalanceSheet)
  }),

  // Top Products
  http.get(`${API_BASE}/reports/top-products`, () => {
    return HttpResponse.json(mockTopProducts)
  }),

  // Settings
  http.get(`${API_BASE}/settings`, () => {
    return HttpResponse.json(mockSettings)
  }),

  http.put(`${API_BASE}/settings`, async ({ request }) => {
    const body = await request.json()
    Object.assign(mockSettings, body)
    return HttpResponse.json(mockSettings)
  }),

  // Users (for settings)
  http.get(`${API_BASE}/users`, () => {
    return HttpResponse.json(mockUsers)
  }),
]