import { post } from '@/lib/api-client'
import type { ResultMessage, ArticleCommentDto } from '@/types'

export function sendArticleComment(data: ArticleCommentDto): Promise<ResultMessage<void>> {
  return post<ResultMessage<void>>('/amqp/sendArticleComment', data)
}
