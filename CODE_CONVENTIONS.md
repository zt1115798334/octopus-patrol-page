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

- 基础路径: `/api`
- 超时时间: 30000ms
- 请求拦截器: 自动附加 `Authorization: Bearer <token>`
- 响应拦截器: 401 时自动刷新 token，失败队列处理并发请求

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

```css
@theme {
  /* 主色系 */
  --color-primary-50: #eef2ff;    /* Indigo 蓝紫 */
  --color-accent-50: #f0f9ff;     /* Sky 天蓝 */
  --color-success-50: #ecfdf5;    /* Emerald 翡翠绿 */
  --color-warning-50: #fff7ed;    /* Orange 橙色 */
  --color-danger-50: #fff1f2;     /* Rose 玫瑰红 */
  --color-neutral-50: #fafafa;    /* 中性灰 */

  /* 侧边栏 */
  --color-sidebar-bg: #f8fafc;
  --color-sidebar-hover: #f1f5f9;
  --color-sidebar-active: #eef2ff;

  /* 圆角 */
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* 阴影 */
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.06);
  --shadow-dropdown: 0 4px 6px -1px rgb(0 0 0 / 0.08);
}
```

### 11.3 暗色模式

- 使用 CSS 类切换 (`.dark`)
- Store 管理主题: `useThemeStore`
- 支持 `light` / `dark` / `system` 三种模式
- 持久化到 localStorage

### 11.4 动画

- 页面过渡: Framer Motion `motion.div` + `initial/animate/exit`
- 侧边栏折叠: `motion.aside` + `animate={{ width }}`
- 表格行: `motion.tr` 逐行淡入
- 按钮: `whileHover={{ scale: 1.02 }}`, `whileTap={{ scale: 0.97 }}`
- 缓动函数: `[0.16, 1, 0.3, 1]` (ease-out-expo)

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
