import { get, post } from '@/lib/api-client'
import type { ResultMessage, AiUsageRecordDto, QueryAiUsageRecordDto } from '@/types'

export function findAiUsageRecordPage(
  data: QueryAiUsageRecordDto,
): Promise<ResultMessage<AiUsageRecordDto>> {
  return post<ResultMessage<AiUsageRecordDto>>('/aiUsageRecord/findAiUsageRecordPage', data)
}

export function findAiUsageRecord(
  id: number,
): Promise<ResultMessage<AiUsageRecordDto>> {
  return get<ResultMessage<AiUsageRecordDto>>(`/aiUsageRecord/findAiUsageRecord/${id}`)
}

export function findAiUsageRecordsByUser(
  userId: number,
): Promise<ResultMessage<AiUsageRecordDto[]>> {
  return get<ResultMessage<AiUsageRecordDto[]>>(`/aiUsageRecord/findAiUsageRecordsByUser/${userId}`)
}
