import { del, get, post } from '@/lib/api-client'
import type { PageData, PermissionDto, QueryPermissionDto, ResultMessage } from '@/types'

export function savePermission(data: PermissionDto): Promise<ResultMessage<PermissionDto>> {
  return post<ResultMessage<PermissionDto>>('/permission/savePermission', data)
}

export function deletePermission(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/permission/deletePermission/${id}`)
}

export function deletePermissions(ids: number[]): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/permission/deletePermissions', ids)
}

export function findPermissionPage(
  data: QueryPermissionDto,
): Promise<ResultMessage<PageData<PermissionDto>>> {
  return post<ResultMessage<PageData<PermissionDto>>>('/permission/findPermissionPage', data)
}

export function findPermissionList(): Promise<ResultMessage<PermissionDto[]>> {
  return get<ResultMessage<PermissionDto[]>>('/permission/findPermissionList')
}
