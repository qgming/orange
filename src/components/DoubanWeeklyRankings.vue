<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { DoubanWeeklyItem, DoubanWeeklyTab } from '@/types'
import { useHorizontalWheelScroll } from '@/composables/useHorizontalWheelScroll'

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

const { containerRef: tabStripRef, handleWheel: handleTabStripWheel } = useHorizontalWheelScroll()

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
    <div class="section-header">
      <div class="title-stack">
        <span class="section-kicker">Curated Weekly</span>
        <div class="title-row">
          <h2 class="section-title">豆瓣排行榜</h2>
          <span class="weekly-badge">周更</span>
        </div>
      </div>
      <div ref="tabStripRef" class="tab-strip" @wheel="handleTabStripWheel">
        <button v-for="tab in tabs" :key="tab.key" class="tab-chip" :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key">
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <div class="state-copy">
        <strong>豆瓣周榜加载中</strong>
        <span>正在同步本周片单、剧集和综艺口碑。</span>
      </div>
    </div>

    <div v-else-if="activeError" class="empty-state error-state">
      <div class="state-copy">
        <strong>{{ activeConfig.label }}暂时不可用</strong>
        <span>{{ activeError }}</span>
        <span>你可以先切到别的榜单，或者稍后重新刷新。</span>
      </div>
      <button class="retry-btn" @click="fetchAll">重新加载</button>
    </div>

    <div v-else-if="featuredItem" class="ranking-shell">
      <a :href="featuredItem.url" target="_blank" rel="noopener noreferrer" class="featured-card">
        <div class="featured-cover-wrap">
          <img :src="featuredItem.cover_proxy || featuredItem.cover" :alt="featuredItem.title" class="featured-cover"
            loading="lazy" />
          <div class="featured-overlay"></div>
          <div class="featured-rank">#{{ featuredItem.rank }}</div>
          <div class="featured-score">
            <strong>{{ formatRating(featuredItem.rating) }}</strong>
            <span>{{ activeConfig.eyebrow }}</span>
          </div>
        </div>
        <div class="featured-body">
          <div class="featured-meta-row">
            <span class="good-rate">好评 {{ featuredItem.good_rate }}%</span>
            <span class="rating-count">{{ formatCount(featuredItem.rating_count) }} 人评价</span>
          </div>
          <h3 class="featured-title">{{ featuredItem.title }}</h3>
          <p class="featured-subtitle">{{ featuredItem.card_subtitle }}</p>
          <p class="featured-desc">{{ featuredItem.description }}</p>
          <div class="featured-tags">
            <span v-for="tag in featuredItem.tags.slice(0, 2)" :key="tag" class="tag-pill">{{ tag }}</span>
          </div>
        </div>
      </a>

      <div class="ranking-list">
        <a v-for="item in listItems" :key="item.id" :href="item.url" target="_blank" rel="noopener noreferrer"
          class="rank-row">
          <div class="row-rank">{{ item.rank }}</div>
          <div class="row-main">
            <div class="row-title-line">
              <h3 class="row-title">{{ item.title }}</h3>
              <span class="row-score">{{ formatRating(item.rating) }}</span>
            </div>
            <p class="row-subtitle">{{ item.card_subtitle }}</p>
            <div class="row-footer">
              <span class="row-count">{{ formatCount(item.rating_count) }} 人</span>
              <span class="trend-chip" :class="getTrendClass(item.trend)">{{ getTrendLabel(item.trend, item.rank_change)
                }}</span>
            </div>
          </div>
        </a>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="state-copy">
        <strong>{{ activeConfig.label }}本周暂时还没有同步</strong>
        <span>接口已经连通，但这份榜单此刻没有返回条目。</span>
        <span>可以先切换别的榜单看看，或者稍后再回来刷新。</span>
      </div>
      <button class="retry-btn" @click="fetchAll">再试一次</button>
    </div>
  </section>
</template>

<style scoped>
.douban-section {
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

.tab-chip {
  flex: 0 0 auto;
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--bg-elevated) 85%, transparent);
  color: var(--text-secondary);
  font-size: var(--text-xs);
  transition: transform var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out);
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
  max-width: 340px;
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
  transition: transform var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out);
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
  border-radius: calc(var(--radius-xl) - 4px);
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--c-accent) 18%, var(--border-default));
  background: color-mix(in srgb, var(--bg-elevated) 88%, transparent);
  transition: transform var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
}

.featured-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--c-accent) 34%, var(--border-hover));
  box-shadow: 0 18px 30px -22px rgb(0 0 0 / 0.7);
}

.featured-cover-wrap {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.featured-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent, rgb(0 0 0 / 0.7));
}

.featured-rank,
.featured-score {
  position: absolute;
  z-index: 1;
}

.featured-rank {
  top: var(--sp-3);
  left: var(--sp-3);
  padding: 6px 10px;
  border-radius: var(--radius-full);
  background: rgb(0 0 0 / 0.56);
  color: white;
  font-size: 11px;
  letter-spacing: 0.12em;
}

.featured-score {
  right: var(--sp-3);
  bottom: var(--sp-3);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: white;
}

.featured-score strong {
  font-size: var(--text-2xl);
  line-height: 1;
}

.featured-score span {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.82;
}

.featured-body {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding: var(--sp-4);
}

.featured-meta-row,
.row-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  flex-wrap: wrap;
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

.featured-title,
.row-title {
  margin: 0;
  color: var(--text-primary);
}

.featured-title {
  font-size: var(--text-lg);
}

.featured-subtitle,
.row-subtitle,
.featured-desc {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 1.65;
}

.featured-subtitle,
.featured-desc,
.row-subtitle {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.featured-subtitle {
  line-clamp: 2;
  -webkit-line-clamp: 2;
}

.featured-desc {
  line-clamp: 3;
  -webkit-line-clamp: 3;
}

.row-subtitle {
  line-clamp: 1;
  -webkit-line-clamp: 1;
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

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.rank-row {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: var(--sp-3);
  align-items: start;
  padding: var(--sp-3);
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--bg-elevated) 78%, transparent);
  border: 1px solid transparent;
  transition: transform var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out);
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

.trend-chip.trend-up {
  background: rgb(34 197 94 / 0.14);
  color: #4ade80;
}

.trend-chip.trend-down {
  background: rgb(239 68 68 / 0.14);
  color: #f87171;
}

.trend-chip.trend-flat {
  background: rgb(148 163 184 / 0.14);
  color: #cbd5e1;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {

  .section-header,
  .ranking-shell {
    padding-left: var(--sp-4);
    padding-right: var(--sp-4);
  }

  .featured-cover-wrap {
    aspect-ratio: 4 / 3;
  }
}
</style>
