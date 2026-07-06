import { post, get } from '@/lib/api-client'
import type { ResultMessage } from '@/types'

export function login(data: { username: string; password: string }): Promise<ResultMessage<string>> {
  return post<ResultMessage<string>>('/login/login', data)
}

export function getVerificationCode(): Promise<ResultMessage<string>> {
  return get<ResultMessage<string>>('/login/getVerificationCode')
}

export function getPublicKey(): Promise<ResultMessage<string>> {
  return get<ResultMessage<string>>('/login/getPublicKey')
}

export function logout(): Promise<ResultMessage<void>> {
  return post<ResultMessage<void>>('/login/logout')
}
