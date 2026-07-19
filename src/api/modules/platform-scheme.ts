import { get, post, del, WEB_BASE_URL } from '@/lib/api-client'
import type { ResultMessage, PlatformSchemeDto, QueryPlatformSchemeDto } from '@/types'

export function savePlatformScheme(
  data: PlatformSchemeDto,
): Promise<ResultMessage<PlatformSchemeDto>> {
  return post<ResultMessage<PlatformSchemeDto>>('/platformScheme/savePlatformScheme', data, WEB_BASE_URL)
}

export function deletePlatformScheme(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/platformScheme/deletePlatformScheme/${id}`, undefined, WEB_BASE_URL)
}

export function findPlatformScheme(id: number): Promise<ResultMessage<PlatformSchemeDto>> {
  return get<ResultMessage<PlatformSchemeDto>>(`/platformScheme/findPlatformScheme/${id}`, undefined, WEB_BASE_URL)
}

export function findPlatformSchemesByCurrentUser(): Promise<ResultMessage<PlatformSchemeDto[]>> {
  return get<ResultMessage<PlatformSchemeDto[]>>(
    '/platformScheme/findPlatformSchemesByCurrentUser',
    undefined,
    WEB_BASE_URL,
  )
}

export function findPlatformSchemesByUserId(
  userId: number,
): Promise<ResultMessage<PlatformSchemeDto[]>> {
  return get<ResultMessage<PlatformSchemeDto[]>>(
    `/platformScheme/findPlatformSchemesByUserId/${userId}`,
    undefined,
    WEB_BASE_URL,
  )
}

export function findEnabledPlatformSchemesByAccountId(
  platformAccountId: number,
): Promise<ResultMessage<PlatformSchemeDto[]>> {
  return get<ResultMessage<PlatformSchemeDto[]>>(
    `/platformScheme/findEnabledPlatformSchemesByAccountId/${platformAccountId}`,
    undefined,
    WEB_BASE_URL,
  )
}

export function findPlatformSchemePage(
  data: QueryPlatformSchemeDto,
): Promise<ResultMessage<PlatformSchemeDto>> {
  return post<ResultMessage<PlatformSchemeDto>>(
    '/platformScheme/findPlatformSchemePage',
    data,
    WEB_BASE_URL,
  )
}

export function runPlatformScheme(id: number): Promise<ResultMessage<void>> {
  return post<ResultMessage<void>>(`/platformScheme/runPlatformScheme/${id}`, undefined, WEB_BASE_URL)
}
