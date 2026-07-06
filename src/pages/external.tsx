import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Search, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { searchXhs } from '@/api/modules/external'
import { toast } from 'sonner'
import type { XhsNoteDto } from '@/types'

export default function ExternalPage() {
  const { t } = useTranslation()
  const [keyword, setKeyword] = useState('')
  const [accountId, setAccountId] = useState('')
  const [results, setResults] = useState<XhsNoteDto[]>([])
  const [totalCount, setTotalCount] = useState(0)

  const searchMutation = useMutation({
    mutationFn: searchXhs,
    onSuccess: (res) => {
      if (res.meta.success) {
        setResults(res.data.data || [])
        setTotalCount(res.data.count || 0)
        toast.success(`${t('common.search')}完成`)
      }
    },
    onError: () => toast.error(t('common.operationFailed')),
  })

  const handleSearch = () => {
    if (!keyword.trim()) return
    searchMutation.mutate({ keyword, platformAccountId: Number(accountId) || 1 })
  }

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('nav.xhsSearch')}</h1></div>
      <Card><CardContent className="pt-6"><div className="flex gap-3"><Input placeholder="搜索关键词" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="max-w-xs" /><Input placeholder="平台账号ID" value={accountId} onChange={(e) => setAccountId(e.target.value)} className="max-w-[140px]" /><Button onClick={handleSearch} loading={searchMutation.isPending}><Search className="h-4 w-4 mr-2" />{t('common.search')}</Button></div>
        {results.length > 0 && <div className="mt-4"><p className="text-sm text-neutral-500 mb-3">共找到 {totalCount} 条结果</p><div className="space-y-2">{results.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
            <div><p className="font-medium text-sm">{item.title}</p><p className="text-xs text-neutral-500 mt-0.5">{item.author}</p></div>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline text-sm"><Globe className="h-3.5 w-3.5 inline mr-1" />查看</a>
          </div>
        ))}</div></div>}
      </CardContent></Card>
    </div>
  )
}
