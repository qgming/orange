import videoSitesData from '@/data/videoSites.json'
import type { VideoSiteCategory } from '@/types'

const REMOTE_SITES_URL = '/orange/sites.json'
const SITES_CACHE_KEY = 'orange:site-directory'
const SITES_CACHE_TTL = 60 * 60 * 1000
export const localVideoSites = videoSitesData as VideoSiteCategory

interface VideoSitesCacheEntry {
  timestamp: number;
  data: VideoSiteCategory;
}

export const isVideoSiteCategory = (data: unknown): data is VideoSiteCategory => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false

  return Object.values(data).every(sites => {
    if (!Array.isArray(sites)) return false
    return sites.every(site => {
      if (!site || typeof site !== 'object' || Array.isArray(site)) return false
      const item = site as Record<string, unknown>
      return typeof item.name === 'string' && typeof item.url === 'string'
    })
  })
}

const isVideoSitesCacheEntry = (data: unknown): data is VideoSitesCacheEntry => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false
  const entry = data as Record<string, unknown>

  return typeof entry.timestamp === 'number'
    && Date.now() - entry.timestamp < SITES_CACHE_TTL
    && isVideoSiteCategory(entry.data)
}

const getCachedSites = () => {
  try {
    const cached = localStorage.getItem(SITES_CACHE_KEY)
    if (!cached) return null

    const data = JSON.parse(cached)
    return isVideoSitesCacheEntry(data) ? data.data : null
  } catch {
    return null
  }
}

const setCachedSites = (data: VideoSiteCategory) => {
  try {
    localStorage.setItem(SITES_CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data,
    }))
  } catch {
    // 忽略缓存写入失败，页面仍可使用远程结果或本地兜底。
  }
}

export const fetchRemoteSites = async () => {
  const cachedSites = getCachedSites()
  if (cachedSites) return cachedSites

  try {
    const response = await fetch(REMOTE_SITES_URL, { cache: 'no-cache' })
    if (!response.ok) return null
    const data = await response.json()
    if (!isVideoSiteCategory(data)) return null

    setCachedSites(data)
    return data
  } catch {
    return null
  }
}

export const getHostname = (url: string) => {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

export const openSiteWithSource = (url: string) => {
  try {
    const targetUrl = new URL(url)
    targetUrl.searchParams.append('from', 'v.qgming.com')
    window.open(targetUrl.toString(), '_blank')
  } catch {
    window.open(url, '_blank')
  }
}
