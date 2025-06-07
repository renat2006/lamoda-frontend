// Global types
export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: number
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  categoryId: string
  inStock: boolean
  createdAt: string
  updatedAt: string
} 