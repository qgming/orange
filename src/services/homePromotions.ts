import promotionsData from '@/data/homePromotions.json'
import type { HomePromotionItem, HomePromotionsConfig } from '@/types'

const REMOTE_PROMOTIONS_URL = '/orange/promotions.json'
export const localHomePromotions = promotionsData as HomePromotionsConfig

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

export const fetchRemotePromotions = async () => {
  try {
    const response = await fetch(REMOTE_PROMOTIONS_URL, { cache: 'no-cache' })
    if (!response.ok) return null
    const data = await response.json()
    return isHomePromotionsConfig(data) ? data : null
  } catch {
    return null
  }
}
