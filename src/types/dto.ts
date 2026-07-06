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

// ==================== Common Types ====================

export interface ResultMessage<T> {
  meta: {
    success: boolean
    code: number
    message: string
  }
  data: T
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
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

export interface VisitStatsDto {
  type?: VisitStatsType
  title?: string
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
  title?: string
  yesterdayCount?: number
  todayCount?: number
  totalCount?: number
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

// ==================== File Upload Types ====================

export interface FileUploadInfoDto {
  id?: number
  fileName?: string
  fileSize?: number
}
