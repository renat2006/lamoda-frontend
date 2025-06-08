const API_BASE_URL = 'https://lamoda.duckdns.org'

export interface Product {
  id?: string
  name: string
  category: string
  brand?: string
  price: number
  currency?: string
  gender?: string
  sizes?: string[]
  colors?: string[]
  images?: string[]
  description?: string
  in_stock?: boolean
  tags?: string[]
  season?: string | string[]
  created_at?: string
  seller_id?: string
  // Category specific fields
  material?: string // For tshirt
  sleeve_length?: string // For tshirt
  waist_type?: string // For pants
  length?: string // For pants
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  pages: number
}

class ProductService {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('access_token')
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    })

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }

    return response
  }

  public async createProduct(product: Product): Promise<{ id: string }> {
    const response = await this.fetchWithAuth('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create product')
    }

    return response.json()
  }

  public async getProducts(): Promise<Product[]> {
    const response = await this.fetchWithAuth('/products')

    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }

    return response.json()
  }

  public async getProductsPaginated(page: number = 1, limit: number = 10): Promise<ProductsResponse> {
    const response = await this.fetchWithAuth(`/products/paginated?page=${page}&limit=${limit}`)

    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }

    return response.json()
  }

  public async getProduct(id: string): Promise<Product> {
    const response = await this.fetchWithAuth(`/products/${id}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Product not found')
      }
      throw new Error('Failed to fetch product')
    }

    return response.json()
  }

  public async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const response = await this.fetchWithAuth(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update product')
    }

    return response.json()
  }

  public async deleteProduct(id: string): Promise<void> {
    const response = await this.fetchWithAuth(`/products/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete product')
    }
  }

  public async deleteAllProducts(): Promise<{ message: string; deleted_count: number }> {
    const response = await this.fetchWithAuth('/products/all', {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete all products')
    }

    return response.json()
  }

  public async uploadExcel(file: File): Promise<{ message: string; created: number; errors: string[] }> {
    const token = this.getToken()
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/products/upload-excel`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to upload Excel file')
    }

    return response.json()
  }
}

export const productService = new ProductService()

// Helper function to format product data for different categories
export const formatProductForCategory = (product: Product): Product => {
  const baseProduct = {
    name: product.name,
    category: product.category,
    brand: product.brand,
    price: product.price,
    currency: product.currency || 'RUB',
    gender: product.gender,
    sizes: product.sizes || [],
    colors: product.colors || [],
    images: product.images || [],
    description: product.description,
    in_stock: product.in_stock ?? true,
    tags: product.tags || [],
    season: product.season,
  }

  // Add category-specific fields
  if (product.category === 'tshirt') {
    return {
      ...baseProduct,
      material: product.material,
      sleeve_length: product.sleeve_length,
    }
  }

  if (product.category === 'pants') {
    return {
      ...baseProduct,
      waist_type: product.waist_type,
      length: product.length,
    }
  }

  return baseProduct
} 