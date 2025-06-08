'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/shared/page-layout'
import { PageWrapper } from '@/components/shared/mobile-layout'
import { LamodaButton } from '@/components/ui/lamoda-button'
import { LamodaCard } from '@/components/ui/lamoda-card'
import { 
  Bell, 
  Shield, 
  Mail, 
  Phone, 
  Globe, 
  Palette, 
  Save,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react'

// Mock settings data
const settingsData = {
  notifications: {
    orders: true,
    moderation: true,
    promotions: false,
    analytics: true,
    system: true
  },
  privacy: {
    profileVisible: true,
    contactVisible: false,
    analyticsTracking: true
  },
  preferences: {
    language: 'ru',
    timezone: 'Europe/Moscow',
    currency: 'RUB',
    theme: 'light'
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(settingsData)
  const [saved, setSaved] = useState(false)

  const handleToggle = (section: 'notifications' | 'privacy' | 'preferences', key: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key as keyof typeof prev[typeof section]]
      }
    }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <PageLayout>
      <PageWrapper maxWidth="2xl">
        <div className="space-y-12">
          {/* Header */}
          <div className="border-b border-border pb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-light text-foreground mb-4">
                Настройки
              </h1>
              <p className="text-lg text-foreground/60 font-light">
                Управление аккаунтом и предпочтениями
              </p>
            </div>
            <LamodaButton onClick={handleSave} disabled={saved}>
              {saved ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Сохранено
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </>
              )}
            </LamodaButton>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Notifications */}
            <LamodaCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="h-5 w-5 text-foreground/40" />
                <h3 className="text-lg font-medium text-foreground">Уведомления</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <div className="font-medium text-foreground">Новые заказы</div>
                    <div className="text-sm text-foreground/60">Получать уведомления о новых заказах</div>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications', 'orders')}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      settings.notifications.orders ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.notifications.orders ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <div className="font-medium text-foreground">Модерация товаров</div>
                    <div className="text-sm text-foreground/60">Статус проверки карточек товаров</div>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications', 'moderation')}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      settings.notifications.moderation ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.notifications.moderation ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <div className="font-medium text-foreground">Акции и промо</div>
                    <div className="text-sm text-foreground/60">Информация о скидках и спецпредложениях</div>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications', 'promotions')}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      settings.notifications.promotions ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.notifications.promotions ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <div className="font-medium text-foreground">Аналитика продаж</div>
                    <div className="text-sm text-foreground/60">Еженедельные отчеты по продажам</div>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications', 'analytics')}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      settings.notifications.analytics ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.notifications.analytics ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-foreground">Системные уведомления</div>
                    <div className="text-sm text-foreground/60">Важные обновления платформы</div>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications', 'system')}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      settings.notifications.system ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.notifications.system ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </LamodaCard>

            {/* Privacy Settings */}
            <LamodaCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-5 w-5 text-foreground/40" />
                <h3 className="text-lg font-medium text-foreground">Приватность</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <div className="font-medium text-foreground">Публичный профиль</div>
                    <div className="text-sm text-foreground/60">Показывать информацию о компании в каталоге</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {settings.privacy.profileVisible ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-foreground/40" />
                    )}
                    <button
                      onClick={() => handleToggle('privacy', 'profileVisible')}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        settings.privacy.profileVisible ? 'bg-primary' : 'bg-border'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.privacy.profileVisible ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <div className="font-medium text-foreground">Контактная информация</div>
                    <div className="text-sm text-foreground/60">Показывать телефон и email покупателям</div>
                  </div>
                  <button
                    onClick={() => handleToggle('privacy', 'contactVisible')}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      settings.privacy.contactVisible ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.privacy.contactVisible ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-foreground">Аналитика использования</div>
                    <div className="text-sm text-foreground/60">Помочь улучшить платформу анонимными данными</div>
                  </div>
                  <button
                    onClick={() => handleToggle('privacy', 'analyticsTracking')}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      settings.privacy.analyticsTracking ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.privacy.analyticsTracking ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </LamodaCard>

            {/* Preferences */}
            <LamodaCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="h-5 w-5 text-foreground/40" />
                <h3 className="text-lg font-medium text-foreground">Предпочтения</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-foreground/40 uppercase tracking-wider block mb-2">
                    Язык интерфейса
                  </label>
                  <select className="w-full px-3 py-2 border border-border bg-white text-foreground focus:outline-none focus:border-foreground">
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-foreground/40 uppercase tracking-wider block mb-2">
                    Часовой пояс
                  </label>
                  <select className="w-full px-3 py-2 border border-border bg-white text-foreground focus:outline-none focus:border-foreground">
                    <option value="Europe/Moscow">Москва (UTC+3)</option>
                    <option value="Europe/Kiev">Киев (UTC+2)</option>
                    <option value="Asia/Almaty">Алматы (UTC+6)</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-foreground/40 uppercase tracking-wider block mb-2">
                    Валюта
                  </label>
                  <select className="w-full px-3 py-2 border border-border bg-white text-foreground focus:outline-none focus:border-foreground">
                    <option value="RUB">Российский рубль (₽)</option>
                    <option value="USD">Доллар США ($)</option>
                    <option value="EUR">Евро (€)</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-foreground/40 uppercase tracking-wider block mb-2">
                    Тема оформления
                  </label>
                  <select className="w-full px-3 py-2 border border-border bg-white text-foreground focus:outline-none focus:border-foreground">
                    <option value="light">Светлая</option>
                    <option value="dark">Тёмная</option>
                    <option value="auto">Автоматически</option>
                  </select>
                </div>
              </div>
            </LamodaCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <LamodaCard className="p-4">
              <h4 className="font-medium text-foreground mb-4">Статус аккаунта</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-foreground">Верифицирован</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-foreground">Email подтверждён</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-foreground">Документы проверены</span>
                </div>
              </div>
            </LamodaCard>

            {/* Security Tip */}
            <div className="bg-primary/5 border-l-4 border-primary p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Безопасность
                  </h4>
                  <p className="text-xs text-foreground/60 mb-3">
                    Рекомендуем регулярно обновлять пароль и включить двухфакторную аутентификацию.
                  </p>
                  <LamodaButton variant="outline" size="sm">
                    Настроить 2FA
                  </LamodaButton>
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