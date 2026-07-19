import { useState, useEffect } from 'react'
import { fetchShowFileBlob } from '@/api/modules/file'

/**
 * 根据文件 ID 获取预览 Blob URL（自动携带 token）。
 *
 * - 使用 axios 请求文件预览接口，token 由拦截器自动注入。
 * - 返回 Blob URL 可直接用于 <img src> / <AvatarImage src>。
 * - 组件卸载或 fileId 变化时自动 revoke 释放内存。
 *
 * @param fileId 文件 ID，为 null/undefined 时不发起请求
 * @returns Blob URL 字符串，加载中或无效 fileId 时返回 null
 */
export function useShowFileUrl(fileId: number | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (fileId == null) {
      setUrl(null)
      return
    }

    let objectUrl: string | null = null
    let cancelled = false

    fetchShowFileBlob(fileId)
      .then((blob) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setUrl(objectUrl)
      })
      .catch(() => {
        if (!cancelled) setUrl(null)
      })

    return () => {
      cancelled = true
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [fileId])

  return url
}
