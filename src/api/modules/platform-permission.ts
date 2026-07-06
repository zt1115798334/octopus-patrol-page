import { get, post, put, del } from '@/lib/api-client'
import type { ResultMessage, Page, PlatformPermissionDto, QueryPlatformPermissionDto, EnabledState } from '@/types'

export function savePlatformPermission(data: PlatformPermissionDto): Promise<ResultMessage<PlatformPermissionDto>> {
  return post<ResultMessage<PlatformPermissionDto>>('/platformPermission/savePlatformPermission', data)
}

export function deletePlatformPermission(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/platformPermission/deletePlatformPermission/${id}`)
}

export function deletePlatformPermissions(ids: number[]): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/platformPermission/deletePlatformPermissions', ids)
}

export function changePlatformPermissionEnabledState(data: { id: number; enabledState: EnabledState }): Promise<ResultMessage<void>> {
  return put<ResultMessage<void>>('/platformPermission/changeEnabledState', data)
}

export function findPlatformPermissionPage(data: QueryPlatformPermissionDto): Promise<ResultMessage<Page<PlatformPermissionDto>>> {
  return post<ResultMessage<Page<PlatformPermissionDto>>>('/platformPermission/findPlatformPermissionPage', data)
}

export function findPlatformPermissionList(): Promise<ResultMessage<PlatformPermissionDto[]>> {
  return get<ResultMessage<PlatformPermissionDto[]>>('/platformPermission/findPlatformPermissionList')
}
