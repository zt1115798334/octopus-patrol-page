import { get, post, put, del } from '@/lib/api-client'
import type { ResultMessage, Page, AiConfigDto, QueryAiConfigDto, EnabledState } from '@/types'

export function saveAiConfig(data: AiConfigDto): Promise<ResultMessage<AiConfigDto>> {
  return post<ResultMessage<AiConfigDto>>('/aiConfig/saveAiConfig', data)
}

export function deleteAiConfig(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/aiConfig/deleteAiConfig/${id}`)
}

export function deleteAiConfigs(ids: number[]): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/aiConfig/deleteAiConfigs', ids)
}

export function changeAiConfigEnabledState(data: { id: number; enabledState: EnabledState }): Promise<ResultMessage<void>> {
  return put<ResultMessage<void>>('/aiConfig/changeAiConfigEnabledState', data)
}

export function findAiConfigPage(data: QueryAiConfigDto): Promise<ResultMessage<Page<AiConfigDto>>> {
  return post<ResultMessage<Page<AiConfigDto>>>('/aiConfig/findAiConfigPage', data)
}

export function findAiConfigList(): Promise<ResultMessage<AiConfigDto[]>> {
  return get<ResultMessage<AiConfigDto[]>>('/aiConfig/findAiConfigList')
}
