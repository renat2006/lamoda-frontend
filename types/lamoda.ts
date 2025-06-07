// Lamoda Seller типы данных

export interface Order {
  id: string
  number: string
  date: string
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  amount: number
  itemsCount: number
  customer: {
    name: string
    email?: string
    phone?: string
  }
  shippingDeadline?: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  productId: string
  sku: string
  name: string
  size?: string
  color?: string
  quantity: number
  price: number
  image?: string
}

export interface Product {
  id: string
  sellerSku: string
  lamodaSku?: string
  name: string
  description: string
  category: string
  brand: string
  price: number
  discountPrice?: number
  images: string[]
  status: 'draft' | 'moderation' | 'active' | 'inactive' | 'rejected'
  inStock: number
  sizes?: ProductSize[]
  attributes: ProductAttribute[]
  createdAt: string
  updatedAt: string
}

export interface ProductSize {
  size: string
  quantity: number
  ean?: string
}

export interface ProductAttribute {
  name: string
  value: string
  required?: boolean
}

export interface Category {
  id: string
  name: string
  parentId?: string
  children?: Category[]
  attributes: CategoryAttribute[]
}

export interface CategoryAttribute {
  name: string
  type: 'text' | 'number' | 'select' | 'multiselect'
  required: boolean
  options?: string[]
}

export interface SellerProfile {
  id: string
  companyName: string
  personalCabinet: string
  contractNumber?: string
  startDate?: string
  phone?: string
  email?: string
  bankAccount?: {
    accountNumber: string
    bankName: string
    bic: string
    inn: string
  }
}

export interface Analytics {
  period: 'day' | 'week' | 'month' | 'year'
  sales: {
    date: string
    amount: number
    ordersCount: number
  }[]
  topProducts: {
    productId: string
    name: string
    salesCount: number
    revenue: number
  }[]
  metrics: {
    totalRevenue: number
    averageCheck: number
    conversionRate: number
    returnRate: number
  }
}

export interface Filter {
  countries?: string[]
  statuses?: string[]
  dateFrom?: string
  dateTo?: string
  search?: string
  categories?: string[]
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
  message?: string
}

// Навигационные типы
export type NavigationItem = {
  name: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  current?: boolean
}

export type TabItem = {
  name: string
  key: string
  count?: number
} 