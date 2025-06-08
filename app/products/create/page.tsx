"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Save, Package, Info, ImageIcon, Tag, Menu, X, ChevronRight, Loader2, Check } from "lucide-react"
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

export default function CreateProductPage() {
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
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newTag, setNewTag] = useState('')
  const [activeSection, setActiveSection] = useState('basic')
  const router = useRouter()
  const { toast } = useToast()

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
      await productService.createProduct(formData)
      toast({
        title: "Товар создан!",
        description: "Товар успешно добавлен в каталог",
      })
      router.push('/products')
    } catch (error) {
      toast({
        title: "Ошибка создания",
        description: error instanceof Error ? error.message : "Не удалось создать товар",
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
                Создание товара
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
                        Создание...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Создать товар
                      </>
                    )}
                  </LamodaButton>
                )}
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
                {/* Basic Information */}
                {activeSection === 'basic' && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Info className="w-5 h-5 text-gray-400" />
                      <h2 className="text-lg font-semibold text-gray-900">Основная информация</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Название товара *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Введите название товара"
                          className="mt-1"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                          Категория *
                        </Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="brand" className="text-sm font-medium text-gray-700">
                          Бренд
                        </Label>
                        <Input
                          id="brand"
                          value={formData.brand || ''}
                          onChange={(e) => handleInputChange('brand', e.target.value)}
                          placeholder="Название бренда"
                          className="mt-1"
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
                        <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                          Пол
                        </Label>
                        <Select value={formData.gender || ''} onValueChange={(value) => handleInputChange('gender', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Выберите пол" />
                          </SelectTrigger>
                          <SelectContent>
                            {GENDERS.map((gender) => (
                              <SelectItem key={gender.value} value={gender.value}>
                                {gender.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="season" className="text-sm font-medium text-gray-700">
                          Сезон
                        </Label>
                        <Select value={Array.isArray(formData.season) ? formData.season[0] || '' : (formData.season || '')} onValueChange={(value) => handleInputChange('season', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Выберите сезон" />
                          </SelectTrigger>
                          <SelectContent>
                            {SEASONS.map((season) => (
                              <SelectItem key={season} value={season}>
                                {season}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                          Описание
                        </Label>
                        <textarea
                          id="description"
                          value={formData.description || ''}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="Опишите товар подробно"
                          rows={4}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="in_stock"
                            checked={formData.in_stock}
                            onChange={(e) => handleInputChange('in_stock', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                          />
                          <Label htmlFor="in_stock" className="text-sm font-medium text-gray-700">
                            Товар в наличии
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Images Section */}
                {activeSection === 'images' && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                      <h2 className="text-lg font-semibold text-gray-900">Изображения</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="Вставьте URL изображения"
                          className="flex-1"
                        />
                        <LamodaButton type="button" onClick={addImage} className="bg-black text-white hover:bg-gray-800">
                          <Plus className="w-4 h-4" />
                        </LamodaButton>
                      </div>

                      {formData.images && formData.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Товар ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Variants Section */}
                {activeSection === 'variants' && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Package className="w-5 h-5 text-gray-400" />
                      <h2 className="text-lg font-semibold text-gray-900">Варианты товара</h2>
                    </div>

                    <div className="space-y-6">
                      {/* Sizes */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-3 block">Размеры</Label>
                        <div className="flex flex-wrap gap-2">
                          {SIZES.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => toggleSize(size)}
                              className={cn(
                                "px-3 py-1 text-sm rounded-md border transition-colors",
                                formData.sizes?.includes(size)
                                  ? "bg-black text-white border-black"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                              )}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Colors */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-3 block">Цвета</Label>
                        <div className="flex flex-wrap gap-2">
                          {COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => toggleColor(color)}
                              className={cn(
                                "px-3 py-1 text-sm rounded-md border transition-colors",
                                formData.colors?.includes(color)
                                  ? "bg-black text-white border-black"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                              )}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags Section */}
                {activeSection === 'tags' && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Tag className="w-5 h-5 text-gray-400" />
                      <h2 className="text-lg font-semibold text-gray-900">Теги</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Введите тег"
                          className="flex-1"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <LamodaButton type="button" onClick={addTag} className="bg-black text-white hover:bg-gray-800">
                          <Plus className="w-4 h-4" />
                        </LamodaButton>
                      </div>

                      {formData.tags && formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                      Создать товар
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
      </div>
    </div>
  )
} 