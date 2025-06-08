"use client"

import { useState, useEffect } from "react"
import { X, Upload, Plus, Minus, Save, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { LamodaButton } from "@/components/ui/lamoda-button"
import { LamodaCard } from "@/components/ui/lamoda-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ProductVariant {
  id: string
  size: string
  color: string
  sku: string
  price: number
  stock: number
  barcode?: string
}

interface ProductFormData {
  name: string
  description: string
  category: string
  brand: string
  variants: ProductVariant[]
  tags: string[]
}

interface Product {
  id?: string
  name: string
  sellerSku: string
  category: string
  price: number
  stock: number
  status: "active" | "moderation" | "rejected" | "draft"
  description?: string
  brand?: string
  variants?: ProductVariant[]
}

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product?: Product | null
  onSave: (product: ProductFormData) => Promise<void>
  isLoading?: boolean
}

const categories = [
  { value: 'clothing', label: 'Одежда' },
  { value: 'shoes', label: 'Обувь' },
  { value: 'accessories', label: 'Аксессуары' },
  { value: 'sport', label: 'Спорт' }
]

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
const colors = ['Белый', 'Черный', 'Серый', 'Красный', 'Синий', 'Зеленый', 'Желтый', 'Коричневый', 'Розовый', 'Фиолетовый']

export function ProductModal({ isOpen, onClose, product, onSave, isLoading = false }: ProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    brand: '',
    variants: [],
    tags: []
  })

  const [activeTab, setActiveTab] = useState('basic')
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        brand: product.brand || '',
        variants: product.variants || [{
          id: '1',
          size: 'M',
          color: 'Синий',
          sku: product.sellerSku || '',
          price: product.price || 0,
          stock: product.stock || 0
        }],
        tags: []
      })
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        description: '',
        category: '',
        brand: '',
        variants: [{
          id: '1',
          size: 'M',
          color: 'Синий',
          sku: '',
          price: 0,
          stock: 0
        }],
        tags: []
      })
    }
  }, [product, isOpen])

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: Date.now().toString(),
      size: 'M',
      color: 'Синий',
      sku: '',
      price: 0,
      stock: 0
    }
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }))
  }

  const removeVariant = (variantId: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== variantId)
    }))
  }

  const updateVariant = (variantId: string, field: keyof ProductVariant, value: any) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(v => 
        v.id === variantId ? { ...v, [field]: value } : v
      )
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Название товара обязательно'
    if (!formData.category) newErrors.category = 'Выберите категорию'
    if (!formData.brand.trim()) newErrors.brand = 'Укажите бренд'
    if (formData.variants.length === 0) newErrors.variants = 'Добавьте хотя бы один вариант'
    
    formData.variants.forEach((variant, index) => {
      if (!variant.sku.trim()) newErrors[`variant_${index}_sku`] = 'SKU обязателен'
      if (variant.price <= 0) newErrors[`variant_${index}_price`] = 'Цена должна быть больше 0'
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-light text-foreground">
              {product ? 'Редактировать товар' : 'Создать новый товар'}
            </h2>
            <p className="text-sm text-foreground/60">
              {product ? 'Внесите изменения в карточку товара' : 'Заполните информацию о товаре для Lamoda'}
            </p>
          </div>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'basic', label: 'Основное' },
              { id: 'variants', label: 'Варианты' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "py-4 px-2 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground/60 hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Название товара *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Например: Джинсы slim fit"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="brand">Бренд *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="Например: Levi's"
                    className={errors.brand ? 'border-red-500' : ''}
                  />
                  {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="category">Категория *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                  placeholder="Подробное описание товара..."
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Tags */}
              <div>
                <Label>Теги</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Добавить тег..."
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'variants' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Варианты товара</h3>
                  <p className="text-sm text-foreground/60">Добавьте размеры, цвета и цены</p>
                </div>
                <Button onClick={addVariant} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить вариант
                </Button>
              </div>

              {errors.variants && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-red-700 text-sm">{errors.variants}</span>
                </div>
              )}

              <div className="space-y-4">
                {formData.variants.map((variant, index) => (
                  <LamodaCard key={variant.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Вариант {index + 1}</h4>
                      {formData.variants.length > 1 && (
                        <Button 
                          onClick={() => removeVariant(variant.id)}
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label>Размер</Label>
                        <Select
                          value={variant.size}
                          onValueChange={(value) => updateVariant(variant.id, 'size', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {sizes.map(size => (
                              <SelectItem key={size} value={size}>{size}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Цвет</Label>
                        <Select
                          value={variant.color}
                          onValueChange={(value) => updateVariant(variant.id, 'color', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {colors.map(color => (
                              <SelectItem key={color} value={color}>{color}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>SKU *</Label>
                        <Input
                          value={variant.sku}
                          onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                          placeholder="PROD-001"
                          className={errors[`variant_${index}_sku`] ? 'border-red-500' : ''}
                        />
                        {errors[`variant_${index}_sku`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`variant_${index}_sku`]}</p>
                        )}
                      </div>

                      <div>
                        <Label>Цена *</Label>
                        <Input
                          type="number"
                          value={variant.price}
                          onChange={(e) => updateVariant(variant.id, 'price', Number(e.target.value))}
                          placeholder="0"
                          className={errors[`variant_${index}_price`] ? 'border-red-500' : ''}
                        />
                        {errors[`variant_${index}_price`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`variant_${index}_price`]}</p>
                        )}
                      </div>

                      <div>
                        <Label>Остаток</Label>
                        <Input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => updateVariant(variant.id, 'stock', Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <Label>Штрихкод</Label>
                        <Input
                          value={variant.barcode || ''}
                          onChange={(e) => updateVariant(variant.id, 'barcode', e.target.value)}
                          placeholder="4607012345678"
                        />
                      </div>
                    </div>
                  </LamodaCard>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex items-center gap-4">
            {Object.keys(errors).length > 0 && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Исправьте ошибки перед сохранением</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <LamodaButton 
              onClick={handleSubmit}
              disabled={isLoading || Object.keys(errors).length > 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {product ? 'Сохранить изменения' : 'Создать товар'}
                </>
              )}
            </LamodaButton>
          </div>
        </div>
      </div>
    </div>
  )
} 