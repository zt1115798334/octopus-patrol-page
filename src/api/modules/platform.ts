import { get, post, request, del, WEB_BASE_URL } from '@/lib/api-client'
import type { ResultMessage, PlatformDto, QueryPlatformDto, EnabledState, SavePlatformDto } from '@/types'

export function savePlatform(data: SavePlatformDto): Promise<ResultMessage<PlatformDto>> {
  return post<ResultMessage<PlatformDto>>('/platform/savePlatform', data, WEB_BASE_URL)
}

export function deletePlatform(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/platform/deletePlatform/${id}`, undefined, WEB_BASE_URL)
}

export function deletePlatforms(ids: number[]): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/platform/deletePlatforms', ids, WEB_BASE_URL)
}

export function changePlatformEnabledState(data: { id: number; enabledState: EnabledState }): Promise<ResultMessage<void>> {
  return request<ResultMessage<void>>({ method: 'PUT', url: '/platform/changePlatformEnabledState', params: data }, WEB_BASE_URL)
}

export function findPlatformPage(data: QueryPlatformDto): Promise<ResultMessage<PlatformDto>> {
  return post<ResultMessage<PlatformDto>>('/platform/findPlatformPage', data, WEB_BASE_URL)
}

export function findAllPlatforms(): Promise<ResultMessage<PlatformDto[]>> {
  return get<ResultMessage<PlatformDto[]>>('/platform/findAllPlatforms', undefined, WEB_BASE_URL)
}
