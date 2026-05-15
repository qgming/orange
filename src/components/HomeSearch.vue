<script setup lang="ts">
/**
 * HomeSearch - 首页搜索入口
 * 搜索逻辑从顶栏迁移到首页，避免全站顶栏承担业务输入。
 */
import { computed, ref } from 'vue'
import { performSearch, searchSites } from '@/utils/searchService'

const searchQuery = ref('')
const currentSiteIndex = ref(0)
const showEngines = ref(false)

const quickKeywords = ['庆余年', '沙丘', '繁花', '周处除三害', '三体']
const currentSite = computed(() => searchSites[currentSiteIndex.value] ?? searchSites[0])

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
</script>

<template>
  <section class="home-search" aria-label="影视搜索">
    <div class="search-copy">
      <span class="eyebrow">Orange Video Navigator</span>
      <h1>找片、看榜、进站点，一次到位。</h1>
      <p>把常用影视搜索放在首页中央，顶部栏只负责页面跳转。输入片名后会打开当前选择的搜索源。</p>
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
            <button
              v-for="(site, index) in searchSites"
              :key="site.name"
              type="button"
              class="engine-option"
              :class="{ active: currentSiteIndex === index }"
              @click="selectSite(index)"
            >
              {{ site.name }}
            </button>
          </div>
        </Transition>
      </div>

      <input
        v-model="searchQuery"
        class="search-input"
        type="search"
        placeholder="输入电影、剧集、综艺名称"
        autocomplete="off"
      />

      <button type="submit" class="search-submit" aria-label="搜索">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="7"></circle>
          <path d="m20 20-3.5-3.5"></path>
        </svg>
        <span>搜索</span>
      </button>
    </form>

    <div class="quick-keywords" aria-label="快速搜索">
      <button
        v-for="keyword in quickKeywords"
        :key="keyword"
        type="button"
        class="keyword-chip"
        @click="submitSearch(keyword)"
      >
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
  gap: var(--sp-5);
  padding: clamp(2rem, 7vw, 5.5rem) 0 var(--sp-8);
}

.search-copy {
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.eyebrow {
  width: fit-content;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--c-accent) 16%, var(--bg-surface));
  color: var(--c-accent-light);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.search-copy h1 {
  margin: 0;
  max-width: 680px;
  font-size: clamp(2.25rem, 8vw, 5rem);
  line-height: 0.98;
  letter-spacing: 0;
  color: var(--text-primary);
}

.search-copy p {
  max-width: 620px;
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
}

.search-panel {
  position: relative;
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr) auto;
  gap: var(--sp-2);
  width: min(100%, 900px);
  padding: var(--sp-2);
  background:
    linear-gradient(var(--bg-surface), var(--bg-surface)) padding-box,
    linear-gradient(135deg, color-mix(in srgb, var(--c-accent) 70%, transparent), var(--border-default)) border-box;
  border: 1px solid transparent;
  border-radius: var(--radius-2xl);
  box-shadow: 0 24px 80px -48px color-mix(in srgb, var(--c-accent) 70%, transparent);
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
  background: var(--bg-elevated);
  color: var(--text-primary);
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
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  box-shadow: 0 16px 36px -18px rgb(0 0 0 / 0.7);
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
  padding: 0 var(--sp-4);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  outline: none;
  background: var(--bg-base);
  color: var(--text-primary);
  font-size: var(--text-base);
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.search-input:focus {
  border-color: color-mix(in srgb, var(--c-accent) 55%, var(--border-hover));
}

.search-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  padding: 0 var(--sp-5);
  background: var(--c-accent);
  color: white;
  transition: filter var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
}

.search-submit:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.quick-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.keyword-chip {
  padding: 7px var(--sp-3);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  background: var(--bg-surface);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  transition: all var(--duration-fast) var(--ease-out);
}

.keyword-chip:hover {
  border-color: var(--border-hover);
  background: var(--bg-hover);
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

@media (max-width: 720px) {
  .search-panel {
    grid-template-columns: 1fr;
  }

  .engine-button,
  .search-input,
  .search-submit {
    height: 48px;
  }
}
</style>
