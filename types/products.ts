export interface ProductFilters {
  search?: string
  category?: string[]
  brand?: string[]
  priceMin?: number
  priceMax?: number
  inStock?: boolean | null
  status?: ('active' | 'inactive' | 'pending' | 'rejected')[]
  createdDateFrom?: string
  createdDateTo?: string
  sizes?: string[]
  colors?: string[]
  tags?: string[]
  rating?: number
}

export interface ProductStats {
  total: number
  active: number
  inactive: number
  pending: number
  rejected: number
  inStock: number
  outOfStock: number
  averagePrice: number
  totalValue: number
  categories: { [key: string]: number }
  brands: { [key: string]: number }
}

export interface ExportOptions {
  format: 'xlsx' | 'csv' | 'json' | 'pdf'
  fields: string[]
  includeImages: boolean
  dateRange?: {
    from: string
    to: string
  }
}

export interface BulkEditOperation {
  operation: 'update' | 'delete' | 'duplicate' | 'activate' | 'deactivate'
  productIds: string[]
  updateData?: Partial<Product>
}

export interface Product {
  id?: string
  name: string
  category: string
  brand?: string
  price: number
  originalPrice?: number
  currency?: string
  gender?: string
  sizes?: string[]
  colors?: string[]
  images?: string[]
  description?: string
  in_stock?: boolean
  stock_quantity?: number
  tags?: string[]
  season?: string | string[]
  created_at?: string
  updated_at?: string
  seller_id?: string
  status?: 'active' | 'inactive' | 'pending' | 'rejected'
  views?: number
  sales_count?: number
  rating?: number
  reviews_count?: number
  sku?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  material?: string
  care_instructions?: string[]
  features?: string[]
}

export type ViewMode = 'grid' | 'list' | 'compact' | 'detailed'
export type SortOption = 'name' | 'price' | 'created' | 'updated' | 'views' | 'sales' | 'rating'
export type SortDirection = 'asc' | 'desc' 