<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppFooter from '@/components/AppFooter.vue'
import TopBar from '@/components/TopBar.vue'
import { useHorizontalWheelScroll } from '@/composables/useHorizontalWheelScroll'
import type { DoubanWeeklyItem, DoubanWeeklyTab } from '@/types'
import { performSearch } from '@/utils/searchService'

interface ApiEnvelope<T> {
  data?: T
}

interface WeeklyTabConfig {
  key: DoubanWeeklyTab
  label: string
  short: string
  endpoint: string
}

const tabs: WeeklyTabConfig[] = [
  { key: 'movie', label: '全球电影', short: '电影', endpoint: '/v2/douban/weekly/movie' },
  { key: 'tv_chinese', label: '华语剧集', short: '华语剧', endpoint: '/v2/douban/weekly/tv_chinese' },
  { key: 'tv_global', label: '全球剧集', short: '全球剧', endpoint: '/v2/douban/weekly/tv_global' },
  { key: 'show_chinese', label: '华语综艺', short: '综艺', endpoint: '/v2/douban/weekly/show_chinese' },
  { key: 'show_global', label: '全球口碑综艺', short: '口碑综艺', endpoint: '/v2/douban/weekly/show_global' },
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

// @ts-expect-error containerRef 在模板中作为 ref 使用
const { containerRef, handleWheel: handleTabStripWheel } = useHorizontalWheelScroll()

const activeConfig = computed(() => tabs.find(tab => tab.key === activeTab.value) ?? tabs[0])
const activeItems = computed(() => rankings.value[activeTab.value] ?? [])
const activeError = computed(() => errors.value[activeTab.value])
const heroItem = computed(() => activeItems.value[0] ?? null)
const topThree = computed(() => activeItems.value.slice(0, 3))
const listItems = computed(() => activeItems.value.slice(3, 12))

const tabCounts = computed(() => {
  return tabs.reduce<Record<DoubanWeeklyTab, number>>((result, tab) => {
    result[tab.key] = rankings.value[tab.key]?.length ?? 0
    return result
  }, {
    movie: 0,
    tv_chinese: 0,
    tv_global: 0,
    show_chinese: 0,
    show_global: 0,
  })
})

const formatRating = (value?: number) => {
  if (typeof value !== 'number') return '--'
  return value.toFixed(1)
}

const formatCount = (value?: number) => {
  if (typeof value !== 'number') return '--'
  return new Intl.NumberFormat('zh-CN', { notation: value > 9999 ? 'compact' : 'standard' }).format(value)
}

const trendText = (item: DoubanWeeklyItem) => {
  if (item.trend === 'up') return `上升 ${Math.abs(item.rank_change)}`
  if (item.trend === 'down') return `下降 ${Math.abs(item.rank_change)}`
  return item.rank_change === 0 ? '持平' : `变化 ${Math.abs(item.rank_change)}`
}

const trendClass = (item: DoubanWeeklyItem) => {
  if (item.trend === 'up') return 'up'
  if (item.trend === 'down') return 'down'
  return 'flat'
}

const openSearch = (title: string) => {
  performSearch(title, 0)
}

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

  const nextRankings = { ...rankings.value }
  const nextErrors = { ...errors.value }

  responses.forEach(({ key, items, failed }) => {
    nextRankings[key] = items
    nextErrors[key] = failed ? '这一份周榜暂时连接不上，可能是上游接口波动。' : null
  })

  rankings.value = nextRankings
  errors.value = nextErrors
  loading.value = false
}

onMounted(() => {
  document.title = '豆瓣周榜 - 橘子导航'
  fetchAll()
})
</script>

<template>
  <div class="weekly-page">
    <TopBar />

    <main class="weekly-main">
      <header class="hero">
        <div class="hero-copy">
          <span class="eyebrow">Douban Weekly</span>
          <h1>豆瓣周榜</h1>
        </div>
      </header>

      <nav ref="containerRef" class="weekly-tabs" aria-label="豆瓣周榜分类" @wheel="handleTabStripWheel">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="tab-button"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <span>{{ tab.short }}</span>
          <strong>{{ tabCounts[tab.key] || '--' }}</strong>
        </button>
      </nav>

      <section v-if="loading" class="state-card">
        <span class="spinner"></span>
        <p>正在加载豆瓣周榜...</p>
      </section>

      <section v-else-if="activeError && !heroItem" class="state-card">
        <strong>{{ activeConfig.label }}暂时不可用</strong>
        <p>{{ activeError }}</p>
        <button type="button" @click="fetchAll">重新加载</button>
      </section>

      <template v-else-if="heroItem">
        <section class="spotlight">
          <button type="button" class="poster-card" @click="openSearch(heroItem.title)">
            <img :src="heroItem.cover_proxy || heroItem.cover" :alt="heroItem.title" />
            <span class="rank-mark">#1</span>
          </button>

          <div class="spotlight-copy">
            <span class="spotlight-kicker">{{ activeConfig.label }}榜首</span>
            <h2>{{ heroItem.title }}</h2>
            <p>{{ heroItem.description || heroItem.card_subtitle }}</p>
            <div class="rating-row">
              <strong>{{ formatRating(heroItem.rating) }}</strong>
              <span>{{ formatCount(heroItem.rating_count) }} 人评价</span>
              <span>好评 {{ heroItem.good_rate }}%</span>
            </div>
            <div class="tag-row">
              <span v-for="tag in heroItem.tags.slice(0, 4)" :key="tag">{{ tag }}</span>
            </div>
            <button type="button" class="primary-action" @click="openSearch(heroItem.title)">搜索播放源</button>
          </div>
        </section>

        <section class="top-grid" aria-label="前三名">
          <button v-for="item in topThree" :key="item.id" type="button" class="top-card" @click="openSearch(item.title)">
            <span class="top-rank">#{{ item.rank }}</span>
            <img :src="item.cover_proxy || item.cover" :alt="item.title" />
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.card_subtitle }}</p>
            </div>
          </button>
        </section>

        <section class="rank-table" aria-label="豆瓣周榜列表">
          <button v-for="item in listItems" :key="item.id" type="button" class="rank-row" @click="openSearch(item.title)">
            <span class="rank-number">{{ item.rank }}</span>
            <span class="rank-title">{{ item.title }}</span>
            <span class="rank-sub">{{ item.card_subtitle }}</span>
            <span class="rank-score">{{ formatRating(item.rating) }}</span>
            <span class="trend" :class="trendClass(item)">{{ trendText(item) }}</span>
          </button>
        </section>
      </template>

      <section v-else class="state-card">
        <strong>{{ activeConfig.label }}暂无数据</strong>
        <p>可以切换其他分类，或者稍后再试。</p>
        <button type="button" @click="fetchAll">再试一次</button>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.weekly-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.weekly-main {
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

.eyebrow,
.spotlight-kicker {
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

.weekly-tabs {
  display: flex;
  gap: var(--sp-2);
  padding: var(--sp-2);
  margin-bottom: var(--sp-5);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: var(--bg-surface);
  overflow-x: auto;
  scrollbar-width: none;
}

.weekly-tabs::-webkit-scrollbar {
  display: none;
}

.tab-button {
  flex: 1 0 132px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  min-height: 44px;
  padding: 0 var(--sp-3);
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  color: var(--text-secondary);
  transition: all var(--duration-fast) var(--ease-out);
}

.tab-button:hover,
.tab-button.active {
  border-color: color-mix(in srgb, var(--c-accent) 28%, var(--border-hover));
  background: color-mix(in srgb, var(--c-accent) 12%, var(--bg-elevated));
  color: var(--text-primary);
}

.tab-button strong {
  color: var(--c-accent-light);
  font-size: var(--text-xs);
}

.spotlight {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: var(--sp-6);
  align-items: stretch;
  margin-bottom: var(--sp-5);
}

.poster-card {
  position: relative;
  overflow: hidden;
  min-height: 420px;
  border-radius: var(--radius-xl);
  background: var(--bg-surface);
}

.poster-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rank-mark {
  position: absolute;
  top: var(--sp-3);
  left: var(--sp-3);
  padding: 5px 10px;
  border-radius: var(--radius-md);
  background: rgb(0 0 0 / 0.58);
  color: white;
  font-weight: var(--font-semibold);
}

.spotlight-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--sp-4);
  padding: var(--sp-6);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: var(--bg-surface);
}

.spotlight-copy h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: clamp(2rem, 5vw, 3.75rem);
  line-height: 1;
}

.spotlight-copy p {
  margin: 0;
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

.rating-row,
.tag-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sp-2);
}

.rating-row strong {
  color: var(--c-accent-light);
  font-size: var(--text-4xl);
  line-height: 1;
}

.rating-row span,
.tag-row span {
  padding: 6px 10px;
  border-radius: var(--radius-full);
  background: var(--bg-elevated);
  color: var(--text-secondary);
  font-size: var(--text-xs);
}

.primary-action,
.state-card button {
  width: fit-content;
  padding: 10px 16px;
  border-radius: var(--radius-full);
  background: var(--c-accent);
  color: white;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.top-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--sp-3);
  margin-bottom: var(--sp-5);
}

.top-card {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: var(--sp-3);
  align-items: center;
  padding: var(--sp-3);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: var(--bg-surface);
  text-align: left;
}

.top-card img {
  width: 72px;
  aspect-ratio: 2 / 3;
  border-radius: var(--radius-md);
  object-fit: cover;
}

.top-rank {
  grid-column: 1 / -1;
  color: var(--c-accent-light);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}

.top-card h3,
.top-card p {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.top-card h3 {
  color: var(--text-primary);
  font-size: var(--text-base);
}

.top-card p {
  margin-top: 3px;
  color: var(--text-tertiary);
  font-size: var(--text-xs);
}

.rank-table {
  overflow: hidden;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: var(--bg-surface);
}

.rank-row {
  width: 100%;
  display: grid;
  grid-template-columns: 48px minmax(120px, 1fr) minmax(180px, 1.4fr) 64px 86px;
  gap: var(--sp-3);
  align-items: center;
  min-height: 58px;
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
.rank-score {
  color: var(--c-accent-light);
  font-weight: var(--font-semibold);
}

.rank-title,
.rank-sub {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-title {
  color: var(--text-primary);
  font-weight: var(--font-medium);
}

.rank-sub {
  color: var(--text-tertiary);
  font-size: var(--text-xs);
}

.trend {
  justify-self: end;
  font-size: var(--text-xs);
}

.trend.up {
  color: #4ade80;
}

.trend.down {
  color: #f87171;
}

.trend.flat {
  color: var(--text-tertiary);
}

.state-card {
  display: flex;
  min-height: 320px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sp-3);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: var(--bg-surface);
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

@media (max-width: 900px) {
  .spotlight,
  .top-grid {
    grid-template-columns: 1fr;
  }

  .poster-card {
    min-height: 360px;
  }

  .rank-row {
    grid-template-columns: 36px minmax(0, 1fr) 54px;
  }

  .rank-sub,
  .trend {
    display: none;
  }
}

@media (max-width: 560px) {
  .weekly-main {
    padding-top: var(--sp-4);
  }

  .spotlight-copy {
    padding: var(--sp-4);
  }

  .poster-card {
    min-height: 280px;
  }
}
</style>
