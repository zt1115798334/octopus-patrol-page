import { get, post } from '@/lib/api-client'
import type {
  ResultMessage,
  Page,
  PlatformSchemeRunLogDto,
  QueryPlatformSchemeRunLogDto,
} from '@/types'

export function findPlatformSchemeRunLog(
  id: number,
): Promise<ResultMessage<PlatformSchemeRunLogDto>> {
  return get<ResultMessage<PlatformSchemeRunLogDto>>(
    `/platformSchemeRunLog/findPlatformSchemeRunLog/${id}`,
  )
}

export function findPlatformSchemeRunLogsBySchemeId(
  schemeId: number,
): Promise<ResultMessage<PlatformSchemeRunLogDto[]>> {
  return get<ResultMessage<PlatformSchemeRunLogDto[]>>(
    `/platformSchemeRunLog/findPlatformSchemeRunLogsBySchemeId/${schemeId}`,
  )
}

export function findPlatformSchemeRunLogPage(
  data: QueryPlatformSchemeRunLogDto,
): Promise<ResultMessage<Page<PlatformSchemeRunLogDto>>> {
  return post<ResultMessage<Page<PlatformSchemeRunLogDto>>>(
    '/platformSchemeRunLog/findPlatformSchemeRunLogPage',
    data,
  )
}
