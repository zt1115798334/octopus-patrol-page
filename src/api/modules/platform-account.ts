import { get, post, request, del, WEB_BASE_URL } from '@/lib/api-client'
import type { ResultMessage, PlatformAccountDto, EnabledState } from '@/types'
import type { QueryPlatformAccountDto } from '@/types/dto'

export function savePlatformAccount(data: PlatformAccountDto): Promise<ResultMessage<PlatformAccountDto>> {
  return post<ResultMessage<PlatformAccountDto>>('/platformAccount/savePlatformAccount', data, WEB_BASE_URL)
}

export function deletePlatformAccount(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/platformAccount/deletePlatformAccount/${id}`, undefined, WEB_BASE_URL)
}

export function deletePlatformAccounts(ids: number[]): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/platformAccount/deletePlatformAccounts', ids, WEB_BASE_URL)
}

export function changePlatformAccountEnabledState(data: { id: number; enabledState: EnabledState }): Promise<ResultMessage<void>> {
  return put<ResultMessage<void>>('/platformAccount/changePlatformAccountEnabledState', data)
}

export function findPlatformAccountPage(data: QueryPlatformAccountDto): Promise<ResultMessage<PlatformAccountDto>> {
  return post<ResultMessage<PlatformAccountDto>>('/platformAccount/findPlatformAccountPage', data, WEB_BASE_URL)
}

export function findPlatformAccountList(): Promise<ResultMessage<PlatformAccountDto[]>> {
  return get<ResultMessage<PlatformAccountDto[]>>('/platformAccount/findPlatformAccountList', undefined, WEB_BASE_URL)
}
