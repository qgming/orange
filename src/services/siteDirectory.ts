import videoSitesData from '@/data/videoSites.json'
import type { VideoSiteCategory } from '@/types'

const REMOTE_SITES_URL = '/orange/sites.json'
export const localVideoSites = videoSitesData as VideoSiteCategory

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

export const fetchRemoteSites = async () => {
  try {
    const response = await fetch(REMOTE_SITES_URL, { cache: 'no-cache' })
    if (!response.ok) return null
    const data = await response.json()
    return isVideoSiteCategory(data) ? data : null
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
