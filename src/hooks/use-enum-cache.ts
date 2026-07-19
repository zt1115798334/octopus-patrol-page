import { useState, useEffect } from 'react'
import { findAllEnumPairs } from '@/api/modules/enum'
import type { EnumPairsData } from '@/types'

const ENUM_STORAGE_KEY = 'enumPairsData'

/**
 * 首页加载时调用，获取所有枚举键值对并缓存到 localStorage
 * 后续访问直接从 localStorage 读取，不再重复请求
 */
export function useEnumCache(): { data: EnumPairsData | null; loading: boolean } {
  const [data, setData] = useState<EnumPairsData | null>(() => {
    try {
      const cached = localStorage.getItem(ENUM_STORAGE_KEY)
      if (cached) {
        return JSON.parse(cached) as EnumPairsData
      }
    } catch {
      // 解析失败则重新请求
    }
    return null
  })
  const [loading, setLoading] = useState(!data)

  useEffect(() => {
    if (data) return // 已有缓存，不再请求

    let cancelled = false
    setLoading(true)

    findAllEnumPairs()
      .then((res) => {
        if (cancelled) return
        const pairs = res.obj ?? {}
        try {
          localStorage.setItem(ENUM_STORAGE_KEY, JSON.stringify(pairs))
        } catch {
          // localStorage 满或其他异常，不影响使用
        }
        setData(pairs)
      })
      .catch((err) => {
        if (cancelled) return
        console.error('加载枚举数据失败:', err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { data, loading }
}
