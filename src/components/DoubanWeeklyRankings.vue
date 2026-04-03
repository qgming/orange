<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { DoubanWeeklyItem, DoubanWeeklyTab } from '@/types'
import { useHorizontalWheelScroll } from '@/composables/useHorizontalWheelScroll'
import { performSearch } from '../utils/searchService'

interface ApiEnvelope<T> {
  data?: T
}

interface WeeklyTabConfig {
  key: DoubanWeeklyTab
  label: string
  eyebrow: string
  endpoint: string
}

const tabs: WeeklyTabConfig[] = [
  { key: 'movie', label: '全球电影', eyebrow: 'Movie', endpoint: '/v2/douban/weekly/movie' },
  { key: 'tv_chinese', label: '华语剧集', eyebrow: 'Chinese TV', endpoint: '/v2/douban/weekly/tv_chinese' },
  { key: 'tv_global', label: '全球剧集', eyebrow: 'Global TV', endpoint: '/v2/douban/weekly/tv_global' },
  { key: 'show_chinese', label: '华语综艺', eyebrow: 'Chinese Show', endpoint: '/v2/douban/weekly/show_chinese' },
  { key: 'show_global', label: '全球口碑综艺', eyebrow: 'Global Variety', endpoint: '/v2/douban/weekly/show_global' },
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

const activeTab = ref<DoubanWeeklyTab>('movie')
const loading = ref(true)
const rankings = ref<Record<DoubanWeeklyTab, DoubanWeeklyItem[]>>({
  movie: [],
  tv_chinese: [],
  tv_global: [],
  show_chinese: [],
  show_global: [],
})
const errors = ref<Record<DoubanWeeklyTab, string | null>>({
  movie: null,
  tv_chinese: null,
  tv_global: null,
  show_chinese: null,
  show_global: null,
})

let currentHostIndex = 0

const activeConfig = computed(() => tabs.find(tab => tab.key === activeTab.value) ?? tabs[0])
const activeItems = computed(() => rankings.value[activeTab.value] ?? [])
const activeError = computed(() => errors.value[activeTab.value])
const featuredItem = computed(() => activeItems.value[0] ?? null)
const listItems = computed(() => activeItems.value.slice(1, 6))

const formatRating = (value: number) => value.toFixed(1)
const formatCount = (value: number) => new Intl.NumberFormat('zh-CN').format(value)

const getTrendLabel = (trend: string, change: number) => {
  if (trend === 'up') return `上升 ${Math.abs(change)}`
  if (trend === 'down') return `下降 ${Math.abs(change)}`
  return change === 0 ? '持平' : `变化 ${Math.abs(change)}`
}

const getTrendClass = (trend: string) => {
  if (trend === 'up') return 'trend-up'
  if (trend === 'down') return 'trend-down'
  return 'trend-flat'
}

// @ts-expect-error containerRef 在模板中作为 ref 使用
const { containerRef, handleWheel: handleTabStripWheel } = useHorizontalWheelScroll()

const handleClick = (name: string) => {
  performSearch(name, 0)
}

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

const fetchAll = async () => {
  loading.value = true

  const responses = await Promise.all(
    tabs.map(async (tab) => {
      const result = await fetchApiData<ApiEnvelope<DoubanWeeklyItem[]>>(tab.endpoint)
      return {
        key: tab.key,
        items: result?.data ?? [],
        failed: !result,
      }
    })
  )

  const nextState: Record<DoubanWeeklyTab, DoubanWeeklyItem[]> = {
    movie: [],
    tv_chinese: [],
    tv_global: [],
    show_chinese: [],
    show_global: [],
  }

  const nextErrors: Record<DoubanWeeklyTab, string | null> = {
    movie: null,
    tv_chinese: null,
    tv_global: null,
    show_chinese: null,
    show_global: null,
  }

  responses.forEach(({ key, items, failed }) => {
    nextState[key] = items
    if (failed) {
      nextErrors[key] = '这一份周榜暂时连接不上，可能是上游接口波动。'
    }
  })

  rankings.value = nextState
  errors.value = nextErrors
  loading.value = false
}

onMounted(fetchAll)
</script>

<template>
  <section class="douban-section">
    <!-- 标题栏：与导航组件风格统一 -->
    <div class="section-header">
      <div class="header-left">
        <h2 class="section-title">豆瓣排行榜</h2>
        <span class="header-badge">周更</span>
      </div>
      <div ref="containerRef" class="tab-strip" @wheel="handleTabStripWheel">
        <button v-for="tab in tabs" :key="tab.key" class="tab-chip" :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key">
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <span>正在加载周榜...</span>
    </div>

    <!-- 错误 -->
    <div v-else-if="activeError" class="empty-state">
      <span class="empty-title">{{ activeConfig.label }}暂时不可用</span>
      <span class="empty-desc">{{ activeError }}</span>
      <button class="retry-btn" @click="fetchAll">重新加载</button>
    </div>

    <!-- 榜单内容 -->
    <div v-else-if="featuredItem" class="ranking-body">
      <!-- 榜首卡片 -->
      <button type="button" class="featured-card" @click="handleClick(featuredItem.title)">
        <div class="featured-cover-wrap">
          <img :src="featuredItem.cover_proxy || featuredItem.cover" :alt="featuredItem.title" class="featured-cover"
            loading="lazy" />
          <div class="featured-overlay"></div>
          <span class="featured-rank">#1</span>
          <div class="featured-score-overlay">
            <strong>{{ formatRating(featuredItem.rating) }}</strong>
            <span>{{ formatCount(featuredItem.rating_count) }}人评</span>
          </div>
        </div>
        <div class="featured-info">
          <h3 class="featured-title">{{ featuredItem.title }}</h3>
          <p class="featured-sub">{{ featuredItem.card_subtitle }}</p>
          <div class="featured-bottom">
            <span class="featured-rate">好评 {{ featuredItem.good_rate }}%</span>
            <div class="featured-tags">
              <span v-for="tag in featuredItem.tags.slice(0, 2)" :key="tag" class="tag-pill">{{ tag }}</span>
            </div>
          </div>
        </div>
      </button>

      <!-- 排名列表 -->
      <div class="ranking-list">
        <button v-for="item in listItems" :key="item.id" type="button"
          class="rank-row" @click="handleClick(item.title)">
          <span class="rank-num" :class="{ 'top-3': item.rank <= 3 }">{{ item.rank }}</span>
          <div class="rank-info">
            <span class="rank-name">{{ item.title }}</span>
            <span class="rank-sub">{{ item.card_subtitle }}</span>
          </div>
          <div class="rank-right">
            <span class="rank-score">{{ formatRating(item.rating) }}</span>
            <span class="rank-trend" :class="getTrendClass(item.trend)">{{ getTrendLabel(item.trend, item.rank_change) }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- 空数据 -->
    <div v-else class="empty-state">
      <span class="empty-title">{{ activeConfig.label }}暂无数据</span>
      <span class="empty-desc">可以先切换别的榜单看看</span>
      <button class="retry-btn" @click="fetchAll">再试一次</button>
    </div>
  </section>
</template>

<style scoped>
/* 外框：与导航组件统一 */
.douban-section {
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
  color: var(--text-tertiary);
  font-size: var(--text-xs);
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
  display: block;
  width: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-elevated);
  border: none;
  outline: none;
  font: inherit;
  padding: 0;
  cursor: pointer;
  text-align: left;
  transition: transform var(--duration-fast) var(--ease-out);
}

.featured-card:hover {
  transform: translateY(-2px);
}

.featured-cover-wrap {
  position: relative;
  overflow: hidden;
}

.featured-cover {
  display: block;
  width: 100%;
  height: auto;
}

.featured-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgb(0 0 0 / 0.75));
}

.featured-rank {
  position: absolute;
  top: var(--sp-2);
  left: var(--sp-2);
  padding: 3px 8px;
  border-radius: var(--radius-md);
  background: rgb(0 0 0 / 0.5);
  color: white;
  font-size: 11px;
  font-weight: var(--font-semibold);
}

.featured-score-overlay {
  position: absolute;
  right: var(--sp-2);
  bottom: var(--sp-2);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: white;
}

.featured-score-overlay strong {
  font-size: var(--text-xl);
  line-height: 1;
}

.featured-score-overlay span {
  font-size: 10px;
  opacity: 0.8;
}

.featured-info {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  padding: var(--sp-3);
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

.featured-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  margin-top: var(--sp-1);
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

.rank-trend {
  font-size: 10px;
}

.rank-trend.trend-up {
  color: #4ade80;
}

.rank-trend.trend-down {
  color: #f87171;
}

.rank-trend.trend-flat {
  color: var(--text-tertiary);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .ranking-body {
    padding: var(--sp-3);
  }
}
</style>
