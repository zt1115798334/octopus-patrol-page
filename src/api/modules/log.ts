import { get, post } from '@/lib/api-client'
import type { ResultMessage, LogDto, LogDtoComplex, LogStatisticsDto, QueryLogDto } from '@/types'

export function findLogPage(data: QueryLogDto): Promise<ResultMessage<LogDtoComplex>> {
  return post<ResultMessage<LogDtoComplex>>('/log/findLogPage', data)
}

export function getLogStatistics(): Promise<ResultMessage<LogStatisticsDto>> {
  return get<ResultMessage<LogStatisticsDto>>('/log/getLogStatistics')
}

export function findLogById(id: number): Promise<ResultMessage<LogDto>> {
  return get<ResultMessage<LogDto>>(`/log/findLogById/${id}`)
}
