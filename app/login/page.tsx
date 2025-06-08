"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { authService, type LoginCredentials } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginCredentials>({
    login: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authService.login(formData)
      toast({
        title: "Добро пожаловать!",
        description: "Вы успешно вошли в систему",
      })
      router.push('/products')
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: error instanceof Error ? error.message : "Неверный логин или пароль",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Lamoda Seller
          </h1>
          <p className="text-gray-600 text-sm">
            Вход в систему
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Login Field */}
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1">
                Логин
              </label>
              <input
                id="login"
                name="login"
                type="text"
                value={formData.login}
                onChange={handleChange}
                placeholder="Введите логин"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Введите пароль"
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              {isLoading ? "Вход..." : "Войти"}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Нет аккаунта?{" "}
              <Link 
                href="/register" 
                className="text-black hover:underline font-medium"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}