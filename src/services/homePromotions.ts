import promotionsData from '@/data/homePromotions.json'
import type { HomePromotionItem, HomePromotionsConfig } from '@/types'

const REMOTE_PROMOTIONS_URL = '/orange/promotions.json'
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

export const fetchRemotePromotions = async () => {
  const cachedPromotions = getCachedPromotions()
  if (cachedPromotions) return cachedPromotions

  try {
    const response = await fetch(REMOTE_PROMOTIONS_URL, { cache: 'no-cache' })
    if (!response.ok) return null
    const data = await response.json()
    if (!isHomePromotionsConfig(data)) return null

    setCachedPromotions(data)
    return data
  } catch {
    return null
  }
}
