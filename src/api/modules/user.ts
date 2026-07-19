import { get, post, put, del } from '@/lib/api-client'
import type { ResultMessage, UserDto, QueryUserDto, UserStatisticsDto, EnabledState } from '@/types'

export function saveUser(data: UserDto): Promise<ResultMessage<UserDto>> {
  return post<ResultMessage<UserDto>>('/user/saveUser', data)
}

export function modifyUserPassword(data: { id: number; newPassword: string }): Promise<ResultMessage<void>> {
  return put<ResultMessage<void>>('/user/modifyUserPassword', data)
}

export function modifyUserPhone(data: { phone: string }): Promise<ResultMessage<void>> {
  return put<ResultMessage<void>>('/user/modifyUserPhone', data)
}

export function deleteUser(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/user/deleteUser/${id}`)
}

export function deleteUsers(ids: number[]): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/user/deleteUsers', ids)
}

export function changeUserEnabledState(data: { id: number; enabledState: EnabledState }): Promise<ResultMessage<void>> {
  return put<ResultMessage<void>>('/user/changeEnabledState', data)
}

export function findUserPage(data: QueryUserDto): Promise<ResultMessage<UserDto>> {
  return post<ResultMessage<UserDto>>('/user/findUserPage', data)
}

export function findUser(id: number): Promise<ResultMessage<UserDto>> {
  return get<ResultMessage<UserDto>>(`/user/findUser/${id}`)
}

export function getUserStatistics(): Promise<ResultMessage<UserStatisticsDto>> {
  return get<ResultMessage<UserStatisticsDto>>('/user/getUserStatistics')
}
