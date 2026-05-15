<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import AppFooter from '@/components/AppFooter.vue'
import TopBar from '@/components/TopBar.vue'
import { useHorizontalWheelScroll } from '@/composables/useHorizontalWheelScroll'
import type {
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
  { key: 'web', label: '网剧热度榜', short: '网剧', endpoint: '/v2/maoyan/realtime/web' },
  { key: 'tv', label: '电视收视榜', short: '电视', endpoint: '/v2/maoyan/realtime/tv' },
  { key: 'movie', label: '电影票房榜', short: '票房', endpoint: '/v2/maoyan/realtime/movie' },
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
const errors = ref<Record<RankingTab, string | null>>({
  web: null,
  tv: null,
  movie: null,
})

let currentHostIndex = 0
let refreshInterval: number | null = null

// @ts-expect-error containerRef 在模板中作为 ref 使用
const { containerRef, handleWheel: handleTabStripWheel } = useHorizontalWheelScroll()

const activeConfig = computed(() => tabs.find(tab => tab.key === activeTab.value) ?? tabs[0])
const activeError = computed(() => errors.value[activeTab.value])
const webRanking = computed(() => webData.value?.list ?? [])
const tvRanking = computed(() => tvData.value?.list ?? [])
const movieRanking = computed(() => movieData.value?.list ?? [])

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

const activeRefreshGap = computed(() => {
  if (activeTab.value === 'web') return webData.value?.update_gap_second
  if (activeTab.value === 'tv') return tvData.value?.update_gap_second
  return movieData.value?.update_gap_second
})

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

const heroRow = computed(() => rows.value[0] ?? null)
const listRows = computed(() => rows.value.slice(1, 12))

const metrics = computed(() => {
  if (activeTab.value === 'movie' && movieData.value) {
    return [
      { label: '实时总票房', value: `${movieData.value.box_office}${movieData.value.box_office_unit}`, note: movieData.value.updated },
      { label: '分账票房', value: `${movieData.value.split_box_office}${movieData.value.split_box_office_unit}`, note: movieData.value.show_count_desc },
      { label: '场均人次', value: movieRanking.value[0]?.avg_show_view || '--', note: movieData.value.view_count_desc },
    ]
  }

  if (activeTab.value === 'tv') {
    const top = tvRanking.value[0]
    return [
      { label: '最近更新', value: tvData.value?.updated || '--', note: `${activeRefreshGap.value ?? '--'} 秒刷新` },
      { label: '榜首市占', value: top?.market_rate_desc || '--', note: top?.channel_name || '等待同步' },
      { label: '榜首关注', value: top?.attention_rate_desc || '--', note: top ? formatRate(top.attention_rate) : '等待同步' },
    ]
  }

  const top = webRanking.value[0]
  return [
    { label: '最近更新', value: webData.value?.updated || '--', note: `${activeRefreshGap.value ?? '--'} 秒刷新` },
    { label: '榜首热度', value: top?.curr_heat_desc || '--', note: top ? formatCompact(top.curr_heat) : '等待同步' },
    { label: '头部平台', value: top?.platform_desc || '--', note: top?.release_info || '等待同步' },
  ]
})

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

  const [web, tv, movie] = await Promise.all([
    fetchRankingData<WebRankingData>('/v2/maoyan/realtime/web'),
    fetchRankingData<TvRankingData>('/v2/maoyan/realtime/tv'),
    fetchRankingData<MovieRankingData>('/v2/maoyan/realtime/movie'),
  ])

  if (web) webData.value = web
  if (tv) tvData.value = tv
  if (movie) movieData.value = movie

  errors.value = {
    web: web || webData.value ? null : '网剧热度榜暂时连接不上，可能是上游接口波动。',
    tv: tv || tvData.value ? null : '电视收视榜暂时连接不上，可能是上游接口波动。',
    movie: movie || movieData.value ? null : '电影票房榜暂时连接不上，可能是上游接口波动。',
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

      <nav ref="containerRef" class="switcher" aria-label="实时榜单分类" @wheel="handleTabStripWheel">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="switch-button"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <span>{{ tab.short }}</span>
          <strong>{{ tab.label }}</strong>
        </button>
      </nav>

      <section class="metric-grid" aria-label="关键指标">
        <div v-for="metric in metrics" :key="metric.label" class="metric-card">
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
          <small>{{ metric.note }}</small>
        </div>
      </section>

      <section v-if="loading" class="state-card">
        <span class="spinner"></span>
        <p>正在加载实时榜单...</p>
      </section>

      <section v-else-if="activeError && !heroRow" class="state-card">
        <strong>{{ activeConfig.label }}暂时不可用</strong>
        <p>{{ activeError }}</p>
        <button type="button" @click="fetchAll">重新加载</button>
      </section>

      <template v-else-if="heroRow">
        <section class="leader-card">
          <div class="leader-rank">#1</div>
          <div class="leader-copy">
            <span>{{ activeConfig.label }}</span>
            <h2>{{ heroRow.title }}</h2>
            <p>{{ heroRow.subtitle }}</p>
          </div>
          <div class="leader-score">
            <strong>{{ heroRow.metric }}</strong>
            <span>{{ heroRow.note }}</span>
          </div>
          <button type="button" class="leader-action" @click="openSearch(heroRow.searchName)">搜索播放源</button>
        </section>

        <section class="rank-list" aria-label="实时排行榜列表">
          <button v-for="row in listRows" :key="row.key" type="button" class="rank-row" @click="openSearch(row.searchName)">
            <span class="rank-number">{{ row.rank }}</span>
            <span class="rank-title">{{ row.title }}</span>
            <span class="rank-sub">{{ row.subtitle }}</span>
            <span class="rank-metric">{{ row.metric }}</span>
            <span class="rank-note">{{ row.note }}</span>
          </button>
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

.metric-card,
.leader-card,
.rank-list,
.state-card {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: var(--bg-surface);
}

.metric-card span,
.metric-card small {
  color: var(--text-tertiary);
  font-size: var(--text-xs);
}

.switcher {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--sp-2);
  padding: var(--sp-2);
  margin-bottom: var(--sp-4);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: var(--bg-surface);
  overflow-x: auto;
}

.switch-button {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  min-height: 58px;
  padding: var(--sp-3);
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  color: var(--text-secondary);
  text-align: left;
  transition: all var(--duration-fast) var(--ease-out);
}

.switch-button span {
  color: var(--c-accent-light);
  font-size: var(--text-xs);
}

.switch-button strong {
  color: inherit;
  font-size: var(--text-sm);
}

.switch-button:hover,
.switch-button.active {
  border-color: color-mix(in srgb, var(--c-accent) 28%, var(--border-hover));
  background: color-mix(in srgb, var(--c-accent) 12%, var(--bg-elevated));
  color: var(--text-primary);
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--sp-3);
  margin-bottom: var(--sp-5);
}

.metric-card {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding: var(--sp-4);
}

.metric-card strong {
  color: var(--text-primary);
  font-size: var(--text-2xl);
  line-height: var(--leading-tight);
}

.leader-card {
  display: grid;
  grid-template-columns: 80px minmax(0, 1fr) 220px auto;
  gap: var(--sp-4);
  align-items: center;
  padding: var(--sp-5);
  margin-bottom: var(--sp-4);
  background:
    radial-gradient(circle at 12% 10%, color-mix(in srgb, var(--c-accent) 20%, transparent), transparent 32%),
    var(--bg-surface);
}

.leader-rank {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-xl);
  background: var(--c-accent);
  color: white;
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
}

.leader-copy {
  min-width: 0;
}

.leader-copy span {
  color: var(--c-accent-light);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}

.leader-copy h2,
.leader-copy p {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.leader-copy h2 {
  margin-top: var(--sp-1);
  color: var(--text-primary);
  font-size: clamp(1.75rem, 4vw, 3rem);
  line-height: 1;
}

.leader-copy p {
  margin-top: var(--sp-2);
  color: var(--text-secondary);
}

.leader-score {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--sp-1);
}

.leader-score strong {
  color: var(--c-accent-light);
  font-size: var(--text-3xl);
  line-height: 1;
}

.leader-score span {
  color: var(--text-tertiary);
  font-size: var(--text-xs);
}

.leader-action,
.state-card button {
  padding: 10px 16px;
  border-radius: var(--radius-full);
  background: var(--c-accent);
  color: white;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.rank-list {
  overflow: hidden;
}

.rank-row {
  width: 100%;
  min-height: 58px;
  display: grid;
  grid-template-columns: 48px minmax(140px, 1fr) minmax(160px, 1.2fr) 110px 120px;
  gap: var(--sp-3);
  align-items: center;
  padding: 0 var(--sp-4);
  border-bottom: 1px solid var(--border-default);
  color: var(--text-secondary);
  text-align: left;
}

.rank-row:last-child {
  border-bottom: none;
}

.rank-row:hover {
  background: var(--bg-hover);
}

.rank-number,
.rank-metric {
  color: var(--c-accent-light);
  font-weight: var(--font-semibold);
}

.rank-title,
.rank-sub,
.rank-note {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-title {
  color: var(--text-primary);
  font-weight: var(--font-medium);
}

.rank-sub,
.rank-note {
  color: var(--text-tertiary);
  font-size: var(--text-xs);
}

.rank-note {
  justify-self: end;
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
  .metric-grid {
    grid-template-columns: 1fr;
  }

  .leader-card {
    grid-template-columns: 64px minmax(0, 1fr);
  }

  .leader-score,
  .leader-action {
    grid-column: 1 / -1;
    align-items: flex-start;
    justify-self: start;
  }

  .rank-row {
    grid-template-columns: 36px minmax(0, 1fr) 92px;
  }

  .rank-sub,
  .rank-note {
    display: none;
  }
}

@media (max-width: 620px) {
  .realtime-main {
    padding-top: var(--sp-4);
  }

  .switcher {
    display: flex;
    scrollbar-width: none;
  }

  .switcher::-webkit-scrollbar {
    display: none;
  }

  .switch-button {
    flex: 1 0 126px;
  }

  .leader-card {
    padding: var(--sp-4);
  }
}
</style>
