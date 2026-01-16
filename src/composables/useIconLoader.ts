import { ref } from 'vue'

// 临时导入，稍后会迁移到 TS
declare function getWebsiteIcon(url: string, options?: any): Promise<string>

export function useIconLoader() {
  const loadingIcons = ref(new Set<string>())
  const isInitialLoading = ref(true)

  const getIconKey = (url: string, siteName: string) => {
    return `${url}||${siteName}`
  }

  const loadSiteIcon = async (url: string, siteName: string, iconStore: any): Promise<string> => {
    const key = getIconKey(url, siteName)

    // 检查缓存
    const cached = iconStore.getIcon(key)
    if (cached) return cached

    // 检查是否正在加载
    if (loadingIcons.value.has(key)) {
      return '🌐'
    }

    loadingIcons.value.add(key)

    try {
      // 动态导入 iconService
      const { getWebsiteIcon } = await import('@/utils/iconService')
      const iconUrl = await getWebsiteIcon(url, { cache: true })
      iconStore.setIcon(key, iconUrl)
      return iconUrl
    } catch (error) {
      const fallbackIcon = siteName.charAt(0)
      iconStore.setIcon(key, fallbackIcon)
      return fallbackIcon
    } finally {
      loadingIcons.value.delete(key)
    }
  }

  const getSiteIcon = (url: string, siteName: string, iconStore: any): string => {
    const key = getIconKey(url, siteName)
    return iconStore.getIcon(key) || '🌐'
  }

  const hasIconLoaded = (url: string, siteName: string, iconStore: any): boolean => {
    const key = getIconKey(url, siteName)
    return iconStore.hasIcon(key)
  }

  const preloadIcons = async (sites: any[], iconStore: any): Promise<void> => {
    isInitialLoading.value = true
    const promises = sites.map(site => loadSiteIcon(site.url, site.name, iconStore))
    await Promise.allSettled(promises)
    isInitialLoading.value = false
  }

  return {
    loadSiteIcon,
    getSiteIcon,
    hasIconLoaded,
    preloadIcons,
    loadingIcons,
    isInitialLoading
  }
}
