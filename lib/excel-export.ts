import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { formatCurrency, formatNumber, formatDate } from './format-utils'

interface Product {
  id: string
  name: string
  sellerSku: string
  category: string
  price: number
  stock: number
  status: "active" | "moderation" | "rejected" | "draft"
  imageUrl?: string
  salesLast30Days: number
  rating: number
  createdAt: string
  rejectionReason?: string
  urgent: boolean
  lowStock: boolean
  sales: number
  views: number
  conversion: number
  brand?: string
  material?: string
  description?: string
}

interface ExcelExportOptions {
  includeImages?: boolean
  includeAnalytics?: boolean
  includeInventory?: boolean
  dateRange?: {
    from: string
    to: string
  }
  customFields?: string[]
}

export class ProductExcelExporter {
  private workbook: XLSX.WorkBook
  private products: Product[]
  private options: ExcelExportOptions

  constructor(products: Product[], options: ExcelExportOptions = {}) {
    this.products = products
    this.options = options
    this.workbook = XLSX.utils.book_new()
  }

  // Основная функция экспорта
  async export(filename?: string): Promise<void> {
    // Создаем листы
    this.createProductsSheet()
    this.createInventorySheet()
    this.createAnalyticsSheet()
    this.createSummarySheet()

    // Генерируем имя файла
    const exportFilename = filename || this.generateFilename()

    // Сохраняем файл
    const excelBuffer = XLSX.write(this.workbook, { 
      bookType: 'xlsx', 
      type: 'array',
      cellStyles: true
    })
    
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    saveAs(blob, exportFilename)
  }

  // Лист с товарами
  private createProductsSheet(): void {
    const headers = [
      'ID товара',
      'Название',
      'Артикул продавца',
      'Категория',
      'Бренд',
      'Цена (₽)',
      'Остаток',
      'Статус',
      'Рейтинг',
      'Продажи за 30 дней',
      'Просмотры',
      'Конверсия (%)',
      'Дата создания',
      'Материал',
      'Описание',
      'Причина отклонения',
      'Требует внимания',
      'Мало остатков'
    ]

    const data = this.products.map(product => [
      product.id,
      product.name,
      product.sellerSku,
      product.category,
      product.brand || '',
      product.price,
      product.stock,
      this.getStatusText(product.status),
      product.rating || 0,
      product.salesLast30Days,
      product.views,
      product.conversion.toFixed(2),
      formatDate(product.createdAt),
      product.material || '',
      product.description || '',
      product.rejectionReason || '',
      product.urgent ? 'Да' : 'Нет',
      product.lowStock ? 'Да' : 'Нет'
    ])

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data])
    
    // Настройки ширины колонок
    const columnWidths = [
      { wch: 15 }, // ID
      { wch: 30 }, // Название
      { wch: 20 }, // Артикул
      { wch: 15 }, // Категория
      { wch: 15 }, // Бренд
      { wch: 12 }, // Цена
      { wch: 10 }, // Остаток
      { wch: 12 }, // Статус
      { wch: 8 },  // Рейтинг
      { wch: 12 }, // Продажи
      { wch: 12 }, // Просмотры
      { wch: 12 }, // Конверсия
      { wch: 15 }, // Дата
      { wch: 20 }, // Материал
      { wch: 40 }, // Описание
      { wch: 30 }, // Причина отклонения
      { wch: 15 }, // Требует внимания
      { wch: 15 }  // Мало остатков
    ]
    
    worksheet['!cols'] = columnWidths

    // Форматирование заголовков
    this.formatHeaders(worksheet, headers.length)
    
    // Условное форматирование
    this.applyConditionalFormatting(worksheet, data.length + 1)

    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Товары')
  }

  // Лист с инвентаризацией
  private createInventorySheet(): void {
    const headers = [
      'Артикул',
      'Название товара',
      'Категория',
      'Текущий остаток',
      'Зарезервировано',
      'Доступно к продаже',
      'Средние продажи в день',
      'Дней до окончания',
      'Статус остатков',
      'Рекомендуемый заказ'
    ]

    const data = this.products.map(product => {
      const avgSalesPerDay = product.salesLast30Days / 30
      const daysLeft = avgSalesPerDay > 0 ? Math.floor(product.stock / avgSalesPerDay) : Infinity
      const stockStatus = this.getStockStatus(product.stock, daysLeft)
      const recommendedOrder = this.calculateRecommendedOrder(product.stock, avgSalesPerDay)

      return [
        product.sellerSku,
        product.name,
        product.category,
        product.stock,
        Math.floor(product.stock * 0.1), // Примерное резервирование 10%
        Math.floor(product.stock * 0.9),
        avgSalesPerDay.toFixed(1),
        daysLeft === Infinity ? 'N/A' : daysLeft,
        stockStatus,
        recommendedOrder
      ]
    })

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data])
    
    worksheet['!cols'] = [
      { wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 12 }, { wch: 12 },
      { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 15 }
    ]

    this.formatHeaders(worksheet, headers.length)
    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Инвентаризация')
  }

  // Лист с аналитикой
  private createAnalyticsSheet(): void {
    const headers = [
      'Категория',
      'Количество товаров',
      'Общая стоимость остатков',
      'Продажи за 30 дней',
      'Выручка за 30 дней',
      'Средний рейтинг',
      'Средняя конверсия',
      'Доля от общих продаж (%)'
    ]

    // Группируем по категориям
    const categoryStats = this.calculateCategoryStats()
    
    const data = Object.entries(categoryStats).map(([category, stats]) => [
      category,
      stats.count,
      formatNumber(stats.totalStockValue),
      stats.totalSales,
      formatNumber(stats.totalRevenue),
      stats.avgRating.toFixed(2),
      stats.avgConversion.toFixed(2),
      stats.salesShare.toFixed(1)
    ])

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data])
    
    worksheet['!cols'] = [
      { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, 
      { wch: 18 }, { wch: 12 }, { wch: 15 }, { wch: 18 }
    ]

    this.formatHeaders(worksheet, headers.length)
    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Аналитика по категориям')
  }

  // Сводный лист
  private createSummarySheet(): void {
    const totalProducts = this.products.length
    const activeProducts = this.products.filter(p => p.status === 'active').length
    const totalStockValue = this.products.reduce((sum, p) => sum + (p.price * p.stock), 0)
    const totalSales = this.products.reduce((sum, p) => sum + p.salesLast30Days, 0)
    const totalRevenue = this.products.reduce((sum, p) => sum + (p.salesLast30Days * p.price), 0)
    const avgRating = this.products.reduce((sum, p) => sum + (p.rating || 0), 0) / totalProducts
    const lowStockCount = this.products.filter(p => p.lowStock).length
    const urgentCount = this.products.filter(p => p.urgent).length

    const summaryData = [
      ['ОБЩАЯ СТАТИСТИКА ТОВАРОВ', ''],
      ['', ''],
      ['Общее количество товаров', totalProducts],
      ['Активных товаров', activeProducts],
      ['Товаров на модерации', this.products.filter(p => p.status === 'moderation').length],
      ['Отклоненных товаров', this.products.filter(p => p.status === 'rejected').length],
      ['Черновиков', this.products.filter(p => p.status === 'draft').length],
      ['', ''],
      ['ФИНАНСОВЫЕ ПОКАЗАТЕЛИ', ''],
      ['', ''],
      ['Общая стоимость остатков', formatCurrency(totalStockValue)],
      ['Продажи за 30 дней (шт)', formatNumber(totalSales)],
      ['Выручка за 30 дней', formatCurrency(totalRevenue)],
      ['Средняя цена товара', formatCurrency(totalStockValue / totalProducts)],
      ['Средний рейтинг', avgRating.toFixed(2)],
      ['', ''],
      ['ПРОБЛЕМЫ И ВНИМАНИЕ', ''],
      ['', ''],
      ['Товаров с низким остатком', lowStockCount],
      ['Требует срочного внимания', urgentCount],
      ['Товаров без продаж', this.products.filter(p => p.salesLast30Days === 0).length],
      ['', ''],
      ['ТОП-5 ТОВАРОВ ПО ПРОДАЖАМ', ''],
      ['', '']
    ]

    // Добавляем топ товары
    const topProducts = this.products
      .sort((a, b) => b.salesLast30Days - a.salesLast30Days)
      .slice(0, 5)

    topProducts.forEach((product, index) => {
      summaryData.push([
        `${index + 1}. ${product.name}`,
        `${product.salesLast30Days} продаж`
      ])
    })

    const worksheet = XLSX.utils.aoa_to_sheet(summaryData)
    
    // Устанавливаем ширину колонок
    worksheet['!cols'] = [{ wch: 40 }, { wch: 20 }]

    // Форматируем заголовки секций
    const headerCells = ['A1', 'A9', 'A17', 'A23']
    headerCells.forEach(cell => {
      if (worksheet[cell]) {
        worksheet[cell].s = {
          font: { bold: true, size: 14 },
          fill: { fgColor: { rgb: 'E8F4FD' } },
          alignment: { horizontal: 'left' }
        }
      }
    })

    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Сводка')
  }

  // Вспомогательные методы
  private getStatusText(status: string): string {
    const statusMap = {
      active: 'Активен',
      moderation: 'На модерации',
      rejected: 'Отклонен',
      draft: 'Черновик'
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  private getStockStatus(stock: number, daysLeft: number): string {
    if (stock === 0) return 'Нет в наличии'
    if (daysLeft < 7) return 'Критически мало'
    if (daysLeft < 14) return 'Мало'
    if (daysLeft < 30) return 'Нормально'
    return 'Достаточно'
  }

  private calculateRecommendedOrder(stock: number, avgSalesPerDay: number): number {
    if (avgSalesPerDay === 0) return 0
    const targetDays = 30
    const targetStock = avgSalesPerDay * targetDays
    return Math.max(0, Math.ceil(targetStock - stock))
  }

  private calculateCategoryStats() {
    const stats: Record<string, any> = {}
    const totalSales = this.products.reduce((sum, p) => sum + p.salesLast30Days, 0)

    this.products.forEach(product => {
      const category = product.category
      if (!stats[category]) {
        stats[category] = {
          count: 0,
          totalStockValue: 0,
          totalSales: 0,
          totalRevenue: 0,
          totalRating: 0,
          totalConversion: 0,
          products: []
        }
      }

      const categoryStats = stats[category]
      categoryStats.count++
      categoryStats.totalStockValue += product.price * product.stock
      categoryStats.totalSales += product.salesLast30Days
      categoryStats.totalRevenue += product.salesLast30Days * product.price
      categoryStats.totalRating += product.rating || 0
      categoryStats.totalConversion += product.conversion
      categoryStats.products.push(product)
    })

    // Вычисляем средние значения
    Object.keys(stats).forEach(category => {
      const categoryStats = stats[category]
      categoryStats.avgRating = categoryStats.totalRating / categoryStats.count
      categoryStats.avgConversion = categoryStats.totalConversion / categoryStats.count
      categoryStats.salesShare = (categoryStats.totalSales / totalSales) * 100
    })

    return stats
  }

  private formatHeaders(worksheet: XLSX.WorkSheet, columnCount: number): void {
    for (let i = 0; i < columnCount; i++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i })
      if (!worksheet[cellAddress]) continue
      
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: 'C5504B' } }, // Lamoda red
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } }
        }
      }
    }
  }

  private applyConditionalFormatting(worksheet: XLSX.WorkSheet, rowCount: number): void {
    // Форматирование для статуса (колонка H)
    for (let i = 1; i < rowCount; i++) {
      const statusCell = `H${i + 1}`
      if (worksheet[statusCell]) {
        const status = worksheet[statusCell].v
        let bgColor = 'FFFFFF'
        
        switch (status) {
          case 'Активен':
            bgColor = 'D4EDDA'
            break
          case 'На модерации':
            bgColor = 'FFF3CD'
            break
          case 'Отклонен':
            bgColor = 'F8D7DA'
            break
          case 'Черновик':
            bgColor = 'E2E3E5'
            break
        }
        
        worksheet[statusCell].s = {
          fill: { fgColor: { rgb: bgColor } },
          alignment: { horizontal: 'center' }
        }
      }

      // Форматирование для низких остатков (колонка G)
      const stockCell = `G${i + 1}`
      if (worksheet[stockCell] && worksheet[stockCell].v < 10) {
        worksheet[stockCell].s = {
          font: { color: { rgb: 'DC3545' } },
          fill: { fgColor: { rgb: 'F8D7DA' } }
        }
      }
    }
  }

  private generateFilename(): string {
    const date = new Date().toISOString().split('T')[0]
    const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-')
    return `lamoda-products-${date}-${time}.xlsx`
  }
}

// Функция для быстрого экспорта
export async function exportProductsToExcel(
  products: Product[], 
  options: ExcelExportOptions = {},
  filename?: string
): Promise<void> {
  const exporter = new ProductExcelExporter(products, options)
  await exporter.export(filename)
}

// Экспорт шаблона для импорта товаров
export function exportProductTemplate(): void {
  const headers = [
    'Название товара*',
    'Артикул продавца*',
    'Категория*',
    'Бренд*',
    'Цена*',
    'Остаток*',
    'Описание',
    'Материал',
    'Страна производства',
    'Размер',
    'Цвет',
    'Штрихкод',
    'SEO заголовок',
    'SEO описание',
    'Теги (через запятую)'
  ]

  const exampleData = [
    [
      'Джинсы slim fit мужские',
      'JEANS-001-M-BLUE',
      'Одежда',
      'Levi\'s',
      '3299',
      '50',
      'Стильные мужские джинсы slim fit из качественного денима',
      '98% хлопок, 2% эластан',
      'Турция',
      'M',
      'Синий',
      '4607012345678',
      'Джинсы slim fit мужские Levi\'s | Купить в Lamoda',
      'Стильные мужские джинсы slim fit от Levi\'s. Качественный деним, удобная посадка.',
      'джинсы, мужские, slim fit, деним'
    ]
  ]

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...exampleData])
  
  // Устанавливаем ширину колонок
  worksheet['!cols'] = headers.map(() => ({ wch: 20 }))
  
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Шаблон товаров')

  // Добавляем лист с инструкциями
  const instructions = [
    ['ИНСТРУКЦИЯ ПО ЗАПОЛНЕНИЮ'],
    [''],
    ['Обязательные поля отмечены звездочкой (*)'],
    [''],
    ['Название товара*: Полное название товара (до 100 символов)'],
    ['Артикул продавца*: Уникальный артикул вашего товара'],
    ['Категория*: Выберите из списка: Одежда, Обувь, Аксессуары, Спорт'],
    ['Бренд*: Название бренда товара'],
    ['Цена*: Цена в рублях (только цифры)'],
    ['Остаток*: Количество товара на складе'],
    ['Описание: Подробное описание товара'],
    ['Материал: Состав материала товара'],
    ['Страна производства: Страна-производитель'],
    ['Размер: Размер товара (XS, S, M, L, XL, XXL или числовые)'],
    ['Цвет: Цвет товара'],
    ['Штрихкод: EAN или другой штрихкод товара'],
    ['SEO заголовок: Заголовок для поисковых систем (до 60 символов)'],
    ['SEO описание: Описание для поисковых систем (до 160 символов)'],
    ['Теги: Ключевые слова через запятую для поиска']
  ]

  const instructionSheet = XLSX.utils.aoa_to_sheet(instructions)
  instructionSheet['!cols'] = [{ wch: 80 }]
  XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Инструкция')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  })
  saveAs(blob, 'lamoda-products-template.xlsx')
} 