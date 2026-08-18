import { del, get, post, put, WEB_BASE_URL } from '@/lib/api-client'
import type { AiConfigDto, EnabledState, PageData, QueryAiConfigDto, ResultMessage } from '@/types'

export function saveAiConfig(data: AiConfigDto): Promise<ResultMessage<AiConfigDto>> {
  return post<ResultMessage<AiConfigDto>>('/aiConfig/saveAiConfig', data, WEB_BASE_URL)
}

export function deleteAiConfig(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/aiConfig/deleteAiConfig/${id}`, undefined, WEB_BASE_URL)
}

export function deleteAiConfigs(ids: number[]): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/aiConfig/deleteAiConfigs', ids, WEB_BASE_URL)
}

export function changeAiConfigEnabledState(data: {
  id: number
  enabledState: EnabledState
}): Promise<ResultMessage<void>> {
  return put<ResultMessage<void>>('/aiConfig/changeAiConfigEnabledState', data)
}

export function findAiConfigPage(
  data: QueryAiConfigDto,
): Promise<ResultMessage<PageData<AiConfigDto>>> {
  return post<ResultMessage<PageData<AiConfigDto>>>(
    '/aiConfig/findAiConfigPage',
    data,
    WEB_BASE_URL,
  )
}

export function findAiConfigList(): Promise<ResultMessage<AiConfigDto[]>> {
  return get<ResultMessage<AiConfigDto[]>>('/aiConfig/findAiConfigList', undefined, WEB_BASE_URL)
}
