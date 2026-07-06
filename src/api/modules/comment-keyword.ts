import { post, del } from '@/lib/api-client'
import type { ResultMessage, Page, CommentKeywordDto, QueryCommentKeywordDto } from '@/types'

export function saveCommentKeyword(data: CommentKeywordDto): Promise<ResultMessage<CommentKeywordDto>> {
  return post<ResultMessage<CommentKeywordDto>>('/commentKeyword/saveCommentKeyword', data)
}

export function deleteCommentKeyword(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/commentKeyword/deleteCommentKeyword/${id}`)
}

export function deleteCommentKeywords(ids: number[]): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/commentKeyword/deleteCommentKeywords', ids)
}

export function findCommentKeywordPage(data: QueryCommentKeywordDto): Promise<ResultMessage<Page<CommentKeywordDto>>> {
  return post<ResultMessage<Page<CommentKeywordDto>>>('/commentKeyword/findCommentKeywordPage', data)
}
