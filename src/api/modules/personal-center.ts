import { get, post, put } from '@/lib/api-client'
import type { ResultMessage, ConfigurationInformationDto } from '@/types'

export function getConfigInfo(): Promise<ResultMessage<ConfigurationInformationDto>> {
  return get<ResultMessage<ConfigurationInformationDto>>('/personalCenter/getConfigInfo')
}

export function modifyConfigInfo(data: ConfigurationInformationDto): Promise<ResultMessage<void>> {
  return put<ResultMessage<void>>('/personalCenter/modifyConfigInfo', data)
}
