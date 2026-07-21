import { post } from '@/lib/api-client'
import type { ResultMessage, AiCommentRequestDto } from '@/types'

export function generateComment(data: AiCommentRequestDto): Promise<ResultMessage<string>> {
  return post<ResultMessage<string>>('/ai/generate', data)
}
