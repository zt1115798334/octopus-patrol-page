// ============================================================
// Mock Handler — intercepts axios requests and returns mock data
// ============================================================

import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import * as data from './data'

// ---- Helpers ----

function success<T>(d: T) {
  return {
    data: { meta: { success: true, code: 200, message: 'OK' }, data: d },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  } satisfies AxiosResponse
}

function ok() {
  return success(null)
}

function paginate<T>(items: T[], pageNumber = 0, pageSize = 10) {
  const start = pageNumber * pageSize
  const content = items.slice(start, start + pageSize)
  return {
    content,
    totalElements: items.length,
    totalPages: Math.ceil(items.length / pageSize),
    number: pageNumber,
    size: pageSize,
  }
}

// Deep clone to avoid mutation across calls
function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}

// ---- In-memory stores (clone so handlers can mutate) ----
let users = clone(data.mockUsers)
let roles = clone(data.mockRoles)
let platforms = clone(data.mockPlatforms)
let platformAccounts = clone(data.mockPlatformAccounts)
let platformPermissions = clone(data.mockPlatformPermissions)
let platformSchemes = clone(data.mockPlatformSchemes)
let runLogs = clone(data.mockRunLogs)
let menus = clone(data.mockMenus)
let permissions = clone(data.mockPermissions)
let pricingPlans = clone(data.mockPricingPlans)
let planHistory = clone(data.mockPlanHistory)
let aiConfigs = clone(data.mockAiConfigs)
let articles = clone(data.mockArticles)
let commentKeywords = clone(data.mockCommentKeywords)
let logs = clone(data.mockLogs)
let jobs = clone(data.mockJobs)

let idCounter = 1000
function nextId() { return ++idCounter }

// ===== URL pattern matching =====

type RouteHandler = (url: string, method: string, body: any) => AxiosResponse | null

const routes: Array<{ match: RegExp; handler: RouteHandler }> = []

function on(method: string, pattern: RegExp, handler: RouteHandler) {
  // Make trailing slash optional so /api/login/login and /api/login/login/ both match
  const source = pattern.source.replace(/\/+$/, '/?')
  routes.push({
    match: new RegExp(`^${source}`, pattern.flags),
    handler: (url, m, body) => {
      if (m !== method) return null
      return handler(url, m, body)
    },
  })
}

// ---- User ----
on('POST', /\/user\/findUserPage/, (_, __, body) => {
  return success(paginate(users, body?.pageNumber ?? 0, body?.pageSize ?? 10))
})
on('GET', /\/user\/findUser\/(\d+)/, (url) => {
  const id = Number(url.split('/').pop())
  return success(users.find((u) => u.id === id) ?? null)
})
on('GET', /\/user\/findCurrentUser/, () => success(users[0]))
on('GET', /\/user\/getUserStatistics/, () => success(data.mockUserStats))
on('POST', /\/user\/saveUser/, (_, __, body) => {
  if (body?.id) {
    const idx = users.findIndex((u) => u.id === body.id)
    if (idx >= 0) users[idx] = { ...users[idx], ...body }
  } else {
    const newUser = { ...body, id: nextId(), createdTime: new Date().toISOString(), lastLoginTime: undefined }
    users.unshift(newUser)
  }
  return ok()
})
on('DELETE', /\/user\/deleteUser\/(\d+)/, (url) => {
  const id = Number(url.split('/').pop())
  users = users.filter((u) => u.id !== id)
  return ok()
})
on('DELETE', /\/user\/deleteUsers/, (_, __, body) => {
  const ids: number[] = body ?? []
  users = users.filter((u) => u.id !== undefined && !ids.includes(u.id))
  return ok()
})
on('PUT', /\/user\/changeEnabledState/, (_, __, body) => {
  const u = users.find((x) => x.id === body?.id)
  if (u) u.enabledState = body?.enabledState
  return ok()
})
on('PUT', /\/user\/modifyUserPassword/, () => ok())
on('PUT', /\/user\/modifyUserAvatar/, () => ok())
on('PUT', /\/user\/modifyUserPhone/, () => ok())

// ---- Role ----
on('POST', /\/role\/findRolePage/, (_, __, body) => {
  return success(paginate(roles, body?.pageNumber ?? 0, body?.pageSize ?? 10))
})
on('GET', /\/role\/findRoleList/, () => success(roles))
on('POST', /\/role\/saveRole/, (_, __, body) => {
  if (body?.id) {
    const idx = roles.findIndex((r) => r.id === body.id)
    if (idx >= 0) roles[idx] = { ...roles[idx], ...body }
  } else {
    roles.push({ ...body, id: nextId() })
  }
  return ok()
})
on('DELETE', /\/role\/deleteRole\/(\d+)/, (url) => {
  roles = roles.filter((r) => r.id !== Number(url.split('/').pop()))
  return ok()
})
on('DELETE', /\/role\/deleteRoles/, (_, __, body) => {
  const ids: number[] = body ?? []
  roles = roles.filter((r) => r.id !== undefined && !ids.includes(r.id))
  return ok()
})
on('PUT', /\/role\/changeEnabledState/, (_, __, body) => {
  const r = roles.find((x) => x.id === body?.id)
  if (r) r.enabledState = body?.enabledState
  return ok()
})
on('POST', /\/role\/bindRolePermissions/, () => ok())

// ---- Menu ----
on('GET', /\/menu\/findMenuList/, () => success(menus))
on('GET', /\/menu\/findMenuButtonList/, () => success([]))
on('POST', /\/menu\/saveMenu/, (_, __, body) => {
  if (body?.id) {
    const idx = menus.findIndex((m) => m.id === body.id)
    if (idx >= 0) menus[idx] = { ...menus[idx], ...body }
  } else {
    menus.push({ ...body, id: nextId(), children: [] })
  }
  return ok()
})
on('DELETE', /\/menu\/deleteMenu/, () => ok())
on('DELETE', /\/menu\/deleteMenus/, () => ok())
on('POST', /\/menu\/bindMenuPermissions/, () => ok())

// ---- Permission ----
on('POST', /\/permission\/findPermissionPage/, (_, __, body) => {
  return success(paginate(permissions, body?.pageNumber ?? 0, body?.pageSize ?? 10))
})
on('GET', /\/permission\/findPermissionList/, () => success(permissions))
on('POST', /\/permission\/savePermission/, (_, __, body) => {
  if (body?.id) {
    const idx = permissions.findIndex((p) => p.id === body.id)
    if (idx >= 0) permissions[idx] = { ...permissions[idx], ...body }
  } else {
    permissions.push({ ...body, id: nextId(), createdTime: new Date().toISOString() })
  }
  return ok()
})
on('DELETE', /\/permission\/deletePermission\/(\d+)/, (url) => {
  permissions = permissions.filter((p) => p.id !== Number(url.split('/').pop()))
  return ok()
})
on('DELETE', /\/permission\/deletePermissions/, (_, __, body) => {
  const ids: number[] = body ?? []
  permissions = permissions.filter((p) => p.id !== undefined && !ids.includes(p.id))
  return ok()
})

// ---- Log ----
on('POST', /\/log\/saveLog/, () => ok())
on('POST', /\/log\/findLogPage/, (_, __, body) => {
  return success(paginate(logs, body?.pageNumber ?? 0, body?.pageSize ?? 10))
})
on('GET', /\/log\/getLogStatistics/, () => success(data.mockLogStats))
on('POST', /\/log\/countLog/, (_, __, body) => {
  const start = body?.startDateTime ? new Date(body.startDateTime) : null
  const end = body?.endDateTime ? new Date(body.endDateTime) : null
  let filtered = logs
  if (start) filtered = filtered.filter((l) => l.createdTime && new Date(l.createdTime) >= start)
  if (end) filtered = filtered.filter((l) => l.createdTime && new Date(l.createdTime) <= end)
  return success([{ type: 'LOGIN', count: filtered.filter((l) => l.type === 'SYSTEM').length }])
})
on('POST', /\/log\/countLoginLog/, () => success([{ date: new Date().toISOString().slice(0, 10), count: 5 }]))

// ---- Dashboard ----
on('POST', /\/dashboard\/getVisitStats/, () => success(data.mockVisitStats))
on('POST', /\/dashboard\/getVisitTrend/, () => success(data.mockVisitTrend))
on('POST', /\/dashboard\/getTimeConsuming/, () => success(data.mockTimeConsuming))

// ---- Pricing Plan ----
on('POST', /\/pricingPlan\/findPricingPlanPage/, (_, __, body) => {
  return success(paginate(pricingPlans, body?.pageNumber ?? 0, body?.pageSize ?? 10))
})
on('GET', /\/pricingPlan\/findAllPricingPlans/, () => success(pricingPlans))
on('POST', /\/pricingPlan\/savePricingPlan/, (_, __, body) => {
  if (body?.id) {
    const idx = pricingPlans.findIndex((p) => p.id === body.id)
    if (idx >= 0) pricingPlans[idx] = { ...pricingPlans[idx], ...body, updatedTime: new Date().toISOString() }
  } else {
    pricingPlans.push({ ...body, id: nextId(), createdTime: new Date().toISOString(), updatedTime: new Date().toISOString() })
  }
  return ok()
})
on('DELETE', /\/pricingPlan\/deletePricingPlan\/(\d+)/, (url) => {
  pricingPlans = pricingPlans.filter((p) => p.id !== Number(url.split('/').pop()))
  return ok()
})
on('DELETE', /\/pricingPlan\/deletePricingPlans/, (_, __, body) => {
  const ids: number[] = body ?? []
  pricingPlans = pricingPlans.filter((p) => p.id !== undefined && !ids.includes(p.id))
  return ok()
})
on('PUT', /\/pricingPlan\/changeEnabledState/, (_, __, body) => {
  const p = pricingPlans.find((x) => x.id === body?.id)
  if (p) p.enabledState = body?.enabledState
  return ok()
})

// ---- Pricing History ----
on('POST', /\/userPricingPlanHistory\/findUserPricingPlanHistoryPage/, (_, __, body) => {
  return success(paginate(planHistory, body?.pageNumber ?? 0, body?.pageSize ?? 10))
})

// ---- AI Config ----
on('POST', /\/aiConfig\/findAiConfigPage/, (_, __, body) => {
  return success(paginate(aiConfigs, body?.pageNumber ?? 0, body?.pageSize ?? 10))
})
on('GET', /\/aiConfig\/findAiConfigList/, () => success(aiConfigs))
on('POST', /\/aiConfig\/saveAiConfig/, (_, __, body) => {
  if (body?.id) {
    const idx = aiConfigs.findIndex((c) => c.id === body.id)
    if (idx >= 0) aiConfigs[idx] = { ...aiConfigs[idx], ...body, updatedTime: new Date().toISOString() }
  } else {
    aiConfigs.push({ ...body, id: nextId(), createdTime: new Date().toISOString(), updatedTime: new Date().toISOString() })
  }
  return ok()
})
on('DELETE', /\/aiConfig\/deleteAiConfig\/(\d+)/, (url) => {
  aiConfigs = aiConfigs.filter((c) => c.id !== Number(url.split('/').pop()))
  return ok()
})
on('DELETE', /\/aiConfig\/deleteAiConfigs/, (_, __, body) => {
  const ids: number[] = body ?? []
  aiConfigs = aiConfigs.filter((c) => c.id !== undefined && !ids.includes(c.id))
  return ok()
})
on('PUT', /\/aiConfig\/changeAiConfigEnabledState/, (_, __, body) => {
  const c = aiConfigs.find((x) => x.id === body?.id)
  if (c) c.enabledState = body?.enabledState
  return ok()
})

// ---- AI ----
on('POST', /\/ai\/generateComment/, () => {
  return success({
    content: '这是一条由AI自动生成的评论，模拟真实场景下的回复内容。观点清晰，语言流畅，符合平台调性要求。',
  })
})

// ---- Article ----
on('POST', /\/article\/findArticlePage/, (_, __, body) => {
  return success(paginate(articles, body?.pageNumber ?? 0, body?.pageSize ?? 10))
})
on('POST', /\/article\/saveArticle/, (_, __, body) => {
  if (body?.id) {
    const idx = articles.findIndex((a) => a.id === body.id)
    if (idx >= 0) articles[idx] = { ...articles[idx], ...body, updatedTime: new Date().toISOString() }
  } else {
    articles.unshift({ ...body, id: nextId(), createdTime: new Date().toISOString(), updatedTime: new Date().toISOString() })
  }
  return ok()
})
on('DELETE', /\/article\/deleteArticle\/(\d+)/, (url) => {
  articles = articles.filter((a) => a.id !== Number(url.split('/').pop()))
  return ok()
})
on('DELETE', /\/article\/deleteArticles/, (_, __, body) => {
  const ids: number[] = body ?? []
  articles = articles.filter((a) => a.id !== undefined && !ids.includes(a.id))
  return ok()
})
on('POST', /\/article\/crawlArticles/, () => ok())

// ---- Comment Keyword ----
on('POST', /\/commentKeyword\/findCommentKeywordPage/, (_, __, body) => {
  return success(paginate(commentKeywords, body?.pageNumber ?? 0, body?.pageSize ?? 10))
})
on('POST', /\/commentKeyword\/saveCommentKeyword/, (_, __, body) => {
  if (body?.id) {
    const idx = commentKeywords.findIndex((k) => k.id === body.id)
    if (idx >= 0) commentKeywords[idx] = { ...commentKeywords[idx], ...body, updatedTime: new Date().toISOString() }
  } else {
    commentKeywords.unshift({ ...body, id: nextId(), createdTime: new Date().toISOString(), updatedTime: new Date().toISOString() })
  }
  return ok()
})
on('DELETE', /\/commentKeyword\/deleteCommentKeyword\/(\d+)/, (url) => {
  commentKeywords = commentKeywords.filter((k) => k.id !== Number(url.split('/').pop()))
  return ok()
})
on('DELETE', /\/commentKeyword\/deleteCommentKeywords/, (_, __, body) => {
  const ids: number[] = body ?? []
  commentKeywords = commentKeywords.filter((k) => k.id !== undefined && !ids.includes(k.id))
  return ok()
})

// ---- Platform ----
on('POST', /\/platform\/findPlatformPage/, (_, __, body) => {
  return success(paginate(platforms, body?.pageNumber ?? 0, body?.pageSize ?? 10))
})
on('GET', /\/platform\/findAllPlatforms/, () => success(platforms))
on('POST', /\/platform\/savePlatform/, (_, __, body) => {
  if (body?.id) {
    const idx = platforms.findIndex((p) => p.id === body.id)
    if (idx >= 0) platforms[idx] = { ...platforms[idx], ...body, updatedTime: new Date().toISOString() }
  } else {
    platforms.unshift({ ...body, id: nextId(), createdTime: new Date().toISOString(), updatedTime: new Date().toISOString() })
  }
  return ok()
})
on('DELETE', /\/platform\/deletePlatform\/(\d+)/, (url) => {
  platforms = platforms.filter((p) => p.id !== Number(url.split('/').pop()))
  return ok()
})
on('DELETE', /\/platform\/deletePlatforms/, (_, __, body) => {
  const ids: number[] = body ?? []
  platforms = platforms.filter((p) => p.id !== undefined && !ids.includes(p.id))
  return ok()
})
on('PUT', /\/platform\/changeEnabledState/, (_, __, body) => {
  const p = platforms.find((x) => x.id === body?.id)
  if (p) p.enabledState = body?.enabledState
  return ok()
})

// ---- Platform Account ----
on('POST', /\/platformAccount\/findPlatformAccountPage/, (_, __, body) => {
  return success(paginate(platformAccounts, body?.pageNumber ?? 0, body?.pageSize ?? 10))
})
on('GET', /\/platformAccount\/findPlatformAccountList/, () => success(platformAccounts))
on('POST', /\/platformAccount\/savePlatformAccount/, (_, __, body) => {
  if (body?.id) {
    const idx = platformAccounts.findIndex((a) => a.id === body.id)
    if (idx >= 0) platformAccounts[idx] = { ...platformAccounts[idx], ...body, updatedTime: new Date().toISOString() }
  } else {
    platformAccounts.unshift({ ...body, id: nextId(), createdTime: new Date().toISOString(), updatedTime: new Date().toISOString() })
  }
  return ok()
})
on('DELETE', /\/platformAccount\/deletePlatformAccount\/(\d+)/, (url) => {
  platformAccounts = platformAccounts.filter((a) => a.id !== Number(url.split('/').pop()))
  return ok()
})
on('DELETE', /\/platformAccount\/deletePlatformAccounts/, (_, __, body) => {
  const ids: number[] = body ?? []
  platformAccounts = platformAccounts.filter((a) => a.id !== undefined && !ids.includes(a.id))
  return ok()
})
on('PUT', /\/platformAccount\/changePlatformAccountEnabledState/, (_, __, body) => {
  const a = platformAccounts.find((x) => x.id === body?.id)
  if (a) a.enabledState = body?.enabledState
  return ok()
})

// ---- Platform Permission ----
on('POST', /\/platformPermission\/findPlatformPermissionPage/, (_, __, body) => {
  return success(paginate(platformPermissions, body?.pageNumber ?? 0, body?.pageSize ?? 10))
})
on('GET', /\/platformPermission\/findPlatformPermissionList/, () => success(platformPermissions))
on('POST', /\/platformPermission\/savePlatformPermission/, (_, __, body) => {
  if (body?.id) {
    const idx = platformPermissions.findIndex((p) => p.id === body.id)
    if (idx >= 0) platformPermissions[idx] = { ...platformPermissions[idx], ...body, updatedTime: new Date().toISOString() }
  } else {
    platformPermissions.unshift({ ...body, id: nextId(), createdTime: new Date().toISOString(), updatedTime: new Date().toISOString() })
  }
  return ok()
})
on('DELETE', /\/platformPermission\/deletePlatformPermission\/(\d+)/, (url) => {
  platformPermissions = platformPermissions.filter((p) => p.id !== Number(url.split('/').pop()))
  return ok()
})
on('DELETE', /\/platformPermission\/deletePlatformPermissions/, (_, __, body) => {
  const ids: number[] = body ?? []
  platformPermissions = platformPermissions.filter((p) => p.id !== undefined && !ids.includes(p.id))
  return ok()
})
on('PUT', /\/platformPermission\/changeEnabledState/, (_, __, body) => {
  const p = platformPermissions.find((x) => x.id === body?.id)
  if (p) p.enabledState = body?.enabledState
  return ok()
})

// ---- Platform Scheme ----
on('POST', /\/platformScheme\/findPlatformSchemePage/, (_, __, body) => {
  return success(paginate(platformSchemes, body?.pageNumber ?? 0, body?.pageSize ?? 10))
})
on('GET', /\/platformScheme\/findPlatformScheme\/(\d+)/, (url) => {
  const id = Number(url.split('/').pop())
  return success(platformSchemes.find((s) => s.id === id) ?? null)
})
on('GET', /\/platformScheme\/findPlatformSchemesByCurrentUser/, () => success(platformSchemes))
on('GET', /\/platformScheme\/findPlatformSchemesByUserId/, () => success(platformSchemes))
on('GET', /\/platformScheme\/findEnabledPlatformSchemesByAccountId/, () => success(platformSchemes.filter((s) => s.enabledState === 'ENABLED')))
on('POST', /\/platformScheme\/savePlatformScheme/, (_, __, body) => {
  if (body?.id) {
    const idx = platformSchemes.findIndex((s) => s.id === body.id)
    if (idx >= 0) platformSchemes[idx] = { ...platformSchemes[idx], ...body, updatedTime: new Date().toISOString() }
  } else {
    platformSchemes.unshift({ ...body, id: nextId(), createdTime: new Date().toISOString(), updatedTime: new Date().toISOString() })
  }
  return ok()
})
on('DELETE', /\/platformScheme\/deletePlatformScheme/, () => ok())
on('POST', /\/platformScheme\/runPlatformScheme/, () => ok())

// ---- Scheme Run Log ----
on('POST', /\/platformSchemeRunLog\/findPlatformSchemeRunLogPage/, (_, __, body) => {
  return success(paginate(runLogs, body?.pageNumber ?? 0, body?.pageSize ?? 10))
})
on('GET', /\/platformSchemeRunLog\/findPlatformSchemeRunLogsBySchemeId/, () => success(runLogs))
on('GET', /\/platformSchemeRunLog\/findPlatformSchemeRunLog\/(\d+)/, (url) => {
  const id = Number(url.split('/').pop())
  return success(runLogs.find((l) => l.id === id) ?? null)
})

// ---- Job ----
on('POST', /\/job\/addJob/, (_, __, body) => {
  jobs.push(body)
  return ok()
})
on('POST', /\/job\/pauseJob/, () => ok())
on('POST', /\/job\/resumeJob/, () => ok())
on('POST', /\/job\/deleteJob/, (_, __, body) => {
  jobs = jobs.filter((j) => !(j.jobName === body?.jobName && j.jobGroup === body?.jobGroup))
  return ok()
})
on('GET', /\/job\/findAllJobs/, () => success(jobs))

// ---- AMQP ----
on('POST', /\/amqp\/sendArticleComment/, () => ok())

// ---- External ----
on('POST', /\/external\/searchXhs/, () => {
  return success({
    keyword: '测试关键词',
    count: 3,
    data: [
      { title: '小红书测试笔记1', author: '用户A', link: 'https://xhs.com/note/1' },
      { title: '小红书测试笔记2', author: '用户B', link: 'https://xhs.com/note/2' },
      { title: '小红书测试笔记3', author: '用户C', link: 'https://xhs.com/note/3' },
    ],
  })
})
on('POST', /\/external\/saveArticleCommentRecord/, () => ok())

// ---- Personal Center ----
on('GET', /\/personalCenter\/getConfigInfo/, () => success(data.mockConfigInfo))
on('PUT', /\/personalCenter\/modifyConfigInfo/, (_, __, body) => {
  return success({ ...data.mockConfigInfo, ...body })
})

// ---- File Upload ----
on('POST', /\/file\/upload/, () => {
  return success({ id: nextId(), fileName: 'uploaded-file.jpg', fileSize: 102400 })
})

// ---- Auth (login) ----
on('POST', /\/login\/login/, (_, __, body) => {
  return success('mock-access-token-xxxx')
})
on('GET', /\/login\/getVerificationCode/, () => {
  return success({ code: '1234', imageBase64: '' })
})
on('GET', /\/login\/getPublicKey/, () => {
  return success('MOCK_PUBLIC_KEY_BASE64')
})
on('POST', /\/login\/logout/, () => ok())
on('POST', /\/login\/refresh/, () => success('mock-refreshed-token'))

// ===== Export setup =====

export function setupMock() {
  // Module-level side effects already registered all routes.
  // This function is called from main.tsx to signal mock mode is active.
  console.log('[Mock] Mock mode enabled — all API calls will return fake data.')
}

export function handleMockRequest(config: InternalAxiosRequestConfig): AxiosResponse | null {
  const url = config.url ?? ''
  const method = (config.method ?? 'get').toUpperCase()
  const body = config.data

  for (const route of routes) {
    if (route.match.test(url)) {
      const result = route.handler(url, method, body)
      if (result) return result
    }
  }

  // If no route matched, log a warning and return a generic success to avoid errors
  console.warn(`[Mock] No handler for ${method} ${url}`)
  return null
}
