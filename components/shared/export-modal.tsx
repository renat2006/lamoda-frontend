'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { LamodaButton } from "@/components/ui/lamoda-button"
import { Download, FileText, Table, FileSpreadsheet, FileJson } from "lucide-react"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: string, options: ExportOptions) => void
  title: string
  description: string
  itemCount: number
}

interface ExportOptions {
  format: 'csv' | 'xlsx' | 'json' | 'pdf'
  includeHeaders: boolean
  encoding: 'utf-8' | 'windows-1251'
  dateFormat: 'iso' | 'ru'
}

const formatOptions = [
  {
    value: 'csv',
    label: 'CSV файл',
    description: 'Таблица для Excel/Google Sheets',
    icon: Table,
    color: 'text-green-600'
  },
  {
    value: 'xlsx',
    label: 'Excel файл',
    description: 'Готовый Excel документ',
    icon: FileSpreadsheet,
    color: 'text-blue-600'
  },
  {
    value: 'json',
    label: 'JSON файл',
    description: 'Структурированные данные',
    icon: FileJson,
    color: 'text-purple-600'
  },
  {
    value: 'pdf',
    label: 'PDF отчет',
    description: 'Печатная версия',
    icon: FileText,
    color: 'text-red-600'
  }
]

export function ExportModal({
  isOpen,
  onClose,
  onExport,
  title,
  description,
  itemCount
}: ExportModalProps) {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'csv',
    includeHeaders: true,
    encoding: 'utf-8',
    dateFormat: 'ru'
  })

  const handleExport = () => {
    onExport(options.format, options)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <Download className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center text-lg font-medium text-gray-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mt-2">
            {description}
          </DialogDescription>
          <div className="text-center text-sm text-gray-500 mt-1">
            К экспорту: {itemCount} записей
          </div>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Формат файла</label>
            <div className="grid grid-cols-2 gap-2">
              {formatOptions.map((format) => {
                const Icon = format.icon
                return (
                  <button
                    key={format.value}
                    onClick={() => setOptions(prev => ({ ...prev, format: format.value as any }))}
                    className={`p-3 border-2 rounded-lg text-left transition-all ${
                      options.format === format.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`h-4 w-4 ${format.color}`} />
                      <span className="font-medium text-sm">{format.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">{format.description}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Включить заголовки</label>
              <input
                type="checkbox"
                checked={options.includeHeaders}
                onChange={(e) => setOptions(prev => ({ ...prev, includeHeaders: e.target.checked }))}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>

            {(options.format === 'csv' || options.format === 'xlsx') && (
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Кодировка</label>
                <select
                  value={options.encoding}
                  onChange={(e) => setOptions(prev => ({ ...prev, encoding: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="utf-8">UTF-8 (рекомендуемая)</option>
                  <option value="windows-1251">Windows-1251 (для старых Excel)</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-gray-700">Формат дат</label>
              <select
                value={options.dateFormat}
                onChange={(e) => setOptions(prev => ({ ...prev, dateFormat: e.target.value as any }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="ru">ДД.ММ.ГГГГ (русский)</option>
                <option value="iso">ГГГГ-ММ-ДД (ISO)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <LamodaButton 
            onClick={handleExport}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Экспортировать
          </LamodaButton>
          <LamodaButton 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Отмена
          </LamodaButton>
        </div>
      </DialogContent>
    </Dialog>
  )
} 