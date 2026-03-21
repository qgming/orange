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
  series_id: number
  series_name: string
  release_info: string
  platform_desc: string
  platform_txt: number
  curr_heat: number
  curr_heat_desc: string
  bar_value: number
}

export interface WebRankingData {
  update_gap_second: number
  updated: string
  updated_at: number
  list: WebRankingItem[]
}

export interface TvRankingItem {
  programme_name: string
  channel_name: string
  market_rate: number
  market_rate_desc: string
  attention_rate: number
  attention_rate_desc: string
}

export interface TvRankingData {
  update_gap_second: number
  updated: string
  updated_at: number
  list: TvRankingItem[]
}

export interface MovieRankingItem {
  movie_id: number
  movie_name: string
  release_info: string
  box_office: string
  box_office_unit: string
  box_office_desc: string
  box_office_rate: string
  split_box_office: string
  split_box_office_unit: string
  split_box_office_desc: string
  split_box_office_rate: string
  show_count: number
  show_count_rate: string
  avg_show_view: string
  avg_seat_view: string
  sum_box_desc: string
  sum_split_box_desc: string
}

export interface MovieRankingData {
  title: string
  show_count_desc: string
  view_count_desc: string
  split_box_office: string
  split_box_office_unit: string
  box_office: string
  box_office_unit: string
  update_gap_second: number
  updated: string
  updated_at: number
  list: MovieRankingItem[]
}

export interface DoubanWeeklyItem {
  rank: number
  title: string
  id: string
  rating: number
  rating_count: number
  good_rate: number
  trend: string
  rank_change: number
  card_subtitle: string
  description: string
  cover: string
  cover_proxy: string
  url: string
  tags: string[]
}

export type DoubanWeeklyTab =
  | 'movie'
  | 'tv_chinese'
  | 'tv_global'
  | 'show_chinese'
  | 'show_global'

export type RankingTab = 'web' | 'tv' | 'movie'

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
