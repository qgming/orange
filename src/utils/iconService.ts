import type { IconServiceOptions } from '@/types'

class IconService {
  private iconCache: Map<string, string>
  private iconServices: Array<(domain: string) => string>
  private emojiList: string[]

  constructor() {
    this.iconCache = new Map()

    // 高清图标服务列表
    this.iconServices = [
      (domain) => `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`,
      (domain) => `https://api.iowen.cn/favicon/${encodeURIComponent(domain)}.png`,
      (domain) => `https://icon.horse/icon/${encodeURIComponent(domain)}`,
      (domain) => `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`,
    ]

    // 随机 emoji 列表
    this.emojiList = [
      '🎬', '🎥', '🎞️', '📺', '📹', '🎭', '🎪', '🎨', '🎯', '🎲',
      '🎮', '🎰', '🎳', '🎸', '🎹', '🎺', '🎻', '🎼', '🎤', '🎧',
      '📱', '💻', '🖥️', '⌨️', '🖱️', '🖨️', '📷', '📸', '📡', '🔭',
      '🌟', '⭐', '✨', '💫', '🌈', '🔥', '💎', '🎁', '🎀', '🎊',
      '🚀', '🛸', '🌍', '🌎', '🌏', '🗺️', '🧭', '⚡', '🌙', '☀️'
    ]
  }

  getDomain(url: string): string {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  getRandomEmoji(seed?: string): string {
    // 如果提供了种子(如网站名称),使用它来生成一致的随机 emoji
    if (seed) {
      let hash = 0
      for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i)
        hash = hash & hash
      }
      const index = Math.abs(hash) % this.emojiList.length
      return this.emojiList[index]
    }
    // 否则返回真正的随机 emoji
    return this.emojiList[Math.floor(Math.random() * this.emojiList.length)]
  }

  getStandardFavicon(url: string): string {
    try {
      const urlObj = new URL(url)
      return `${urlObj.protocol}//${urlObj.host}/favicon.ico`
    } catch {
      return ''
    }
  }

  async checkIconExists(iconUrl: string, timeout = 3000): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      await fetch(iconUrl, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors', // 避免 CORS 问题
      })

      clearTimeout(timeoutId)
      // no-cors 模式下 response.ok 可能不准确,只要没抛错就认为成功
      return true
    } catch {
      return false
    }
  }

  async getWebsiteIcon(url: string, options: IconServiceOptions = {}): Promise<string> {
    const { cache = true, timeout = 5000, siteName = '' } = options
    const domain = this.getDomain(url)

    // 检查缓存
    if (cache && this.iconCache.has(domain)) {
      return this.iconCache.get(domain)!
    }

    // 尝试标准 favicon
    const standardFavicon = this.getStandardFavicon(url)
    if (standardFavicon && await this.checkIconExists(standardFavicon, timeout)) {
      if (cache) this.iconCache.set(domain, standardFavicon)
      return standardFavicon
    }

    // 尝试各个图标服务
    for (const service of this.iconServices) {
      const iconUrl = service(domain)
      if (await this.checkIconExists(iconUrl, timeout)) {
        if (cache) this.iconCache.set(domain, iconUrl)
        return iconUrl
      }
    }

    // 所有服务都失败,返回随机 emoji (使用网站名称或域名作为种子以保持一致性)
    const emoji = this.getRandomEmoji(siteName || domain)
    if (cache) this.iconCache.set(domain, emoji)
    return emoji
  }
}

const iconService = new IconService()
export const getWebsiteIcon = iconService.getWebsiteIcon.bind(iconService)
export default iconService
