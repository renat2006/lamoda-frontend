// Lamoda Seller типы данных

export interface Order {
  id: string
  number: string
  date: string
  shippingDeadline?: string
  amount: number
  itemsCount: number
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  customer: {
    name: string
    email?: string
    phone?: string
  }
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
  name: string
  sellerSku: string
  lamodaSku?: string
  price: number
  discountPrice?: number
  inStock: number
  status: 'draft' | 'moderation' | 'active' | 'inactive' | 'rejected'
  images?: string[]
  brand?: string
  category?: string
  description?: string
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

export interface CardData {
  id: string
  title: string
  subtitle?: string
  description?: string
  badge?: string
  status?: string
  onClick?: () => void
}

export interface DataPoint {
  name: string
  value: number
  change?: number
  color?: string
}

export interface StatsData {
  title: string
  value: string
  change?: {
    value: string
    type: 'increase' | 'decrease' | 'neutral'
  }
  icon?: React.ReactNode
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}

export interface FilterItem {
  key: string
  label: string
  value: string | number | boolean
  type: 'text' | 'select' | 'checkbox' | 'date' | 'range'
  options?: Array<{ label: string; value: string | number }>
}

export interface Column {
  key: string
  label: string
  sortable?: boolean
  width?: string
  render?: (value: unknown, row: unknown) => React.ReactNode
}

export interface SidebarItem {
  title: string
  subtitle?: string
  badge?: string
  onClick?: () => void
}

export interface NotificationData {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
}

export interface UserProfile {
  name: string
  email: string
  role: string
  avatar?: string
  company?: string
} 