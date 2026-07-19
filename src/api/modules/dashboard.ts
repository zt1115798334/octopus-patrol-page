import { post } from '@/lib/api-client'
import type {
  ResultMessage,
  VisitStatsDto,
  DateVisitStatsDto,
  TimeConsumingDto,
  QueryVisitTrendDto,
  QueryRankDto,
  QueryHourlyVisitDto,
  HotEndpointDto,
  SlowEndpointDto,
  ModuleDistributionDto,
  HourlyVisitDto,
  ActiveUserDto,
  OperateRatioDto,
  WeeklyCompareDto,
} from '@/types'

/**
 * 访问统计（无参）
 * 返回 ResultMessage.list 为 VisitStatsDto[]
 */
export function findVisitStats(): Promise<ResultMessage<VisitStatsDto>> {
  return post<ResultMessage<VisitStatsDto>>('/dashboard/findVisitStats')
}

/**
 * 访问趋势
 * 返回 ResultMessage.obj 为 {dates: string[], values: string[]}
 */
export function findVisitTrend(data: QueryVisitTrendDto): Promise<ResultMessage<Record<string, string[]>>> {
  return post<ResultMessage<Record<string, string[]>>>('/dashboard/findVisitTrend', data)
}

/**
 * 耗时统计（无参）
 * 返回 ResultMessage.list 为 TimeConsumingDto[]
 */
export function findTimeConsumingStats(): Promise<ResultMessage<TimeConsumingDto>> {
  return post<ResultMessage<TimeConsumingDto>>('/dashboard/findTimeConsumingStats')
}

/**
 * 热门接口排行
 * 返回 ResultMessage.list 为 HotEndpointDto[]
 */
export function findHotEndpoints(data: QueryRankDto): Promise<ResultMessage<HotEndpointDto>> {
  return post<ResultMessage<HotEndpointDto>>('/dashboard/findHotEndpoints', data)
}

/**
 * 模块分布统计（无参）
 * 返回 ResultMessage.list 为 ModuleDistributionDto[]
 */
export function findModuleDistribution(): Promise<ResultMessage<ModuleDistributionDto>> {
  return post<ResultMessage<ModuleDistributionDto>>('/dashboard/findModuleDistribution')
}

/**
 * 慢接口排行
 * 返回 ResultMessage.list 为 SlowEndpointDto[]
 */
export function findSlowEndpoints(data: QueryRankDto): Promise<ResultMessage<SlowEndpointDto>> {
  return post<ResultMessage<SlowEndpointDto>>('/dashboard/findSlowEndpoints', data)
}

/**
 * 按小时访问分布
 * 返回 ResultMessage.list 为 HourlyVisitDto[]
 */
export function findHourlyVisitDistribution(data: QueryHourlyVisitDto): Promise<ResultMessage<HourlyVisitDto>> {
  return post<ResultMessage<HourlyVisitDto>>('/dashboard/findHourlyVisitDistribution', data)
}

/**
 * 活跃用户排行
 * 返回 ResultMessage.list 为 ActiveUserDto[]
 */
export function findActiveUsers(data: QueryRankDto): Promise<ResultMessage<ActiveUserDto>> {
  return post<ResultMessage<ActiveUserDto>>('/dashboard/findActiveUsers', data)
}

/**
 * 操作类型占比（无参）
 * 返回 ResultMessage.list 为 OperateRatioDto[]
 */
export function findOperateRatio(): Promise<ResultMessage<OperateRatioDto>> {
  return post<ResultMessage<OperateRatioDto>>('/dashboard/findOperateRatio')
}

/**
 * 本周 vs 上周对比（无参）
 * 返回 ResultMessage.obj 为 WeeklyCompareDto
 */
export function findWeeklyCompare(): Promise<ResultMessage<WeeklyCompareDto>> {
  return post<ResultMessage<WeeklyCompareDto>>('/dashboard/findWeeklyCompare')
}
