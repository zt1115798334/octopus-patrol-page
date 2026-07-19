import { get, post, put, del } from '@/lib/api-client'
import type { ResultMessage, RoleDto, QueryRoleDto, EnabledState } from '@/types'

export function saveRole(data: RoleDto): Promise<ResultMessage<RoleDto>> {
  return post<ResultMessage<RoleDto>>('/role/saveRole', data)
}

export function deleteRole(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/role/deleteRole/${id}`)
}

export function deleteRoles(ids: number[]): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/role/deleteRoles', ids)
}

export function changeRoleEnabledState(data: { id: number; enabledState: EnabledState }): Promise<ResultMessage<void>> {
  return put<ResultMessage<void>>('/role/changeEnabledState', data)
}

export function findRolePage(data: QueryRoleDto): Promise<ResultMessage<RoleDto>> {
  return post<ResultMessage<RoleDto>>('/role/findRolePage', data)
}

export function findRoleList(): Promise<ResultMessage<RoleDto[]>> {
  return get<ResultMessage<RoleDto[]>>('/role/findRoleList')
}

export function bindRolePermissions(data: { roleId?: number; permissionIds?: number[] }): Promise<ResultMessage<void>> {
  return post<ResultMessage<void>>('/role/bindRolePermissions', data)
}
