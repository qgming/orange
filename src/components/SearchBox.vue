<script setup lang="ts">
/**
 * SearchBox - 搜索卡片
 */
import { ref, computed } from 'vue'
import { searchSites, performSearch } from '../utils/searchService'

const searchQuery = ref('')
const currentSiteIndex = ref(0)

const currentSite = computed(() => searchSites[currentSiteIndex.value])

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    performSearch(searchQuery.value, currentSiteIndex.value)
  }
}

const handleKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch()
  }
}
</script>

<template>
  <section class="search-section">
    <div class="search-copy">
      <span class="search-kicker">Video Search</span>
      <h1 class="search-title">精彩视界，欢迎探索</h1>
    </div>

    <div class="search-bar">
      <div class="search-input-wrapper">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" v-model="searchQuery" :placeholder="`在${currentSite.name}中搜索视频`" @keyup="handleKeyup"
          class="search-input" />
        <button class="search-btn" @click="handleSearch">
          搜索
        </button>
      </div>
    </div>

    <div class="site-list">
      <button v-for="(site, index) in searchSites" :key="index" class="site-btn"
        :class="{ active: currentSiteIndex === index }" @click="currentSiteIndex = index">
        {{ site.name }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.search-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-3) 0 var(--sp-2);
}

.search-copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-2);
  text-align: center;
  max-width: 760px;
}

.search-kicker {
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--c-accent-light);
}

.search-title {
  margin: 0;
  font-size: clamp(1.75rem, 3.8vw, 2.8rem);
  line-height: 1.05;
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.search-bar {
  width: 100%;
  display: flex;
  justify-content: center;
}

.search-input-wrapper {
  width: min(100%, 820px);
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-2) var(--sp-2) var(--sp-2) var(--sp-5);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--bg-surface) 78%, transparent), color-mix(in srgb, var(--bg-elevated) 92%, transparent));
  border: 1px solid color-mix(in srgb, var(--c-accent) 18%, var(--border-default));
  border-radius: var(--radius-full);
  box-shadow: 0 18px 40px -34px rgb(0 0 0 / 0.7);
  transition: border-color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
}

.search-input-wrapper:focus-within {
  border-color: color-mix(in srgb, var(--c-accent) 70%, var(--border-hover));
  transform: translateY(-1px);
  box-shadow: 0 24px 50px -36px rgb(0 0 0 / 0.85);
}

.search-icon {
  flex-shrink: 0;
  color: var(--text-tertiary);
}

.search-input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  font-size: var(--text-base);
  color: var(--text-primary);
  outline: none;
  padding: var(--sp-2) 0;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.search-btn {
  padding: 12px 22px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent-light));
  color: white;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: transform var(--duration-fast) var(--ease-out), filter var(--duration-fast) var(--ease-out);
}

.search-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.06);
}

.site-list {
  width: min(100%, 920px);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.site-btn {
  padding: 10px 16px;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  background: color-mix(in srgb, var(--bg-elevated) 78%, transparent);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  transition: transform var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out);
}

.site-btn:hover {
  transform: translateY(-1px);
  border-color: var(--border-hover);
  color: var(--text-primary);
}

.site-btn.active {
  background: linear-gradient(135deg, color-mix(in srgb, var(--c-accent) 88%, transparent), color-mix(in srgb, var(--c-accent-light) 72%, transparent));
  color: white;
  border-color: transparent;
}

@media (max-width: 640px) {
  .search-section {
    gap: var(--sp-3);
  }

  .search-input-wrapper {
    padding-left: var(--sp-4);
  }

  .search-btn {
    padding: 10px 16px;
  }
}
</style>
