<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import AppFooter from '@/components/AppFooter.vue'
import TopBar from '@/components/TopBar.vue'
import CategoryTabs from '@/components/CategoryTabs.vue'
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
import { performSearch } from '@/utils/searchService'

interface ApiEnvelope<T> {
  data?: T
}

interface RealtimeTabConfig {
  key: RankingTab
  label: string
  short: string
  endpoint: string
}

interface DisplayRow {
  key: string
  rank: number
  title: string
  subtitle: string
  metric: string
  note: string
  searchName: string
}

const tabs: RealtimeTabConfig[] = [
  { key: 'web', label: '网剧实时热度', short: '网剧', endpoint: '/v2/maoyan/realtime/web' },
  { key: 'tv', label: '电视收视排行', short: '电视', endpoint: '/v2/maoyan/realtime/tv' },
  { key: 'movie', label: '电影实时票房', short: '票房', endpoint: '/v2/maoyan/realtime/movie' },
  { key: 'global', label: '全球票房总榜', short: '全球', endpoint: '/v2/maoyan/all/movie' },
]

const apiHosts = [
  'https://60s.viki.moe',
  'https://60api.09cdn.xyz',
  'https://60s.zeabur.app',
  'https://60s.crystelf.top',
  'https://cqxx.site',
  'https://api.yanyua.icu',
  'https://60s.tmini.net',
  'https://60s.7se.cn',
  'https://60s.mizhoubaobei.top',
]

const activeTab = ref<RankingTab>('web')
const loading = ref(true)
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

let currentHostIndex = 0
let refreshInterval: number | null = null

const activeConfig = computed(() => tabs.find(tab => tab.key === activeTab.value) ?? tabs[0])

const categoryTabs = computed(() => {
  return tabs.map(tab => ({
    key: tab.key,
    label: tab.label,
  }))
})
const activeError = computed(() => errors.value[activeTab.value])
const webRanking = computed(() => webData.value?.list ?? [])
const tvRanking = computed(() => tvData.value?.list ?? [])
const movieRanking = computed(() => movieData.value?.list ?? [])
const globalRanking = computed(() => globalData.value?.list ?? [])

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

const rows = computed<DisplayRow[]>(() => {
  if (activeTab.value === 'web') {
    return webRanking.value.map((item: WebRankingItem, index: number) => ({
      key: String(item.series_id),
      rank: index + 1,
      title: item.series_name,
      subtitle: item.release_info || item.platform_desc || '热度同步中',
      metric: item.curr_heat_desc || formatCompact(item.curr_heat),
      note: item.platform_desc || `指数 ${formatCompact(item.bar_value)}`,
      searchName: item.series_name,
    }))
  }

  if (activeTab.value === 'tv') {
    return tvRanking.value.map((item: TvRankingItem, index: number) => ({
      key: `${item.programme_name}-${index}`,
      rank: index + 1,
      title: item.programme_name,
      subtitle: item.channel_name || '频道信息暂缺',
      metric: item.market_rate_desc || formatRate(item.market_rate),
      note: `关注度 ${item.attention_rate_desc || formatRate(item.attention_rate)}`,
      searchName: item.programme_name,
    }))
  }

  if (activeTab.value === 'global') {
    return globalRanking.value.map((item: GlobalBoxOfficeItem) => ({
      key: String(item.maoyan_id),
      rank: item.rank,
      title: item.movie_name,
      subtitle: `${item.release_year}年上映`,
      metric: item.box_office_desc,
      note: `全球累计票房`,
      searchName: item.movie_name,
    }))
  }

  return movieRanking.value.map((item: MovieRankingItem, index: number) => ({
    key: String(item.movie_id),
    rank: index + 1,
    title: item.movie_name,
    subtitle: item.release_info || item.sum_box_desc || '票房同步中',
    metric: item.box_office_desc || `${item.box_office}${item.box_office_unit}`,
    note: item.box_office_rate || item.split_box_office_desc || '票房占比待同步',
    searchName: item.movie_name,
  }))
})

const hasRows = computed(() => rows.value.length > 0)
const listRows = computed(() => rows.value.slice(0, 20))

const fetchApiData = async <T,>(endpoint: string): Promise<T | null> => {
  for (let i = 0; i < apiHosts.length; i++) {
    try {
      const host = apiHosts[(currentHostIndex + i) % apiHosts.length]
      const response = await fetch(`${host}${endpoint}`, {
        signal: AbortSignal.timeout(5000),
      })

      if (!response.ok) continue

      const result = (await response.json()) as T
      currentHostIndex = (currentHostIndex + i) % apiHosts.length
      return result
    } catch {
      continue
    }
  }

  return null
}

const fetchRankingData = async <T,>(endpoint: string) => {
  const result = await fetchApiData<ApiEnvelope<T>>(endpoint)
  return result?.data ?? null
}

const fetchAll = async () => {
  loading.value = true

  const [web, tv, movie, global] = await Promise.all([
    fetchRankingData<WebRankingData>('/v2/maoyan/realtime/web'),
    fetchRankingData<TvRankingData>('/v2/maoyan/realtime/tv'),
    fetchRankingData<MovieRankingData>('/v2/maoyan/realtime/movie'),
    fetchRankingData<GlobalBoxOfficeData>('/v2/maoyan/all/movie'),
  ])

  if (web) webData.value = web
  if (tv) tvData.value = tv
  if (movie) movieData.value = movie
  if (global) globalData.value = global

  errors.value = {
    web: web || webData.value ? null : '网剧热度榜暂时连接不上，可能是上游接口波动。',
    tv: tv || tvData.value ? null : '电视收视榜暂时连接不上，可能是上游接口波动。',
    movie: movie || movieData.value ? null : '电影票房榜暂时连接不上，可能是上游接口波动。',
    global: global || globalData.value ? null : '全球票房总榜暂时连接不上，可能是上游接口波动。',
  }

  loading.value = false
}

const openSearch = (name: string) => {
  performSearch(name, 0)
}

onMounted(() => {
  document.title = '实时榜单 - 橘子导航'
  fetchAll()
  refreshInterval = setInterval(fetchAll, 5 * 60 * 1000) as unknown as number
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>

<template>
  <div class="realtime-page">
    <TopBar />

    <main class="realtime-main">
      <header class="hero">
        <div class="hero-copy">
          <span class="eyebrow">Realtime Board</span>
          <h1>实时排行榜</h1>
        </div>
      </header>

      <CategoryTabs
        :tabs="categoryTabs"
        :active-tab="activeTab"
        aria-label="实时榜单分类"
        @update:active-tab="activeTab = $event as RankingTab"
      />

      <section v-if="loading" class="state-card">
        <span class="spinner"></span>
        <p>正在加载实时榜单...</p>
      </section>

      <section v-else-if="activeError && !hasRows" class="state-card">
        <strong>{{ activeConfig.label }}暂时不可用</strong>
        <p>{{ activeError }}</p>
        <button type="button" @click="fetchAll">重新加载</button>
      </section>

      <template v-else-if="hasRows">
        <section class="rank-list" aria-label="实时排行榜列表">
          <article v-for="row in listRows" :key="row.key" class="rank-card">
            <div class="rank-header">
              <span class="rank-badge">#{{ row.rank }}</span>
              <span class="rank-metric">{{ row.metric }}</span>
            </div>
            <h2 class="rank-title">{{ row.title }}</h2>
            <p class="rank-info">{{ row.subtitle }} • {{ row.note }}</p>
            <button type="button" class="play-button" @click="openSearch(row.searchName)">
              <span class="play-icon" aria-hidden="true"></span>
              播放
            </button>
          </article>
        </section>
      </template>

      <section v-else class="state-card">
        <strong>{{ activeConfig.label }}暂无数据</strong>
        <p>可以切换其他榜单，或者稍后再试。</p>
        <button type="button" @click="fetchAll">再试一次</button>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.realtime-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.realtime-main {
  flex: 1;
  width: min(100%, 1180px);
  margin: 0 auto;
  padding: var(--sp-6) var(--sp-4) 0;
}

.hero {
  margin-bottom: var(--sp-5);
}

.hero-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--sp-2);
}

.eyebrow {
  color: var(--c-accent-light);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero h1 {
  margin: 0;
  color: var(--text-primary);
  font-size: clamp(2.125rem, 5vw, 3.75rem);
  line-height: 1;
  letter-spacing: 0;
}

.state-card {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: var(--bg-surface);
}

.state-card button {
  padding: 10px 16px;
  border-radius: var(--radius-full);
  background: var(--c-accent);
  color: white;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.rank-card {
  position: relative;
  padding: var(--sp-5);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: var(--bg-surface);
  transition: transform var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
}

.rank-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--c-accent) 28%, var(--border-hover));
  box-shadow: 0 8px 24px -8px color-mix(in srgb, var(--c-accent) 24%, transparent);
}

.rank-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-3);
}

.rank-badge {
  color: var(--c-accent);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  line-height: 1;
}

.rank-metric {
  color: var(--c-accent-light);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
}

.rank-title {
  margin: 0 0 var(--sp-2) 0;
  color: var(--text-primary);
  font-size: clamp(1.5rem, 3vw, 2rem);
  line-height: 1.2;
  font-weight: var(--font-semibold);
}

.rank-info {
  margin: 0 0 var(--sp-4) 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.play-button {
  position: absolute;
  right: var(--sp-5);
  bottom: var(--sp-5);
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 10px 18px;
  border-radius: var(--radius-full);
  background: var(--c-accent);
  color: white;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: transform var(--duration-fast) var(--ease-out);
}

.play-button:hover {
  transform: translateY(-1px);
}

.play-icon {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 8px solid currentColor;
}

.state-card {
  min-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sp-3);
  color: var(--text-secondary);
  text-align: center;
}

.state-card strong {
  color: var(--text-primary);
}

.state-card p {
  max-width: 420px;
  margin: 0;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-default);
  border-top-color: var(--c-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 960px) {
  .rank-card {
    padding: var(--sp-4);
  }

  .play-button {
    right: var(--sp-4);
    bottom: var(--sp-4);
  }
}

@media (max-width: 620px) {
  .realtime-main {
    padding-top: var(--sp-4);
  }
}
</style>
