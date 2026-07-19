import { post } from '@/lib/api-client'
import type { ResultMessage, UserPricingPlanHistoryDto, QueryKeywordsDto } from '@/types'

export function findUserPricingPlanHistoryPage(
  data: QueryKeywordsDto,
): Promise<ResultMessage<UserPricingPlanHistoryDto>> {
  return post<ResultMessage<UserPricingPlanHistoryDto>>(
    '/userPricingPlanHistory/findUserPricingPlanHistoryPage',
    data,
  )
}
