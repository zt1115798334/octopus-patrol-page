import { get, post, request, del, WEB_BASE_URL } from '@/lib/api-client'
import type { ResultMessage, AiConfigDto, QueryAiConfigDto, EnabledState } from '@/types'

export function saveAiConfig(data: AiConfigDto): Promise<ResultMessage<AiConfigDto>> {
  return post<ResultMessage<AiConfigDto>>('/aiConfig/saveAiConfig', data, WEB_BASE_URL)
}

export function deleteAiConfig(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/aiConfig/deleteAiConfig/${id}`, undefined, WEB_BASE_URL)
}

export function deleteAiConfigs(ids: number[]): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/aiConfig/deleteAiConfigs', ids, WEB_BASE_URL)
}

export function changeAiConfigEnabledState(data: { id: number; enabledState: EnabledState }): Promise<ResultMessage<void>> {
  return request<ResultMessage<void>>({ method: 'PUT', url: '/aiConfig/changeEnabledState', params: data }, WEB_BASE_URL)
}

export function findAiConfigPage(data: QueryAiConfigDto): Promise<ResultMessage<AiConfigDto>> {
  return post<ResultMessage<AiConfigDto>>('/aiConfig/findAiConfigPage', data, WEB_BASE_URL)
}

export function findAiConfigList(): Promise<ResultMessage<AiConfigDto[]>> {
  return get<ResultMessage<AiConfigDto[]>>('/aiConfig/findAiConfigList', undefined, WEB_BASE_URL)
}
