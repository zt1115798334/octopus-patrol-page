import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { SkeletonTable } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { findUserPricingPlanHistoryPage } from '@/api/modules/pricing-plan-history'

export default function PricingHistoryPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['pricingHistory'],
    queryFn: () => findUserPricingPlanHistoryPage({ pageNumber: 1, pageSize: 50 }),
  })
  const items = data?.data?.content || []

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('nav.pricingHistory')}</h1></div>
      <Card><CardContent className="pt-4">
        {isLoading ? <SkeletonTable rows={5} /> : items.length === 0 ? <EmptyState /> : (
          <Table><TableHeader><TableRow><TableHead>{t('user.title')}</TableHead><TableHead>{t('pricingPlan.planName')}</TableHead><TableHead>{t('pricingPlan.planLevel')}</TableHead><TableHead>{t('pricingPlan.originalPrice')}</TableHead><TableHead>开始时间</TableHead><TableHead>结束时间</TableHead></TableRow></TableHeader>
            <TableBody>{items.map((item) => (
              <TableRow key={item.id}><TableCell>{item.userId}</TableCell><TableCell className="font-medium">{item.planName}</TableCell><TableCell><Badge variant="info">{item.planLevel}</Badge></TableCell><TableCell>¥{item.pricePaid || 0}</TableCell><TableCell className="text-sm text-neutral-500">{formatDate(item.startTime, 'yyyy-MM-dd')}</TableCell><TableCell className="text-sm text-neutral-500">{formatDate(item.endTime, 'yyyy-MM-dd')}</TableCell></TableRow>
            ))}</TableBody></Table>
        )}
      </CardContent></Card>
    </div>
  )
}
