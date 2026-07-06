import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send } from 'lucide-react'

export default function AmqpPage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('nav.amqp')}</h1><p className="text-sm text-neutral-500 mt-1">消息队列管理</p></div>
      <Card><CardHeader><CardTitle>消息队列监控</CardTitle></CardHeader><CardContent className="flex flex-col items-center justify-center py-12 text-neutral-500"><Send className="h-12 w-12 mb-4 opacity-30" /><p>消息队列管理模块</p><p className="text-sm mt-1">用于管理 RabbitMQ 消息的生产与消费</p></CardContent></Card>
    </div>
  )
}
