<script setup lang="ts">
/**
 * TopBar - 顶栏
 * 桌面端：Logo + 内联搜索框 + 主题切换
 * 移动端：Logo + 搜索图标(点击展开) + 主题切换
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { searchSites, performSearch } from '../utils/searchService'
import ThemeToggle from './ThemeToggle.vue'

const searchQuery = ref('')
const currentSiteIndex = ref(0)
const showDropdown = ref(false)
const mobileSearchOpen = ref(false)
const isMobile = ref(false)

const currentSite = computed(() => searchSites[currentSiteIndex.value])

const selectSite = (index: number) => {
  currentSiteIndex.value = index
  showDropdown.value = false
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    performSearch(searchQuery.value, currentSiteIndex.value)
  }
}

const handleKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter') handleSearch()
  if (event.key === 'Escape') mobileSearchOpen.value = false
}

const closeDropdown = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.search-wrapper')) {
    showDropdown.value = false
  }
}

const updateViewport = () => {
  isMobile.value = window.innerWidth <= 640
  if (!isMobile.value) mobileSearchOpen.value = false
}

onMounted(() => {
  updateViewport()
  window.addEventListener('resize', updateViewport)
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewport)
  document.removeEventListener('click', closeDropdown)
})
</script>

<template>
  <header class="top-bar">
    <div class="bar-content">
      <!-- Logo -->
      <router-link to="/" class="logo-link">
        <img src="@/assets/logo.svg" alt="橘子导航" class="logo" />
        <span class="logo-text">橘子导航</span>
      </router-link>

      <!-- 桌面端：内联搜索框 -->
      <div class="search-wrapper desktop-search">
        <div class="search-bar">
          <button class="engine-btn" @click.stop="showDropdown = !showDropdown">
            <span class="engine-name">{{ currentSite.name }}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="search-divider"></div>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索视频..."
            @keyup="handleKeyup"
            class="search-input"
          />
          <button class="search-btn" @click="handleSearch">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
        <Transition name="dropdown">
          <div v-if="showDropdown" class="engine-dropdown">
            <button
              v-for="(site, index) in searchSites"
              :key="index"
              class="engine-option"
              :class="{ active: currentSiteIndex === index }"
              @click="selectSite(index)"
            >
              {{ site.name }}
            </button>
          </div>
        </Transition>
      </div>

      <!-- 移动端：搜索图标按钮 -->
      <button class="mobile-search-toggle" @click="mobileSearchOpen = !mobileSearchOpen">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>

      <div class="bar-right">
        <ThemeToggle />
      </div>
    </div>

    <!-- 移动端：展开搜索栏 -->
    <Transition name="slide">
      <div v-if="mobileSearchOpen" class="mobile-search-panel">
        <div class="search-wrapper">
          <div class="search-bar">
            <button class="engine-btn" @click.stop="showDropdown = !showDropdown">
              <span class="engine-name">{{ currentSite.name }}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div class="search-divider"></div>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索视频..."
              @keyup="handleKeyup"
              class="search-input"
              autofocus
            />
            <button class="search-btn" @click="handleSearch">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
          <Transition name="dropdown">
            <div v-if="showDropdown" class="engine-dropdown">
              <button
                v-for="(site, index) in searchSites"
                :key="index"
                class="engine-option"
                :class="{ active: currentSiteIndex === index }"
                @click="selectSite(index)"
              >
                {{ site.name }}
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.top-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: color-mix(in srgb, var(--bg-base) 88%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-default);
}

.bar-content {
  max-width: 1480px;
  margin: 0 auto;
  padding: var(--sp-2) var(--sp-4);
  display: flex;
  align-items: center;
  gap: var(--sp-4);
}

.logo-link {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-shrink: 0;
  min-width: 100px;
}

.logo {
  width: 26px;
  height: 26px;
}

.logo-text {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

/* 搜索区域 - 居中 */
.desktop-search {
  margin: 0 auto;
}

.search-wrapper {
  flex: 1;
  max-width: 480px;
  position: relative;
}

.search-bar {
  display: flex;
  align-items: center;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  transition: border-color var(--duration-fast) var(--ease-out);
  overflow: hidden;
}

.search-bar:focus-within {
  border-color: color-mix(in srgb, var(--c-accent) 50%, var(--border-hover));
}

.engine-btn {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  padding: var(--sp-2) var(--sp-3);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
  transition: color var(--duration-fast) var(--ease-out);
}

.engine-btn:hover {
  color: var(--text-primary);
}

.engine-name {
  max-width: 64px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-divider {
  width: 1px;
  height: 16px;
  background: var(--border-default);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  min-width: 0;
  padding: var(--sp-2) var(--sp-3);
  background: transparent;
  border: none;
  font-size: var(--text-sm);
  color: var(--text-primary);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin: 2px;
  border-radius: var(--radius-md);
  background: var(--c-accent);
  color: white;
  flex-shrink: 0;
  transition: filter var(--duration-fast) var(--ease-out);
}

.search-btn:hover {
  filter: brightness(1.1);
}

/* 搜索引擎下拉 */
.engine-dropdown {
  position: absolute;
  top: calc(100% + var(--sp-1));
  left: 0;
  min-width: 140px;
  padding: var(--sp-1);
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 24px -8px rgb(0 0 0 / 0.4);
  z-index: 200;
}

.engine-option {
  display: block;
  width: 100%;
  padding: var(--sp-2) var(--sp-3);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-align: left;
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-out);
}

.engine-option:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.engine-option.active {
  color: var(--c-accent);
}

/* 移动端搜索图标 */
.mobile-search-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin-left: auto;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-out);
}

.mobile-search-toggle:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

/* 移动端搜索面板 */
.mobile-search-panel {
  padding: var(--sp-2) var(--sp-4) var(--sp-3);
  border-top: 1px solid var(--border-default);
}

.mobile-search-panel .search-wrapper {
  max-width: none;
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 150ms var(--ease-out), transform 150ms var(--ease-out);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 搜索面板展开动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 200ms var(--ease-out);
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 80px;
}

.bar-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--sp-3);
  flex-shrink: 0;
  min-width: 100px;
}

@media (max-width: 640px) {
  .bar-content {
    gap: var(--sp-2);
  }

  .logo-text {
    display: none;
  }

  .desktop-search {
    display: none;
  }

  .mobile-search-toggle {
    display: flex;
  }
}
</style>
