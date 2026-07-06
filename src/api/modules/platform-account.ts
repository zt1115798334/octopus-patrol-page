import { get, post, put, del } from '@/lib/api-client'
import type { ResultMessage, Page, PlatformAccountDto, EnabledState } from '@/types'
import type { QueryPlatformAccountDto } from '@/types/dto'

export function savePlatformAccount(data: PlatformAccountDto): Promise<ResultMessage<PlatformAccountDto>> {
  return post<ResultMessage<PlatformAccountDto>>('/platformAccount/savePlatformAccount', data)
}

export function deletePlatformAccount(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/platformAccount/deletePlatformAccount/${id}`)
}

export function deletePlatformAccounts(ids: number[]): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/platformAccount/deletePlatformAccounts', ids)
}

export function changePlatformAccountEnabledState(data: { id: number; enabledState: EnabledState }): Promise<ResultMessage<void>> {
  return put<ResultMessage<void>>('/platformAccount/changeEnabledState', data)
}

export function findPlatformAccountPage(data: QueryPlatformAccountDto): Promise<ResultMessage<Page<PlatformAccountDto>>> {
  return post<ResultMessage<Page<PlatformAccountDto>>>('/platformAccount/findPlatformAccountPage', data)
}

export function findPlatformAccountList(): Promise<ResultMessage<PlatformAccountDto[]>> {
  return get<ResultMessage<PlatformAccountDto[]>>('/platformAccount/findPlatformAccountList')
}
