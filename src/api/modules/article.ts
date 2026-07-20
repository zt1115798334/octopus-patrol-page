import { post, del } from '@/lib/api-client'
import type { ResultMessage, ArticleDto, QueryArticleDto } from '@/types'

export function saveArticle(data: ArticleDto): Promise<ResultMessage<ArticleDto>> {
  return post<ResultMessage<ArticleDto>>('/article/saveArticle', data)
}

export function deleteArticle(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/article/deleteArticle/${id}`)
}

export function deleteArticles(ids: number[]): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/article/deleteArticles', ids)
}

export function findArticlePage(data: QueryArticleDto): Promise<ResultMessage<ArticleDto>> {
  return post<ResultMessage<ArticleDto>>('/article/findArticlePage', data)
}

export function crawlArticles(data: QueryArticleDto): Promise<ResultMessage<void>> {
  return post<ResultMessage<void>>('/article/crawlArticles', data)
}
