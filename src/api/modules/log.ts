import { get, post } from '@/lib/api-client'
import type { ResultMessage, PageData, LogDto, LogDtoComplex, LogStatisticsDto, QueryLogDto } from '@/types'

export function findLogPage(data: QueryLogDto): Promise<ResultMessage<PageData<LogDtoComplex>>> {
  return post<ResultMessage<PageData<LogDtoComplex>>>('/log/findPage', data)
}

export function getLogStatistics(): Promise<ResultMessage<LogStatisticsDto>> {
  return get<ResultMessage<LogStatisticsDto>>('/log/statistics')
}

export function findLogById(id: number): Promise<ResultMessage<LogDto>> {
  return get<ResultMessage<LogDto>>(`/log/findById/${id}`)
}
