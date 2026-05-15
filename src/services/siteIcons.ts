/**
 * IconService - 网站图标服务
 * 提供多级降级策略获取网站图标
 */

interface IconServiceOptions {
  cache?: boolean
  timeout?: number
  siteName?: string
}

class IconService {
  private iconCache: Map<string, string>
  private loadingPromises: Map<string, Promise<string>>

  constructor() {
    this.iconCache = new Map()
    this.loadingPromises = new Map()
  }

  /**
   * 从URL提取域名
   */
  getDomain(url: string): string {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  /**
   * 获取图标服务URL列表（按优先级排序）
   */
  private getIconServices(domain: string): string[] {
    return [
      // 优先使用Google高清图标
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`,
      // 国内图标服务
      `https://api.iowen.cn/favicon/${encodeURIComponent(domain)}.png`,
      // 备用服务
      `https://icon.horse/icon/${encodeURIComponent(domain)}`,
      // Google低分辨率
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`,
    ]
  }

  /**
   * 检测图片是否可加载
   */
  private checkImageLoad(url: string, timeout: number): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image()
      const timer = setTimeout(() => {
        img.src = ''
        resolve(false)
      }, timeout)

      img.onload = () => {
        clearTimeout(timer)
        resolve(true)
      }

      img.onerror = () => {
        clearTimeout(timer)
        resolve(false)
      }

      img.src = url
    })
  }

  /**
   * 获取首字母作为保底图标
   */
  getInitialIcon(name: string): string {
    if (!name) return '?'
    // 获取第一个字符
    const firstChar = name.charAt(0).toUpperCase()
    return firstChar
  }

  /**
   * 根据名称生成一致的颜色
   */
  getIconColor(name: string): string {
    const colors = [
      '#f87171', '#fb923c', '#fbbf24', '#a3e635',
      '#4ade80', '#2dd4bf', '#22d3ee', '#38bdf8',
      '#818cf8', '#a78bfa', '#e879f9', '#f472b6'
    ]
    
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i)
      hash = hash & hash
    }
    
    return colors[Math.abs(hash) % colors.length]
  }

  /**
   * 获取网站图标
   * 降级策略：图标服务 → 首字母
   */
  async getWebsiteIcon(url: string, options: IconServiceOptions = {}): Promise<string> {
    const { cache = true, timeout = 3000, siteName = '' } = options
    const domain = this.getDomain(url)
    const cacheKey = domain

    // 检查缓存
    if (cache && this.iconCache.has(cacheKey)) {
      return this.iconCache.get(cacheKey)!
    }

    // 检查是否正在加载
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)!
    }

    // 创建加载Promise
    const loadPromise = this.loadIcon(url, domain, timeout, siteName)
    this.loadingPromises.set(cacheKey, loadPromise)

    try {
      const result = await loadPromise
      if (cache) this.iconCache.set(cacheKey, result)
      return result
    } finally {
      this.loadingPromises.delete(cacheKey)
    }
  }

  /**
   * 实际加载图标的逻辑
   */
  private async loadIcon(_url: string, domain: string, timeout: number, siteName: string): Promise<string> {
    // 获取图标服务列表
    const services = this.getIconServices(domain)

    // 依次尝试每个服务
    for (const iconUrl of services) {
      const success = await this.checkImageLoad(iconUrl, timeout)
      if (success) {
        return iconUrl
      }
    }

    // 所有服务都失败，返回首字母标记
    // 返回格式：initial:首字母:颜色
    const initial = this.getInitialIcon(siteName || domain)
    const color = this.getIconColor(siteName || domain)
    return `initial:${initial}:${color}`
  }

  /**
   * 检查图标是否是首字母类型
   */
  isInitialIcon(icon: string): boolean {
    return icon.startsWith('initial:')
  }

  /**
   * 解析首字母图标
   */
  parseInitialIcon(icon: string): { letter: string; color: string } | null {
    if (!this.isInitialIcon(icon)) return null
    const parts = icon.split(':')
    return {
      letter: parts[1] || '?',
      color: parts[2] || '#666'
    }
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.iconCache.clear()
  }
}

const iconService = new IconService()

export const getWebsiteIcon = iconService.getWebsiteIcon.bind(iconService)
export const isInitialIcon = iconService.isInitialIcon.bind(iconService)
export const parseInitialIcon = iconService.parseInitialIcon.bind(iconService)
export default iconService
