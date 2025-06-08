"use client"

import { useState } from "react"
import { Download, FileText, File, FileSpreadsheet, X } from "lucide-react"
import { LamodaButton } from "@/components/ui/lamoda-button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ExportOptions } from "@/types/products"
import { getAvailableFields } from "@/lib/product-export-utils"
import { cn } from "@/lib/utils"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (options: ExportOptions) => void
  selectedCount: number
}

export function ExportModal({ isOpen, onClose, onExport, selectedCount }: ExportModalProps) {
  const [format, setFormat] = useState<ExportOptions['format']>('xlsx')
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'name', 'category', 'brand', 'price', 'in_stock', 'created_at'
  ])
  const [includeImages, setIncludeImages] = useState(false)
  const [dateRange, setDateRange] = useState<ExportOptions['dateRange']>()

  const availableFields = getAvailableFields()

  const formats = [
    { 
      value: 'xlsx', 
      label: 'Excel (XLSX)', 
      icon: FileSpreadsheet, 
      description: 'Подходит для анализа и редактирования' 
    },
    { 
      value: 'csv', 
      label: 'CSV', 
      icon: FileText, 
      description: 'Универсальный формат для импорта' 
    },
    { 
      value: 'json', 
      label: 'JSON', 
      icon: File, 
      description: 'Для программной обработки' 
    },
    { 
      value: 'pdf', 
      label: 'PDF', 
      icon: FileText, 
      description: 'Для печати и просмотра' 
    }
  ] as const

  const toggleField = (fieldValue: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldValue)
        ? prev.filter(f => f !== fieldValue)
        : [...prev, fieldValue]
    )
  }

  const selectAllFields = () => {
    setSelectedFields(availableFields.map(f => f.value))
  }

  const clearAllFields = () => {
    setSelectedFields([])
  }

  const handleExport = () => {
    onExport({
      format,
      fields: selectedFields,
      includeImages,
      dateRange
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-medium text-foreground">Экспорт товаров</h2>
            <p className="text-sm text-foreground/60 mt-1">
              {selectedCount > 0 
                ? `Экспортируется ${selectedCount} выбранных товаров`
                : 'Экспортируются все товары'
              }
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Формат файла</h3>
            <div className="grid grid-cols-2 gap-3">
              {formats.map(fmt => {
                const Icon = fmt.icon
                return (
                  <button
                    key={fmt.value}
                    onClick={() => setFormat(fmt.value)}
                    className={cn(
                      "p-4 border rounded-lg text-left transition-all",
                      format === fmt.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-foreground/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-foreground/40" />
                      <div>
                        <div className="font-medium text-foreground">{fmt.label}</div>
                        <div className="text-xs text-foreground/60">{fmt.description}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Fields Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground">
                Поля для экспорта ({selectedFields.length})
              </h3>
              <div className="flex gap-2">
                <LamodaButton variant="ghost" size="sm" onClick={selectAllFields}>
                  Выбрать все
                </LamodaButton>
                <LamodaButton variant="ghost" size="sm" onClick={clearAllFields}>
                  Очистить
                </LamodaButton>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 border border-border rounded-lg">
              {availableFields.map(field => (
                <label key={field.value} className="flex items-center space-x-2 text-sm">
                  <Checkbox
                    checked={selectedFields.includes(field.value)}
                    onCheckedChange={() => toggleField(field.value)}
                  />
                  <span className="truncate">{field.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Дополнительные настройки</h3>
            
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={includeImages}
                onCheckedChange={(checked) => setIncludeImages(checked === true)}
              />
              <span className="text-sm">Включить ссылки на изображения</span>
            </label>

            {/* Date Range */}
            <div>
              <label className="text-sm text-foreground/60 block mb-2">
                Период создания (опционально)
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange?.from || ''}
                  onChange={(e) => setDateRange(prev => ({ 
                    from: e.target.value, 
                    to: prev?.to || '' 
                  }))}
                  className="px-3 py-2 border border-border rounded text-sm"
                  placeholder="От"
                />
                <input
                  type="date"
                  value={dateRange?.to || ''}
                  onChange={(e) => setDateRange(prev => ({ 
                    from: prev?.from || '', 
                    to: e.target.value 
                  }))}
                  className="px-3 py-2 border border-border rounded text-sm"
                  placeholder="До"
                />
              </div>
            </div>
          </div>

          {/* Selected Fields Preview */}
          {selectedFields.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Выбранные поля:</h4>
              <div className="flex flex-wrap gap-1">
                {selectedFields.map(fieldValue => {
                  const field = availableFields.find(f => f.value === fieldValue)
                  return (
                    <Badge key={fieldValue} variant="secondary" className="text-xs">
                      {field?.label}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
          <div className="text-sm text-foreground/60">
            Будет экспортировано: {selectedFields.length} полей
          </div>
          <div className="flex gap-3">
            <LamodaButton variant="outline" onClick={onClose}>
              Отмена
            </LamodaButton>
            <LamodaButton 
              onClick={handleExport}
              disabled={selectedFields.length === 0}
              className="bg-primary hover:bg-primary/90"
            >
              <Download className="w-4 h-4 mr-2" />
              Экспортировать
            </LamodaButton>
          </div>
        </div>
      </div>
    </div>
  )
} 