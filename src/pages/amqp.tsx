import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sendArticleComment } from '@/api/modules/amqp'
import { toast } from 'sonner'

export default function AmqpPage() {
  const { t } = useTranslation()

  const [formData, setFormData] = useState({
    articleId: '',
    title: '',
    content: '',
    url: '',
    userId: '',
    accountId: '',
    accountCookie: '',
  })

  const sendMutation = useMutation({
    mutationFn: sendArticleComment,
    onSuccess: () => {
      toast.success(t('common.operationSuccess'))
      setFormData({
        articleId: '',
        title: '',
        content: '',
        url: '',
        userId: '',
        accountId: '',
        accountCookie: '',
      })
    },
    onError: () => {},
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.articleId || !formData.content) return
    sendMutation.mutate({
      articleId: Number(formData.articleId),
      title: formData.title,
      content: formData.content,
      url: formData.url,
      userId: Number(formData.userId) || 0,
      accountId: Number(formData.accountId) || 0,
      accountCookie: formData.accountCookie,
    })
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          {t('nav.amqp')}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          发送文章评论消息至 RabbitMQ 消息队列
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              发送评论消息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="文章ID"
                  type="number"
                  value={formData.articleId}
                  onChange={(e) => updateField('articleId', e.target.value)}
                  placeholder="请输入文章ID"
                />
                <Input
                  label="文章URL"
                  value={formData.url}
                  onChange={(e) => updateField('url', e.target.value)}
                  placeholder="文章链接"
                />
              </div>
              <Input
                label="评论标题"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="评论标题"
              />
              <Input
                label="评论内容"
                value={formData.content}
                onChange={(e) => updateField('content', e.target.value)}
                placeholder="请输入评论内容"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="用户ID"
                  type="number"
                  value={formData.userId}
                  onChange={(e) => updateField('userId', e.target.value)}
                />
                <Input
                  label="平台账号ID"
                  type="number"
                  value={formData.accountId}
                  onChange={(e) => updateField('accountId', e.target.value)}
                />
              </div>
              <Input
                label="Cookie"
                value={formData.accountCookie}
                onChange={(e) => updateField('accountCookie', e.target.value)}
                placeholder="平台账号Cookie"
              />
              <Button
                type="submit"
                className="w-full"
                loading={sendMutation.isPending}
              >
                <Send className="h-4 w-4 mr-2" />
                发送消息
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>队列状态</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">article.comment.queue</span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-success-600">
                    <span className="h-2 w-2 rounded-full bg-success-500" />
                    运行中
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">文章评论消息队列</p>
              </div>
              <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Exchange</span>
                  <span className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
                    patrol.topic
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Routing Key</span>
                  <span className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
                    article.comment
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
