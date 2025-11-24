import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import router from '@/router'

/**
 * 响应数据格式
 */
export interface ResponseData<T = unknown> {
  code: number
  message: string
  data: T
  success: boolean
}

/**
 * 请求配置扩展
 */
export interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean // 是否显示 loading
  showError?: boolean // 是否显示错误提示
  showSuccess?: boolean // 是否显示成功提示
  successMessage?: string // 成功提示文案
}

/**
 * 创建 axios 实例
 */
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// Loading 实例
let loadingInstance: ReturnType<typeof ElLoading.service> | null = null
let loadingCount = 0

/**
 * 显示 Loading
 */
function showLoading() {
  if (loadingCount === 0) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }
  loadingCount++
}

/**
 * 隐藏 Loading
 */
function hideLoading() {
  loadingCount--
  if (loadingCount === 0 && loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
}

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const requestConfig = config as RequestConfig

    // 显示 loading
    if (requestConfig.showLoading !== false) {
      showLoading()
    }

    // 添加 token
    if (userStore.token && config.headers) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }

    // 添加时间戳，防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    return config
  },
  (error) => {
    hideLoading()
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
service.interceptors.response.use(
  (response) => {
    const config = response.config as RequestConfig

    // 隐藏 loading
    if (config.showLoading !== false) {
      hideLoading()
    }

    const { code, message, data, success } = response.data as ResponseData

    // 根据业务状态码处理
    if (code === 200 || success) {
      // 显示成功提示
      if (config.showSuccess) {
        ElMessage.success(config.successMessage || message || '操作成功')
      }
      // 直接修改 response.data 为业务数据
      response.data = data
      return response
    }

    // 业务错误处理
    if (config.showError !== false) {
      ElMessage.error(message || '请求失败')
    }

    return Promise.reject(new Error(message || '请求失败'))
  },
  (error) => {
    const config = error.config as RequestConfig

    // 隐藏 loading
    if (config?.showLoading !== false) {
      hideLoading()
    }

    // 处理 HTTP 错误
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // 未授权，跳转登录
          ElMessage.error('登录已过期，请重新登录')
          const userStore = useUserStore()
          userStore.logout()
          router.push('/login')
          break

        case 403:
          // 无权限
          ElMessage.error('没有权限访问')
          router.push('/403')
          break

        case 404:
          ElMessage.error('请求的资源不存在')
          break

        case 500:
          ElMessage.error('服务器错误')
          break

        case 502:
          ElMessage.error('网关错误')
          break

        case 503:
          ElMessage.error('服务不可用')
          break

        case 504:
          ElMessage.error('网关超时')
          break

        default:
          ElMessage.error(data?.message || `请求失败 (${status})`)
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      if (error.message.includes('timeout')) {
        ElMessage.error('请求超时，请稍后重试')
      } else if (error.message.includes('Network Error')) {
        ElMessage.error('网络错误，请检查网络连接')
      } else {
        ElMessage.error('请求失败，请稍后重试')
      }
    } else {
      // 请求配置错误
      ElMessage.error('请求配置错误')
    }

    return Promise.reject(error)
  }
)

/**
 * 通用请求方法
 */
class Request {
  /**
   * GET 请求
   */
  get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    config?: RequestConfig
  ): Promise<T> {
    return service.get(url, { params, ...config })
  }

  /**
   * POST 请求
   */
  post<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    config?: RequestConfig
  ): Promise<T> {
    return service.post(url, data, config)
  }

  /**
   * PUT 请求
   */
  put<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    config?: RequestConfig
  ): Promise<T> {
    return service.put(url, data, config)
  }

  /**
   * DELETE 请求
   */
  delete<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    config?: RequestConfig
  ): Promise<T> {
    return service.delete(url, { params, ...config })
  }

  /**
   * PATCH 请求
   */
  patch<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    config?: RequestConfig
  ): Promise<T> {
    return service.patch(url, data, config)
  }

  /**
   * 上传文件
   */
  upload<T = unknown>(url: string, file: File, config?: RequestConfig): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...config
    })
  }

  /**
   * 下载文件
   */
  download(url: string, params?: Record<string, unknown>, filename?: string): Promise<void> {
    return service
      .get(url, {
        params,
        responseType: 'blob'
      })
      .then((response) => {
        const blob = new Blob([response.data])
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = filename || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
      })
  }
}

export const request = new Request()
export default service
