import NProgress from 'nprogress'
import '@/styles/nprogress.scss'

/**
 * NProgress 工具类
 */
class NProgressManager {
  private requestCount = 0

  /**
   * 配置 NProgress
   */
  configure() {
    NProgress.configure({
      showSpinner: false,
      trickleSpeed: 200,
      minimum: 0.3,
      easing: 'ease',
      speed: 500
    })
  }

  /**
   * 开始进度条
   */
  start() {
    if (this.requestCount === 0) {
      NProgress.start()
    }
    this.requestCount++
  }

  /**
   * 结束进度条
   */
  done() {
    this.requestCount--
    if (this.requestCount <= 0) {
      this.requestCount = 0
      NProgress.done()
    }
  }

  /**
   * 强制结束进度条
   */
  forceDone() {
    this.requestCount = 0
    NProgress.done()
  }

  /**
   * 设置进度
   */
  set(n: number) {
    NProgress.set(n)
  }

  /**
   * 增加进度
   */
  inc(n?: number) {
    NProgress.inc(n)
  }
}

export const nprogressManager = new NProgressManager()

// 初始化配置
nprogressManager.configure()

export default NProgress
