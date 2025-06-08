"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Plus, Save, Loader2, Image as ImageIcon, Tag, Package, Info, Menu, X, ChevronRight, Check } from "lucide-react"
import { LamodaButton } from "@/components/ui/lamoda-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { productService, type Product } from "@/lib/api/products"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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
    if (field === 'price') {
      // Remove all non-digit characters and convert to number
      const numericValue = value.replace(/[^\d]/g, '')
      setFormData(prev => ({ ...prev, [field]: numericValue ? parseInt(numericValue) : 0 }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price)
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

  const handleNextSection = () => {
    const currentIndex = sections.findIndex(section => section.id === activeSection)
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id)
    }
  }

  const handlePrevSection = () => {
    const currentIndex = sections.findIndex(section => section.id === activeSection)
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id)
    }
  }

  const isLastSection = activeSection === sections[sections.length - 1].id

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
                {!isLastSection ? (
                  <LamodaButton 
                    onClick={handleNextSection}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    Далее
                  </LamodaButton>
                ) : (
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
                        Сохранить изменения
                      </>
                    )}
                  </LamodaButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Navigation tabs */}
          <div className="border-b">
            <nav className="flex -mb-px">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px",
                    activeSection === section.id
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Form content */}
          <form id="product-form" onSubmit={handleSubmit} className="p-6 pb-28">
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

                      <div className="space-y-2">
                        <Label htmlFor="price">Цена</Label>
                        <div className="relative">
                          <Input
                            id="price"
                            type="text"
                            value={formatPrice(formData.price)}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            className="pl-12"
                            placeholder="0"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            ₽
                          </div>
                        </div>
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

          {/* Floating action button */}
          <div className="fixed bottom-20 right-6 z-50">
            <Button
              type="submit"
              form="product-form"
              className="h-12 w-12 rounded-full shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <ChevronRight className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden sm:flex items-center justify-between border-t p-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Отмена
            </Button>
            <Button
              type="submit"
              form="product-form"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : sections.findIndex(s => s.id === activeSection) === sections.length - 1 ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Сохранить изменения
                </>
              ) : (
                <>
                  Далее
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 