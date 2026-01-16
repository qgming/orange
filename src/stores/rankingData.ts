import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WebRankingItem, TvRankingItem, RankingTab } from '@/types'
import { useApiRetry } from '@/composables/useApiRetry'

const API_HOSTS = [
  'https://api.vvhan.com',
  'https://api.aa1.cn',
  'https://api.uomg.com',
  'https://api.oioweb.cn',
  'https://api.qqsuu.cn',
  'https://api.lolimi.cn',
  'https://api.yujn.cn',
  'https://api.ixiaowai.cn',
  'https://api.66mz8.com'
]

export const useRankingDataStore = defineStore('rankingData', () => {
  const webRanking = ref<WebRankingItem[]>([])
  const tvRanking = ref<TvRankingItem[]>([])
  const activeTab = ref<RankingTab>('web')
  const isExpanded = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetchTime = ref(0)

  const { fetchWithRetry } = useApiRetry<{ data: WebRankingItem[] }>(API_HOSTS)

  const fetchWebRanking = async () => {
    try {
      loading.value = true
      const response = await fetchWithRetry('/v2/maoyan/realtime/web')
      webRanking.value = response.data || []
      lastFetchTime.value = Date.now()
      error.value = null
    } catch (err) {
      error.value = '获取排行失败'
      console.error('Failed to fetch web ranking:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchTvRanking = async () => {
    try {
      loading.value = true
      const response = await fetchWithRetry('/v2/maoyan/realtime/tv') as any
      tvRanking.value = response.data || []
      lastFetchTime.value = Date.now()
      error.value = null
    } catch (err) {
      error.value = '获取排行失败'
      console.error('Failed to fetch TV ranking:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchAllRankings = async () => {
    await Promise.all([fetchWebRanking(), fetchTvRanking()])
  }

  const displayedWebRanking = computed(() => {
    return isExpanded.value ? webRanking.value : webRanking.value.slice(0, 4)
  })

  const displayedTvRanking = computed(() => {
    return isExpanded.value ? tvRanking.value : tvRanking.value.slice(0, 4)
  })

  return {
    webRanking,
    tvRanking,
    activeTab,
    isExpanded,
    loading,
    error,
    fetchWebRanking,
    fetchTvRanking,
    fetchAllRankings,
    setActiveTab: (tab: RankingTab) => { activeTab.value = tab },
    toggleExpand: () => { isExpanded.value = !isExpanded.value },
    displayedWebRanking,
    displayedTvRanking
  }
})
