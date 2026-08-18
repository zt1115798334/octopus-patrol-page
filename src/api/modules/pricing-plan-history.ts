import { post } from '@/lib/api-client'
import type { PageData, QueryKeywordsDto, ResultMessage, UserPricingPlanHistoryDto } from '@/types'

export function findUserPricingPlanHistoryPage(
  data: QueryKeywordsDto,
): Promise<ResultMessage<PageData<UserPricingPlanHistoryDto>>> {
  return post<ResultMessage<PageData<UserPricingPlanHistoryDto>>>(
    '/userPricingPlanHistory/findUserPricingPlanHistoryPage',
    data,
  )
}
