"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authService, type RegisterData } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterData>({
    inn: '',
    company_name: '',
    bank_account: '',
    legal_address: '',
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState<{ login: string; password: string } | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await authService.register(formData)
      setCredentials({
        login: result.login!,
        password: result.password!
      })
      toast({
        title: "Регистрация успешна!",
        description: "Ваши данные для входа показаны ниже",
      })
    } catch (error) {
      toast({
        title: "Ошибка регистрации",
        description: error instanceof Error ? error.message : "Произошла ошибка при регистрации",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // Success page after registration
  if (credentials) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Регистрация завершена!
            </h1>
            <p className="text-gray-600 text-sm">
              Сохраните ваши данные для входа
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-800 mb-3 text-center">Данные для входа:</h3>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Логин:</span>
                      <span className="font-mono font-medium text-gray-900">{credentials.login}</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Пароль:</span>
                      <span className="font-mono font-medium text-gray-900">{credentials.password}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-black text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors duration-150"
              >
                Перейти к входу
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Registration form
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Lamoda Seller
          </h1>
          <p className="text-gray-600 text-sm">
            Регистрация продавца
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Name */}
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                Название компании
              </label>
              <input
                id="company_name"
                name="company_name"
                type="text"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="ООО Ваша компания"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
              />
            </div>

            {/* INN */}
            <div>
              <label htmlFor="inn" className="block text-sm font-medium text-gray-700 mb-1">
                ИНН
              </label>
              <input
                id="inn"
                name="inn"
                type="text"
                value={formData.inn}
                onChange={handleChange}
                placeholder="1234567890"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="company@example.com"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
              />
            </div>

            {/* Bank Account */}
            <div>
              <label htmlFor="bank_account" className="block text-sm font-medium text-gray-700 mb-1">
                Банковский счет
              </label>
              <input
                id="bank_account"
                name="bank_account"
                type="text"
                value={formData.bank_account}
                onChange={handleChange}
                placeholder="40702810000000000000"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
              />
            </div>

            {/* Legal Address */}
            <div>
              <label htmlFor="legal_address" className="block text-sm font-medium text-gray-700 mb-1">
                Юридический адрес
              </label>
              <textarea
                id="legal_address"
                name="legal_address"
                value={formData.legal_address}
                onChange={handleChange}
                placeholder="г. Москва, ул. Примерная, д. 1, офис 100"
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{" "}
              <Link 
                href="/login" 
                className="text-black hover:underline font-medium"
              >
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}