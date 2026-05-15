<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import AppFooter from '@/components/AppFooter.vue'
import TopBar from '@/components/TopBar.vue'
import CategoryTabs from '@/components/CategoryTabs.vue'
import { usePageMeta } from '@/composables/usePageMeta'
import type { RankingTab } from '@/types'
import { realtimeRankingTabs } from '@/services/realtimeRankings'
import { useRealtimeRankingsStore } from '@/stores/realtimeRankings'
import { performSearch } from '@/services/search'

const activeTab = ref<RankingTab>('web')
const rankingsStore = useRealtimeRankingsStore()
const { loading, loaded, errors } = storeToRefs(rankingsStore)

let refreshInterval: number | null = null

usePageMeta({
  title: '实时榜单 - 橘子导航',
  description: '查看网剧热度、电视收视、电影票房与全球票房榜单，快速发现当下热门影视内容。',
  canonicalPath: '/realtime-rankings',
})

const activeConfig = computed(() => realtimeRankingTabs.find(tab => tab.key === activeTab.value) ?? realtimeRankingTabs[0])

const categoryTabs = computed(() => {
  return realtimeRankingTabs.map(tab => ({
    key: tab.key,
    label: tab.label,
  }))
})
const activeError = computed(() => errors.value[activeTab.value])
const rows = computed(() => rankingsStore.rowsForTab(activeTab.value))

const hasRows = computed(() => rows.value.length > 0)
const listRows = computed(() => rows.value.slice(0, 20))
const showLoading = computed(() => loading.value && !loaded.value)
const fetchAll = () => rankingsStore.fetchAll({ force: true })

const openSearch = (name: string) => {
  performSearch(name, 0)
}

onMounted(() => {
  void rankingsStore.fetchAll()
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

      <section v-if="showLoading" class="state-card">
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
