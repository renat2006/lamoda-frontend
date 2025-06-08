"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Plus, Save, Loader2, Image as ImageIcon, Tag, Package, Info, Menu, X } from "lucide-react"
import { LamodaButton } from "@/components/ui/lamoda-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { productService, type Product } from "@/lib/api/products"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  { value: 'tshirt', label: 'Футболка' },
  { value: 'pants', label: 'Брюки' },
  { value: 'dress', label: 'Платье' },
  { value: 'shoes', label: 'Обувь' },
  { value: 'accessories', label: 'Аксессуары' },
]

const GENDERS = [
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
  { value: 'unisex', label: 'Унисекс' },
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
const COLORS = ['белый', 'черный', 'серый', 'красный', 'синий', 'зеленый', 'желтый', 'розовый', 'фиолетовый', 'коричневый']
const SEASONS = ['весна', 'лето', 'осень', 'зима', 'всесезонный']

export default function EditProductPage() {
  const [formData, setFormData] = useState<Product>({
    name: '',
    category: '',
    brand: '',
    price: 0,
    currency: 'RUB',
    gender: '',
    sizes: [],
    colors: [],
    images: [],
    description: '',
    in_stock: true,
    tags: [],
    season: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newTag, setNewTag] = useState('')
  const [activeSection, setActiveSection] = useState('basic')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  const productId = params.id as string

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoadingProduct(true)
        const product = await productService.getProduct(productId)
        setFormData(product)
      } catch (error) {
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить данные товара",
          variant: "destructive",
        })
        router.push('/products')
      } finally {
        setIsLoadingProduct(false)
      }
    }

    if (productId) {
      loadProduct()
    }
  }, [productId, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.category || !formData.price) {
      toast({
        title: "Ошибка валидации",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await productService.updateProduct(productId, formData)
      toast({
        title: "Товар обновлен!",
        description: "Изменения успешно сохранены",
      })
      router.push('/products')
    } catch (error) {
      toast({
        title: "Ошибка обновления",
        description: error instanceof Error ? error.message : "Не удалось обновить товар",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), newImageUrl.trim()]
      }))
      setNewImageUrl('')
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }))
  }

  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes?.includes(size) 
        ? prev.sizes.filter(s => s !== size)
        : [...(prev.sizes || []), size]
    }))
  }

  const toggleColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors?.includes(color) 
        ? prev.colors.filter(c => c !== color)
        : [...(prev.colors || []), color]
    }))
  }

  const sections = [
    { id: 'basic', label: 'Основное', icon: Info },
    { id: 'images', label: 'Изображения', icon: ImageIcon },
    { id: 'variants', label: 'Варианты', icon: Package },
    { id: 'tags', label: 'Теги', icon: Tag },
  ]

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка товара...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 min-w-0">
              <LamodaButton 
                variant="ghost" 
                size="sm" 
                onClick={() => router.back()}
                className="shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </LamodaButton>
              <h1 className="text-xl font-semibold text-gray-900 truncate">
                Редактирование товара
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Desktop buttons */}
              <div className="hidden sm:flex items-center gap-3">
                <LamodaButton 
                  variant="outline" 
                  onClick={() => router.back()}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  Отмена
                </LamodaButton>
                <LamodaButton 
                  type="submit" 
                  form="product-form"
                  disabled={isLoading}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить
                    </>
                  )}
                </LamodaButton>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="lg:hidden pb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">
                {sections.findIndex(s => s.id === activeSection) + 1} из {sections.length}
              </span>
              <span className="text-xs text-gray-500">
                {Math.round(((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-black h-1 rounded-full transition-all duration-300"
                style={{ width: `${((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-[240px,1fr] lg:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                      activeSection === section.id
                        ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                        : "text-gray-600 hover:bg-white/50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {section.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:min-w-0">
            <form id="product-form" onSubmit={handleSubmit} className="space-y-6 pb-20 lg:pb-6">
              {/* Section Content */}
              <div className="bg-white rounded-lg border border-gray-200">
                {activeSection === 'basic' && (
                  <div className="p-4 sm:p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Название товара *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Платье летнее с цветочным принтом"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="category">Категория *</Label>
                          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map(cat => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="brand">Бренд</Label>
                          <Input
                            id="brand"
                            value={formData.brand || ''}
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                            placeholder="Zara"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="price">Цена *</Label>
                            <Input
                              id="price"
                              type="number"
                              value={formData.price}
                              onChange={(e) => handleInputChange('price', Number(e.target.value))}
                              placeholder="3499"
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="currency">Валюта</Label>
                            <Select value={formData.currency || 'RUB'} onValueChange={(value) => handleInputChange('currency', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="RUB">RUB</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="gender">Пол</Label>
                          <Select value={formData.gender || ''} onValueChange={(value) => handleInputChange('gender', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите пол" />
                            </SelectTrigger>
                            <SelectContent>
                              {GENDERS.map(gender => (
                                <SelectItem key={gender.value} value={gender.value}>
                                  {gender.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="in_stock"
                            checked={formData.in_stock}
                            onChange={(e) => handleInputChange('in_stock', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black focus:ring-1"
                          />
                          <Label htmlFor="in_stock">В наличии</Label>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Описание</Label>
                        <textarea
                          id="description"
                          value={formData.description || ''}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="Легкое платье из хлопка с цветочным узором..."
                          className="w-full min-h-[100px] p-3 border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'images' && (
                  <div className="p-4 sm:p-6 space-y-6">
                    <div className="flex gap-2">
                      <Input
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://cdn.lamoda.ru/images/1.jpg"
                      />
                      <LamodaButton type="button" onClick={addImage} size="sm">
                        <Plus className="w-4 h-4" />
                      </LamodaButton>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {formData.images?.map((url, index) => (
                        <div key={index} className="relative group aspect-square">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280">No Image</text></svg>'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'variants' && (
                  <div className="p-4 sm:p-6 space-y-6">
                    {/* Sizes */}
                    <div>
                      <Label>Размеры</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {SIZES.map(size => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={cn(
                              "px-3 py-1.5 text-sm rounded-md border transition-colors",
                              formData.sizes?.includes(size)
                                ? "bg-black text-white border-black"
                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                            )}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Colors */}
                    <div>
                      <Label>Цвета</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {COLORS.map(color => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => toggleColor(color)}
                            className={cn(
                              "px-3 py-1.5 text-sm rounded-md border transition-colors",
                              formData.colors?.includes(color)
                                ? "bg-black text-white border-black"
                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                            )}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Season */}
                    <div>
                      <Label htmlFor="season">Сезон</Label>
                      <Select value={Array.isArray(formData.season) ? formData.season[0] || '' : (formData.season || '')} onValueChange={(value) => handleInputChange('season', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите сезон" />
                        </SelectTrigger>
                        <SelectContent>
                          {SEASONS.map(season => (
                            <SelectItem key={season} value={season}>
                              {season}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {activeSection === 'tags' && (
                  <div className="p-4 sm:p-6 space-y-6">
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Добавить тег"
                      />
                      <LamodaButton type="button" onClick={addTag} size="sm">
                        <Plus className="w-4 h-4" />
                      </LamodaButton>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {formData.tags?.map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="px-3 py-1 text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 gap-1">
          {sections.map((section, index) => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            const isPassed = sections.findIndex(s => s.id === activeSection) > index
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-3 transition-colors",
                  isActive 
                    ? "text-black bg-gray-50" 
                    : isPassed 
                    ? "text-green-600"
                    : "text-gray-400"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors",
                  isActive 
                    ? "bg-black text-white border-black"
                    : isPassed
                    ? "bg-green-600 text-white border-green-600"
                    : "border-gray-300 text-gray-400"
                )}>
                  {isPassed ? '✓' : index + 1}
                </div>
                <span className="text-xs font-medium truncate">{section.label}</span>
              </button>
            )
          })}
        </div>
        
        {/* Mobile action buttons */}
        <div className="flex gap-2 p-3 border-t border-gray-100">
          <LamodaButton 
            variant="outline" 
            onClick={() => router.back()}
            className="flex-1"
          >
            Отмена
          </LamodaButton>
          <LamodaButton 
            type="submit" 
            form="product-form"
            disabled={isLoading}
            className="flex-1 bg-black text-white hover:bg-gray-800"
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </LamodaButton>
        </div>
      </div>
    </div>
  )
} 