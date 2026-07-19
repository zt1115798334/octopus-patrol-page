import { get } from '@/lib/api-client'
import type { ResultMessage, EnumPairsData } from '@/types'

/**
 * 查询所有枚举值列表（无参）
 * GET /enum/findAllEnumPairs
 * 返回 ResultMessage.obj 为 Map<枚举类名, EnumValueDto[]>
 */
export function findAllEnumPairs(): Promise<ResultMessage<EnumPairsData>> {
  return get<ResultMessage<EnumPairsData>>('/enum/findAllEnumPairs')
}
