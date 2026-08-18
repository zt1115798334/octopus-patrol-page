import { get, post, WEB_BASE_URL } from '@/lib/api-client'
import type {
  ResultMessage,
  PageData,
  PlatformSchemeRunLogDto,
  QueryPlatformSchemeRunLogDto,
} from '@/types'

export function findPlatformSchemeRunLog(
  id: number,
): Promise<ResultMessage<PlatformSchemeRunLogDto>> {
  return get<ResultMessage<PlatformSchemeRunLogDto>>(
    `/platformSchemeRunLog/findPlatformSchemeRunLog/${id}`,
    undefined,
    WEB_BASE_URL,
  )
}

export function findPlatformSchemeRunLogsBySchemeId(
  schemeId: number,
): Promise<ResultMessage<PlatformSchemeRunLogDto[]>> {
  return get<ResultMessage<PlatformSchemeRunLogDto[]>>(
    `/platformSchemeRunLog/findPlatformSchemeRunLogsBySchemeId/${schemeId}`,
    undefined,
    WEB_BASE_URL,
  )
}

export function findPlatformSchemeRunLogPage(
  data: QueryPlatformSchemeRunLogDto,
): Promise<ResultMessage<PageData<PlatformSchemeRunLogDto>>> {
  return post<ResultMessage<PageData<PlatformSchemeRunLogDto>>>(
    '/platformSchemeRunLog/findPlatformSchemeRunLogPage',
    data,
    WEB_BASE_URL,
  )
}
