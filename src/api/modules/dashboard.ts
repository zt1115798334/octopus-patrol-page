import { post } from '@/lib/api-client'
import type { ResultMessage, VisitStatsDto, DateVisitStatsDto, TimeConsumingDto, QueryVisitTrendDto } from '@/types'

export function getVisitStats(data: QueryVisitTrendDto): Promise<ResultMessage<VisitStatsDto[]>> {
  return post<ResultMessage<VisitStatsDto[]>>('/dashboard/getVisitStats', data)
}

export function getVisitTrend(data: QueryVisitTrendDto): Promise<ResultMessage<DateVisitStatsDto[]>> {
  return post<ResultMessage<DateVisitStatsDto[]>>('/dashboard/getVisitTrend', data)
}

export function getTimeConsuming(data: QueryVisitTrendDto): Promise<ResultMessage<TimeConsumingDto[]>> {
  return post<ResultMessage<TimeConsumingDto[]>>('/dashboard/getTimeConsuming', data)
}
