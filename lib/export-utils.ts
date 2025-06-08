// Utility functions for exporting data and printing labels

interface LegacyExportOptions {
  format: 'csv' | 'xlsx' | 'json' | 'pdf'
  includeHeaders: boolean
  encoding: 'utf-8' | 'windows-1251'
  dateFormat: 'iso' | 'ru'
}

// Format date according to options
export function formatDate(date: string | Date, format: 'iso' | 'ru'): string {
  const d = new Date(date)
  if (format === 'iso') {
    return d.toISOString().split('T')[0]
  }
  return d.toLocaleDateString('ru-RU')
}

// Export to CSV
export function exportToCSV(data: any[], filename: string, options: LegacyExportOptions): void {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvRows = []

  if (options.includeHeaders) {
    csvRows.push(headers.join(','))
  }

  for (const row of data) {
    const values = headers.map(header => {
      let value = row[header]
      
      // Format dates
      if (value instanceof Date || (typeof value === 'string' && Date.parse(value))) {
        value = formatDate(value, options.dateFormat)
      }
      
      // Escape quotes and wrap in quotes if contains comma
      if (typeof value === 'string') {
        value = value.replace(/"/g, '""')
        if (value.includes(',') || value.includes('\n') || value.includes('"')) {
          value = `"${value}"`
        }
      }
      
      return value
    })
    csvRows.push(values.join(','))
  }

  const csvString = csvRows.join('\n')
  
  // Handle encoding
  let blob: Blob
  if (options.encoding === 'windows-1251') {
    // For Windows-1251 encoding (legacy Excel support)
    const uint8Array = new TextEncoder().encode(csvString)
    blob = new Blob([uint8Array], { type: 'text/csv;charset=windows-1251' })
  } else {
    // UTF-8 with BOM for better Excel support
    blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8' })
  }

  downloadFile(blob, filename)
}

// Export to JSON
export function exportToJSON(data: any[], filename: string, options: LegacyExportOptions): void {
  const processedData = data.map(item => {
    const processed = { ...item }
    
    // Format dates in JSON
    Object.keys(processed).forEach(key => {
      if (processed[key] instanceof Date || (typeof processed[key] === 'string' && Date.parse(processed[key]))) {
        processed[key] = formatDate(processed[key], options.dateFormat)
      }
    })
    
    return processed
  })

  const jsonString = JSON.stringify(processedData, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' })
  downloadFile(blob, filename)
}

// Generate PDF report
export function exportToPDF(data: any[], filename: string, title: string): void {
  // Create a simple HTML table for PDF generation
  const headers = data.length > 0 ? Object.keys(data[0]) : []
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: 'Arial', sans-serif; margin: 20px; }
        h1 { color: #333; border-bottom: 2px solid #000; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p>Дата создания: ${new Date().toLocaleDateString('ru-RU')}</p>
      <p>Количество записей: ${data.length}</p>
      
      <table>
        <thead>
          <tr>
            ${headers.map(header => `<th>${header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <p>Сгенерировано автоматически системой Lamoda Seller</p>
      </div>
    </body>
    </html>
  `

  // Create a blob and trigger print
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  
  // Open in new window for printing
  const printWindow = window.open(url, '_blank')
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print()
      // Clean up after a delay
      setTimeout(() => {
        printWindow.close()
        URL.revokeObjectURL(url)
      }, 1000)
    }
  }
}

// Generate Excel file (XLSX)
export function exportToExcel(data: any[], filename: string, options: ExportOptions): void {
  // For now, we'll use CSV as Excel alternative
  // In production, you would use a library like 'xlsx' or 'exceljs'
  const csvFilename = filename.replace('.xlsx', '.csv')
  exportToCSV(data, csvFilename, options)
  
  // Show message about Excel format
  setTimeout(() => {
    alert('Excel файл сохранен как CSV. Для полной поддержки XLSX установите дополнительные библиотеки.')
  }, 100)
}

// Print shipping labels
export function printShippingLabels(orderIds: string[]): void {
  // Generate label content for each order
  const labelContent = orderIds.map(orderId => `
    <div class="label" style="
      width: 10cm; 
      height: 15cm; 
      border: 2px solid #000; 
      margin: 10px; 
      padding: 15px; 
      page-break-after: always;
      font-family: Arial, sans-serif;
    ">
      <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">
        <h2 style="margin: 0; font-size: 18px;">LAMODA</h2>
        <p style="margin: 5px 0; font-size: 12px;">Транспортная этикетка</p>
      </div>
      
      <div style="margin-bottom: 15px;">
        <strong>Заказ:</strong> ${orderId}<br>
        <strong>Дата:</strong> ${new Date().toLocaleDateString('ru-RU')}<br>
        <strong>Время:</strong> ${new Date().toLocaleTimeString('ru-RU')}
      </div>
      
      <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px;">
        <strong>От:</strong><br>
        Продавец Lamoda<br>
        ул. Складская, 1<br>
        Москва, 123456
      </div>
      
      <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px;">
        <strong>Кому:</strong><br>
        Покупатель<br>
        Адрес доставки<br>
        Город, индекс
      </div>
      
      <div style="text-align: center; font-size: 24px; font-weight: bold; border: 2px solid #000; padding: 10px;">
        ${orderId}
      </div>
      
      <div style="margin-top: 15px; font-size: 10px; text-align: center;">
        <p>Обрабатывать с осторожностью</p>
        <div style="height: 40px; border: 1px solid #ccc; margin: 10px 0;">
          <p style="margin: 15px 0; text-align: center;">Место для штрих-кода</p>
        </div>
      </div>
    </div>
  `).join('')

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Этикетки заказов</title>
      <style>
        @page { 
          size: A4; 
          margin: 0; 
        }
        body { 
          margin: 0; 
          font-family: Arial, sans-serif; 
        }
        .label { 
          display: inline-block; 
          vertical-align: top; 
        }
        @media print {
          body { -webkit-print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      ${labelContent}
    </body>
    </html>
  `

  // Create blob and open print window
  const blob = new Blob([printContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  
  const printWindow = window.open(url, '_blank', 'width=800,height=600')
  if (printWindow) {
    printWindow.onload = () => {
      // Give time for content to load
      setTimeout(() => {
        printWindow.print()
        // Close after printing
        setTimeout(() => {
          printWindow.close()
          URL.revokeObjectURL(url)
        }, 1000)
      }, 500)
    }
  } else {
    // Fallback: download as HTML file
    downloadFile(blob, `shipping_labels_${new Date().toISOString().split('T')[0]}.html`)
  }
}

// Utility function to download files
function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

// Main export function that handles all formats
export function exportData(
  data: any[], 
  format: string, 
  filename: string, 
  options: ExportOptions,
  title?: string
): void {
  if (data.length === 0) {
    throw new Error('Нет данных для экспорта')
  }

  const baseFilename = filename.replace(/\.[^/.]+$/, "")
  
  switch (format) {
    case 'csv':
      exportToCSV(data, `${baseFilename}.csv`, options)
      break
    case 'xlsx':
      exportToExcel(data, `${baseFilename}.xlsx`, options)
      break
    case 'json':
      exportToJSON(data, `${baseFilename}.json`, options)
      break
    case 'pdf':
      exportToPDF(data, `${baseFilename}.pdf`, title || 'Отчет')
      break
    default:
      throw new Error(`Неподдерживаемый формат: ${format}`)
  }
}

 