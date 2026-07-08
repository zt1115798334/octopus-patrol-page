import { get, post } from '@/lib/api-client'
import type { ResultMessage, Page, AiUsageRecordDto, QueryAiUsageRecordDto } from '@/types'

export function findAiUsageRecordPage(
  data: QueryAiUsageRecordDto,
): Promise<ResultMessage<Page<AiUsageRecordDto>>> {
  return post<ResultMessage<Page<AiUsageRecordDto>>>('/aiUsageRecord/findAiUsageRecordPage', data)
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
