import { computed, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDoubanWeeklyStore } from '@/stores/doubanWeekly'
import { useHomePromotionsStore } from '@/stores/homePromotions'
import { useRealtimeRankingsStore } from '@/stores/realtimeRankings'
import { useSiteDirectoryStore } from '@/stores/siteDirectory'

const COOLDOWN_MS = 60 * 1000
const LAST_REFRESH_KEY = 'orange:last-deep-refresh'

const refreshing = ref(false)
const lastRefreshAt = ref(0)
const now = ref(Date.now())

let timer: number | null = null

const readLastRefreshAt = () => {
  if (typeof window === 'undefined') return 0

  const stored = Number(window.localStorage.getItem(LAST_REFRESH_KEY))
  return Number.isFinite(stored) ? stored : 0
}

const writeLastRefreshAt = (value: number) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LAST_REFRESH_KEY, String(value))
}

export const useDeepRefresh = () => {
  const homePromotionsStore = useHomePromotionsStore()
  const siteDirectoryStore = useSiteDirectoryStore()
  const realtimeRankingsStore = useRealtimeRankingsStore()
  const doubanWeeklyStore = useDoubanWeeklyStore()

  const { loading: promotionsLoading } = storeToRefs(homePromotionsStore)
  const { loading: sitesLoading } = storeToRefs(siteDirectoryStore)
  const { loading: rankingsLoading } = storeToRefs(realtimeRankingsStore)
  const { loading: weeklyLoading } = storeToRefs(doubanWeeklyStore)

  const remainingMs = computed(() => Math.max(0, COOLDOWN_MS - (now.value - lastRefreshAt.value)))
  const remainingSeconds = computed(() => Math.ceil(remainingMs.value / 1000))
  const isCoolingDown = computed(() => remainingMs.value > 0)
  const isBusy = computed(() => refreshing.value
    || promotionsLoading.value
    || sitesLoading.value
    || rankingsLoading.value
    || weeklyLoading.value)
  const canRefresh = computed(() => !isBusy.value && !isCoolingDown.value)

  const refreshAll = async () => {
    if (!canRefresh.value) return

    refreshing.value = true

    try {
      await Promise.allSettled([
        homePromotionsStore.loadPromotions({ force: true }),
        siteDirectoryStore.loadSites({ force: true }),
        realtimeRankingsStore.fetchAll({ force: true }),
        doubanWeeklyStore.fetchAll({ force: true }),
      ])
    } finally {
      const completedAt = Date.now()
      lastRefreshAt.value = completedAt
      now.value = completedAt
      writeLastRefreshAt(completedAt)
      refreshing.value = false
    }
  }

  onMounted(() => {
    lastRefreshAt.value = readLastRefreshAt()
    now.value = Date.now()

    if (timer === null) {
      timer = window.setInterval(() => {
        now.value = Date.now()
      }, 1000)
    }
  })

  onUnmounted(() => {
    if (timer !== null) {
      window.clearInterval(timer)
      timer = null
    }
  })

  return {
    canRefresh,
    isBusy,
    isCoolingDown,
    remainingSeconds,
    refreshAll,
  }
}
