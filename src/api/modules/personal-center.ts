import { get, put } from '@/lib/api-client'
import type { ResultMessage, ConfigurationInformationDto, UserDto } from '@/types'

export function getConfigInfo(): Promise<ResultMessage<ConfigurationInformationDto>> {
  return get<ResultMessage<ConfigurationInformationDto>>('/personalCenter/getConfigInfo')
}

export function modifyConfigInfo(data: ConfigurationInformationDto): Promise<ResultMessage<void>> {
  return put<ResultMessage<void>>('/personalCenter/modifyConfigInfo', data)
}

export function findCurrentUser(): Promise<ResultMessage<UserDto>> {
  return get<ResultMessage<UserDto>>('/personalCenter/findCurrentUser')
}

export function modifyCurrentAvatarId(avatarId: number): Promise<ResultMessage<void>> {
  return put<ResultMessage<void>>(`/personalCenter/modifyCurrentAvatarId?avatarId=${avatarId}`)
}
