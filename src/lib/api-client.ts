import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios'

const BASE_URL = '/patrol/general/api'

// 路径前缀：patrol-web 模块的接口统一走此 base（对应后端 patrol-web 的 controller）
export const WEB_BASE_URL = '/patrol/web/api'

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ---- Mock mode ----

export function enableMockMode(handler: (config: InternalAxiosRequestConfig) => AxiosResponse | null) {
  console.log('[Mock] Mock mode enabled — intercepting API calls')

  // Override adapter only when mock mode is explicitly enabled.
  // When mock is disabled, axios uses its default adapter (xhr/fetch) as normal.
  const mockAdapter = (config: InternalAxiosRequestConfig) => {
    const mockResp = handler(config)
    if (mockResp) {
      console.log('[Mock]', config.method?.toUpperCase(), config.url, '→ 200')
      return Promise.resolve(mockResp)
    }
    console.warn('[Mock] No handler for', config.method?.toUpperCase(), config.url)
    // Fallback: temporarily remove mock adapter so the real request goes through
    delete instance.defaults.adapter
    return instance(config).finally(() => {
      instance.defaults.adapter = mockAdapter
    })
  }
  instance.defaults.adapter = mockAdapter
}

// Request interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)


// Response interceptor
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return instance(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const response = await axios.post(`${BASE_URL}/login/refresh`, {
          refreshToken,
        })
        const newToken = response.data.obj
        localStorage.setItem('accessToken', newToken)
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return instance(originalRequest)
      } catch {
        processQueue(error, null)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

// Generic request helpers
export async function request<T>(config: AxiosRequestConfig, baseURL: string = BASE_URL): Promise<T> {
  const response = await instance.request<T>({ ...config, baseURL })
  return response.data
}

export async function get<T>(url: string, params?: Record<string, unknown>, baseURL?: string): Promise<T> {
  return request<T>({ method: 'GET', url, params }, baseURL)
}

export async function post<T>(url: string, data?: unknown, baseURL?: string): Promise<T> {
  return request<T>({ method: 'POST', url, data }, baseURL)
}

export async function put<T>(url: string, data?: unknown, baseURL?: string): Promise<T> {
  return request<T>({ method: 'PUT', url, data }, baseURL)
}

export async function del<T>(url: string, data?: unknown, baseURL?: string): Promise<T> {
  return request<T>({ method: 'DELETE', url, data }, baseURL)
}

export async function upload<T>(
  url: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<T> {
  const formData = new FormData()
  formData.append('file', file)
  // 必须显式将 Content-Type 设为 undefined，覆盖 axios 实例默认的 application/json，
  // 让浏览器自动从 FormData 生成 multipart/form-data + boundary
  return request<T>({
    method: 'POST',
    url,
    data: formData,
    headers: { 'Content-Type': undefined },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percent)
      }
    },
  })
}

export default instance
