<script setup lang="ts">
/**
 * HomeSearch - 首页搜索入口
 * 搜索逻辑从顶栏迁移到首页，避免全站顶栏承担业务输入。
 */
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRealtimeRankingsStore } from '@/stores/realtimeRankings'
import { performSearch, searchSites } from '@/services/search'

const searchQuery = ref('')
const currentSiteIndex = ref(0)
const showEngines = ref(false)
const heroTitle = '好片，不必到处找。'
const fallbackKeywords = ['庆余年', '沙丘', '繁花', '周处除三害', '三体']

const rankingsStore = useRealtimeRankingsStore()
const { webTopKeywords } = storeToRefs(rankingsStore)
const currentSite = computed(() => searchSites[currentSiteIndex.value] ?? searchSites[0])
const quickKeywords = computed(() => webTopKeywords.value.length ? webTopKeywords.value : fallbackKeywords)

const selectSite = (index: number) => {
  currentSiteIndex.value = index
  showEngines.value = false
}

const submitSearch = (keyword = searchQuery.value) => {
  const query = keyword.trim()
  if (!query) return

  searchQuery.value = query
  performSearch(query, currentSiteIndex.value)
}

onMounted(() => {
  void rankingsStore.fetchAll()
})
</script>

<template>
  <section class="home-search" aria-label="影视搜索">
    <div class="search-copy">
      <h1 class="hero-title">
        <span class="hero-title-text">{{ heroTitle }}</span>
      </h1>
    </div>

    <form class="search-panel" @submit.prevent="submitSearch()">
      <div class="engine-select">
        <button type="button" class="engine-button" @click="showEngines = !showEngines">
          <span>{{ currentSite.name }}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </button>

        <Transition name="engine-pop">
          <div v-if="showEngines" class="engine-menu">
            <button v-for="(site, index) in searchSites" :key="site.name" type="button" class="engine-option"
              :class="{ active: currentSiteIndex === index }" @click="selectSite(index)">
              {{ site.name }}
            </button>
          </div>
        </Transition>
      </div>

      <input v-model="searchQuery" class="search-input" type="search" placeholder="输入电影、剧集、综艺名称" autocomplete="off" />

      <button type="submit" class="search-submit" aria-label="搜索">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="7"></circle>
          <path d="m20 20-3.5-3.5"></path>
        </svg>
        <span>搜索</span>
      </button>
    </form>

    <div class="quick-keywords" aria-label="快速搜索">
      <button v-for="keyword in quickKeywords" :key="keyword" type="button" class="keyword-chip"
        @click="submitSearch(keyword)">
        {{ keyword }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.home-search {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);
  padding: clamp(2rem, 6vw, 4rem) 0 var(--sp-8);
}

.search-copy {
  width: 100%;
  max-width: 880px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: clamp(1rem, 2.8vw, 2rem);
  text-align: center;
}

.search-copy h1 {
  margin: 0;
  max-width: 100%;
  font-size: clamp(2.625rem, 6vw, 4.5rem);
  line-height: 1;
  letter-spacing: 0;
  color: var(--text-primary);
  white-space: nowrap;
}

.hero-title {
  display: flex;
  justify-content: center;
}

.hero-title-text {
  --hero-title-width: 10.25em;

  box-sizing: content-box;
  display: inline-block;
  overflow: hidden;
  width: 0;
  padding-right: 0.04em;
  border-right: 2px solid color-mix(in srgb, var(--c-accent) 92%, white);
  white-space: nowrap;
  animation:
    title-typing-loop 4.8s steps(10, end) infinite,
    caret-blink 900ms steps(1, end) infinite;
}

.search-panel {
  position: relative;
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--sp-2);
  width: min(100%, 880px);
  margin: 0 auto;
  padding: 10px;
  background: var(--surface-card);
  border: 1px solid color-mix(in srgb, var(--border-default) 88%, transparent);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-lg);
  transition: border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
}

.search-panel:focus-within {
  border-color: color-mix(in srgb, var(--c-accent) 34%, var(--border-hover));
  box-shadow: var(--shadow-md);
}

.engine-select {
  position: relative;
}

.engine-button,
.search-submit {
  height: 52px;
  border-radius: var(--radius-xl);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.engine-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  padding: 0 var(--sp-4);
  border: 1px solid transparent;
  background: var(--surface-chip);
  color: var(--text-primary);
  transition: background var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out);
}

.engine-button:hover {
  border-color: var(--border-hover);
  background: var(--surface-chip-hover);
}

.engine-button svg,
.search-submit svg {
  width: 18px;
  height: 18px;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex-shrink: 0;
}

.engine-menu {
  position: absolute;
  top: calc(100% + var(--sp-2));
  left: 0;
  z-index: 20;
  width: 100%;
  min-width: 160px;
  padding: var(--sp-1);
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.engine-option {
  width: 100%;
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  text-align: left;
}

.engine-option:hover,
.engine-option.active {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.search-input {
  width: 100%;
  min-width: 0;
  height: 52px;
  padding: 0 var(--sp-4) 0 var(--sp-3);
  border: none;
  border-radius: var(--radius-xl);
  outline: none;
  background: transparent;
  color: var(--text-primary);
  font-size: var(--text-base);
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.search-input:focus {
  outline: none;
}

.search-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  min-width: 112px;
  padding: 0 var(--sp-5);
  background: var(--c-accent);
  color: var(--text-on-accent);
  transition: filter var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
}

.search-submit:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.quick-keywords {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--sp-2);
  width: min(100%, 880px);
}

.keyword-chip {
  padding: 7px var(--sp-3);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  background: var(--surface-chip);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  transition: border-color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out);
}

.keyword-chip:hover {
  border-color: color-mix(in srgb, var(--c-accent) 30%, var(--border-hover));
  background: var(--surface-chip-hover);
  color: var(--text-primary);
}

.engine-pop-enter-active,
.engine-pop-leave-active {
  transition: opacity 150ms var(--ease-out), transform 150ms var(--ease-out);
}

.engine-pop-enter-from,
.engine-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@keyframes title-typing-loop {

  0%,
  12% {
    width: 0;
  }

  42%,
  58% {
    width: var(--hero-title-width);
  }

  88%,
  100% {
    width: 0;
  }
}

@keyframes caret-blink {

  0%,
  45% {
    border-right-color: color-mix(in srgb, var(--c-accent) 92%, white);
  }

  55%,
  100% {
    border-right-color: transparent;
  }
}

@media (max-width: 720px) {
  .search-copy {
    margin-bottom: var(--sp-4);
  }

  .search-copy h1 {
    white-space: normal;
  }

  .hero-title-text {
    width: auto;
    border-right: none;
    white-space: normal;
    animation: none;
  }

  .search-panel {
    grid-template-columns: 1fr;
    padding: var(--sp-2);
  }

  .engine-button,
  .search-input,
  .search-submit {
    height: 48px;
  }

  .search-input {
    padding-left: var(--sp-4);
    border-radius: var(--radius-xl);
    background: var(--surface-card-muted);
  }

  .search-submit {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-title-text {
    width: auto;
    border-right: none;
    animation: none;
  }
}
</style>
