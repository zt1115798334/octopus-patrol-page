import { get, post } from '@/lib/api-client'
import type { ResultMessage, PageData, AiUsageRecordDto, QueryAiUsageRecordDto } from '@/types'

export function findAiUsageRecordPage(
  data: QueryAiUsageRecordDto,
): Promise<ResultMessage<PageData<AiUsageRecordDto>>> {
  return post<ResultMessage<PageData<AiUsageRecordDto>>>('/aiUsageRecord/findAiUsageRecordPage', data)
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
