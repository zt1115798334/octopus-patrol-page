import { get, post, put, del } from '@/lib/api-client'
import type { ResultMessage, Page, PlatformDto, QueryPlatformDto, EnabledState } from '@/types'

export function savePlatform(data: PlatformDto): Promise<ResultMessage<PlatformDto>> {
  return post<ResultMessage<PlatformDto>>('/platform/savePlatform', data)
}

export function deletePlatform(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/platform/deletePlatform/${id}`)
}

export function deletePlatforms(ids: number[]): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/platform/deletePlatforms', ids)
}

export function changePlatformEnabledState(data: { id: number; enabledState: EnabledState }): Promise<ResultMessage<void>> {
  return put<ResultMessage<void>>('/platform/changeEnabledState', data)
}

export function findPlatformPage(data: QueryPlatformDto): Promise<ResultMessage<Page<PlatformDto>>> {
  return post<ResultMessage<Page<PlatformDto>>>('/platform/findPlatformPage', data)
}

export function findAllPlatforms(): Promise<ResultMessage<PlatformDto[]>> {
  return get<ResultMessage<PlatformDto[]>>('/platform/findAllPlatforms')
}
