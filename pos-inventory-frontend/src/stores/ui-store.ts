import { create } from 'zustand'
import { SyncStatus } from '@/types'

interface UIState {
  // Sidebar state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  
  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  
  // Sync state
  syncStatus: SyncStatus
  setSyncStatus: (status: SyncStatus) => void
  lastSyncTime: Date | null
  setLastSyncTime: (time: Date | null) => void
  
  // Modal states
  modals: {
    addProduct: boolean
    editProduct: boolean
    addUser: boolean
    receipt: boolean
    confirmDelete: boolean
  }
  openModal: (modal: keyof UIState['modals']) => void
  closeModal: (modal: keyof UIState['modals']) => void
  closeAllModals: () => void
  
  // POS state
  posBasket: Array<{
    productId: string
    quantity: number
    unitPrice: number
  }>
  addToBasket: (item: { productId: string; quantity: number; unitPrice: number }) => void
  updateBasketItem: (productId: string, quantity: number) => void
  removeFromBasket: (productId: string) => void
  clearBasket: () => void
  
  // Filters and search
  productFilters: {
    search: string
    category: string
    lowStock: boolean
  }
  setProductFilters: (filters: Partial<UIState['productFilters']>) => void
  
  salesFilters: {
    dateFrom: string
    dateTo: string
    productId: string
    soldById: string
  }
  setSalesFilters: (filters: Partial<UIState['salesFilters']>) => void
}

export const useUIStore = create<UIState>((set, get) => ({
  // Sidebar state
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  // Loading states
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // Sync state
  syncStatus: 'online',
  setSyncStatus: (status) => set({ syncStatus: status }),
  lastSyncTime: null,
  setLastSyncTime: (time) => set({ lastSyncTime: time }),
  
  // Modal states
  modals: {
    addProduct: false,
    editProduct: false,
    addUser: false,
    receipt: false,
    confirmDelete: false,
  },
  openModal: (modal) => 
    set((state) => ({
      modals: { ...state.modals, [modal]: true }
    })),
  closeModal: (modal) =>
    set((state) => ({
      modals: { ...state.modals, [modal]: false }
    })),
  closeAllModals: () =>
    set({
      modals: {
        addProduct: false,
        editProduct: false,
        addUser: false,
        receipt: false,
        confirmDelete: false,
      }
    }),
  
  // POS state
  posBasket: [],
  addToBasket: (item) => {
    const basket = get().posBasket
    const existingIndex = basket.findIndex(b => b.productId === item.productId)
    
    if (existingIndex >= 0) {
      const newBasket = [...basket]
      newBasket[existingIndex].quantity += item.quantity
      set({ posBasket: newBasket })
    } else {
      set({ posBasket: [...basket, item] })
    }
  },
  updateBasketItem: (productId, quantity) => {
    const basket = get().posBasket
    if (quantity <= 0) {
      set({ posBasket: basket.filter(item => item.productId !== productId) })
    } else {
      set({
        posBasket: basket.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        )
      })
    }
  },
  removeFromBasket: (productId) => {
    set({
      posBasket: get().posBasket.filter(item => item.productId !== productId)
    })
  },
  clearBasket: () => set({ posBasket: [] }),
  
  // Filters and search
  productFilters: {
    search: '',
    category: '',
    lowStock: false,
  },
  setProductFilters: (filters) =>
    set((state) => ({
      productFilters: { ...state.productFilters, ...filters }
    })),
  
  salesFilters: {
    dateFrom: '',
    dateTo: '',
    productId: '',
    soldById: '',
  },
  setSalesFilters: (filters) =>
    set((state) => ({
      salesFilters: { ...state.salesFilters, ...filters }
    })),
}))