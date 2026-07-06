import { get, post, put, del } from '@/lib/api-client'
import type { ResultMessage, Page, TenantDto, QueryTenantDto, EnabledState } from '@/types'

export function saveTenant(data: TenantDto): Promise<ResultMessage<TenantDto>> {
  return post<ResultMessage<TenantDto>>('/tenant/saveTenant', data)
}

export function deleteTenant(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/tenant/deleteTenant/${id}`)
}

export function deleteTenants(ids: number[]): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/tenant/deleteTenants', ids)
}

export function changeTenantEnabledState(data: { id: number; enabledState: EnabledState }): Promise<ResultMessage<void>> {
  return put<ResultMessage<void>>('/tenant/changeEnabledState', data)
}

export function findTenantPage(data: QueryTenantDto): Promise<ResultMessage<Page<TenantDto>>> {
  return post<ResultMessage<Page<TenantDto>>>('/tenant/findTenantPage', data)
}

export function findTenantList(): Promise<ResultMessage<TenantDto[]>> {
  return get<ResultMessage<TenantDto[]>>('/tenant/findTenantList')
}
