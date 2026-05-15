<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppFooter from '@/components/AppFooter.vue'
import TopBar from '@/components/TopBar.vue'
import CategoryTabs from '@/components/CategoryTabs.vue'
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

const activeConfig = computed(() => tabs.find(tab => tab.key === activeTab.value) ?? tabs[0])
const activeItems = computed(() => rankings.value[activeTab.value] ?? [])
const activeError = computed(() => errors.value[activeTab.value])
const heroItem = computed(() => activeItems.value[0] ?? null)

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

const categoryTabs = computed(() => {
  return tabs.map(tab => ({
    key: tab.key,
    label: tab.label,
    count: tabCounts.value[tab.key] || 0,
  }))
})

const formatRating = (value?: number) => {
  if (typeof value !== 'number') return '--'
  return value.toFixed(1)
}

const formatCount = (value?: number) => {
  if (typeof value !== 'number') return '--'
  return new Intl.NumberFormat('zh-CN', { notation: value > 9999 ? 'compact' : 'standard' }).format(value)
}

const coverSource = (item: DoubanWeeklyItem) => item.cover_proxy || item.cover

const subtitleParts = (subtitle: string) => {
  const [year, region, genre, director, ...castParts] = subtitle
    .split('/')
    .map(part => part.trim())
    .filter(Boolean)

  return {
    year,
    region,
    genre,
    director,
    cast: castParts.join(' / '),
  }
}

const subtitleFields = (subtitle: string) => {
  const parts = subtitleParts(subtitle)
  return [
    { label: '时间', value: parts.year },
    { label: '制片国家/地区', value: parts.region },
    { label: '类型', value: parts.genre },
    { label: '导演', value: parts.director },
    { label: '主演', value: parts.cast },
  ].filter(field => field.value)
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

const openDouban = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
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

      <CategoryTabs
        :tabs="categoryTabs"
        :active-tab="activeTab"
        aria-label="豆瓣周榜分类"
        @update:active-tab="activeTab = $event as DoubanWeeklyTab"
      />

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
        <section class="spotlight-list" :aria-label="`${activeConfig.label}列表`">
          <article v-for="item in activeItems" :key="item.id" class="spotlight">
            <button type="button" class="poster-card" @click="openSearch(item.title)">
              <img :src="coverSource(item)" :alt="item.title" />
            </button>

            <div class="spotlight-copy">
              <div class="headline-meta">
                <span class="meta-pill">#{{ item.rank }}</span>
              </div>
              <span class="corner-score">{{ formatRating(item.rating) }}</span>
              <h2>{{ item.title }}</h2>
              <div class="detail-grid" aria-label="条目信息">
                <span v-for="field in subtitleFields(item.card_subtitle)" :key="field.label">
                  <strong>{{ field.label }}</strong>
                  {{ field.value }}
                </span>
              </div>
              <p>{{ item.description || item.card_subtitle }}</p>
              <div class="rating-row">
                <span>{{ formatCount(item.rating_count) }} 人评价</span>
                <span>好评 {{ item.good_rate }}%</span>
                <span class="trend" :class="trendClass(item)">{{ trendText(item) }}</span>
                <span v-for="tag in item.tags.slice(0, 4)" :key="tag">{{ tag }}</span>
              </div>
              <div class="action-row">
                <button type="button" class="primary-action" @click="openSearch(item.title)">
                  <span class="play-icon" aria-hidden="true"></span>
                  播放
                </button>
                <button type="button" class="ghost-action" @click="openDouban(item.url)">豆瓣详情</button>
              </div>
            </div>
          </article>
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

.spotlight-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.spotlight {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  gap: var(--sp-4);
  align-items: stretch;
}

.poster-card {
  position: relative;
  overflow: hidden;
  min-height: 360px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-default);
  background: var(--bg-surface);
  box-shadow: 0 24px 70px -52px color-mix(in srgb, var(--c-accent) 72%, transparent);
}

.poster-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.headline-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  align-items: baseline;
  padding-right: 72px;
}

.meta-pill {
  align-self: flex-start;
  padding: 0;
  background: none;
  color: var(--c-accent);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  line-height: 1;
}

.corner-score {
  position: absolute;
  top: var(--sp-5);
  right: var(--sp-5);
  color: var(--c-accent);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  line-height: 1;
}

.spotlight-copy {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: var(--sp-3);
  padding: var(--sp-5) var(--sp-5) calc(var(--sp-5) + 48px);
  border: 1px solid #e4e4e7;
  border-radius: var(--radius-xl);
  background: #ffffff;
}

.spotlight-copy h2 {
  margin: 0;
  color: #18181b;
  font-size: clamp(1.75rem, 4vw, 3rem);
  line-height: 1.05;
}

.spotlight-copy p {
  margin: 0;
  color: #52525b;
  line-height: var(--leading-relaxed);
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-grid span {
  min-width: 0;
  padding: 0;
  color: #52525b;
  font-size: var(--text-sm);
  line-height: 1.45;
}

.detail-grid strong {
  display: inline;
  margin-right: 8px;
  color: #71717a;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.rating-row {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: var(--sp-2);
  overflow-x: auto;
  scrollbar-width: none;
}

.rating-row::-webkit-scrollbar {
  display: none;
}

.rating-row span {
  flex: 0 0 auto;
  padding: 6px 10px;
  border-radius: var(--radius-full);
  background: #f4f4f5;
  color: #52525b;
  font-size: var(--text-xs);
}

.action-row {
  position: absolute;
  right: var(--sp-5);
  bottom: var(--sp-5);
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  justify-content: flex-end;
}

.primary-action,
.state-card button {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 10px 16px;
  border-radius: var(--radius-full);
  background: var(--c-accent);
  color: white;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.play-icon {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 8px solid currentColor;
}

.ghost-action {
  width: fit-content;
  padding: 10px 16px;
  border: 1px solid #e4e4e7;
  border-radius: var(--radius-full);
  background: #ffffff;
  color: #18181b;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.primary-action:hover,
.ghost-action:hover {
  transform: translateY(-1px);
}

.trend {
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
  .spotlight {
    grid-template-columns: 1fr;
  }

  .poster-card {
    min-height: 320px;
  }
}

@media (max-width: 560px) {
  .weekly-main {
    padding-top: var(--sp-4);
  }

  .spotlight-copy {
    padding: var(--sp-4) var(--sp-4) calc(var(--sp-4) + 48px);
  }

  .action-row {
    right: var(--sp-4);
    bottom: var(--sp-4);
  }

  .corner-score {
    top: var(--sp-4);
    right: var(--sp-4);
  }

  .poster-card {
    min-height: 240px;
  }
}
</style>
