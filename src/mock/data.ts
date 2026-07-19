// ============================================================
// Mock Data — all entity data used by the mock handler
// ============================================================

import type {
  UserDto,
  RoleDto,
  MenuDto,
  PermissionDto,
  TenantDto,
  LogDto,
  PricingPlanDto,
  UserPricingPlanHistoryDto,
  AiConfigDto,
  ArticleDto,
  CommentKeywordDto,
  PlatformDto,
  PlatformAccountDto,
  PlatformPermissionDto,
  PlatformSchemeDto,
  PlatformSchemeRunLogDto,
  JobDto,
  VisitStatsDto,
  DateVisitStatsDto,
  TimeConsumingDto,
  HotEndpointDto,
  SlowEndpointDto,
  ModuleDistributionDto,
  HourlyVisitDto,
  ActiveUserDto,
  OperateRatioDto,
  WeeklyCompareDto,
  LogStatisticsDto,
  UserStatisticsDto,
  ConfigurationInformationDto,
} from '@/types'
import { VisitStatsType } from '@/types'

// ---- Helpers ----
let _id = 100
function nextId(): number { return ++_id }

function daysAgo(n: number): string {
  const d = new Date(); d.setDate(d.getDate() - n)
  return d.toISOString()
}

// ---- Users ----
export const mockUsers: UserDto[] = [
  { id: 1, tenantId: 1, account: 'admin', username: '管理员', avatarId: 1, phone: '13800000001', enabledState: 'ENABLED' as any, createdTime: daysAgo(60), lastLoginTime: daysAgo(0), planName: '企业版', planLevel: 'ENTERPRISE' as any, roleIds: [1] },
  { id: 2, tenantId: 1, account: 'zhangsan', username: '张三', avatarId: 2, phone: '13800000002', enabledState: 'ENABLED' as any, createdTime: daysAgo(55), lastLoginTime: daysAgo(2), planName: '专业版', planLevel: 'PROFESSIONAL' as any, roleIds: [2] },
  { id: 3, tenantId: 1, account: 'lisi', username: '李四', avatarId: 3, phone: '13800000003', enabledState: 'ENABLED' as any, createdTime: daysAgo(50), lastLoginTime: daysAgo(3), planName: '基础版', planLevel: 'BASIC' as any, roleIds: [2] },
  { id: 4, tenantId: 2, account: 'wangwu', username: '王五', avatarId: 4, phone: '13800000004', enabledState: 'ENABLED' as any, createdTime: daysAgo(45), lastLoginTime: daysAgo(5), planName: '专业版', planLevel: 'PROFESSIONAL' as any, roleIds: [2] },
  { id: 5, tenantId: 2, account: 'zhaoliu', username: '赵六', avatarId: 5, phone: '13800000005', enabledState: 'DISABLED' as any, createdTime: daysAgo(40), lastLoginTime: daysAgo(10), planName: '基础版', planLevel: 'BASIC' as any, roleIds: [3] },
  { id: 6, tenantId: 1, account: 'sunqi', username: '孙七', avatarId: 6, phone: '13800000006', enabledState: 'ENABLED' as any, createdTime: daysAgo(35), lastLoginTime: daysAgo(1), planName: '企业版', planLevel: 'ENTERPRISE' as any, roleIds: [2] },
  { id: 7, tenantId: 3, account: 'zhouba', username: '周八', avatarId: 7, phone: '13800000007', enabledState: 'ENABLED' as any, createdTime: daysAgo(30), lastLoginTime: daysAgo(7), planName: '专业版', planLevel: 'PROFESSIONAL' as any, roleIds: [3] },
  { id: 8, tenantId: 3, account: 'wujiu', username: '吴九', avatarId: 8, phone: '13800000008', enabledState: 'ENABLED' as any, createdTime: daysAgo(25), lastLoginTime: daysAgo(4), planName: '基础版', planLevel: 'BASIC' as any, roleIds: [3] },
  { id: 9, tenantId: 1, account: 'zhengshi', username: '郑十', avatarId: 9, phone: '13800000009', enabledState: 'DISABLED' as any, createdTime: daysAgo(20), lastLoginTime: daysAgo(15), planName: '企业版', planLevel: 'ENTERPRISE' as any, roleIds: [2] },
  { id: 10, tenantId: 2, account: 'liuyi', username: '刘一', avatarId: 10, phone: '13800000010', enabledState: 'ENABLED' as any, createdTime: daysAgo(15), lastLoginTime: daysAgo(1), planName: '专业版', planLevel: 'PROFESSIONAL' as any, roleIds: [3] },
  { id: 11, tenantId: 1, account: 'chener', username: '陈二', avatarId: 11, phone: '13800000011', enabledState: 'ENABLED' as any, createdTime: daysAgo(10), lastLoginTime: daysAgo(2), planName: '基础版', planLevel: 'BASIC' as any, roleIds: [3] },
  { id: 12, tenantId: 3, account: 'yangshan', username: '杨三', avatarId: 12, phone: '13800000012', enabledState: 'ENABLED' as any, createdTime: daysAgo(5), lastLoginTime: daysAgo(0), planName: '企业版', planLevel: 'ENTERPRISE' as any, roleIds: [2] },
]

// ---- Roles ----
export const mockRoles: RoleDto[] = [
  { id: 1, name: '超级管理员', sort: 1, enabledState: 'ENABLED' as any },
  { id: 2, name: '运维工程师', sort: 2, enabledState: 'ENABLED' as any },
  { id: 3, name: '普通用户', sort: 3, enabledState: 'ENABLED' as any },
  { id: 4, name: '审计员', sort: 4, enabledState: 'ENABLED' as any },
  { id: 5, name: '只读用户', sort: 5, enabledState: 'DISABLED' as any },
]

// ---- Tenants ----
export const mockTenants: TenantDto[] = [
  { id: 1, tenantName: '腾讯科技', tenantCode: 'tencent', contactName: '马化腾', contactPhone: '13800001111', contactEmail: 'tencent@example.com', enabledState: 'ENABLED' as any, expireTime: daysAgo(-365), createdTime: daysAgo(365) },
  { id: 2, tenantName: '阿里巴巴', tenantCode: 'alibaba', contactName: '张勇', contactPhone: '13800002222', contactEmail: 'alibaba@example.com', enabledState: 'ENABLED' as any, expireTime: daysAgo(-200), createdTime: daysAgo(300) },
  { id: 3, tenantName: '字节跳动', tenantCode: 'bytedance', contactName: '梁汝波', contactPhone: '13800003333', contactEmail: 'bytedance@example.com', enabledState: 'ENABLED' as any, expireTime: daysAgo(-180), createdTime: daysAgo(200) },
  { id: 4, tenantName: '美团', tenantCode: 'meituan', contactName: '王兴', contactPhone: '13800004444', contactEmail: 'meituan@example.com', enabledState: 'DISABLED' as any, expireTime: daysAgo(10), createdTime: daysAgo(150) },
  { id: 5, tenantName: '京东集团', tenantCode: 'jd', contactName: '刘强东', contactPhone: '13800005555', contactEmail: 'jd@example.com', enabledState: 'ENABLED' as any, expireTime: daysAgo(-90), createdTime: daysAgo(100) },
  { id: 6, tenantName: '拼多多', tenantCode: 'pdd', contactName: '陈磊', contactPhone: '13800006666', contactEmail: 'pdd@example.com', enabledState: 'ENABLED' as any, expireTime: daysAgo(-60), createdTime: daysAgo(80) },
]

// ---- Platforms ----
export const mockPlatforms: PlatformDto[] = [
  { id: 1, platformName: '小红书', platformCode: 'XHS' as any, description: '小红书平台爬取与评论', enabledState: 'ENABLED' as any, createdTime: daysAgo(180), updatedTime: daysAgo(1) },
  { id: 2, platformName: '抖音', platformCode: 'DY' as any, description: '抖音短视频平台', enabledState: 'ENABLED' as any, createdTime: daysAgo(150), updatedTime: daysAgo(3) },
  { id: 3, platformName: '微博', platformCode: 'WB' as any, description: '微博社交媒体平台', enabledState: 'ENABLED' as any, createdTime: daysAgo(120), updatedTime: daysAgo(5) },
  { id: 4, platformName: '知乎', platformCode: 'ZH' as any, description: '知乎问答平台', enabledState: 'DISABLED' as any, createdTime: daysAgo(90), updatedTime: daysAgo(10) },
  { id: 5, platformName: 'B站', platformCode: 'BILI' as any, description: 'Bilibili弹幕视频网', enabledState: 'ENABLED' as any, createdTime: daysAgo(60), updatedTime: daysAgo(7) },
  { id: 6, platformName: '快手', platformCode: 'KS' as any, description: '快手短视频平台', enabledState: 'ENABLED' as any, createdTime: daysAgo(30), updatedTime: daysAgo(2) },
]

// ---- Platform Accounts ----
export const mockPlatformAccounts: PlatformAccountDto[] = [
  { id: 1, account: 'xhs_admin', platformId: 1, platformName: '小红书', platformCode: 'XHS', enabledState: 'ENABLED' as any, createdTime: daysAgo(100), updatedTime: daysAgo(1) },
  { id: 2, account: 'xhs_ops', platformId: 1, platformName: '小红书', platformCode: 'XHS', enabledState: 'ENABLED' as any, createdTime: daysAgo(80), updatedTime: daysAgo(2) },
  { id: 3, account: 'dy_master', platformId: 2, platformName: '抖音', platformCode: 'DY', enabledState: 'ENABLED' as any, createdTime: daysAgo(70), updatedTime: daysAgo(3) },
  { id: 4, account: 'wb_official', platformId: 3, platformName: '微博', platformCode: 'WB', enabledState: 'ENABLED' as any, createdTime: daysAgo(60), updatedTime: daysAgo(4) },
  { id: 5, account: 'zh_editor', platformId: 4, platformName: '知乎', platformCode: 'ZH', enabledState: 'DISABLED' as any, createdTime: daysAgo(50), updatedTime: daysAgo(15) },
  { id: 6, account: 'bili_up', platformId: 5, platformName: 'B站', platformCode: 'BILI', enabledState: 'ENABLED' as any, createdTime: daysAgo(40), updatedTime: daysAgo(5) },
  { id: 7, account: 'ks_live', platformId: 6, platformName: '快手', platformCode: 'KS', enabledState: 'ENABLED' as any, createdTime: daysAgo(30), updatedTime: daysAgo(2) },
  { id: 8, account: 'xhs_marketing', platformId: 1, platformName: '小红书', platformCode: 'XHS', enabledState: 'ENABLED' as any, createdTime: daysAgo(20), updatedTime: daysAgo(1) },
]

// ---- Platform Permissions ----
export const mockPlatformPermissions: PlatformPermissionDto[] = [
  { id: 1, userId: 1, platformId: 1, platformName: '小红书', platformCode: 'XHS', enabledState: 'ENABLED' as any, createdTime: daysAgo(90), updatedTime: daysAgo(1) },
  { id: 2, userId: 1, platformId: 2, platformName: '抖音', platformCode: 'DY', enabledState: 'ENABLED' as any, createdTime: daysAgo(85), updatedTime: daysAgo(2) },
  { id: 3, userId: 2, platformId: 1, platformName: '小红书', platformCode: 'XHS', enabledState: 'ENABLED' as any, createdTime: daysAgo(80), updatedTime: daysAgo(3) },
  { id: 4, userId: 2, platformId: 3, platformName: '微博', platformCode: 'WB', enabledState: 'DISABLED' as any, createdTime: daysAgo(75), updatedTime: daysAgo(10) },
  { id: 5, userId: 3, platformId: 1, platformName: '小红书', platformCode: 'XHS', enabledState: 'ENABLED' as any, createdTime: daysAgo(70), updatedTime: daysAgo(5) },
  { id: 6, userId: 3, platformId: 5, platformName: 'B站', platformCode: 'BILI', enabledState: 'ENABLED' as any, createdTime: daysAgo(60), updatedTime: daysAgo(4) },
  { id: 7, userId: 4, platformId: 2, platformName: '抖音', platformCode: 'DY', enabledState: 'ENABLED' as any, createdTime: daysAgo(50), updatedTime: daysAgo(2) },
  { id: 8, userId: 4, platformId: 6, platformName: '快手', platformCode: 'KS', enabledState: 'ENABLED' as any, createdTime: daysAgo(40), updatedTime: daysAgo(1) },
  { id: 9, userId: 6, platformId: 1, platformName: '小红书', platformCode: 'XHS', enabledState: 'ENABLED' as any, createdTime: daysAgo(30), updatedTime: daysAgo(0) },
  { id: 10, userId: 6, platformId: 3, platformName: '微博', platformCode: 'WB', enabledState: 'ENABLED' as any, createdTime: daysAgo(20), updatedTime: daysAgo(2) },
]

// ---- Platform Schemes ----
export const mockPlatformSchemes: PlatformSchemeDto[] = [
  { id: 1, userId: 1, platformCode: 'XHS' as any, platformAccountId: 1, requestParams: '{"keyword":"热门话题"}', description: '每日热门话题爬取', enabledState: 'ENABLED' as any, createdTime: daysAgo(60), updatedTime: daysAgo(1) },
  { id: 2, userId: 1, platformCode: 'DY' as any, platformAccountId: 3, requestParams: '{"type":"video"}', description: '热门视频监控', enabledState: 'ENABLED' as any, createdTime: daysAgo(50), updatedTime: daysAgo(2) },
  { id: 3, userId: 2, platformCode: 'XHS' as any, platformAccountId: 2, requestParams: '{"keyword":"美妆"}', description: '美妆类内容监控', enabledState: 'ENABLED' as any, createdTime: daysAgo(40), updatedTime: daysAgo(3) },
  { id: 4, userId: 3, platformCode: 'WB' as any, platformAccountId: 4, requestParams: '{"type":"hotsearch"}', description: '微博热搜监控', enabledState: 'DISABLED' as any, createdTime: daysAgo(30), updatedTime: daysAgo(10) },
  { id: 5, userId: 6, platformCode: 'XHS' as any, platformAccountId: 1, requestParams: '{"keyword":"科技"}', description: '科技类内容评论', enabledState: 'ENABLED' as any, createdTime: daysAgo(20), updatedTime: daysAgo(1) },
  { id: 6, userId: 6, platformCode: 'BILI' as any, platformAccountId: 6, requestParams: '{"type":"trending"}', description: 'B站热门视频监控', enabledState: 'ENABLED' as any, createdTime: daysAgo(10), updatedTime: daysAgo(0) },
  { id: 7, userId: 10, platformCode: 'XHS' as any, platformAccountId: 8, requestParams: '{"keyword":"数码"}', description: '数码产品评测监控', enabledState: 'ENABLED' as any, createdTime: daysAgo(5), updatedTime: daysAgo(1) },
  { id: 8, userId: 12, platformCode: 'KS' as any, platformAccountId: 7, requestParams: '{"keyword":"搞笑"}', description: '搞笑内容监控', enabledState: 'ENABLED' as any, createdTime: daysAgo(3), updatedTime: daysAgo(0) },
]

// ---- Scheme Run Logs ----
export const mockRunLogs: PlatformSchemeRunLogDto[] = [
  { id: 1, userId: 1, platformSchemeId: 1, platformCode: 'XHS' as any, platformAccountId: 1, runStatus: 'SUCCESS', startTime: daysAgo(1), endTime: daysAgo(1), duration: 1200, attemptCount: 1, createdTime: daysAgo(1) },
  { id: 2, userId: 1, platformSchemeId: 2, platformCode: 'DY' as any, platformAccountId: 3, runStatus: 'SUCCESS', startTime: daysAgo(1), endTime: daysAgo(1), duration: 3500, attemptCount: 1, createdTime: daysAgo(1) },
  { id: 3, userId: 2, platformSchemeId: 3, platformCode: 'XHS' as any, platformAccountId: 2, runStatus: 'FAILED', startTime: daysAgo(0), endTime: daysAgo(0), duration: 5000, attemptCount: 3, errorMessage: '网络请求超时', createdTime: daysAgo(0) },
  { id: 4, userId: 6, platformSchemeId: 5, platformCode: 'XHS' as any, platformAccountId: 1, runStatus: 'SUCCESS', startTime: daysAgo(0), endTime: daysAgo(0), duration: 800, attemptCount: 1, createdTime: daysAgo(0) },
  { id: 5, userId: 6, platformSchemeId: 6, platformCode: 'BILI' as any, platformAccountId: 6, runStatus: 'RUNNING', startTime: daysAgo(0), duration: 0, attemptCount: 1, createdTime: daysAgo(0) },
  { id: 6, userId: 1, platformSchemeId: 1, platformCode: 'XHS' as any, platformAccountId: 1, runStatus: 'SUCCESS', startTime: daysAgo(2), endTime: daysAgo(2), duration: 1100, attemptCount: 1, createdTime: daysAgo(2) },
  { id: 7, userId: 3, platformSchemeId: 4, platformCode: 'WB' as any, platformAccountId: 4, runStatus: 'SUCCESS', startTime: daysAgo(3), endTime: daysAgo(3), duration: 900, attemptCount: 1, createdTime: daysAgo(3) },
  { id: 8, userId: 10, platformSchemeId: 7, platformCode: 'XHS' as any, platformAccountId: 8, runStatus: 'SUCCESS', startTime: daysAgo(0), endTime: daysAgo(0), duration: 1500, attemptCount: 1, createdTime: daysAgo(0) },
  { id: 9, userId: 12, platformSchemeId: 8, platformCode: 'KS' as any, platformAccountId: 7, runStatus: 'FAILED', startTime: daysAgo(0), endTime: daysAgo(0), duration: 3000, attemptCount: 2, errorMessage: '账号登录异常', createdTime: daysAgo(0) },
  { id: 10, userId: 1, platformSchemeId: 1, platformCode: 'XHS' as any, platformAccountId: 1, runStatus: 'SUCCESS', startTime: daysAgo(3), endTime: daysAgo(3), duration: 1300, attemptCount: 1, createdTime: daysAgo(3) },
]

// ---- Menus ----
export const mockMenus: MenuDto[] = [
  { id: 1, parentId: 0, path: '/', name: '仪表盘', sort: 1, children: [], meta: { icon: 'LayoutDashboard', title: '仪表盘' } },
  {
    id: 2, parentId: 0, path: '/system', name: '系统管理', sort: 2, children: [
      { id: 3, parentId: 2, path: '/user', name: '用户管理', sort: 1, children: [] },
      { id: 4, parentId: 2, path: '/pricing-plan', name: '套餐管理', sort: 2, children: [] },
      { id: 5, parentId: 2, path: '/menu', name: '菜单管理', sort: 3, children: [] },
      { id: 6, parentId: 2, path: '/log', name: '日志', sort: 4, children: [] },
    ],
  },
  {
    id: 7, parentId: 0, path: '/platform', name: '平台管理', sort: 3, children: [
      { id: 8, parentId: 7, path: '/platform', name: '平台列表', sort: 1, children: [] },
      { id: 9, parentId: 7, path: '/platform-account', name: '平台账号', sort: 2, children: [] },
      { id: 10, parentId: 7, path: '/run-plan', name: '运行方案', sort: 3, children: [] },
    ],
  },
  {
    id: 11, parentId: 0, path: '/ai', name: 'AI管理', sort: 4, children: [
      { id: 12, parentId: 11, path: '/ai-config', name: 'AI配置', sort: 1, children: [] },
      { id: 13, parentId: 11, path: '/ai-usage', name: 'AI使用记录', sort: 2, children: [] },
    ],
  },
]

// ---- Permissions ----
export const mockPermissions: PermissionDto[] = [
  { id: 1, name: '用户查看', permissionKey: 'user:read', url: '/api/user/**', httpMethod: 'GET' as any, createdTime: daysAgo(100), updatedTime: daysAgo(10), deleteState: '0' },
  { id: 2, name: '用户新增', permissionKey: 'user:create', url: '/api/user/saveUser', httpMethod: 'POST' as any, createdTime: daysAgo(100), updatedTime: daysAgo(10), deleteState: '0' },
  { id: 3, name: '用户编辑', permissionKey: 'user:update', url: '/api/user/saveUser', httpMethod: 'PUT' as any, createdTime: daysAgo(100), updatedTime: daysAgo(10), deleteState: '0' },
  { id: 4, name: '用户删除', permissionKey: 'user:delete', url: '/api/user/deleteUser/**', httpMethod: 'DELETE' as any, createdTime: daysAgo(100), updatedTime: daysAgo(10), deleteState: '0' },
  { id: 5, name: '角色查看', permissionKey: 'role:read', url: '/api/role/**', httpMethod: 'GET' as any, createdTime: daysAgo(90), updatedTime: daysAgo(10), deleteState: '0' },
  { id: 6, name: '角色管理', permissionKey: 'role:manage', url: '/api/role/**', httpMethod: 'POST' as any, createdTime: daysAgo(90), updatedTime: daysAgo(10), deleteState: '0' },
  { id: 7, name: '平台查看', permissionKey: 'platform:read', url: '/api/platform/**', httpMethod: 'GET' as any, createdTime: daysAgo(80), updatedTime: daysAgo(10), deleteState: '0' },
  { id: 8, name: '平台管理', permissionKey: 'platform:manage', url: '/api/platform/**', httpMethod: 'POST' as any, createdTime: daysAgo(80), updatedTime: daysAgo(10), deleteState: '0' },
  { id: 9, name: '日志查看', permissionKey: 'log:read', url: '/api/log/**', httpMethod: 'GET' as any, createdTime: daysAgo(70), updatedTime: daysAgo(10), deleteState: '0' },
  { id: 10, name: 'AI配置管理', permissionKey: 'ai:manage', url: '/api/aiConfig/**', httpMethod: 'POST' as any, createdTime: daysAgo(60), updatedTime: daysAgo(10), deleteState: '0' },
  { id: 11, name: '文章管理', permissionKey: 'article:manage', url: '/api/article/**', httpMethod: 'POST' as any, createdTime: daysAgo(50), updatedTime: daysAgo(10), deleteState: '0' },
  { id: 12, name: '定价管理', permissionKey: 'pricing:manage', url: '/api/pricingPlan/**', httpMethod: 'POST' as any, createdTime: daysAgo(40), updatedTime: daysAgo(10), deleteState: '0' },
]

// ---- Pricing Plans ----
export const mockPricingPlans: PricingPlanDto[] = [
  { id: 1, planName: '免费版', planLevel: 'FREE' as any, originalPrice: 0, discountPrice: 0, keywordLimit: 5, dailyCommentLimit: 20, aiConfigLimit: 1, tokenLimit: 1000, enabledState: 'ENABLED' as any, createdTime: daysAgo(180), updatedTime: daysAgo(30) },
  { id: 2, planName: '基础版', planLevel: 'BASIC' as any, originalPrice: 299, discountPrice: 199, keywordLimit: 20, dailyCommentLimit: 100, aiConfigLimit: 3, tokenLimit: 5000, enabledState: 'ENABLED' as any, createdTime: daysAgo(180), updatedTime: daysAgo(30) },
  { id: 3, planName: '专业版', planLevel: 'PROFESSIONAL' as any, originalPrice: 999, discountPrice: 699, keywordLimit: 100, dailyCommentLimit: 500, aiConfigLimit: 10, tokenLimit: 20000, enabledState: 'ENABLED' as any, createdTime: daysAgo(180), updatedTime: daysAgo(30) },
  { id: 4, planName: '企业版', planLevel: 'ENTERPRISE' as any, originalPrice: 2999, discountPrice: 1999, keywordLimit: 500, dailyCommentLimit: 2000, aiConfigLimit: 50, tokenLimit: 100000, enabledState: 'ENABLED' as any, createdTime: daysAgo(180), updatedTime: daysAgo(30) },
  { id: 5, planName: '旗舰版', planLevel: 'ULTIMATE' as any, originalPrice: 9999, discountPrice: 6999, keywordLimit: 9999, dailyCommentLimit: 9999, aiConfigLimit: 200, tokenLimit: 999999, enabledState: 'DISABLED' as any, createdTime: daysAgo(100), updatedTime: daysAgo(50) },
]

// ---- Pricing Plan History ----
export const mockPlanHistory: UserPricingPlanHistoryDto[] = [
  { id: 1, userId: 1, planId: 4, planName: '企业版', planLevel: 'ENTERPRISE' as any, startTime: daysAgo(180), endTime: daysAgo(-185), pricePaid: 1999, createdTime: daysAgo(180), keywordLimit: 500, dailyCommentLimit: 2000, aiConfigLimit: 50, tokenLimit: 100000, usedKeywordCount: 120, usedCommentCount: 800, usedAiConfigCount: 20, usedTokenCount: 30000 },
  { id: 2, userId: 2, planId: 3, planName: '专业版', planLevel: 'PROFESSIONAL' as any, startTime: daysAgo(90), endTime: daysAgo(-275), pricePaid: 699, createdTime: daysAgo(90), keywordLimit: 100, dailyCommentLimit: 500, aiConfigLimit: 10, tokenLimit: 20000, usedKeywordCount: 45, usedCommentCount: 200, usedAiConfigCount: 5, usedTokenCount: 8000 },
  { id: 3, userId: 3, planId: 2, planName: '基础版', planLevel: 'BASIC' as any, startTime: daysAgo(60), endTime: daysAgo(-305), pricePaid: 199, createdTime: daysAgo(60), keywordLimit: 20, dailyCommentLimit: 100, aiConfigLimit: 3, tokenLimit: 5000, usedKeywordCount: 10, usedCommentCount: 30, usedAiConfigCount: 2, usedTokenCount: 2000 },
  { id: 4, userId: 6, planId: 4, planName: '企业版', planLevel: 'ENTERPRISE' as any, startTime: daysAgo(30), endTime: daysAgo(-335), pricePaid: 1999, createdTime: daysAgo(30), keywordLimit: 500, dailyCommentLimit: 2000, aiConfigLimit: 50, tokenLimit: 100000, usedKeywordCount: 200, usedCommentCount: 1200, usedAiConfigCount: 30, usedTokenCount: 50000 },
]

// ---- AI Configs ----
export const mockAiConfigs: AiConfigDto[] = [
  { id: 1, name: 'GPT-4o 默认配置', vendor: 'OPENAI' as any, apiKey: 'sk-****abcd', apiUrl: 'https://api.openai.com/v1', model: 'gpt-4o', isDefault: true, enabledState: 'ENABLED' as any, createdTime: daysAgo(60), updatedTime: daysAgo(1) },
  { id: 2, name: 'Claude 3.5', vendor: 'ANTHROPIC' as any, apiKey: 'sk-ant-****', apiUrl: 'https://api.anthropic.com', model: 'claude-3-5-sonnet', isDefault: false, enabledState: 'ENABLED' as any, createdTime: daysAgo(45), updatedTime: daysAgo(5) },
  { id: 3, name: '混元大模型', vendor: 'TENCENT' as any, apiKey: '****tencent', apiUrl: 'https://hunyuan.tencent.com', model: 'hunyuan-pro', isDefault: false, enabledState: 'ENABLED' as any, createdTime: daysAgo(30), updatedTime: daysAgo(3) },
  { id: 4, name: '文心一言', vendor: 'BAIDU' as any, apiKey: '****baidu', apiUrl: 'https://api.baidu.com', model: 'ernie-4.0', isDefault: false, enabledState: 'DISABLED' as any, createdTime: daysAgo(20), updatedTime: daysAgo(10) },
  { id: 5, name: '通义千问', vendor: 'ALIBABA' as any, apiKey: '****alibaba', apiUrl: 'https://dashscope.aliyuncs.com', model: 'qwen-max', isDefault: false, enabledState: 'ENABLED' as any, createdTime: daysAgo(15), updatedTime: daysAgo(2) },
]

// ---- Articles ----
export const mockArticles: ArticleDto[] = [
  { id: 1, title: '2025年AI行业发展趋势报告', url: 'https://xhs.com/article/1', publishTime: daysAgo(5), createdTime: daysAgo(5), updatedTime: daysAgo(5) },
  { id: 2, title: '深度学习在NLP中的应用', url: 'https://xhs.com/article/2', publishTime: daysAgo(6), createdTime: daysAgo(6), updatedTime: daysAgo(6) },
  { id: 3, title: '前端框架性能对比2025', url: 'https://zhihu.com/article/3', publishTime: daysAgo(7), createdTime: daysAgo(7), updatedTime: daysAgo(7) },
  { id: 4, title: '微服务架构最佳实践', url: 'https://zhihu.com/article/4', publishTime: daysAgo(8), createdTime: daysAgo(8), updatedTime: daysAgo(8) },
  { id: 5, title: 'Python自动化运维实战', url: 'https://xhs.com/article/5', publishTime: daysAgo(9), createdTime: daysAgo(9), updatedTime: daysAgo(9) },
  { id: 6, title: '云原生技术栈选型指南', url: 'https://zhihu.com/article/6', publishTime: daysAgo(10), createdTime: daysAgo(10), updatedTime: daysAgo(10) },
  { id: 7, title: '大模型微调技术详解', url: 'https://xhs.com/article/7', publishTime: daysAgo(11), createdTime: daysAgo(11), updatedTime: daysAgo(11) },
  { id: 8, title: '数据仓库架构演进之路', url: 'https://zhihu.com/article/8', publishTime: daysAgo(12), createdTime: daysAgo(12), updatedTime: daysAgo(12) },
  { id: 9, title: 'Rust在系统编程中的优势', url: 'https://xhs.com/article/9', publishTime: daysAgo(13), createdTime: daysAgo(13), updatedTime: daysAgo(13) },
  { id: 10, title: '容器编排技术对比：K8s vs Nomad', url: 'https://zhihu.com/article/10', publishTime: daysAgo(14), createdTime: daysAgo(14), updatedTime: daysAgo(14) },
  { id: 11, title: 'TypeScript 5.0新特性解读', url: 'https://xhs.com/article/11', publishTime: daysAgo(15), createdTime: daysAgo(15), updatedTime: daysAgo(15) },
  { id: 12, title: '数据库性能优化实战指南', url: 'https://zhihu.com/article/12', publishTime: daysAgo(16), createdTime: daysAgo(16), updatedTime: daysAgo(16) },
]

// ---- Comment Keywords ----
export const mockCommentKeywords: CommentKeywordDto[] = [
  { id: 1, platformAccountId: 1, keyword: 'AI', createdTime: daysAgo(30), updatedTime: daysAgo(1) },
  { id: 2, platformAccountId: 1, keyword: '大模型', createdTime: daysAgo(30), updatedTime: daysAgo(2) },
  { id: 3, platformAccountId: 1, keyword: '编程', createdTime: daysAgo(25), updatedTime: daysAgo(3) },
  { id: 4, platformAccountId: 2, keyword: '前端开发', createdTime: daysAgo(25), updatedTime: daysAgo(4) },
  { id: 5, platformAccountId: 2, keyword: 'React', createdTime: daysAgo(20), updatedTime: daysAgo(5) },
  { id: 6, platformAccountId: 3, keyword: '短视频', createdTime: daysAgo(20), updatedTime: daysAgo(6) },
  { id: 7, platformAccountId: 3, keyword: '抖音运营', createdTime: daysAgo(15), updatedTime: daysAgo(7) },
  { id: 8, platformAccountId: 4, keyword: '热搜', createdTime: daysAgo(15), updatedTime: daysAgo(8) },
  { id: 9, platformAccountId: 1, keyword: 'Python', createdTime: daysAgo(10), updatedTime: daysAgo(3) },
  { id: 10, platformAccountId: 1, keyword: '后端开发', createdTime: daysAgo(10), updatedTime: daysAgo(1) },
  { id: 11, platformAccountId: 6, keyword: '二次元', createdTime: daysAgo(5), updatedTime: daysAgo(2) },
  { id: 12, platformAccountId: 8, keyword: '科技数码', createdTime: daysAgo(3), updatedTime: daysAgo(0) },
]

// ---- Logs ----
export const mockLogs: LogDto[] = [
  { id: 1, userId: 1, name: '管理员', type: 'SYSTEM', operate: 'LOGIN' as any, content: '用户登录系统', ip: 2130706433, createdTime: daysAgo(0), classify: '认证', func: 'login', timeConsuming: 120 },
  { id: 2, userId: 1, name: '管理员', type: 'BUSINESS', operate: 'CREATE' as any, content: '新增用户：张三', ip: 2130706433, createdTime: daysAgo(0), classify: '用户管理', func: 'saveUser', timeConsuming: 45 },
  { id: 3, userId: 2, name: '张三', type: 'SYSTEM', operate: 'LOGIN' as any, content: '用户登录系统', ip: 3232235777, createdTime: daysAgo(1), classify: '认证', func: 'login', timeConsuming: 95 },
  { id: 4, userId: 1, name: '管理员', type: 'BUSINESS', operate: 'UPDATE' as any, content: '修改平台配置：小红书', ip: 2130706433, createdTime: daysAgo(1), classify: '平台管理', func: 'savePlatform', timeConsuming: 230 },
  { id: 5, userId: 3, name: '李四', type: 'BUSINESS', operate: 'DELETE' as any, content: '删除评论关键词：测试', ip: 3232235900, createdTime: daysAgo(2), classify: '关键词管理', func: 'deleteCommentKeyword', timeConsuming: 30 },
  { id: 6, userId: 1, name: '管理员', type: 'SYSTEM', operate: 'LOGIN' as any, content: '用户登录系统', ip: 2130706433, createdTime: daysAgo(2), classify: '认证', func: 'login', timeConsuming: 80 },
  { id: 7, userId: 6, name: '孙七', type: 'BUSINESS', operate: 'CREATE' as any, content: '创建爬取方案', ip: 3232236000, createdTime: daysAgo(3), classify: '方案管理', func: 'savePlatformScheme', timeConsuming: 150 },
  { id: 8, userId: 1, name: '管理员', type: 'BUSINESS', operate: 'UPDATE' as any, content: '修改AI配置：GPT-4o', ip: 2130706433, createdTime: daysAgo(3), classify: 'AI配置', func: 'saveAiConfig', timeConsuming: 180 },
  { id: 9, userId: 4, name: '王五', type: 'SYSTEM', operate: 'LOGIN' as any, content: '用户登录系统', ip: 3232236100, createdTime: daysAgo(4), classify: '认证', func: 'login', timeConsuming: 110 },
  { id: 10, userId: 2, name: '张三', type: 'BUSINESS', operate: 'UPDATE' as any, content: '运行方案#2：热门视频监控', ip: 3232235777, createdTime: daysAgo(4), classify: '方案管理', func: 'runPlatformScheme', timeConsuming: 3500 },
  { id: 11, userId: 1, name: '管理员', type: 'SYSTEM', operate: 'LOGIN' as any, content: '用户登录系统', ip: 2130706433, createdTime: daysAgo(5), classify: '认证', func: 'login', timeConsuming: 75 },
  { id: 12, userId: 8, name: '吴九', type: 'SYSTEM', operate: 'LOGIN' as any, content: '用户登录系统', ip: 3232236200, createdTime: daysAgo(5), classify: '认证', func: 'login', timeConsuming: 200 },
  { id: 13, userId: 1, name: '管理员', type: 'BUSINESS', operate: 'CREATE' as any, content: '新增租户：京东集团', ip: 2130706433, createdTime: daysAgo(6), classify: '租户管理', func: 'saveTenant', timeConsuming: 55 },
  { id: 14, userId: 10, name: '刘一', type: 'BUSINESS', operate: 'UPDATE' as any, content: '修改方案#7参数', ip: 3232236300, createdTime: daysAgo(6), classify: '方案管理', func: 'savePlatformScheme', timeConsuming: 90 },
  { id: 15, userId: 1, name: '管理员', type: 'BUSINESS', operate: 'DELETE' as any, content: '删除用户：已过期', ip: 2130706433, createdTime: daysAgo(7), classify: '用户管理', func: 'deleteUser', timeConsuming: 25 },
]

// ---- Jobs ----
export const mockJobs: JobDto[] = [
  { jobName: 'dailyHotTopicCrawl', jobGroup: 'platform', jobClassName: 'com.octopus.job.DailyHotTopicJob', cronExpression: '0 0 8 * * ?', description: '每日热门话题爬取任务，每天8点执行' },
  { jobName: 'commentAutoReply', jobGroup: 'platform', jobClassName: 'com.octopus.job.CommentAutoReplyJob', cronExpression: '0 */30 * * * ?', description: '自动评论回复任务，每30分钟执行' },
  { jobName: 'tokenRefresh', jobGroup: 'system', jobClassName: 'com.octopus.job.TokenRefreshJob', cronExpression: '0 0 */2 * * ?', description: '平台账号Token刷新，每2小时执行' },
  { jobName: 'dailyReport', jobGroup: 'system', jobClassName: 'com.octopus.job.DailyReportJob', cronExpression: '0 30 9 * * ?', description: '每日运营报告生成，每天9点30分执行' },
  { jobName: 'dataCleanUp', jobGroup: 'system', jobClassName: 'com.octopus.job.DataCleanUpJob', cronExpression: '0 0 2 * * ?', description: '历史数据清理任务，每天凌晨2点执行' },
  { jobName: 'keywordTrendAnalysis', jobGroup: 'platform', jobClassName: 'com.octopus.job.KeywordTrendAnalysisJob', cronExpression: '0 0 12 * * ?', description: '关键词趋势分析任务，每天12点执行' },
]

// ---- Dashboard Stats ----
export const mockVisitStats: VisitStatsDto[] = [
  { type: VisitStatsType.PV, todayCount: 1523, totalCount: 125000, growthRate: 12.5 },
  { type: VisitStatsType.IP, todayCount: 89, totalCount: 3200, growthRate: 8.3 },
  { type: VisitStatsType.SAVE, todayCount: 47, totalCount: 18600, growthRate: -2.1 },
  { type: VisitStatsType.FIND, todayCount: 356, totalCount: 89000, growthRate: 15.7 },
  { type: VisitStatsType.DELETE, todayCount: 23, totalCount: 5600, growthRate: 3.1 },
  { type: VisitStatsType.LOGIN, todayCount: 68, totalCount: 21200, growthRate: 5.8 },
  { type: VisitStatsType.LOGOUT, todayCount: 42, totalCount: 19800, growthRate: -1.5 },
  { type: VisitStatsType.SEND, todayCount: 96, totalCount: 34500, growthRate: 9.3 },
  { type: VisitStatsType.SIGN_IN, todayCount: 18, totalCount: 7800, growthRate: 2.3 },
]

export const mockVisitTrend: Record<string, string[]> = (() => {
  const dates = Array.from({ length: 8 }, (_, i) => daysAgo(7 - i).slice(0, 10))
  const pv = Array.from({ length: 8 }, () => String(Math.floor(Math.random() * 200 + 100)))
  const ip = Array.from({ length: 8 }, () => String(Math.floor(Math.random() * 120 + 50)))
  return {
    PV: pv,
    IP: ip,
    SAVE: Array.from({ length: 8 }, () => String(Math.floor(Math.random() * 30 + 5))),
    FIND: Array.from({ length: 8 }, () => String(Math.floor(Math.random() * 80 + 30))),
    DELETE: Array.from({ length: 8 }, () => String(Math.floor(Math.random() * 10 + 1))),
    LOGIN: Array.from({ length: 8 }, () => String(Math.floor(Math.random() * 40 + 10))),
    LOGOUT: Array.from({ length: 8 }, () => String(Math.floor(Math.random() * 20 + 5))),
    SEND: Array.from({ length: 8 }, () => String(Math.floor(Math.random() * 15 + 3))),
    SIGN_IN: Array.from({ length: 8 }, () => String(Math.floor(Math.random() * 25 + 8))),
    date: dates,
  }
})()

export const mockTimeConsuming: TimeConsumingDto[] = [
  { type: VisitStatsType.PV, yesterdayCount: 120, todayCount: 105, totalCount: 115 },
  { type: VisitStatsType.IP, yesterdayCount: 25, todayCount: 18, totalCount: 22 },
  { type: VisitStatsType.SAVE, yesterdayCount: 12, todayCount: 8, totalCount: 10 },
  { type: VisitStatsType.FIND, yesterdayCount: 5, todayCount: 3, totalCount: 4 },
  { type: VisitStatsType.DELETE, yesterdayCount: 8, todayCount: 6, totalCount: 7 },
  { type: VisitStatsType.LOGIN, yesterdayCount: 15, todayCount: 12, totalCount: 14 },
  { type: VisitStatsType.LOGOUT, yesterdayCount: 10, todayCount: 9, totalCount: 9 },
  { type: VisitStatsType.SEND, yesterdayCount: 30, todayCount: 22, totalCount: 26 },
  { type: VisitStatsType.SIGN_IN, yesterdayCount: 6, todayCount: 4, totalCount: 5 },
]

export const mockLogStats: LogStatisticsDto = {
  totalCount: 15600,
  loginCount: 3200,
  highTimeConsumingCount: 45,
  deleteCount: 230,
}

export const mockUserStats: UserStatisticsDto = {
  totalCount: 12,
  normalCount: 10,
  disabledCount: 2,
  todayNewCount: 1,
}

export const mockActiveUsers: ActiveUserDto[] = [
  { userId: 1, userName: '张三', count: 286 },
  { userId: 2, userName: '李四', count: 254 },
  { userId: 3, userName: '王五', count: 211 },
  { userId: 4, userName: '赵六', count: 187 },
  { userId: 5, userName: '钱七', count: 163 },
  { userId: 6, userName: '孙八', count: 142 },
  { userId: 7, userName: '周九', count: 118 },
  { userId: 8, userName: '吴十', count: 96 },
  { userId: 9, userName: '郑十一', count: 73 },
  { userId: 10, userName: '冯十二', count: 52 },
]

export const mockConfigInfo: ConfigurationInformationDto = {
  basedType: 'JWT' as any,
  accessExpiration: 7200,
  accessTimeUnit: 'SECONDS' as any,
  refreshExpiration: 604800,
  refreshTimeUnit: 'SECONDS' as any,
}
