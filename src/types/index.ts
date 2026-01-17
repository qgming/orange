// 视频站点类型
export interface VideoSite {
  name: string
  url: string
  isRecommended?: boolean
}

export interface VideoSiteCategory {
  [category: string]: VideoSite[]
}

// 搜索类型
export interface SearchSite {
  name: string
  url: string
}

// 排行榜类型
export interface WebRankingItem {
  series_id: string
  series_name: string
  curr_heat_desc?: string
  platform_desc?: string
}

export interface TvRankingItem {
  programme_name: string
  market_rate?: string
  market_rate_desc?: string
  channel_name?: string
}

export type RankingTab = 'web' | 'tv'

// 图标服务类型
export interface IconServiceOptions {
  cache?: boolean
  timeout?: number
  siteName?: string
}

export interface IconCacheEntry {
  url: string
  timestamp: number
}

// API 类型
export interface ApiRetryOptions {
  maxRetries?: number
  timeout?: number
  onRetry?: (attempt: number, host: string) => void
}

export interface ApiResponse<T> {
  data: T
  code?: number
  message?: string
}
