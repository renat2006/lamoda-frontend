// Utility functions for exporting products data
import { Product, ExportOptions } from '@/types/products'

export const exportProducts = async (products: Product[], options: ExportOptions) => {
  const { format, fields, includeImages, dateRange } = options

  // Filter products by date range if specified
  let filteredProducts = products
  if (dateRange) {
    filteredProducts = products.filter(product => {
      if (!product.created_at) return true
      const productDate = new Date(product.created_at)
      const fromDate = new Date(dateRange.from)
      const toDate = new Date(dateRange.to)
      return productDate >= fromDate && productDate <= toDate
    })
  }

  // Filter fields
  const exportData = filteredProducts.map(product => {
    const filtered: any = {}
    fields.forEach((field: string) => {
      if (field in product) {
        filtered[field] = (product as any)[field]
      }
    })
    return filtered
  })

  switch (format) {
    case 'csv':
      return exportProductsToCSV(exportData, fields)
    case 'xlsx':
      return exportProductsToExcel(exportData, fields)
    case 'json':
      return exportProductsToJSON(exportData)
    case 'pdf':
      return exportProductsToPDF(exportData, fields)
    default:
      throw new Error('Unsupported export format')
  }
}

const exportProductsToCSV = (data: any[], fields: string[]) => {
  const headers = fields.join(',')
  const rows = data.map(item => 
    fields.map(field => {
      const value = item[field]
      if (Array.isArray(value)) return `"${value.join('; ')}"`
      if (typeof value === 'object') return `"${JSON.stringify(value)}"`
      return `"${value || ''}"`
    }).join(',')
  ).join('\n')
  
  const csvContent = `${headers}\n${rows}`
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  downloadFile(blob, 'products.csv')
}

const exportProductsToExcel = async (data: any[], fields: string[]) => {
  // Simple Excel export using CSV format with Excel MIME type
  const headers = fields.join('\t')
  const rows = data.map(item => 
    fields.map(field => {
      const value = item[field]
      if (Array.isArray(value)) return value.join('; ')
      if (typeof value === 'object') return JSON.stringify(value)
      return value || ''
    }).join('\t')
  ).join('\n')
  
  const excelContent = `${headers}\n${rows}`
  const blob = new Blob([excelContent], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  })
  downloadFile(blob, 'products.xlsx')
}

const exportProductsToJSON = (data: any[]) => {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  downloadFile(blob, 'products.json')
}

const exportProductsToPDF = (data: any[], fields: string[]) => {
  // Simple PDF generation using HTML to PDF conversion
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Список товаров</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .header { text-align: center; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Список товаров</h1>
        <p>Экспортировано: ${new Date().toLocaleDateString('ru-RU')}</p>
      </div>
      <table>
        <thead>
          <tr>
            ${fields.map(field => `<th>${getFieldDisplayName(field)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(item => `
            <tr>
              ${fields.map(field => {
                const value = item[field]
                let displayValue = ''
                if (Array.isArray(value)) {
                  displayValue = value.join(', ')
                } else if (typeof value === 'object') {
                  displayValue = JSON.stringify(value)
                } else {
                  displayValue = value || ''
                }
                return `<td>${displayValue}</td>`
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `
  
  const blob = new Blob([htmlContent], { type: 'text/html' })
  downloadFile(blob, 'products.html')
}

const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const getFieldDisplayName = (field: string): string => {
  const fieldNames: { [key: string]: string } = {
    name: 'Название',
    category: 'Категория',
    brand: 'Бренд',
    price: 'Цена',
    originalPrice: 'Первоначальная цена',
    in_stock: 'В наличии',
    stock_quantity: 'Количество',
    tags: 'Теги',
    created_at: 'Дата создания',
    updated_at: 'Дата обновления',
    status: 'Статус',
    views: 'Просмотры',
    sales_count: 'Продажи',
    rating: 'Рейтинг',
    sku: 'Артикул',
    description: 'Описание'
  }
  return fieldNames[field] || field
}

export const getAvailableFields = (): { value: string, label: string }[] => [
  { value: 'name', label: 'Название' },
  { value: 'category', label: 'Категория' },
  { value: 'brand', label: 'Бренд' },
  { value: 'price', label: 'Цена' },
  { value: 'originalPrice', label: 'Первоначальная цена' },
  { value: 'in_stock', label: 'В наличии' },
  { value: 'stock_quantity', label: 'Количество' },
  { value: 'tags', label: 'Теги' },
  { value: 'created_at', label: 'Дата создания' },
  { value: 'updated_at', label: 'Дата обновления' },
  { value: 'status', label: 'Статус' },
  { value: 'views', label: 'Просмотры' },
  { value: 'sales_count', label: 'Продажи' },
  { value: 'rating', label: 'Рейтинг' },
  { value: 'sku', label: 'Артикул' },
  { value: 'description', label: 'Описание' }
] 