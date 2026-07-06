import { post } from '@/lib/api-client'
import type { ResultMessage, FileUploadInfoDto } from '@/types'

export function uploadFile(file: File, onProgress?: (percent: number) => void): Promise<ResultMessage<FileUploadInfoDto>> {
  const formData = new FormData()
  formData.append('file', file)
  return post<ResultMessage<FileUploadInfoDto>>('/file/upload', formData)
}
