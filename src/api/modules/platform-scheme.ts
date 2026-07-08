import { get, post, del } from '@/lib/api-client'
import type { ResultMessage, Page, PlatformSchemeDto, QueryPlatformSchemeDto } from '@/types'

export function savePlatformScheme(
  data: PlatformSchemeDto,
): Promise<ResultMessage<PlatformSchemeDto>> {
  return post<ResultMessage<PlatformSchemeDto>>('/platformScheme/savePlatformScheme', data)
}

export function deletePlatformScheme(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/platformScheme/deletePlatformScheme/${id}`)
}

export function findPlatformScheme(id: number): Promise<ResultMessage<PlatformSchemeDto>> {
  return get<ResultMessage<PlatformSchemeDto>>(`/platformScheme/findPlatformScheme/${id}`)
}

export function findPlatformSchemesByCurrentUser(): Promise<ResultMessage<PlatformSchemeDto[]>> {
  return get<ResultMessage<PlatformSchemeDto[]>>(
    '/platformScheme/findPlatformSchemesByCurrentUser',
  )
}

export function findPlatformSchemesByUserId(
  userId: number,
): Promise<ResultMessage<PlatformSchemeDto[]>> {
  return get<ResultMessage<PlatformSchemeDto[]>>(
    `/platformScheme/findPlatformSchemesByUserId/${userId}`,
  )
}

export function findEnabledPlatformSchemesByAccountId(
  platformAccountId: number,
): Promise<ResultMessage<PlatformSchemeDto[]>> {
  return get<ResultMessage<PlatformSchemeDto[]>>(
    `/platformScheme/findEnabledPlatformSchemesByAccountId/${platformAccountId}`,
  )
}

export function findPlatformSchemePage(
  data: QueryPlatformSchemeDto,
): Promise<ResultMessage<Page<PlatformSchemeDto>>> {
  return post<ResultMessage<Page<PlatformSchemeDto>>>(
    '/platformScheme/findPlatformSchemePage',
    data,
  )
}

export function runPlatformScheme(id: number): Promise<ResultMessage<void>> {
  return post<ResultMessage<void>>(`/platformScheme/runPlatformScheme/${id}`)
}
