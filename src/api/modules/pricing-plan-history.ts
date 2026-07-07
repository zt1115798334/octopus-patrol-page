import { post } from '@/lib/api-client'
import type { ResultMessage, Page, UserPricingPlanHistoryDto, QueryKeywordsDto } from '@/types'

export function findUserPricingPlanHistoryPage(
  data: QueryKeywordsDto,
): Promise<ResultMessage<Page<UserPricingPlanHistoryDto>>> {
  return post<ResultMessage<Page<UserPricingPlanHistoryDto>>>(
    '/userPricingPlanHistory/findUserPricingPlanHistoryPage',
    data,
  )
}
