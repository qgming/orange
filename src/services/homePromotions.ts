import promotionsData from '@/data/homePromotions.json'
import type { HomePromotionItem, HomePromotionsConfig } from '@/types'

const REMOTE_PROMOTIONS_URLS = [
  'https://pages.qgming.com/orange/promotions.json',
  '/orange/promotions.json',
]
const PROMOTIONS_CACHE_KEY = 'orange:home-promotions'
const PROMOTIONS_CACHE_TTL = 60 * 60 * 1000
export const localHomePromotions = promotionsData as HomePromotionsConfig

interface HomePromotionsCacheEntry {
  timestamp: number;
  data: HomePromotionsConfig;
}

const isHomePromotionItem = (item: unknown): item is HomePromotionItem => {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return false
  const entry = item as Record<string, unknown>

  const hasTarget = typeof entry.route === 'string' || typeof entry.url === 'string'
  return typeof entry.title === 'string'
    && typeof entry.description === 'string'
    && typeof entry.isVisible === 'boolean'
    && hasTarget
    && (entry.image === undefined || typeof entry.image === 'string')
}

export const isHomePromotionsConfig = (data: unknown): data is HomePromotionsConfig => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false
  const config = data as Record<string, unknown>

  return typeof config.isVisible === 'boolean'
    && Array.isArray(config.items)
    && config.items.every(isHomePromotionItem)
}

const isHomePromotionsCacheEntry = (data: unknown): data is HomePromotionsCacheEntry => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false
  const entry = data as Record<string, unknown>

  return typeof entry.timestamp === 'number'
    && Date.now() - entry.timestamp < PROMOTIONS_CACHE_TTL
    && isHomePromotionsConfig(entry.data)
}

export const clearPromotionsCache = () => {
  try {
    localStorage.removeItem(PROMOTIONS_CACHE_KEY)
  } catch {
    // 忽略缓存清理失败，强制刷新仍会直接请求远程数据。
  }
}

const getCachedPromotions = () => {
  try {
    const cached = localStorage.getItem(PROMOTIONS_CACHE_KEY)
    if (!cached) return null

    const data = JSON.parse(cached)
    return isHomePromotionsCacheEntry(data) ? data.data : null
  } catch {
    return null
  }
}

const setCachedPromotions = (data: HomePromotionsConfig) => {
  try {
    localStorage.setItem(PROMOTIONS_CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data,
    }))
  } catch {
    // 忽略缓存写入失败，页面仍可使用远程结果或本地兜底。
  }
}

const fetchPromotionsFromUrl = async (url: string) => {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) return null

  const text = await response.text()
  const trimmedText = text.trimStart()

  if (!trimmedText || trimmedText.startsWith('<')) return null

  try {
    const data = JSON.parse(text)
    return isHomePromotionsConfig(data) ? data : null
  } catch {
    return null
  }
}

export const fetchRemotePromotions = async (options: { force?: boolean } = {}) => {
  if (options.force) clearPromotionsCache()
  const cachedPromotions = options.force ? null : getCachedPromotions()

  for (const url of REMOTE_PROMOTIONS_URLS) {
    try {
      const data = await fetchPromotionsFromUrl(url)
      if (!data) continue

      setCachedPromotions(data)
      return data
    } catch {
      // 尝试下一个远程地址，最后再回退到本地缓存或内置数据。
    }
  }

  return cachedPromotions
}
