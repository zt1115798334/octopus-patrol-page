import { get, post, put, del } from '@/lib/api-client'
import type { ResultMessage, Page, PricingPlanDto, QueryKeywordsDto, EnabledState } from '@/types'

export function savePricingPlan(data: PricingPlanDto): Promise<ResultMessage<PricingPlanDto>> {
  return post<ResultMessage<PricingPlanDto>>('/pricingPlan/savePricingPlan', data)
}

export function deletePricingPlan(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/pricingPlan/deletePricingPlan/${id}`)
}

export function deletePricingPlans(ids: number[]): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/pricingPlan/deletePricingPlans', ids)
}

export function changePricingPlanEnabledState(data: { id: number; enabledState: EnabledState }): Promise<ResultMessage<void>> {
  return put<ResultMessage<void>>('/pricingPlan/changeEnabledState', data)
}

export function findPricingPlanPage(data: QueryKeywordsDto): Promise<ResultMessage<Page<PricingPlanDto>>> {
  return post<ResultMessage<Page<PricingPlanDto>>>('/pricingPlan/findPricingPlanPage', data)
}

export function findAllPricingPlans(): Promise<ResultMessage<PricingPlanDto[]>> {
  return get<ResultMessage<PricingPlanDto[]>>('/pricingPlan/findAllPricingPlans')
}
