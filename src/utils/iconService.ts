import type { IconServiceOptions } from '@/types'

class IconService {
  private iconCache: Map<string, string>
  private iconServices: Array<(domain: string) => string>

  constructor() {
    this.iconCache = new Map()

    this.iconServices = [
      (domain) => `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`,
      (domain) => `https://api.favicon.im/${encodeURIComponent(domain)}?larger=true`,
      (domain) => `https://favicon.yandex.net/favicon/${encodeURIComponent(domain)}`,
    ]
  }

  getDomain(url: string): string {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  getStandardFavicon(url: string): string {
    try {
      const urlObj = new URL(url)
      return `${urlObj.protocol}//${urlObj.host}/favicon.ico`
    } catch {
      return ''
    }
  }

  async checkIconExists(iconUrl: string, timeout = 2000): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(iconUrl, {
        method: 'HEAD',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return response.ok
    } catch {
      return false
    }
  }

  async getWebsiteIcon(url: string, options: IconServiceOptions = {}): Promise<string> {
    const { cache = true, timeout = 5000 } = options
    const domain = this.getDomain(url)

    if (cache && this.iconCache.has(domain)) {
      return this.iconCache.get(domain)!
    }

    const standardFavicon = this.getStandardFavicon(url)
    if (await this.checkIconExists(standardFavicon, timeout)) {
      if (cache) this.iconCache.set(domain, standardFavicon)
      return standardFavicon
    }

    for (const service of this.iconServices) {
      const iconUrl = service(domain)
      if (await this.checkIconExists(iconUrl, timeout)) {
        if (cache) this.iconCache.set(domain, iconUrl)
        return iconUrl
      }
    }

    throw new Error('No icon found')
  }
}

const iconService = new IconService()
export const getWebsiteIcon = iconService.getWebsiteIcon.bind(iconService)
export default iconService
