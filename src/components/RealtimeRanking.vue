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
    <!-- 标题栏：与导航组件风格统一 -->
    <div class="section-header">
      <div class="header-left">
        <h2 class="section-title">实时排行榜</h2>
        <span class="header-badge">{{ activeConfig.badge }}</span>
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

    <!-- 加载中 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <span>正在加载实时榜单...</span>
    </div>

    <!-- 错误 -->
    <div v-else-if="activeError && !featuredCard" class="empty-state">
      <span class="empty-title">{{ activeConfig.emptyTitle }}</span>
      <span class="empty-desc">{{ activeError }}</span>
      <button type="button" class="retry-btn" @click="fetchAll">重新加载</button>
    </div>

    <!-- 榜单内容 -->
    <div v-else-if="featuredCard" class="ranking-body">
      <!-- 榜首卡片 -->
      <button type="button" class="featured-card" @click="handleClick(featuredCard.searchName)">
        <div class="featured-top">
          <span class="featured-rank">#1</span>
          <div class="featured-info">
            <h3 class="featured-title">{{ featuredCard.title }}</h3>
            <p class="featured-sub">{{ featuredCard.subtitle }}</p>
          </div>
          <div class="featured-score">
            <strong>{{ featuredCard.primaryValue }}</strong>
            <span>{{ featuredCard.primaryLabel }}</span>
          </div>
        </div>
        <div class="featured-bottom">
          <span class="featured-rate">{{ featuredCard.secondaryLabel }} {{ featuredCard.secondaryValue }}</span>
          <div class="featured-tags">
            <span v-for="tag in featuredCard.tags.slice(0, 2)" :key="tag" class="tag-pill">{{ tag }}</span>
          </div>
        </div>
      </button>

      <!-- 电影票房汇总 -->
      <div v-if="activeTab === 'movie' && activeMetrics.length" class="ranking-summary">
        <div v-for="metric in activeMetrics" :key="metric.label" class="summary-card">
          <span class="summary-label">{{ metric.label }}</span>
          <strong class="summary-value">{{ metric.value }}</strong>
          <span class="summary-note">{{ metric.note }}</span>
        </div>
      </div>

      <!-- 排名列表 -->
      <div class="ranking-list">
        <button
          v-for="item in listRows"
          :key="item.key"
          type="button"
          class="rank-row"
          @click="handleClick(item.searchName)"
        >
          <span class="rank-num" :class="{ 'top-3': item.rank <= 3 }">{{ item.rank }}</span>
          <div class="rank-info">
            <span class="rank-name">{{ item.title }}</span>
            <span class="rank-sub">{{ item.subtitle }}</span>
          </div>
          <div class="rank-right">
            <span class="rank-score">{{ item.score }}</span>
            <span class="rank-chip" :class="item.chipTone">{{ item.chip }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- 空数据 -->
    <div v-else class="empty-state">
      <span class="empty-title">{{ activeConfig.emptyTitle }}</span>
      <span class="empty-desc">可以先切换别的榜单看看</span>
      <button type="button" class="retry-btn" @click="fetchAll">再试一次</button>
    </div>
  </section>
</template>

<style scoped>
/* 外框：与导航组件统一 */
.realtime-section {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

/* 标题栏 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  border-bottom: 1px solid var(--border-default);
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-shrink: 0;
}

.section-title {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.header-badge {
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--c-accent) 14%, transparent);
  color: var(--c-accent-light);
  font-size: 10px;
  letter-spacing: 0.06em;
}

/* Tab 条 */
.tab-strip {
  display: flex;
  gap: 2px;
  overflow-x: auto;
  scrollbar-width: none;
}

.tab-strip::-webkit-scrollbar {
  display: none;
}

.tab-chip {
  flex: 0 0 auto;
  padding: 5px var(--sp-2);
  border-radius: var(--radius-md);
  border: none;
  outline: none;
  font: inherit;
  color: var(--text-tertiary);
  font-size: var(--text-xs);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.tab-chip:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.tab-chip.active {
  color: var(--text-primary);
  background: var(--bg-hover);
}

/* 加载 / 空状态 */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sp-3);
  min-height: 240px;
  padding: var(--sp-6);
  color: var(--text-tertiary);
  font-size: var(--text-sm);
  text-align: center;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-default);
  border-top-color: var(--c-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.empty-title {
  color: var(--text-secondary);
  font-weight: var(--font-medium);
}

.empty-desc {
  color: var(--text-tertiary);
  font-size: var(--text-xs);
}

.retry-btn {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-default);
  background: var(--bg-elevated);
  color: var(--text-secondary);
  font-size: var(--text-xs);
  font: inherit;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.retry-btn:hover {
  border-color: var(--border-hover);
  color: var(--text-primary);
}

/* 榜单内容 */
.ranking-body {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
}

/* 榜首卡片 */
.featured-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding: var(--sp-3);
  border-radius: var(--radius-lg);
  background: var(--bg-elevated);
  border: none;
  outline: none;
  font: inherit;
  cursor: pointer;
  text-align: left;
  transition: transform var(--duration-fast) var(--ease-out);
}

.featured-card:hover {
  transform: translateY(-2px);
}

.featured-top {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}

.featured-rank {
  padding: 3px 8px;
  border-radius: var(--radius-md);
  background: rgb(0 0 0 / 0.5);
  color: white;
  font-size: 11px;
  font-weight: var(--font-semibold);
  flex-shrink: 0;
}

.featured-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.featured-title {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.featured-sub {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.featured-score {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.featured-score strong {
  font-size: var(--text-xl);
  line-height: 1;
  color: var(--c-accent-light);
}

.featured-score span {
  font-size: 10px;
  color: var(--text-tertiary);
}

.featured-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
}

.featured-rate {
  font-size: 11px;
  color: var(--c-accent-light);
  font-weight: var(--font-medium);
}

.featured-tags {
  display: flex;
  gap: var(--sp-1);
}

.tag-pill {
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  background: var(--bg-hover);
  color: var(--text-tertiary);
  font-size: 10px;
}

/* 票房汇总 */
.ranking-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--sp-2);
}

.summary-card {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--sp-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
}

.summary-label {
  font-size: 10px;
  color: var(--text-tertiary);
}

.summary-value {
  font-size: var(--text-sm);
  color: var(--text-primary);
}

.summary-note {
  font-size: 10px;
  color: var(--c-accent-light);
}

/* 排名列表 */
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.rank-row {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-2) var(--sp-1);
  border-radius: var(--radius-md);
  border: none;
  outline: none;
  font: inherit;
  width: 100%;
  cursor: pointer;
  text-align: left;
  background: transparent;
  transition: background var(--duration-fast) var(--ease-out);
}

.rank-row:hover {
  background: var(--bg-hover);
}

.rank-num {
  width: 24px;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-tertiary);
  text-align: center;
  flex-shrink: 0;
}

.rank-num.top-3 {
  color: var(--c-accent);
}

.rank-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.rank-name {
  font-size: var(--text-sm);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-sub {
  font-size: 11px;
  color: var(--text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}

.rank-score {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--c-accent-light);
}

.rank-chip {
  font-size: 10px;
}

.rank-chip.accent {
  color: var(--c-accent-light);
}

.rank-chip.neutral {
  color: var(--text-tertiary);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .ranking-body {
    padding: var(--sp-3);
  }

  .ranking-summary {
    grid-template-columns: 1fr;
  }
}
</style>
