import { get, post, del } from '@/lib/api-client'
import type { ResultMessage, PermissionDto, QueryPermissionDto } from '@/types'

export function savePermission(data: PermissionDto): Promise<ResultMessage<PermissionDto>> {
  return post<ResultMessage<PermissionDto>>('/permission/savePermission', data)
}

export function deletePermission(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/permission/deletePermission/${id}`)
}

export function deletePermissions(ids: number[]): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/permission/deletePermissions', ids)
}

export function findPermissionPage(data: QueryPermissionDto): Promise<ResultMessage<PermissionDto>> {
  return post<ResultMessage<PermissionDto>>('/permission/findPermissionPage', data)
}

export function findPermissionList(): Promise<ResultMessage<PermissionDto[]>> {
  return get<ResultMessage<PermissionDto[]>>('/permission/findPermissionList')
}
