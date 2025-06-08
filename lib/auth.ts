const API_BASE_URL = 'https://lamoda.duckdns.org'

export interface LoginCredentials {
  login: string
  password: string
}

export interface RegisterData {
  inn: string
  company_name: string
  bank_account: string
  legal_address: string
  email: string
}

export interface User {
  inn: string
  company_name: string
  bank_account: string
  legal_address: string
  email: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  login?: string
  password?: string
  message?: string
}

class AuthService {
  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('access_token')
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('refresh_token')
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
  }

  public clearTokens(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  public isAuthenticated(): boolean {
    return !!this.getStoredToken()
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getStoredToken()
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    })

    if (response.status === 401) {
      // Try to refresh token
      const refreshed = await this.refreshToken()
      if (refreshed) {
        // Retry the original request
        const newToken = this.getStoredToken()
        return fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(newToken && { Authorization: `Bearer ${newToken}` }),
            ...options.headers,
          },
        })
      } else {
        this.clearTokens()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }

    return response
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.msg || 'Login failed')
    }

    const data: AuthResponse = await response.json()
    this.setTokens(data.access_token, data.refresh_token)
    return data
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }

    const result: AuthResponse = await response.json()
    this.setTokens(result.access_token, result.refresh_token)
    return result
  }

  public async refreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return false

    try {
      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      })

      if (!response.ok) return false

      const data = await response.json()
      this.setTokens(data.access_token, refreshToken)
      return true
    } catch {
      return false
    }
  }

  public async getCurrentUser(): Promise<User> {
    const response = await this.fetchWithAuth('/info')
    
    if (!response.ok) {
      throw new Error('Failed to fetch user info')
    }

    return response.json()
  }

  public async logout(): Promise<void> {
    try {
      // Try to call logout endpoint if we have a token
      const token = this.getStoredToken()
      if (token) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear tokens and redirect, even if server request fails
    this.clearTokens()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
      }
    }
  }
}

export const authService = new AuthService() 