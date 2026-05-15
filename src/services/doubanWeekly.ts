import type { DoubanWeeklyItem, DoubanWeeklyTab } from '@/types'
import { fetchSixtySecondsData } from './sixtySeconds'

export interface WeeklyTabConfig {
  key: DoubanWeeklyTab
  label: string
  short: string
  endpoint: string
}

export const doubanWeeklyTabs: WeeklyTabConfig[] = [
  { key: 'movie', label: '全球电影', short: '电影', endpoint: '/v2/douban/weekly/movie' },
  { key: 'tv_chinese', label: '华语剧集', short: '华语剧', endpoint: '/v2/douban/weekly/tv_chinese' },
  { key: 'tv_global', label: '全球剧集', short: '全球剧', endpoint: '/v2/douban/weekly/tv_global' },
  { key: 'show_chinese', label: '华语综艺', short: '综艺', endpoint: '/v2/douban/weekly/show_chinese' },
  { key: 'show_global', label: '全球口碑综艺', short: '口碑综艺', endpoint: '/v2/douban/weekly/show_global' },
]

export const createEmptyDoubanWeeklyRankings = (): Record<DoubanWeeklyTab, DoubanWeeklyItem[]> => ({
  movie: [],
  tv_chinese: [],
  tv_global: [],
  show_chinese: [],
  show_global: [],
})

export const createEmptyDoubanWeeklyErrors = (): Record<DoubanWeeklyTab, string | null> => ({
  movie: null,
  tv_chinese: null,
  tv_global: null,
  show_chinese: null,
  show_global: null,
})

export const fetchDoubanWeeklyItems = async (endpoint: string) => {
  return fetchSixtySecondsData<DoubanWeeklyItem[]>(endpoint)
}

export const formatDoubanRating = (value?: number) => {
  if (typeof value !== 'number') return '--'
  return value.toFixed(1)
}

export const formatDoubanCount = (value?: number) => {
  if (typeof value !== 'number') return '--'
  return new Intl.NumberFormat('zh-CN', { notation: value > 9999 ? 'compact' : 'standard' }).format(value)
}

export const coverSource = (item: DoubanWeeklyItem) => item.cover_proxy || item.cover

export const subtitleParts = (subtitle: string) => {
  const [year, region, genre, director, ...castParts] = subtitle
    .split('/')
    .map(part => part.trim())
    .filter(Boolean)

  return {
    year,
    region,
    genre,
    director,
    cast: castParts.join(' / '),
  }
}

export const subtitleFields = (subtitle: string) => {
  const parts = subtitleParts(subtitle)
  return [
    { label: '时间', value: parts.year },
    { label: '制片国家/地区', value: parts.region },
    { label: '类型', value: parts.genre },
    { label: '导演', value: parts.director },
    { label: '主演', value: parts.cast },
  ].filter(field => field.value)
}

export const trendText = (item: DoubanWeeklyItem) => {
  if (item.trend === 'up') return `上升 ${Math.abs(item.rank_change)}`
  if (item.trend === 'down') return `下降 ${Math.abs(item.rank_change)}`
  return item.rank_change === 0 ? '持平' : `变化 ${Math.abs(item.rank_change)}`
}

export const trendClass = (item: DoubanWeeklyItem) => {
  if (item.trend === 'up') return 'up'
  if (item.trend === 'down') return 'down'
  return 'flat'
}
