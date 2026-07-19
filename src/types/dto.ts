import type {
  EnabledState,
  SortType,
  Operate,
  AiVendor,
  PlanLevel,
  PlatformCode,
  BasedType,
  TimeUnits,
  HttpMethod,
  VisitStatsType,
} from './enums'

// ==================== Enum Types ====================

export interface EnumValueDto {
  code?: number
  desc?: string
  name?: string
}

/** findAllEnumPairs 返回的 Map 结构: key=枚举类名, value=枚举值列表 */
export type EnumPairsData = Record<string, EnumValueDto[]>

// ==================== Common Types ====================

export interface ResultMessage<T = unknown> {
  meta: {
    success: boolean
    code: number
    timestamp: string
    message: string | null
  }
  obj: T | null
  list: T[] | null
  page: PageData<T> | null
  scroll: ScrollData<T> | null
  value: string | null
}

export interface PageData<T> {
  pageNumber: number | null
  pageSize: number | null
  total: number | null
  list: T[] | null
}

export interface ScrollData<T> {
  scrollId: string | null
  list: T[] | null
}

// ==================== Page / Query DTOs ====================

export interface PageDto {
  pageNumber: number
  pageSize: number
  sortName?: string
  sortType?: SortType
}

export interface QueryKeywordsDto extends PageDto {
  keywords?: string
}

// ==================== Log Types ====================

export interface LogDto {
  id?: number
  userId?: number
  name?: string
  type?: string
  operate?: Operate
  content?: string
  ip?: number
  createdTime?: string
  classify?: string
  func?: string
  resp?: string
  timeConsuming?: number
}

export interface LogDtoComplex {
  id?: number
  name?: string
  type?: string
  operate?: Operate
  ip?: number
  createdTime?: string
  timeConsuming?: number
}

export interface LogStatisticsDto {
  totalCount: number
  loginCount: number
  highTimeConsumingCount: number
  deleteCount: number
}

export interface QueryLogDto extends PageDto {
  startDateTime?: string
  endDateTime?: string
  operate?: Operate
}

// ==================== User Types ====================

export interface RoleDto {
  id?: number
  name?: string
  sort?: number
  enabledState?: EnabledState
  permissionIds?: number[]
}

export interface UserDto {
  id?: number
  tenantId?: number
  account?: string
  password?: string
  username?: string
  avatarId?: number
  roleIds?: number[]
  roles?: RoleDto[]
  phone?: string
  enabledState?: EnabledState
  createdTime?: string
  lastLoginTime?: string
  planId?: number
  planName?: string
  planLevel?: PlanLevel
  startTime?: string
  endTime?: string
}

export interface QueryUserDto extends PageDto {
  enabledState?: EnabledState
  startDateTime?: string
  endDateTime?: string
  userIds?: number[]
  keywords?: string
}

export interface UserStatisticsDto {
  totalCount: number
  normalCount: number
  disabledCount: number
  todayNewCount: number
}

export interface ModifyPasswordDto {
  id: number
  newPassword: string
}

export interface ModifyAvatarDto {
  avatarId: number
}

export interface ModifyPhoneDto {
  phone: string
}

export interface ChangeEnabledStateDto {
  id: number
  enabledState: EnabledState
}

// ==================== Role Types ====================

export interface QueryRoleDto extends PageDto {
  enabledState?: EnabledState
  keywords?: string
}

export interface BindRolePermissionDto {
  roleId?: number
  permissionIds?: number[]
}

// ==================== Menu Types ====================

export interface MenuDto {
  id?: number
  parentId?: number
  path?: string
  component?: string
  redirect?: string
  name?: string
  sort?: number
  meta?: Record<string, unknown>
  children: MenuDto[]
  permissionIds?: number[]
}

export interface BindMenuPermissionDto {
  menuId?: number
  permissionIds?: number[]
}

// ==================== Permission Types ====================

export interface PermissionDto {
  id?: number
  name?: string
  permissionKey?: string
  url?: string
  httpMethod?: HttpMethod
  createdTime?: string
  updatedTime?: string
  deleteState?: string
  menuIds?: number[]
}

export interface QueryPermissionDto extends PageDto {
  keywords?: string
}

// ==================== Tenant Types ====================

export interface TenantDto {
  id?: number
  tenantName?: string
  tenantCode?: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
  enabledState?: EnabledState
  expireTime?: string
  createdTime?: string
}

export interface QueryTenantDto extends PageDto {
  tenantName?: string
  tenantCode?: string
  enabledState?: EnabledState
  keywords?: string
}

// ==================== Pricing Plan Types ====================

export interface PricingPlanDto {
  id?: number
  planName?: string
  planLevel?: PlanLevel
  originalPrice?: number
  discountPrice?: number
  keywordLimit?: number
  dailyCommentLimit?: number
  aiConfigLimit?: number
  tokenLimit?: number
  enabledState?: EnabledState
  createdTime?: string
  updatedTime?: string
}

// ==================== User Pricing Plan History Types ====================

export interface UserPricingPlanHistoryDto {
  id?: number
  userId?: number
  planId?: number
  planName?: string
  planLevel?: PlanLevel
  startTime?: string
  endTime?: string
  pricePaid?: number
  createdTime?: string
  updatedTime?: string
  keywordLimit?: number
  dailyCommentLimit?: number
  aiConfigLimit?: number
  tokenLimit?: number
  usedKeywordCount?: number
  usedCommentCount?: number
  usedAiConfigCount?: number
  usedTokenCount?: number
}

// ==================== Dashboard Types ====================

export interface QueryVisitTrendDto {
  startDateTime?: string
  endDateTime?: string
}

export interface QueryRankDto {
  limit?: number
}

export interface QueryHourlyVisitDto {
  date?: string
}

export interface VisitStatsDto {
  type?: VisitStatsType
  todayCount?: number
  totalCount?: number
  growthRate?: number
}

export interface DateVisitStatsDto {
  date?: string
  value?: number
}

export interface TimeConsumingDto {
  type?: VisitStatsType
  yesterdayCount?: number
  todayCount?: number
  totalCount?: number
}

export interface HotEndpointDto {
  name?: string
  count?: number
}

export interface SlowEndpointDto {
  name?: string
  avgTimeConsuming?: number
  maxTimeConsuming?: number
  count?: number
}

export interface ModuleDistributionDto {
  module?: string
  count?: number
  percentage?: number
}

export interface HourlyVisitDto {
  hour?: number
  count?: number
}

export interface ActiveUserDto {
  userId?: number
  userName?: string
  count?: number
}

export interface OperateRatioDto {
  operate?: string
  count?: number
  percentage?: number
}

export interface WeeklyCompareDto {
  thisWeekPv?: number
  lastWeekPv?: number
  pvGrowthRate?: number
  thisWeekIp?: number
  lastWeekIp?: number
  ipGrowthRate?: number
}

// ==================== Configuration Types ====================

export interface ConfigurationInformationDto {
  basedType?: BasedType
  accessExpiration?: number
  accessTimeUnit?: TimeUnits
  refreshExpiration?: number
  refreshTimeUnit?: TimeUnits
}

// ==================== AI Config Types ====================

export interface AiConfigDto {
  id?: number
  name?: string
  vendor?: AiVendor
  apiKey?: string
  apiUrl?: string
  model?: string
  isDefault?: boolean
  enabledState?: EnabledState
  createdTime?: string
  updatedTime?: string
}

export interface QueryAiConfigDto extends PageDto {
  vendor?: AiVendor
  isDefault?: boolean
  enabledState?: EnabledState
  keywords?: string
}

// ==================== Article Types ====================

export interface ArticleDto {
  id?: number
  title?: string
  content?: string
  url?: string
  publishTime?: string
  createdTime?: string
  updatedTime?: string
}

export interface QueryArticleDto extends PageDto {
  startDateTime?: string
  endDateTime?: string
  articleIds?: number[]
  keywords?: string
}

// ==================== Comment Keyword Types ====================

export interface CommentKeywordDto {
  id?: number
  platformAccountId?: number
  keyword?: string
  createdTime?: string
  updatedTime?: string
}

export interface QueryCommentKeywordDto extends PageDto {
  userId?: number
  platformAccountId?: number
  startDateTime?: string
  endDateTime?: string
  matchIds?: number[]
  keywords?: string
}

// ==================== Platform Types ====================

export interface PlatformDto {
  id?: number
  platformName?: string
  platformCode?: PlatformCode
  description?: string
  enabledState?: EnabledState
  createdTime?: string
  updatedTime?: string
}

export interface QueryPlatformDto extends PageDto {
  enabledState?: EnabledState
  startDateTime?: string
  endDateTime?: string
  platformIds?: number[]
  keywords?: string
}

/** 保存平台请求体（仅业务字段，createdTime/updatedTime 由服务端维护） */
export interface SavePlatformDto {
  id?: number
  platformName?: string
  platformCode?: PlatformCode
  description?: string
  enabledState?: EnabledState
}

// ==================== Platform Account Types ====================

export interface PlatformAccountDto {
  id?: number
  account?: string
  password?: string
  platformId?: number
  platformName?: string
  platformCode?: string
  enabledState?: EnabledState
  cookie?: string
  createdTime?: string
  updatedTime?: string
}

export interface QueryPlatformAccountDto extends PageDto {
  userId?: number
  platformId?: number
  enabledState?: EnabledState
  startDateTime?: string
  endDateTime?: string
  accountIds?: number[]
  keywords?: string
}

// ==================== Platform Permission Types ====================

export interface PlatformPermissionDto {
  id?: number
  userId?: number
  platformId?: number
  platformName?: string
  platformCode?: string
  enabledState?: EnabledState
  createdTime?: string
  updatedTime?: string
}

export interface QueryPlatformPermissionDto extends PageDto {
  userId?: number
  platformId?: number
  enabledState?: EnabledState
  startDateTime?: string
  endDateTime?: string
  keywords?: string
}

// ==================== AI Comment Types ====================

export interface AiApiParamDto {
  vendor?: AiVendor
  apiKey?: string
  apiUrl?: string
  model?: string
}

export interface AiCommentRequestDto {
  content: string
  requirement?: string
  apiParams: AiApiParamDto
}

// ==================== Job / Quartz Types ====================

export interface JobDto {
  jobName: string
  jobGroup: string
  jobClassName: string
  cronExpression: string
  description?: string
  jobDataMap?: Record<string, unknown>
}

export interface JobKeyDto {
  jobName: string
  jobGroup: string
}

// ==================== AMQP Types ====================

export interface ArticleCommentDto {
  articleId: number
  title: string
  content: string
  url: string
  userId: number
  accountId: number
  accountCookie: string
}

// ==================== External Types ====================

export interface XhsNoteDto {
  title: string
  author: string
  link: string
}

export interface SuperSpiderSearchResponseDto {
  keyword: string
  count: number
  data: XhsNoteDto[]
}

export interface SearchXhsDto {
  keyword: string
  platformAccountId: number
}

export interface ArticleCommentRecordDto {
  id?: number
  articleId?: number
  thirdPartyAccountId?: number
  commentContent?: string
  commentTime?: string
  createdTime?: string
  updatedTime?: string
}

// ==================== Platform Scheme Types ====================

export interface PlatformSchemeDto {
  id?: number
  userId?: number
  platformCode?: PlatformCode
  platformAccountId?: number
  requestParams?: string
  description?: string
  enabledState?: EnabledState
  createdTime?: string
  updatedTime?: string
}

export interface QueryPlatformSchemeDto extends PageDto {
  platformCode?: PlatformCode
  platformAccountId?: number
  enabledState?: EnabledState
  startDateTime?: string
  endDateTime?: string
  keywords?: string
}

// ==================== Platform Scheme Run Log Types ====================

export type RunStatus = 'RUNNING' | 'SUCCESS' | 'FAILED'

export interface PlatformSchemeRunLogDto {
  id?: number
  userId?: number
  platformSchemeId?: number
  platformCode?: PlatformCode
  platformAccountId?: number
  runStatus?: RunStatus
  startTime?: string
  endTime?: string
  duration?: number
  attemptCount?: number
  resultMessage?: string
  errorMessage?: string
  requestParams?: string
  createdTime?: string
  updatedTime?: string
}

export interface QueryPlatformSchemeRunLogDto extends PageDto {
  platformSchemeId?: number
  platformCode?: PlatformCode
  runStatus?: RunStatus
  startDateTime?: string
  endDateTime?: string
  keywords?: string
}

// ==================== AI Usage Record Types ====================

export interface AiUsageRecordDto {
  id?: number
  userId?: number
  username?: string
  aiConfigId?: number
  configName?: string
  vendor?: AiVendor
  model?: string
  prompt?: string
  response?: string
  tokenUsed?: number
  cost?: number
  createdTime?: string
}

export interface QueryAiUsageRecordDto extends PageDto {
  userId?: number
  aiConfigId?: number
  vendor?: AiVendor
  startDateTime?: string
  endDateTime?: string
  keywords?: string
}

// ==================== File Upload Types ====================

export interface FileUploadInfoDto {
  id?: number
  fileName?: string
  fileSize?: number
}

/** 文件状态 -- UN_UPLOADED:0,UPLOADED:1,UPLOADING:2 */
export enum FileStatus {
  UN_UPLOADED = 0,
  UPLOADED = 1,
  UPLOADING = 2,
}

/** 文件操作结果（秒传/合并 返回） */
export interface FileOperationResult {
  fileId?: number
  fileStatus?: FileStatus
  chunkUploadedList?: number[]
}

/** 分片初始化上传信息 */
export interface UploadInfo {
  uploadId?: string
  expiryTime?: string
  part?: number[]
}
