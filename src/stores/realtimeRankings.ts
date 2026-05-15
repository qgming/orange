import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { GlobalBoxOfficeData, MovieRankingData, RankingTab, TvRankingData, WebRankingData } from '@/types'
import { fetchAllRealtimeRankings, formatRealtimeRankingRows } from '@/services/realtimeRankings'

const REFRESH_INTERVAL = 5 * 60 * 1000

export const useRealtimeRankingsStore = defineStore('realtimeRankings', () => {
  const loading = ref(false)
  const loaded = ref(false)
  const lastLoadedAt = ref(0)
  const webData = ref<WebRankingData | null>(null)
  const tvData = ref<TvRankingData | null>(null)
  const movieData = ref<MovieRankingData | null>(null)
  const globalData = ref<GlobalBoxOfficeData | null>(null)
  const errors = ref<Record<RankingTab, string | null>>({
    web: null,
    tv: null,
    movie: null,
    global: null,
  })

  const data = computed(() => ({
    web: webData.value,
    tv: tvData.value,
    movie: movieData.value,
    global: globalData.value,
  }))

  const webRanking = computed(() => webData.value?.list ?? [])
  const tvRanking = computed(() => tvData.value?.list ?? [])
  const movieRanking = computed(() => movieData.value?.list ?? [])
  const globalRanking = computed(() => globalData.value?.list ?? [])
  const webTopKeywords = computed(() => webRanking.value.slice(0, 5).map(item => item.series_name).filter(Boolean))

  const rowsForTab = (tab: RankingTab) => formatRealtimeRankingRows(tab, data.value)

  const fetchAll = async (options: { force?: boolean } = {}) => {
    const isFresh = loaded.value && Date.now() - lastLoadedAt.value < REFRESH_INTERVAL
    if (loading.value || (!options.force && isFresh)) return

    loading.value = true
    const result = await fetchAllRealtimeRankings()

    if (result.web) webData.value = result.web
    if (result.tv) tvData.value = result.tv
    if (result.movie) movieData.value = result.movie
    if (result.global) globalData.value = result.global

    errors.value = {
      web: result.web || webData.value ? null : '网剧热度榜暂时连接不上，可能是上游接口波动。',
      tv: result.tv || tvData.value ? null : '电视收视榜暂时连接不上，可能是上游接口波动。',
      movie: result.movie || movieData.value ? null : '电影票房榜暂时连接不上，可能是上游接口波动。',
      global: result.global || globalData.value ? null : '全球票房总榜暂时连接不上，可能是上游接口波动。',
    }

    loaded.value = true
    lastLoadedAt.value = Date.now()
    loading.value = false
  }

  return {
    loading,
    loaded,
    webData,
    tvData,
    movieData,
    globalData,
    errors,
    webRanking,
    tvRanking,
    movieRanking,
    globalRanking,
    webTopKeywords,
    rowsForTab,
    fetchAll,
  }
})
