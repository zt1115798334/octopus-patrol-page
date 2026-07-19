import { request, upload } from '@/lib/api-client'
import type { ResultMessage, FileUploadInfoDto, FileOperationResult, UploadInfo } from '@/types'

const BASE = '/file'

// ==================== 3.14.1 上传文件（直传） ====================

/** POST /file/upload — multipart/form-data，参数 file */
export function uploadFile(file: File, onProgress?: (percent: number) => void): Promise<ResultMessage<FileUploadInfoDto>> {
  return upload<ResultMessage<FileUploadInfoDto>>(`${BASE}/upload`, file, onProgress)
}

// ==================== 3.14.2 检查文件上传状态 ====================

/** POST /file/checkUpload — application/x-www-form-urlencoded，参数 fileMd5 */
export function checkUploadFile(fileMd5: string): Promise<ResultMessage<FileOperationResult>> {
  const params = new URLSearchParams()
  params.append('fileMd5', fileMd5)
  return request<ResultMessage<FileOperationResult>>({
    method: 'POST',
    url: `${BASE}/checkUpload`,
    data: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// ==================== 3.14.3 初始化分片上传 ====================

/** POST /file/initiateUpload — application/x-www-form-urlencoded，参数 fileName/fileMd5/fileSize/chunkSize */
export function initiateUpload(fileName: string, fileMd5: string, fileSize: number, chunkSize: number): Promise<ResultMessage<UploadInfo>> {
  const params = new URLSearchParams()
  params.append('fileName', fileName)
  params.append('fileMd5', fileMd5)
  params.append('fileSize', String(fileSize))
  params.append('chunkSize', String(chunkSize))
  return request<ResultMessage<UploadInfo>>({
    method: 'POST',
    url: `${BASE}/initiateUpload`,
    data: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// ==================== 3.14.4 上传文件分片 ====================

/** POST /file/uploadChunk — multipart/form-data，参数 file/uploadId/chunkNumber */
export function uploadChunk(file: Blob, uploadId: string, chunkNumber: number): Promise<ResultMessage<void>> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('uploadId', uploadId)
  formData.append('chunkNumber', String(chunkNumber))
  // 显式将 Content-Type 设为 undefined，覆盖 axios 实例默认的 application/json
  return request<ResultMessage<void>>({
    method: 'POST',
    url: `${BASE}/uploadChunk`,
    data: formData,
    headers: { 'Content-Type': undefined },
  })
}

// ==================== 3.14.5 合并文件分片 ====================

/** POST /file/mergeUpload — application/x-www-form-urlencoded，参数 uploadId/fileMd5 */
export function mergeUpload(uploadId: string, fileMd5: string): Promise<ResultMessage<FileOperationResult>> {
  const params = new URLSearchParams()
  params.append('uploadId', uploadId)
  params.append('fileMd5', fileMd5)
  return request<ResultMessage<FileOperationResult>>({
    method: 'POST',
    url: `${BASE}/mergeUpload`,
    data: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

/** API 根路径，用于构造浏览器直接请求的完整 URL（如 img src） */
const API_PREFIX = '/patrol/general/api'

// ==================== 3.14.6 / 3.14.7 下载 & 预览 ====================

/** GET /file/download/{fileId} — 附件下载链接（返回完整路径，可直接用于 href/src） */
export function getDownloadFileUrl(fileId: number): string {
  return `${API_PREFIX}${BASE}/download/${fileId}`
}

/** GET /file/show/{fileId} — 在线预览链接（返回完整路径，可直接用于 href/src） */
export function getShowFileUrl(fileId: number): string {
  return `${API_PREFIX}${BASE}/show/${fileId}`
}

/**
 * 通过 axios 请求文件预览接口并返回 Blob。
 * 走 axios 拦截器，自动携带 Authorization token，
 * 解决 <img src> 直接请求无法带 token 的问题。
 */
export async function fetchShowFileBlob(fileId: number): Promise<Blob> {
  const { default: instance } = await import('@/lib/api-client')
  const response = await instance.get(`${BASE}/show/${fileId}`, {
    responseType: 'blob',
  })
  return response.data
}
