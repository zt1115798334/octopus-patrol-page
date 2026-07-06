import { post } from '@/lib/api-client'
import type { ResultMessage, SuperSpiderSearchResponseDto, ArticleCommentRecordDto } from '@/types'

export function searchXhs(data: { keyword: string; platformAccountId: number }): Promise<ResultMessage<SuperSpiderSearchResponseDto>> {
  return post<ResultMessage<SuperSpiderSearchResponseDto>>('/external/searchXhs', data)
}

export function saveArticleCommentRecord(data: ArticleCommentRecordDto): Promise<ResultMessage<void>> {
  return post<ResultMessage<void>>('/external/saveArticleCommentRecord', data)
}
