import { post, get, request } from '@/lib/api-client'
import type { ResultMessage } from '@/types'

/**
 * 用户登录
 * 后端 LoginController 使用 @RequestParam 接收参数，因此需要用 application/x-www-form-urlencoded 格式
 */
export function login(data: { username: string; password: string }): Promise<ResultMessage<string>> {
  const formData = new URLSearchParams()
  formData.append('username', data.username)
  formData.append('password', data.password)
  return request<ResultMessage<string>>({
    method: 'POST',
    url: '/login/login',
    data: formData,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
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
