<script setup lang="ts">
/**
 * RealtimeRanking - 实时排行榜
 * 统一为与豆瓣周榜一致的卡片化榜单结构
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'
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
import { performSearch } from '../utils/searchService'

interface ApiEnvelope<T> {
  data?: T
}

interface RealtimeTabConfig {
  key: RankingTab
  label: string
  eyebrow: string
  badge: string
  emptyTitle: string
}

interface RankingMetric {
  label: string
  value: string
  note: string
}

interface FeaturedCard {
  searchName: string
  title: string
  subtitle: string
  primaryLabel: string
  primaryValue: string
  secondaryLabel: string
  secondaryValue: string
  metaLeft: string
  metaRight: string
  tags: string[]
}

interface RankingRow {
  key: string
  rank: number
  searchName: string
  title: string
  subtitle: string
  score: string
  footer: string
  chip: string
  chipTone: 'accent' | 'neutral'
}

const tabConfigs: RealtimeTabConfig[] = [
  {
    key: 'web',
    label: '网剧热度榜',
    eyebrow: 'Streaming Heat',
    badge: '实时热播',
    emptyTitle: '网剧热度榜暂时不可用',
  },
  {
    key: 'tv',
    label: '电视收视榜',
    eyebrow: 'TV Audience',
    badge: '同步收视',
    emptyTitle: '电视收视榜暂时不可用',
  },
  {
    key: 'movie',
    label: '电影票房榜',
    eyebrow: 'Box Office',
    badge: '票房实时',
    emptyTitle: '电影票房榜暂时不可用',
  },
]

const webData = ref<WebRankingData | null>(null)
const tvData = ref<TvRankingData | null>(null)
const movieData = ref<MovieRankingData | null>(null)
const loading = ref(true)
const activeTab = ref<RankingTab>('web')
const errorMessages = ref<Record<RankingTab, string | null>>({
  web: null,
  tv: null,
  movie: null,
})
let refreshInterval: number | null = null

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

let currentHostIndex = 0

const webRanking = computed<WebRankingItem[]>(() => webData.value?.list ?? [])
const tvRanking = computed<TvRankingItem[]>(() => tvData.value?.list ?? [])
const movieRanking = computed<MovieRankingItem[]>(() => movieData.value?.list ?? [])

const activeConfig = computed(() => tabConfigs.find((tab) => tab.key === activeTab.value) ?? tabConfigs[0])
const activeError = computed(() => errorMessages.value[activeTab.value])

const formatCompactNumber = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '--'
  }

  return new Intl.NumberFormat('zh-CN', {
    notation: value >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 100 ? 0 : 1,
  }).format(value)
}

const formatRate = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '--'
  }

  return `${value.toFixed(2)}%`
}

const activeMetrics = computed<RankingMetric[]>(() => {
  if (activeTab.value === 'web' && webData.value) {
    const topItem = webRanking.value[0]
    return [
      {
        label: '最近更新',
        value: webData.value.updated || '--',
        note: `约 ${webData.value.update_gap_second} 秒刷新`,
      },
      {
        label: '榜首热度',
        value: topItem?.curr_heat_desc || '--',
        note: topItem ? `实时热度 ${formatCompactNumber(topItem.curr_heat)}` : '等待同步',
      },
      {
        label: '头部平台',
        value: topItem?.platform_desc || '--',
        note: topItem?.release_info || '等待同步',
      },
    ]
  }

  if (activeTab.value === 'tv' && tvData.value) {
    const topItem = tvRanking.value[0]
    return [
      {
        label: '最近更新',
        value: tvData.value.updated || '--',
        note: `约 ${tvData.value.update_gap_second} 秒刷新`,
      },
      {
        label: '榜首市占率',
        value: topItem?.market_rate_desc || '--',
        note: topItem ? `原始值 ${formatRate(topItem.market_rate)}` : '等待同步',
      },
      {
        label: '榜首关注度',
        value: topItem?.attention_rate_desc || '--',
        note: topItem?.channel_name || '等待同步',
      },
    ]
  }

  if (movieData.value) {
    return [
      {
        label: '实时总票房',
        value: `${movieData.value.box_office}${movieData.value.box_office_unit}`,
        note: movieData.value.updated || '--',
      },
      {
        label: '分账票房',
        value: `${movieData.value.split_box_office}${movieData.value.split_box_office_unit}`,
        note: movieData.value.show_count_desc || '等待同步',
      },
      {
        label: '场均人次',
        value: movieRanking.value[0]?.avg_show_view || '--',
        note: movieData.value.view_count_desc || '等待同步',
      },
    ]
  }

  return []
})

const featuredCard = computed<FeaturedCard | null>(() => {
  if (activeTab.value === 'web') {
    const item = webRanking.value[0]
    if (!item || !webData.value) return null

    return {
      searchName: item.series_name,
      title: item.series_name,
      subtitle: item.release_info || item.platform_desc || '实时热度持续刷新中',
      primaryLabel: '当前热度',
      primaryValue: item.curr_heat_desc || '--',
      secondaryLabel: '热度指数',
      secondaryValue: formatCompactNumber(item.bar_value),
      metaLeft: `平台 ${item.platform_desc || '--'}`,
      metaRight: `更新于 ${webData.value.updated || '--'}`,
      tags: [
        `${webData.value.update_gap_second} 秒刷新`,
        `实时热度 ${formatCompactNumber(item.curr_heat)}`,
        item.release_info || '热播中',
      ],
    }
  }

  if (activeTab.value === 'tv') {
    const item = tvRanking.value[0]
    if (!item || !tvData.value) return null

    return {
      searchName: item.programme_name,
      title: item.programme_name,
      subtitle: item.channel_name || '电视收视实时同步中',
      primaryLabel: '市场占比',
      primaryValue: item.market_rate_desc || '--',
      secondaryLabel: '关注度',
      secondaryValue: item.attention_rate_desc || '--',
      metaLeft: `频道 ${item.channel_name || '--'}`,
      metaRight: `更新于 ${tvData.value.updated || '--'}`,
      tags: [
        `${tvData.value.update_gap_second} 秒刷新`,
        `原始收视 ${formatRate(item.market_rate)}`,
        `原始关注 ${formatRate(item.attention_rate)}`,
      ],
    }
  }

  const item = movieRanking.value[0]
  if (!item || !movieData.value) return null

  return {
    searchName: item.movie_name,
    title: item.movie_name,
    subtitle: item.release_info || '电影票房实时同步中',
    primaryLabel: '实时票房',
    primaryValue: item.box_office_desc || '--',
    secondaryLabel: '票房占比',
    secondaryValue: item.box_office_rate || '--',
    metaLeft: item.split_box_office_desc || '分账票房待同步',
    metaRight: `更新于 ${movieData.value.updated || '--'}`,
    tags: [
      `${movieData.value.update_gap_second} 秒刷新`,
      item.sum_box_desc || '累计票房待同步',
      `场均人次 ${item.avg_show_view || '--'}`,
    ],
  }
})

// @ts-expect-error containerRef 在模板中作为 ref 使用
const { containerRef, handleWheel: handleTabStripWheel } = useHorizontalWheelScroll()

const listRows = computed<RankingRow[]>(() => {
  if (activeTab.value === 'web') {
    return webRanking.value.slice(1, 10).map((item, index) => ({
      key: String(item.series_id),
      rank: index + 2,
      searchName: item.series_name,
      title: item.series_name,
      subtitle: item.release_info || '网剧热度实时追踪中',
      score: item.curr_heat_desc || '--',
      footer: item.platform_desc || '--',
      chip: `指数 ${formatCompactNumber(item.bar_value)}`,
      chipTone: 'accent',
    }))
  }

  if (activeTab.value === 'tv') {
    return tvRanking.value.slice(1, 10).map((item, index) => ({
      key: `${item.programme_name}-${index}`,
      rank: index + 2,
      searchName: item.programme_name,
      title: item.programme_name,
      subtitle: item.channel_name || '频道信息暂缺',
      score: item.market_rate_desc || '--',
      footer: `关注度 ${item.attention_rate_desc || '--'}`,
      chip: `收视 ${formatRate(item.market_rate)}`,
      chipTone: 'neutral',
    }))
  }

  return movieRanking.value.slice(1, 10).map((item, index) => ({
    key: String(item.movie_id),
    rank: index + 2,
    searchName: item.movie_name,
    title: item.movie_name,
    subtitle: item.release_info || '电影票房实时追踪中',
    score: item.box_office_desc || '--',
    footer: item.split_box_office_desc || '分账票房待同步',
    chip: item.box_office_rate || '--',
    chipTone: 'accent',
  }))
})

const fetchApiData = async <T>(endpoint: string): Promise<T | null> => {
  for (let i = 0; i < apiHosts.length; i++) {
    try {
      const host = apiHosts[(currentHostIndex + i) % apiHosts.length]
      const response = await fetch(`${host}${endpoint}`, {
        signal: AbortSignal.timeout(5000),
      })

      if (!response.ok) {
        continue
      }

      const result = (await response.json()) as T
      currentHostIndex = (currentHostIndex + i) % apiHosts.length
      return result
    } catch {
      continue
    }
  }

  return null
}

const fetchRankingData = async <T>(endpoint: string): Promise<T | null> => {
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

  errorMessages.value = {
    web: web || webData.value ? null : '这一份实时榜暂时连接不上，可能是上游接口波动。',
    tv: tv || tvData.value ? null : '这一份实时榜暂时连接不上，可能是上游接口波动。',
    movie: movie || movieData.value ? null : '这一份实时榜暂时连接不上，可能是上游接口波动。',
  }

  loading.value = false
}

const setActiveTab = (tab: RankingTab) => {
  activeTab.value = tab
}

const handleClick = (name: string) => {
  performSearch(name, 0)
}

onMounted(() => {
  fetchAll()
  refreshInterval = setInterval(fetchAll, 5 * 60 * 1000) as unknown as number
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>

<template>
  <section class="realtime-section">
    <div class="section-header">
      <div class="title-stack">
        <span class="section-kicker">{{ activeConfig.eyebrow }}</span>
        <div class="title-row">
          <h2 class="section-title">实时排行榜</h2>
          <span class="weekly-badge">{{ activeConfig.badge }}</span>
        </div>
      </div>

      <div ref="containerRef" class="tab-strip" @wheel="handleTabStripWheel">
        <button
          v-for="tab in tabConfigs"
          :key="tab.key"
          type="button"
          class="tab-chip"
          :class="{ active: activeTab === tab.key }"
          @click="setActiveTab(tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <div class="state-copy">
        <strong>实时榜单加载中</strong>
        <span>正在同步最新热度、收视和票房数据。</span>
      </div>
    </div>

    <div v-else-if="activeError && !featuredCard" class="empty-state error-state">
      <div class="state-copy">
        <strong>{{ activeConfig.emptyTitle }}</strong>
        <span>{{ activeError }}</span>
        <span>你可以先切到别的榜单，或者稍后重新刷新。</span>
      </div>
      <button type="button" class="retry-btn" @click="fetchAll">重新加载</button>
    </div>

    <div v-else-if="featuredCard" class="ranking-shell">
      <button type="button" class="featured-card" @click="handleClick(featuredCard.searchName)">
        <div class="featured-topline">
          <div class="featured-rank">#1</div>
          <span class="featured-status">{{ activeConfig.label }}</span>
        </div>

        <h3 class="featured-title">{{ featuredCard.title }}</h3>

        <div class="featured-main">
          <p class="featured-subtitle">{{ featuredCard.subtitle }}</p>

          <div class="featured-score">
            <span>{{ featuredCard.primaryLabel }}</span>
            <strong>{{ featuredCard.primaryValue }}</strong>
            <em>{{ featuredCard.secondaryLabel }} {{ featuredCard.secondaryValue }}</em>
          </div>
        </div>

        <div class="featured-meta-row">
          <span class="good-rate">{{ featuredCard.metaLeft }}</span>
          <span class="rating-count">{{ featuredCard.metaRight }}</span>
        </div>

        <div class="featured-tags">
          <span v-for="tag in featuredCard.tags" :key="tag" class="tag-pill">{{ tag }}</span>
        </div>
      </button>

      <div v-if="activeTab === 'movie' && activeMetrics.length" class="ranking-summary">
        <div v-for="metric in activeMetrics" :key="metric.label" class="summary-card">
          <span class="summary-label">{{ metric.label }}</span>
          <strong class="summary-value">{{ metric.value }}</strong>
          <span class="summary-note">{{ metric.note }}</span>
        </div>
      </div>

      <div class="ranking-list">
        <button
          v-for="item in listRows"
          :key="item.key"
          type="button"
          class="rank-row"
          @click="handleClick(item.searchName)"
        >
          <div class="row-rank">{{ item.rank }}</div>
          <div class="row-main">
            <div class="row-title-line">
              <h3 class="row-title">{{ item.title }}</h3>
              <span class="row-score">{{ item.score }}</span>
            </div>
            <p class="row-subtitle">{{ item.subtitle }}</p>
            <div class="row-footer">
              <span class="row-count">{{ item.footer }}</span>
              <span class="trend-chip" :class="item.chipTone">{{ item.chip }}</span>
            </div>
          </div>
        </button>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="state-copy">
        <strong>{{ activeConfig.emptyTitle }}</strong>
        <span>接口已经连通，但这份榜单此刻没有返回条目。</span>
        <span>可以先切换别的榜单看看，或者稍后再回来刷新。</span>
      </div>
      <button type="button" class="retry-btn" @click="fetchAll">再试一次</button>
    </div>
  </section>
</template>

<style scoped>
.realtime-section {
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--c-accent) 14%, transparent), transparent 42%),
    linear-gradient(180deg, color-mix(in srgb, var(--bg-elevated) 80%, transparent), var(--bg-surface));
  border: 1px solid color-mix(in srgb, var(--c-accent) 22%, var(--border-default));
  border-radius: var(--radius-xl);
  overflow: hidden;
  position: relative;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  padding: var(--sp-4) var(--sp-5);
  border-bottom: 1px solid var(--border-default);
  background: linear-gradient(180deg, color-mix(in srgb, var(--bg-elevated) 88%, transparent), transparent);
}

.title-stack {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.section-kicker {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--c-accent-light);
}

.title-row {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-wrap: wrap;
}

.section-title {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.weekly-badge {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--c-accent) 16%, transparent);
  color: var(--c-accent-light);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tab-strip {
  display: flex;
  gap: var(--sp-2);
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}

.tab-strip::-webkit-scrollbar {
  display: none;
}

.tab-chip,
.retry-btn,
.featured-card,
.rank-row {
  border: none;
  outline: none;
  font: inherit;
}

.tab-chip {
  flex: 0 0 auto;
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--bg-elevated) 85%, transparent);
  color: var(--text-secondary);
  font-size: var(--text-xs);
  cursor: pointer;
  transition:
    transform var(--duration-fast) var(--ease-out),
    background var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out);
}

.tab-chip:hover {
  transform: translateY(-1px);
  color: var(--text-primary);
}

.tab-chip.active {
  background: linear-gradient(135deg, color-mix(in srgb, var(--c-accent) 85%, transparent), color-mix(in srgb, var(--c-accent-light) 70%, transparent));
  color: white;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sp-4);
  min-height: 320px;
  padding: var(--sp-6);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  text-align: center;
}

.state-copy {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  max-width: 360px;
}

.state-copy strong {
  color: var(--text-primary);
  font-size: var(--text-base);
}

.error-state .state-copy strong {
  color: #fca5a5;
}

.retry-btn {
  padding: 10px 16px;
  border-radius: var(--radius-full);
  border: 1px solid color-mix(in srgb, var(--c-accent) 24%, var(--border-default));
  background: color-mix(in srgb, var(--bg-elevated) 84%, transparent);
  color: var(--text-primary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition:
    transform var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out),
    background var(--duration-fast) var(--ease-out);
}

.retry-btn:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--c-accent) 46%, var(--border-hover));
  background: color-mix(in srgb, var(--bg-hover) 92%, transparent);
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-default);
  border-top-color: var(--c-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.ranking-shell {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  padding: var(--sp-4);
}

.featured-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding: var(--sp-3);
  border-radius: calc(var(--radius-xl) - 4px);
  border: 1px solid color-mix(in srgb, var(--c-accent) 18%, var(--border-default));
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--c-accent) 18%, transparent), transparent 38%),
    color-mix(in srgb, var(--bg-elevated) 88%, transparent);
  cursor: pointer;
  text-align: left;
  transition:
    transform var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.featured-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--c-accent) 34%, var(--border-hover));
  box-shadow: 0 18px 30px -22px rgb(0 0 0 / 0.7);
}

.featured-topline,
.featured-meta-row,
.row-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  flex-wrap: wrap;
}

.featured-rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 32px;
  padding: 0 12px;
  border-radius: var(--radius-full);
  background: rgb(15 23 42 / 0.72);
  color: white;
  font-size: 12px;
  letter-spacing: 0.12em;
}

.featured-status {
  color: var(--text-tertiary);
  font-size: var(--text-xs);
}

.featured-main {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--sp-3);
}

.featured-title,
.row-title {
  margin: 0;
  color: var(--text-primary);
}

.featured-title {
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  line-height: 1.2;
}

.featured-subtitle,
.row-subtitle {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 1.65;
}

.featured-subtitle,
.row-subtitle {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.featured-subtitle {
  line-clamp: 1;
  -webkit-line-clamp: 1;
}

.row-subtitle {
  line-clamp: 1;
  -webkit-line-clamp: 1;
}

.featured-score {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  text-align: right;
}

.featured-score span {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-tertiary);
}

.featured-score strong {
  font-size: clamp(1.4rem, 3vw, 2rem);
  line-height: 1;
  color: var(--c-accent-light);
}

.featured-score em {
  font-style: normal;
  color: var(--text-secondary);
  font-size: var(--text-xs);
}

.good-rate,
.row-score {
  color: var(--c-accent-light);
  font-weight: var(--font-semibold);
}

.rating-count,
.row-count {
  color: var(--text-tertiary);
  font-size: var(--text-xs);
}

.featured-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.tag-pill,
.trend-chip {
  display: inline-flex;
  align-items: center;
  padding: 5px 9px;
  border-radius: var(--radius-full);
  font-size: 11px;
}

.tag-pill {
  background: color-mix(in srgb, var(--bg-hover) 82%, transparent);
  color: var(--text-secondary);
}

.ranking-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--sp-3);
}

.summary-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--sp-3);
  border: 1px solid color-mix(in srgb, var(--c-accent) 10%, var(--border-default));
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--bg-elevated) 84%, transparent);
}

.summary-label {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.summary-value {
  font-size: var(--text-base);
  color: var(--text-primary);
}

.summary-note {
  font-size: var(--text-xs);
  color: var(--c-accent-light);
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.rank-row {
  width: 100%;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: var(--sp-3);
  align-items: start;
  padding: var(--sp-3);
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--bg-elevated) 78%, transparent);
  border: 1px solid transparent;
  cursor: pointer;
  text-align: left;
  transition:
    transform var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out),
    background var(--duration-fast) var(--ease-out);
}

.rank-row:hover {
  transform: translateX(2px);
  border-color: color-mix(in srgb, var(--c-accent) 20%, var(--border-hover));
  background: color-mix(in srgb, var(--bg-hover) 92%, transparent);
}

.row-rank {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--c-accent) 18%, transparent), color-mix(in srgb, var(--bg-hover) 82%, transparent));
  color: var(--text-primary);
  font-weight: var(--font-semibold);
}

.row-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.row-title-line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--sp-2);
}

.row-title {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trend-chip.accent {
  background: color-mix(in srgb, var(--c-accent) 14%, transparent);
  color: var(--c-accent-light);
}

.trend-chip.neutral {
  background: rgb(148 163 184 / 0.14);
  color: #cbd5e1;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .section-header,
  .ranking-shell {
    padding-left: var(--sp-4);
    padding-right: var(--sp-4);
  }

  .featured-main {
    grid-template-columns: 1fr;
  }

  .featured-score {
    align-items: flex-start;
    text-align: left;
  }

  .ranking-summary {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .section-header {
    padding-top: var(--sp-4);
    padding-bottom: var(--sp-4);
  }

  .ranking-shell {
    gap: var(--sp-2);
  }

  .featured-card,
  .rank-row {
    padding: var(--sp-3);
  }

  .row-title-line,
  .row-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
