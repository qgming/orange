import type {
  GlobalBoxOfficeData,
  GlobalBoxOfficeItem,
  MovieRankingData,
  MovieRankingItem,
  RankingTab,
  TvRankingData,
  TvRankingItem,
  WebRankingData,
  WebRankingItem,
} from '@/types'
import { fetchSixtySecondsData } from './sixtySeconds'

export interface RealtimeTabConfig {
  key: RankingTab
  label: string
  short: string
  endpoint: string
}

export interface RealtimeRankingsResult {
  web: WebRankingData | null
  tv: TvRankingData | null
  movie: MovieRankingData | null
  global: GlobalBoxOfficeData | null
}

export interface DisplayRankingRow {
  key: string
  rank: number
  title: string
  subtitle: string
  metric: string
  note: string
  searchName: string
}

export const realtimeRankingTabs: RealtimeTabConfig[] = [
  { key: 'web', label: '网剧实时热度', short: '网剧', endpoint: '/v2/maoyan/realtime/web' },
  { key: 'tv', label: '电视收视排行', short: '电视', endpoint: '/v2/maoyan/realtime/tv' },
  { key: 'movie', label: '电影实时票房', short: '票房', endpoint: '/v2/maoyan/realtime/movie' },
  { key: 'global', label: '全球票房总榜', short: '全球', endpoint: '/v2/maoyan/all/movie' },
]

const formatCompact = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '--'
  return new Intl.NumberFormat('zh-CN', {
    notation: value >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 100 ? 0 : 1,
  }).format(value)
}

const formatRate = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '--'
  return `${value.toFixed(2)}%`
}

export const fetchRealtimeRanking = async <T>(endpoint: string) => fetchSixtySecondsData<T>(endpoint)

export const fetchAllRealtimeRankings = async (): Promise<RealtimeRankingsResult> => {
  const [web, tv, movie, global] = await Promise.all([
    fetchRealtimeRanking<WebRankingData>('/v2/maoyan/realtime/web'),
    fetchRealtimeRanking<TvRankingData>('/v2/maoyan/realtime/tv'),
    fetchRealtimeRanking<MovieRankingData>('/v2/maoyan/realtime/movie'),
    fetchRealtimeRanking<GlobalBoxOfficeData>('/v2/maoyan/all/movie'),
  ])

  return { web, tv, movie, global }
}

export const formatRealtimeRankingRows = (
  tab: RankingTab,
  data: RealtimeRankingsResult,
): DisplayRankingRow[] => {
  if (tab === 'web') {
    return (data.web?.list ?? []).map((item: WebRankingItem, index: number) => ({
      key: String(item.series_id),
      rank: index + 1,
      title: item.series_name,
      subtitle: item.release_info || item.platform_desc || '热度同步中',
      metric: item.curr_heat_desc || formatCompact(item.curr_heat),
      note: item.platform_desc || `指数 ${formatCompact(item.bar_value)}`,
      searchName: item.series_name,
    }))
  }

  if (tab === 'tv') {
    return (data.tv?.list ?? []).map((item: TvRankingItem, index: number) => ({
      key: `${item.programme_name}-${index}`,
      rank: index + 1,
      title: item.programme_name,
      subtitle: item.channel_name || '频道信息暂缺',
      metric: item.market_rate_desc || formatRate(item.market_rate),
      note: `关注度 ${item.attention_rate_desc || formatRate(item.attention_rate)}`,
      searchName: item.programme_name,
    }))
  }

  if (tab === 'global') {
    return (data.global?.list ?? []).map((item: GlobalBoxOfficeItem) => ({
      key: String(item.maoyan_id),
      rank: item.rank,
      title: item.movie_name,
      subtitle: `${item.release_year}年上映`,
      metric: item.box_office_desc,
      note: '全球累计票房',
      searchName: item.movie_name,
    }))
  }

  return (data.movie?.list ?? []).map((item: MovieRankingItem, index: number) => ({
    key: String(item.movie_id),
    rank: index + 1,
    title: item.movie_name,
    subtitle: item.release_info || item.sum_box_desc || '票房同步中',
    metric: item.box_office_desc || `${item.box_office}${item.box_office_unit}`,
    note: item.box_office_rate || item.split_box_office_desc || '票房占比待同步',
    searchName: item.movie_name,
  }))
}
