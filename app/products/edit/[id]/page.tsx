"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Plus, Save, Loader2 } from "lucide-react"
import { LamodaButton } from "@/components/ui/lamoda-button"
import { LamodaCard } from "@/components/ui/lamoda-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { productService, type Product } from "@/lib/api/products"

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
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <LamodaButton 
            variant="outline" 
            size="sm" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </LamodaButton>
          <h1 className="text-2xl font-bold">Редактирование товара</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Basic Info */}
            <LamodaCard className="p-6">
              <h2 className="text-lg font-semibold mb-4">Основная информация</h2>
              
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

                <div>
                  <Label htmlFor="description">Описание</Label>
                  <textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Легкое платье из хлопка с цветочным узором..."
                    className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                  />
                </div>
              </div>
            </LamodaCard>

            {/* Additional Info */}
            <div className="space-y-6">
              {/* Images */}
              <LamodaCard className="p-6">
                <h2 className="text-lg font-semibold mb-4">Изображения</h2>
                
                <div className="space-y-4">
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
                  
                  <div className="grid grid-cols-2 gap-2">
                    {formData.images?.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280">No Image</text></svg>'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </LamodaCard>

              {/* Sizes */}
              <LamodaCard className="p-6">
                <h2 className="text-lg font-semibold mb-4">Размеры</h2>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(size => (
                    <Badge
                      key={size}
                      variant={formData.sizes?.includes(size) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </Badge>
                  ))}
                </div>
              </LamodaCard>

              {/* Colors */}
              <LamodaCard className="p-6">
                <h2 className="text-lg font-semibold mb-4">Цвета</h2>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(color => (
                    <Badge
                      key={color}
                      variant={formData.colors?.includes(color) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleColor(color)}
                    >
                      {color}
                    </Badge>
                  ))}
                </div>
              </LamodaCard>

              {/* Tags & Season */}
              <LamodaCard className="p-6">
                <h2 className="text-lg font-semibold mb-4">Теги и сезон</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label>Теги</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="платье, лето, новинка"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <LamodaButton type="button" onClick={addTag} size="sm">
                        <Plus className="w-4 h-4" />
                      </LamodaButton>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="season">Сезон</Label>
                    <Select value={formData.season as string || ''} onValueChange={(value) => handleInputChange('season', value)}>
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
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="in_stock"
                      checked={formData.in_stock}
                      onChange={(e) => handleInputChange('in_stock', e.target.checked)}
                    />
                    <Label htmlFor="in_stock">В наличии</Label>
                  </div>
                </div>
              </LamodaCard>

              {/* Category Specific Fields */}
              {formData.category === 'tshirt' && (
                <LamodaCard className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Параметры футболки</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="material">Материал</Label>
                      <Input
                        id="material"
                        value={formData.material || ''}
                        onChange={(e) => handleInputChange('material', e.target.value)}
                        placeholder="Хлопок — 100%"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sleeve_length">Длина рукава</Label>
                      <Select value={formData.sleeve_length || ''} onValueChange={(value) => handleInputChange('sleeve_length', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите длину рукава" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Короткий</SelectItem>
                          <SelectItem value="long">Длинный</SelectItem>
                          <SelectItem value="3/4">3/4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </LamodaCard>
              )}

              {formData.category === 'pants' && (
                <LamodaCard className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Параметры брюк</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="waist_type">Тип пояса</Label>
                      <Select value={formData.waist_type || ''} onValueChange={(value) => handleInputChange('waist_type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип пояса" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Высокий</SelectItem>
                          <SelectItem value="mid">Средний</SelectItem>
                          <SelectItem value="low">Низкий</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="length">Длина</Label>
                      <Select value={formData.length || ''} onValueChange={(value) => handleInputChange('length', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите длину" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Полная</SelectItem>
                          <SelectItem value="cropped">Укороченная</SelectItem>
                          <SelectItem value="short">Короткая</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </LamodaCard>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <LamodaButton 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
            >
              Отмена
            </LamodaButton>
            <LamodaButton 
              type="submit" 
              disabled={isLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
            </LamodaButton>
          </div>
        </form>
      </div>
    </div>
  )
} 