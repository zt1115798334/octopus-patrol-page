# Octopus Patrol 代码规约

## 1. 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | React | 19 |
| 语言 | TypeScript | ~5.7 |
| 构建 | Vite | 6 |
| 样式 | Tailwind CSS | 4 |
| 路由 | React Router DOM | 7 |
| 数据请求 | TanStack React Query | 5 |
| 表格 | TanStack React Table | 8 |
| 状态管理 | Zustand | 5 |
| 表单 | React Hook Form + Zod | 7 / 3 |
| 国际化 | i18next + react-i18next | 24 / 15 |
| 动画 | Framer Motion | 12 |
| 图表 | Recharts | 2 |
| 图标 | Lucide React | 0.476 |
| HTTP | Axios | 1.8 |
| 通知 | Sonner | 2 |
| UI 原语 | Radix UI | 各组件独立版本 |
| 样式工具 | class-variance-authority + clsx + tailwind-merge | — |

## 2. 项目结构

```
src/
├── api/                    # API 服务层
│   ├── index.ts            # 统一导出
│   └── modules/            # 按业务域划分的 API 模块
│       ├── auth.ts
│       ├── user.ts
│       └── ...
├── assets/                 # 静态资源
├── components/
│   ├── auth/               # 认证守卫组件
│   │   ├── auth-guard.tsx
│   │   └── permission-gate.tsx
│   ├── chart/              # 图表组件
│   ├── common/             # 通用业务组件
│   │   ├── error-fallback.tsx
│   │   ├── page-header.tsx
│   │   └── table-toolbar.tsx
│   ├── layout/             # 布局组件
│   │   ├── app-layout.tsx
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── tab-bar.tsx
│   │   ├── breadcrumb-nav.tsx
│   │   ├── command-palette.tsx
│   │   ├── notification-panel.tsx
│   │   └── workspace-switch.tsx
│   ├── table/              # 数据表格组件
│   │   └── data-table.tsx
│   └── ui/                 # 基础 UI 组件 (shadcn 风格)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       └── ... (34 个组件)
├── hooks/                  # 自定义 Hooks
│   ├── use-pagination.ts
│   ├── use-permission.ts
│   ├── use-throttle.ts
│   └── use-ui.ts
├── i18n/                   # 国际化
│   ├── index.ts
│   └── locales/
│       ├── zh.json
│       └── en.json
├── lib/                    # 工具库
│   ├── api-client.ts       # Axios 实例与拦截器
│   ├── utils.ts            # 通用工具函数
│   └── index.ts
├── pages/                  # 页面组件 (20 个)
│   ├── login.tsx
│   ├── dashboard.tsx
│   ├── user.tsx
│   └── ...
├── stores/                 # Zustand 状态仓库
│   ├── auth.ts
│   ├── theme.ts
│   ├── sidebar.ts
│   ├── tabs.ts
│   ├── setting.ts
│   ├── permission.ts
│   └── notification.ts
├── styles/
│   └── globals.css         # 全局样式 + Tailwind 主题
├── types/                  # TypeScript 类型定义
│   ├── enums.ts
│   ├── dto.ts
│   └── index.ts
├── main.tsx                # 应用入口
└── router.tsx              # 路由配置
```

## 3. 命名规范

### 3.1 文件命名

| 类型 | 规则 | 示例 |
|------|------|------|
| 页面组件 | kebab-case | `user.tsx`, `pricing-plan.tsx`, `comment-keyword.tsx` |
| UI 组件 | kebab-case | `button.tsx`, `data-table.tsx`, `alert-dialog.tsx` |
| 布局组件 | kebab-case | `app-layout.tsx`, `breadcrumb-nav.tsx` |
| API 模块 | kebab-case | `user.ts`, `ai-config.ts`, `platform-account.ts` |
| Store | kebab-case | `auth.ts`, `permission.ts`, `sidebar.ts` |
| Hook | kebab-case + `use-` 前缀 | `use-pagination.ts`, `use-permission.ts` |
| 类型文件 | kebab-case | `dto.ts`, `enums.ts` |
| 工具函数 | kebab-case | `utils.ts`, `api-client.ts` |
| 国际化 | 语言代码 | `zh.json`, `en.json` |
| 样式 | kebab-case | `globals.css` |

### 3.2 代码命名

| 类型 | 规则 | 示例 |
|------|------|------|
| 组件 | PascalCase | `UserManagement`, `DataTable`, `AuthGuard` |
| 页面组件 (default export) | PascalCase + `Page` 后缀可选 | `DashboardPage`, `LoginPage` |
| Hook | camelCase + `use` 前缀 | `usePagination`, `useDialogState` |
| Store | camelCase + `use` 前缀 + `Store` 后缀 | `useAuthStore`, `useThemeStore` |
| 函数 | camelCase | `formatDate`, `saveUser`, `findUserPage` |
| API 函数 | camelCase | `login`, `findUserPage`, `changeUserEnabledState` |
| 接口/类型 | PascalCase | `UserDto`, `QueryUserDto`, `AuthState` |
| 枚举 | PascalCase | `EnabledState`, `AiVendor`, `PlanLevel` |
| 枚举值 | UPPER_SNAKE_CASE | `ON`, `OFF`, `OPENAI`, `DEEPSEEK` |
| 常量 | camelCase 或 UPPER_SNAKE_CASE | `BASE_URL` (模块级常量用大写) |
| CSS 类名 | Tailwind 原子类 + kebab-case | `bg-primary-500`, `text-neutral-900` |

### 3.3 DTO 命名模式

| 后缀 | 用途 | 示例 |
|------|------|------|
| `Dto` | 数据传输对象 (实体) | `UserDto`, `ArticleDto` |
| `Query*Dto` | 分页查询参数 | `QueryUserDto`, `QueryArticleDto` |
| `*StatisticsDto` | 统计数据 | `UserStatisticsDto`, `LogStatisticsDto` |
| `Modify*Dto` | 修改操作参数 | `ModifyPasswordDto`, `ModifyAvatarDto` |
| `Change*Dto` | 状态变更参数 | `ChangeEnabledStateDto` |
| `Bind*Dto` | 关联绑定参数 | `BindRolePermissionDto` |

## 4. 导入规范

### 4.1 导入顺序

```typescript
// 1. React / 第三方库
import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Plus, Trash2 } from 'lucide-react'

// 2. UI 组件 (从 @/components/ui 统一导入)
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

// 3. 业务组件
import { PageHeader } from '@/components/common/page-header'

// 4. API 函数
import { findUserPage, saveUser } from '@/api/modules/user'

// 5. 工具函数
import { formatDate, cn } from '@/lib/utils'

// 6. 类型
import type { UserDto, QueryUserDto } from '@/types'

// 7. Store
import { useAuthStore, usePermissionStore } from '@/stores'
```

### 4.2 导入规则

- 使用 `@/` 路径别名导入 `src/` 下的模块，不使用相对路径 `../`
- 类型导入使用 `import type` 语法
- 从 `@/components/ui/index.ts` 或直接从组件文件导入 UI 组件
- 从 `@/stores` 统一导入 store，不直接导入 `@/stores/auth`
- 从 `@/types` 统一导入类型，不直接导入 `@/types/dto`

## 5. 组件规范

### 5.1 函数组件

- 使用函数声明 (非箭头函数) 导出组件
- 使用 `React.forwardRef` 处理 ref 转发
- 设置 `displayName` 属性
- Props 接口定义在组件文件顶部

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glass?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, children, ...props }, ref) => (
    <div ref={ref} className={cn('rounded-xl border', className)} {...props}>
      {children}
    </div>
  ),
)
Card.displayName = 'Card'

export { Card }
```

### 5.2 页面组件

- 使用 `default export` 导出页面组件
- 页面组件名使用 PascalCase
- 文件名使用 kebab-case

```typescript
// src/pages/user.tsx
export default function UserManagement() {
  // ...
}
```

### 5.3 UI 组件 (shadcn 风格)

- 基于 Radix UI 原语封装
- 使用 `class-variance-authority` (cva) 定义变体
- 使用 `cn()` (clsx + tailwind-merge) 合并类名
- 支持 `className` prop 覆盖样式

```typescript
const buttonVariants = cva('inline-flex items-center justify-center ...', {
  variants: {
    variant: {
      default: 'bg-gradient-to-br from-primary-600 to-primary-500 ...',
      secondary: 'bg-neutral-100 ...',
      outline: 'border border-neutral-200 ...',
      ghost: 'bg-transparent ...',
      danger: 'bg-danger-500 ...',
    },
    size: {
      sm: 'h-8 rounded-md px-3 text-xs',
      default: 'h-10 rounded-lg px-4 py-2',
      lg: 'h-12 rounded-lg px-6 text-base',
      icon: 'h-10 w-10 rounded-lg p-0',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})
```

### 5.4 组件 Props 设计

- 使用 `interface` 定义 Props (非 `type`)
- 继承原生 HTML 属性: `extends React.HTMLAttributes<HTMLDivElement>`
- 可选 Props 提供默认值
- 回调 Props 使用 `on` 前缀: `onOpenChange`, `onCheckedChange`

## 6. 状态管理规范

### 6.1 Zustand Store

- 每个 store 独立文件
- 使用 `create<State>()` 泛型声明
- 持久化 store 使用 `persist` 中间件
- 导出 hook 和类型

```typescript
// stores/auth.ts
export interface AuthState {
  isAuthenticated: boolean
  login: (accessToken: string, refreshToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken)
        set({ isAuthenticated: true, accessToken, refreshToken })
      },
      logout: () => {
        localStorage.removeItem('accessToken')
        set({ isAuthenticated: false })
      },
    }),
    { name: 'auth-storage' },
  ),
)
```

### 6.2 Store 命名

| Store | 持久化 | 存储键 |
|-------|--------|--------|
| `useAuthStore` | 部分持久化 | `auth-storage` |
| `useThemeStore` | 完全持久化 | `theme-storage` |
| `useTabsStore` | 部分持久化 | `tabs-storage` |
| `useSettingStore` | 完全持久化 | `setting-storage` |
| `useSidebarStore` | 无 | — |
| `usePermissionStore` | 无 | — |
| `useNotificationStore` | 无 | — |

### 6.3 Store 统一导出

所有 store 从 `@/stores/index.ts` 统一导出:

```typescript
export { useAuthStore } from './auth'
export { useThemeStore } from './theme'
export { useSidebarStore } from './sidebar'
export { useTabsStore } from './tabs'
export { usePermissionStore } from './permission'
export { useNotificationStore } from './notification'
export { useSettingStore } from './setting'
```

## 7. API 层规范

### 7.1 Axios 客户端

- 默认基础路径: `/patrol/general/api`（通用接口，定义在 `src/lib/api-client.ts`）
- Web 模块基础路径: `WEB_BASE_URL = '/patrol/web/api'`（`api-client.ts` 导出，Web 专属接口需显式传入 `baseURL`）
- 超时时间: `30000ms`
- 请求拦截器: 自动附加 `Authorization: Bearer <token>`（从 `localStorage.accessToken` 读取）
- 响应拦截器:
  - 非 2xx / 业务失败统一 `Promise.reject`，交给 React Query 的 `onError` 处理
  - `401` 时自动调用 `/login/refresh` 刷新 token，并用失败队列合并并发请求；刷新失败则清空 token 并跳转 `/login`
- Mock 模式: `enableMockMode(handler)` 可临时接管 axios adapter，用于无后端联调
- 响应解包: `request<T>()` 直接返回 `response.data`，即后端的 `ResultMessage<T>` 信封。业务层需二次解包：`data?.data?.content`、`data?.data?.totalElements`（详见 §20.4）

### 7.2 API 函数签名

```typescript
// 查询 (分页)
export function findUserPage(data: QueryUserDto): Promise<ResultMessage<Page<UserDto>>> {
  return post<ResultMessage<Page<UserDto>>>('/user/findUserPage', data)
}

// 查询 (单个)
export function findUser(id: number): Promise<ResultMessage<UserDto>> {
  return get<ResultMessage<UserDto>>(`/user/findUser/${id}`)
}

// 保存 (新增/编辑)
export function saveUser(data: UserDto): Promise<ResultMessage<UserDto>> {
  return post<ResultMessage<UserDto>>('/user/saveUser', data)
}

// 删除 (单个)
export function deleteUser(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/user/deleteUser/${id}`)
}

// 删除 (批量)
export function deleteUsers(ids: number[]): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/user/deleteUsers', ids)
}

// 状态变更
export function changeUserEnabledState(data: { id: number; enabledState: EnabledState }): Promise<ResultMessage<void>> {
  return put<ResultMessage<void>>('/user/changeEnabledState', data)
}
```

### 7.3 API URL 命名

- 使用 camelCase: `/user/findUserPage`, `/article/saveArticle`
- RESTful 风格: `/user/deleteUser/{id}`
- 分页查询统一使用 POST: `/xxx/findXxxPage`
- 批量删除使用复数: `/xxx/deleteXxxs`

### 7.4 响应格式

所有 API 返回统一的 `ResultMessage<T>` 结构:

```typescript
interface ResultMessage<T> {
  meta: {
    success: boolean
    code: number
    message: string
  }
  data: T
}

interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
```

## 8. 数据请求规范

### 8.1 React Query 使用

```typescript
// 查询
const { data, isLoading } = useQuery({
  queryKey: ['users', query],
  queryFn: () => findUserPage(query),
})

// 变更
const saveMutation = useMutation({
  mutationFn: saveUser,
  onSuccess: () => {
    toast.success(t('common.operationSuccess'))
    setDialogOpen(false)
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
  onError: () => toast.error(t('common.operationFailed')),
})
```

### 8.2 Query Key 命名

- 使用复数名词: `['users']`, `['articles']`, `['roles']`
- 带参数时附加参数: `['users', query]`, `['visitTrend', trendQuery]`
- 统计数据: `['userStatistics']`, `['logStatistics']`

### 8.3 变更操作命名

- 保存: `saveMutation`
- 删除: `deleteMutation`
- 批量删除: `batchDeleteMutation`
- 状态变更: `toggleEnabledMutation`

## 9. 表单规范

### 9.1 Zod Schema 定义

```typescript
const userFormSchema = z.object({
  account: z.string().min(1, '请输入账号'),
  username: z.string().min(1, '请输入用户名'),
  phone: z.string().optional(),
  password: z.string().optional(),
  enabledState: z.string().optional(),
})

type UserFormData = z.infer<typeof userFormSchema>
```

### 9.2 React Hook Form 使用

```typescript
const form = useForm<UserFormData>({
  resolver: zodResolver(userFormSchema),
})

// 注册字段
<Input label={t('user.account')} {...form.register('account')} error={form.formState.errors.account?.message} />

// 提交
<form onSubmit={form.handleSubmit(handleSubmit)}>
```

### 9.3 表单模式

- 新增/编辑共用一个 Dialog
- 通过 `editing` 状态区分模式
- 编辑时使用 `form.reset()` 填充数据
- 新增时重置为空值

```typescript
const handleEdit = useCallback((item: UserDto) => {
  setEditing(item)
  form.reset({ account: item.account || '', username: item.username || '' })
  setDialogOpen(true)
}, [form])

const handleCreate = useCallback(() => {
  setEditing(null)
  form.reset({ account: '', username: '' })
  setDialogOpen(true)
}, [form])
```

## 10. 路由规范

### 10.1 路由配置

- 使用 `createBrowserRouter` 声明式路由
- 页面组件使用 `lazy()` 懒加载
- 受保护路由使用 `AuthGuard` 包裹
- 顶级路由: `/login` (公开), `/` (需认证)

```typescript
const UserManagement = lazy(() => import('@/pages/user'))

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <AuthGuard><AppLayout /></AuthGuard>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'user', element: <UserManagement /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
```

### 10.2 路由路径

- 使用 kebab-case: `/pricing-plan`, `/comment-keyword`, `/platform-account`
- 单词路径: `/user`, `/role`, `/menu`, `/log`
- 扁平化结构，无嵌套路由

## 11. 样式规范

### 11.1 Tailwind CSS

- 使用 Tailwind 4 + `@theme` 定义设计令牌
- 使用 `cn()` 工具函数合并类名
- 不编写自定义 CSS 类 (除非全局层)
- 暗色模式使用 `dark:` 前缀

### 11.2 设计令牌 (globals.css)

> 以 `default` 主题实际取值为准（与文档旧版不同，主色为专业 slate blue 而非 Indigo）。`anime`/`shinchan` 主题通过 `[data-theme-style]` 覆盖同名变量，组件无需改动。

**主色 Primary（单一强调色，slate blue）**

| 档位 | 值 | 档位 | 值 |
|------|-----|------|-----|
| `primary-50` | `#f4f6fb` | `primary-600` | `#4a5f95` |
| `primary-100` | `#e4e9f4` | `primary-700` | `#3d4e7a` |
| `primary-200` | `#cad3e8` | `primary-800` | `#334062` |
| `primary-300` | `#a5b5d8` | `primary-900` | `#27304a` |
| `primary-400` | `#7b91c4` | `primary-950` | `#161b2e` |
| `primary-500` | `#5b74b0` | | |

> `accent` 与主色同族（`#5b74b0` 系列），保证"单一强调色"视觉。

**功能色**

| 语义 | 色系 | 500 档 |
|------|------|--------|
| Success | Emerald 翡翠绿 | `#10b981` |
| Warning | Amber 琥珀橙 | `#f59e0b` |
| Danger | Rose 玫瑰红 | `#f43f5e` |
| Neutral | Cool Gray 冷灰 | `#6b7280`（500）/ `#111827`（900） |

**圆角**

| 变量 | 值 | 用途 |
|------|-----|------|
| `--radius-lg` | `0.75rem` | 按钮、输入 |
| `--radius-xl` | `1rem` | 弹窗、下拉 |
| `--radius-2xl` | `1.25rem` | 卡片（默认） |

**阴影（分层纵深）**

| 变量 | 用途 |
|------|------|
| `--shadow-card` | 卡片静态阴影 |
| `--shadow-elevated` | 卡片 hover 抬升 |
| `--shadow-dropdown` | 下拉/菜单 |
| `--shadow-dialog` | 对话框 |
| `--shadow-glow` / `--shadow-glow-lg` | 主色光晕（登录/强调） |

**缓动曲线**

| 变量 | 值 | 用途 |
|------|-----|------|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | 默认入场/过渡（首选） |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 回弹（侧栏/图标） |
| `--ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | 通用平滑 |

### 11.3 暗色模式

- 使用 `.dark` 类挂在 `<html>` 上切换（由 `useThemeStore.mode` 驱动，支持 `light` / `dark` / `system`，持久化 localStorage）
- **Token 反相映射策略**：并非简单反色，而是在 `globals.css` 中对每个语义色做逐档翻转，例如 `.dark .text-neutral-900 → var(--color-neutral-50)`、`.dark .text-primary-500 → var(--color-primary-400)`，保证明暗对比度一致
- 表面/边框/侧边栏也有独立暗色变量（`--color-sidebar-bg` 等在三套主题下分别重映射为半透明深色）
- `anime` / `shinchan` 各有一套暗色覆盖（`[data-theme-style="x"] .dark ...`），重映射文本、表面、边框、滚动条、对话框等
- 组件不感知明暗，只写 `text-neutral-900` 等语义类名即可自动适配

### 11.4 动画

- 页面/区块过渡: Framer Motion `motion.div` + `initial/animate/exit`，或复用工具类 `.animate-page-enter`（`fade-up 0.4s var(--ease-out-expo)`）
- 侧边栏折叠: `motion.aside` + `animate={{ width }}`
- 表格行: `motion.tr` 逐行淡入（keyframes `row-enter`）
- 按钮: `whileHover={{ scale: 1.02 }}` / `whileTap={{ scale: 0.97 }}`
- PageHeader 标题: `initial={{ opacity: 0, y: -8 }} → animate`，缓动 `--ease-out-expo`
- 缓动函数统一用 `[0.16, 1, 0.3, 1]`（对应 CSS `--ease-out-expo`），回弹用 `--ease-spring`
- 登录页含品牌级 loader 彩蛋（aurora/光晕/粒子等 keyframes），属特殊页面，非通用组件规范

### 11.5 主题风格系统

三套皮肤通过根节点 `data-theme-style` 属性切换（`useSettingStore.themeStyle` 持久化，由 `AppLayout` 写入 `document.documentElement.dataset.themeStyle`）：

| 主题 | 风格 | 主色 (500) | 强调色 (500) | 标题字体 |
|------|------|-----------|-------------|----------|
| `default` | 专业克制 slate blue | `#5b74b0` | `#5b74b0` | Inter |
| `anime` | 二次元 樱花粉+天空蓝 | `#ff5c8a` | `#0ea5e9` | ZCOOL KuaiLe |
| `shinchan` | 蜡笔小新 亮红+金黄 | `#ff5722` | `#fdd835` | ZCOOL XiaoWei |

- 三套主题共享同一套组件与类名，仅靠 CSS 变量 + 少量覆盖类（如 `.gradient-text`、`.card`、`.glass`、`.skeleton` 的 `[data-theme-style]` 选择器）重着色，新增 UI 绝不依赖主题分支
- `anime`/`shinchan` 给 `h1` 加了渐变文字（`linear-gradient` + `background-clip: text`），并整体替换 `body` 字体与背景光晕

## 12. 国际化规范

### 12.1 翻译文件结构

```json
{
  "app": { "name": "...", "shortName": "..." },
  "nav": { "dashboard": "...", "user": "...", "role": "..." },
  "common": { "search": "...", "create": "...", "edit": "...", "delete": "..." },
  "auth": { "login": "...", "logout": "...", "username": "...", "password": "..." },
  "user": { "title": "...", "account": "...", "username": "...", "phone": "..." },
  "dashboard": { "title": "...", "totalUsers": "...", "visitTrend": "..." },
  "theme": { "light": "...", "dark": "...", "system": "..." },
  "setting": { "title": "...", "general": "...", "appearance": "..." }
}
```

### 12.2 使用规则

- 所有用户可见文本使用 `t('key')` 函数
- 导航菜单: `t('nav.xxx')`
- 通用操作: `t('common.xxx')`
- 页面标题: `t('xxx.title')`
- 表单标签: `t('xxx.fieldName')`
- 错误/成功提示: `t('common.operationSuccess')`, `t('common.operationFailed')`
- 带变量: `t('common.total', { total })`
- 支持中/英双语，默认中文

## 13. 权限规范

### 13.1 权限格式

- 格式: `资源:操作` (如 `user:list`, `role:list`, `ai-config:list`)
- 超级权限: `*:*:*` (匹配所有)

### 13.2 权限控制

- 路由级: `AuthGuard` 组件，未登录重定向到 `/login`
- 菜单级: 侧边栏菜单根据权限过滤
- 按钮级: `usePermissionStore().hasButtonPermission(key)`

```typescript
// 侧边栏菜单权限
{ id: 'user', label: t('nav.user'), path: '/user', permission: 'user:list' }

// 按钮权限
const { hasButtonPermission } = usePermissionStore()
{hasButtonPermission('user:delete') && <Button variant="danger">删除</Button>}
```

## 14. 错误处理规范

### 14.1 API 错误

- Axios 拦截器处理 401 (token 过期自动刷新)
- 页面级错误使用 `toast.error()` 提示
- 不在组件内 try-catch API 调用 (由 React Query 管理)

### 14.2 全局错误

- 使用 `react-error-boundary` 包裹根组件
- 错误回退组件: `ErrorFallback`

### 14.3 表单错误

- Zod schema 验证错误显示在字段下方
- 使用 `error` prop 传递: `<Input error={errors.account?.message} />`

## 15. 代码格式化

### 15.1 Prettier 配置

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

### 15.2 ESLint 规则

- `@typescript-eslint/no-explicit-any`: error
- `@typescript-eslint/no-unused-vars`: error (允许 `_` 前缀)
- `react-refresh/only-export-components`: warn
- 使用 TypeScript 严格模式

### 15.3 TypeScript 配置

- 严格模式: `"strict": true`
- 禁止未使用变量: `"noUnusedLocals": true`
- 禁止未使用参数: `"noUnusedParameters": true`
- 路径别名: `@/*` → `./src/*`

## 16. CRUD 页面模板

每个业务页面遵循统一模式:

```typescript
// 1. 导入
import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { findXxxPage, saveXxx, deleteXxx } from '@/api/modules/xxx'
import type { XxxDto, QueryXxxDto } from '@/types'

// 2. Schema 定义
const formSchema = z.object({ ... })
type FormData = z.infer<typeof formSchema>

// 3. 页面组件
export default function XxxManagement() {
  // 4. 状态
  const [page, setPage] = useState(1)
  const [keywords, setKeywords] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<XxxDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  // 5. 查询
  const { data, isLoading } = useQuery({ ... })

  // 6. 表单
  const form = useForm<FormData>({ resolver: zodResolver(formSchema) })

  // 7. 变更
  const saveMutation = useMutation({ ... })
  const deleteMutation = useMutation({ ... })

  // 8. 事件处理
  const handleCreate = useCallback(() => { ... }, [])
  const handleEdit = useCallback((item) => { ... }, [])
  const handleSubmit = useCallback((data) => { ... }, [])

  // 9. 渲染: 搜索栏 + 表格 + Dialog + AlertDialog
  return (
    <div className="space-y-4">
      {/* 页头 */}
      {/* 搜索栏 */}
      {/* 表格 */}
      {/* 新增/编辑 Dialog */}
      {/* 删除确认 AlertDialog */}
    </div>
  )
}
```

## 17. 禁止事项

- 禁止使用 `any` 类型 (`@typescript-eslint/no-explicit-any: error`)
- 禁止使用 `enum` 以外的枚举方式
- 禁止在组件内直接调用 API (必须通过 React Query)
- 禁止使用 `console.log` (生产代码)
- 禁止使用相对路径导入 (`../`), 统一使用 `@/` 别名
- 禁止使用 `var` 声明变量
- 禁止使用 CSS-in-JS 库 (统一使用 Tailwind)
- 禁止在 Zustand store 外部直接修改状态
- 禁止跳过 `forwardRef` 直接使用 `ref` prop
- 禁止硬编码中文文本 (统一使用 i18n)

## 18. 推荐实践

- 使用 `useCallback` 包裹传递给子组件的回调函数
- 使用 `useMemo` 缓存计算结果 (避免不必要的重渲染)
- 使用 Zustand selectors 避免不必要的重渲染: `useAuthStore((s) => s.username)`
- 使用 `queryClient.invalidateQueries()` 替代手动 refetch
- 使用 `Skeleton` 组件作为加载状态 (非 spinner)
- 使用 `EmptyState` 组件处理空数据状态
- 使用 `toast` (sonner) 替代 alert 或 console
- 使用 `formatDate` / `formatNumber` 统一格式化输出
- 使用 `cn()` 合并条件类名

## 19. 页面整体视觉风格（设计语言）

本章描述产品级的视觉与交互风格，是 §11 设计令牌在"页面"层面的落地规范。所有新页面、新组件必须遵循。

### 19.1 设计理念

- **专业、克制、以内容为中心**的后台管理风格，不堆砌装饰。
- **单一强调色**：默认主题为 slate blue（`#5b74b0`），全局只用一种主色；success / warning / danger 等仅用于状态与危险操作。
- **玻璃拟态顶栏 + 白底卡片内容区**：顶栏半透明毛玻璃，内容区以卡片承载，层次清晰。
- **弱边框 + 柔和阴影 + 充足留白**，间距统一走 4px 栅格（`gap-2`=8px、`gap-4`=16px、`p-6`=24px）。

### 19.2 主题体系（三套皮肤）

通过根节点 `data-theme-style` 切换（见 §11.5），同一套组件无需改动即可三变：

| 主题 | 调性 | 主色(500) | 强调色(500) | 标题字体 | 阴影/光晕 |
|------|------|-----------|-------------|----------|-----------|
| `default` | 商务专业 | `#5b74b0` | `#5b74b0` | Inter | 中性冷灰、主色微光 |
| `anime` | 二次元梦幻 | `#ff5c8a` 樱花粉 | `#0ea5e9` 天空蓝 | ZCOOL KuaiLe | 粉调柔光、标题渐变 |
| `shinchan` | 童趣大胆 | `#ff5722` 亮红 | `#fdd835` 金黄 | ZCOOL XiaoWei | 暖色粗光、标题渐变 |

> 新增配色/主题请扩展 CSS 变量与 `[data-theme-style]` 覆盖，禁止在组件内写死某主题色（会破坏主题切换）。

### 19.3 布局结构

```
┌───────────────────────────────────────────────────────────┐
│ Header (h-14, glass 毛玻璃: logo · 面包屑 · 搜索 · 通知 · 主题) │
├──────────┬────────────────────────────────────────────────┤
│ Sidebar  │  Main (p-6)                                      │
│ 折叠72 /  │   ├─ PageHeader (标题 + actions, 入场 y:-8→0)    │
│ 展开260   │   ├─ BreadcrumbNav                              │
│ motion    │   ├─ TabBar (多标签)                            │
│ width     │   └─ 内容: 卡片 / 表格 / 表单 / 图表             │
└──────────┴────────────────────────────────────────────────┘
```

- 顶栏固定 `h-14`(56px)，毛玻璃 `.glass`；侧栏折叠 72px / 展开 260px，`motion.aside` 动画宽度。
- 路由切换用 Framer Motion 过渡 + 路由级 `Suspense` 加载占位。
- 主内容区最大宽度留白，桌面端内容居中不铺满。

### 19.4 组件视觉规范

| 元素 | 规范 |
|------|------|
| 卡片 `.card` | 白底、`1px` 边框、`radius-2xl`(1.25rem)、`shadow-card`；hover 升级 `shadow-elevated` 并微抬 |
| 玻璃 `.glass` | 毛玻璃 header / 弹层（`backdrop-blur` + 半透明） |
| 表格 | 表头 sticky、行 hover 高亮、逐行 `row-enter` 入场；斑马可选 |
| 表单 | 标签在上、错误置于字段下方；RHF + Zod，错误态 danger 边框 |
| 按钮 Button | `cva` 变体：`default`(主色渐变) / `secondary` / `ghost` / `outline` / `danger`；尺寸 `sm`/`default`/`lg`/`icon` |
| 徽章 Badge | `success`/`warning`/`danger`/`neutral` 语义色，pill 圆角 |
| 状态 | 加载用 `Skeleton`（微光 `shimmer`）；空数据用 `EmptyState`；错误用 `ErrorFallback` |
| 标题 | `PageHeader` 统一标题层级，`h1` 1.5rem/700、`h2` 1.25rem/600（见 globals.css `@layer base`） |

### 19.5 字体与排印

- 西文 Inter、等宽 JetBrains Mono；中文回退 PingFang SC / Microsoft YaHei。
- `anime` / `shinchan` 整站替换 `body` 字体为 ZCOOL 系列，并给 `h1` 叠加渐变文字（`linear-gradient` + `background-clip: text`）。
- 数字/金额统一用 `formatNumber`，日期统一用 `formatDate`，保持对齐与本地化一致。

### 19.6 动效语言

- 统一缓动 `--ease-out-expo`（`cubic-bezier(0.16,1,0.3,1)`）；回弹用 `--ease-spring`。
- 区块/页面入场：`animate-page-enter`（`fade-up`）或 `motion.div` `initial/animate/exit`。
- 微交互：按钮 hover `scale 1.02`、tap `0.97`；卡片 hover 抬升；侧栏宽度弹簧。
- 克制原则：非必要不引入长耗时/阻塞动画；列表/表格入场控制在 0.3–0.5s。

### 19.7 无障碍

- 全局 `focus-ring`：`2px` 主色 outline、`offset 2px`，键盘可达。
- 交互元素用语义标签 / Radix 原语；`Tooltip` 用 `TooltipProvider` 统一包裹。
- 颜色不作为唯一信息载体（状态同时有文字/图标）。

### 19.8 视觉层禁止事项

- 禁止硬编码颜色值（一律用 `bg-primary-500` / `text-danger-500` 等 token 类名）。
- 禁止新增非 token 主题色（扩展请加 `--color-*` 变量并同步三套主题）。
- 禁止在组件内直接写死 `anime`/`shinchan` 专属色（破坏主题切换）。
- 禁止低优先级动效使用长耗时/阻塞式动画。

## 20. 代码风格细则（补充要点）

在 §3–§18 基础上，补充与真实代码库一致的关键写法。

### 20.1 React 导入与命名空间

- UI 原语（使用 `forwardRef` / `React.HTMLAttributes` 时）保留 `import * as React from 'react'`，通过 `React.forwardRef`、`React.HTMLAttributes` 访问（如 `button.tsx`、`card.tsx`）。
- 普通页面 / 业务组件可用具名导入：`import { useState, useCallback } from 'react'`（如 `page-header.tsx`）。
- Props 接口继承原生属性：`extends React.HTMLAttributes<HTMLDivElement>`（需 namespace 导入）或 `extends HTMLAttributes<HTMLDivElement>`（具名导入），二选一保持文件内统一。

### 20.2 类名合并与变体

- 统一用 `cn()`（`clsx` + `tailwind-merge`）合并条件类名，禁止字符串拼接。
- 多形态组件用 `cva` 定义 `variants` + 用 `VariantProps<typeof xxx>` 推导类型。
- 组件接受 `className` 并置于合并结果末尾，允许调用方覆盖：
  ```typescript
  const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('rounded-2xl border shadow-card', className)} {...props} />
  ))
  Card.displayName = 'Card'
  ```

### 20.3 Zustand 选择器

- 用选择器精确取值，避免全量订阅导致的重渲染：`const username = useAuthStore((s) => s.username)`。
- 取多个值用 `useShallow` 或分别 `select`，避免返回新对象引发无限渲染。
- 业务修改逻辑放 store action 内，组件只调用 action，不在外部直接 `set`。

### 20.4 API 响应解包（重要）

`request<T>` / `get<T>` / `post<T>` 返回的是 `response.data`，即后端 `ResultMessage<T>` 信封：

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['users', query],
  queryFn: () => findUserPage(query), // → ResultMessage<Page<UserDto>>
})

// 渲染时二次解包
const list = data?.data?.content ?? []
const total = data?.data?.totalElements ?? 0
```

- 不要对 `data` 再 `.json()`（Axios 已解析）。
- 不要用 `any` 接 `data`；用 `ResultMessage<Page<T>>` / `ResultMessage<T>` 明确泛型。

### 20.5 错误与提示

- API 失败由 React Query `onError` / 拦截器统一处理，组件内不 `try-catch` API。
- 用户提示统一 `toast`（sonner）：`toast.success(t('common.operationSuccess'))` / `toast.error(...)`。
- 表单字段错误由 Zod 消息驱动，经 `<Input error={errors.x?.message} />` 透传。

### 20.6 主题 / 外观切换

- 主题风格（default/anime/shinchan）存 `useSettingStore.themeStyle`，由 `AppLayout` 写入 `document.documentElement.dataset.themeStyle`。
- 明暗模式存 `useThemeStore.mode`，写入 `.dark` 类。
- 组件内**不应**直接操作这些 DOM 属性，统一经 store，保证持久化与单一数据源。

### 20.7 动画常量

- 复用 globals.css 变量：`var(--ease-out-expo)`、`var(--ease-spring)`、`var(--ease-smooth)`。
- Framer Motion 缓动数组用 `[0.16, 1, 0.3, 1]`，与 `--ease-out-expo` 一致。
- 入场优先 `.animate-page-enter` 或 `motion.div`，不要各自写重复的 `@keyframes`。

### 20.8 文件级约定

- 单文件单组件（UI 原语可附私有子组件）。
- 类型导入用 `import type`；项目开启 `verbatimModuleSyntax`。
- 业务枚举用 `export enum Xxx { ON = 'ON' }`（UPPER_SNAKE 值）；UI 模式串（如主题/明暗）用 `type X = 'a' | 'b'` 联合类型。
- 文件末尾显式 `export { Xxx }`（UI 原语额外 `export type { XxxProps }`），不导出未使用的内部符号。
