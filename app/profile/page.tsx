'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/shared/page-layout'
import { PageWrapper } from '@/components/shared/mobile-layout'
import { LamodaButton } from '@/components/ui/lamoda-button'
import { LamodaCard } from '@/components/ui/lamoda-card'
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Star, 
  Calendar,
  Edit3,
  CheckCircle,
  AlertCircle,
  Clock,
  Shield
} from 'lucide-react'
import { formatNumber } from '@/lib/format-utils'

// Mock data
const companyInfo = {
  name: 'ООО «Модный стиль»',
  legalName: 'Общество с ограниченной ответственностью «Модный стиль»',
  inn: '7710123456',
  kpp: '771001001',
  ogrn: '1027700123456',
  address: 'г. Москва, ул. Тверская, д. 1, стр. 1',
  phone: '+7 (499) 123-45-67',
  email: 'info@modnystyle.ru',
  contactPerson: 'Иванова Анна Сергеевна',
  sellerSince: '2022-03-15',
  rating: 4.8,
  status: 'verified',
  category: 'Премиум',
  totalSales: 15600000,
  totalOrders: 8520
}

const documents = [
  { name: 'Договор с Lamoda', status: 'active', date: '2024-01-15', type: 'contract' },
  { name: 'Справка о налогах', status: 'pending', date: '2024-12-01', type: 'tax' },
  { name: 'Сертификат качества', status: 'expired', date: '2024-11-30', type: 'certificate' },
  { name: 'Банковские реквизиты', status: 'active', date: '2024-01-15', type: 'banking' }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-600'
    case 'pending': return 'text-amber-600'
    case 'expired': return 'text-red-600'
    case 'verified': return 'text-green-600'
    default: return 'text-foreground'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'Активен'
    case 'pending': return 'На проверке'
    case 'expired': return 'Истек'
    case 'verified': return 'Проверен'
    default: return status
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return <CheckCircle className="h-4 w-4" />
    case 'pending': return <Clock className="h-4 w-4" />
    case 'expired': return <AlertCircle className="h-4 w-4" />
    case 'verified': return <Shield className="h-4 w-4" />
    default: return <AlertCircle className="h-4 w-4" />
  }
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('info')

  return (
    <PageLayout>
      <PageWrapper maxWidth="2xl">
        <div className="space-y-12">
          {/* Header */}
          <div className="border-b border-border pb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-light text-foreground mb-4">
                Профиль
              </h1>
              <p className="text-lg text-foreground/60 font-light">
                Информация о компании и настройки аккаунта
              </p>
            </div>
            <LamodaButton 
              variant="outline" 
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? 'Сохранить' : 'Редактировать'}
            </LamodaButton>
          </div>
        </div>

        {/* Status & Metrics */}
        <div className="mb-16">
          <h2 className="text-sm font-medium text-foreground mb-6 uppercase tracking-widest">
            Статус селлера
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-light text-primary group-hover:text-foreground transition-colors duration-300">
                {companyInfo.rating}
              </div>
              <div className="text-xs text-foreground/40 uppercase tracking-wider">
                Рейтинг
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-foreground/60">из 5.0</span>
              </div>
            </div>
            
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-light text-primary group-hover:text-foreground transition-colors duration-300">
                {Math.round(companyInfo.totalSales / 1000000)}M
              </div>
              <div className="text-xs text-foreground/40 uppercase tracking-wider">
                Выручка
              </div>
              <div className="text-xs text-foreground/60">
                ₽ за всё время
              </div>
            </div>
            
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-light text-primary group-hover:text-foreground transition-colors duration-300">
                {formatNumber(companyInfo.totalOrders)}
              </div>
              <div className="text-xs text-foreground/40 uppercase tracking-wider">
                Заказов
              </div>
              <div className="text-xs text-foreground/60">
                Выполнено
              </div>
            </div>
            
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-light text-primary group-hover:text-foreground transition-colors duration-300">
                {Math.round((new Date().getTime() - new Date(companyInfo.sellerSince).getTime()) / (1000 * 60 * 60 * 24 * 365 * 100)) / 100}
              </div>
              <div className="text-xs text-foreground/40 uppercase tracking-wider">
                Лет с нами
              </div>
              <div className="text-xs text-foreground/60">
                С {new Date(companyInfo.sellerSince).getFullYear()}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Company Information */}
          <div className="xl:col-span-2 space-y-8">
            <LamodaCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-foreground">Информация о компании</h3>
                <div className="flex items-center gap-2">
                  {getStatusIcon(companyInfo.status)}
                  <span className={`text-sm ${getStatusColor(companyInfo.status)}`}>
                    {getStatusText(companyInfo.status)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-foreground/40 uppercase tracking-wider block mb-1">
                      Название компании
                    </label>
                    <div className="text-foreground font-medium">{companyInfo.name}</div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-foreground/40 uppercase tracking-wider block mb-1">
                      Полное наименование
                    </label>
                    <div className="text-foreground/60 text-sm">{companyInfo.legalName}</div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-foreground/40 uppercase tracking-wider block mb-1">
                      ИНН / КПП
                    </label>
                    <div className="text-foreground font-mono">{companyInfo.inn} / {companyInfo.kpp}</div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-foreground/40 uppercase tracking-wider block mb-1">
                      ОГРН
                    </label>
                    <div className="text-foreground font-mono">{companyInfo.ogrn}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-foreground/40 uppercase tracking-wider block mb-1">
                      Контактное лицо
                    </label>
                    <div className="text-foreground font-medium">{companyInfo.contactPerson}</div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-foreground/40 uppercase tracking-wider block mb-1">
                      Телефон
                    </label>
                    <div className="text-foreground">{companyInfo.phone}</div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-foreground/40 uppercase tracking-wider block mb-1">
                      Email
                    </label>
                    <div className="text-foreground">{companyInfo.email}</div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-foreground/40 uppercase tracking-wider block mb-1">
                      Адрес
                    </label>
                    <div className="text-foreground/60 text-sm">{companyInfo.address}</div>
                  </div>
                </div>
              </div>
            </LamodaCard>

            {/* Documents */}
            <LamodaCard className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-6">Документы</h3>
              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-foreground/40" />
                      <div>
                        <div className="font-medium text-foreground">{doc.name}</div>
                        <div className="text-xs text-foreground/40">
                          {new Date(doc.date).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.status)}
                      <span className={`text-xs ${getStatusColor(doc.status)}`}>
                        {getStatusText(doc.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <LamodaButton variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Загрузить документ
                </LamodaButton>
              </div>
            </LamodaCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <LamodaCard className="p-4">
              <h4 className="font-medium text-foreground mb-4">Быстрая статистика</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/60">Категория</span>
                  <span className="text-sm font-medium text-primary">{companyInfo.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/60">Активных товаров</span>
                  <span className="text-sm font-medium text-foreground">248</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/60">Заказов в месяц</span>
                  <span className="text-sm font-medium text-foreground">~340</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/60">Возвратов</span>
                  <span className="text-sm font-medium text-green-600">2.1%</span>
                </div>
              </div>
            </LamodaCard>

            {/* Expert Tip */}
            <div className="bg-primary/5 border-l-4 border-primary p-4">
              <div className="flex items-start gap-3">
                <Star className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Совет эксперта
                  </h4>
                  <p className="text-xs text-foreground/60">
                    Для повышения рейтинга рекомендуем обновить просроченные документы и поддерживать быструю обработку заказов.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </PageWrapper>
    </PageLayout>
  )
} 