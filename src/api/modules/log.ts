import { get, post } from '@/lib/api-client'
import type { ResultMessage, Page, LogDto, LogDtoComplex, LogStatisticsDto, QueryLogDto } from '@/types'

export function saveLog(data: LogDto): Promise<ResultMessage<LogDto>> {
  return post<ResultMessage<LogDto>>('/log/saveLog', data)
}

export function findLogPage(data: QueryLogDto): Promise<ResultMessage<Page<LogDtoComplex>>> {
  return post<ResultMessage<Page<LogDtoComplex>>>('/log/findLogPage', data)
}

export function getLogStatistics(): Promise<ResultMessage<LogStatisticsDto>> {
  return get<ResultMessage<LogStatisticsDto>>('/log/getLogStatistics')
}

export function countLog(): Promise<ResultMessage<number>> {
  return get<ResultMessage<number>>('/log/countLog')
}

export function countLoginLog(data: QueryLogDto): Promise<ResultMessage<number>> {
  return post<ResultMessage<number>>('/log/countLoginLog', data)
}
