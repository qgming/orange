<script setup lang="ts">
/**
 * HomeView - 首页
 * 桌面(>1220px)：三栏同时展示 豆瓣 | 导航 | 实时
 * 中屏(768-1220px)：双栏 导航 | 榜单Tab切换
 * 移动端(<768px)：全Tab切换（导航 / 豆瓣周榜 / 实时榜单）
 */
import { onMounted, onUnmounted, ref, computed } from 'vue'
import TopBar from '../components/TopBar.vue'
import RealtimeRanking from '../components/RealtimeRanking.vue'
import DoubanWeeklyRankings from '../components/DoubanWeeklyRankings.vue'
import VideoNav from '../components/VideoNav.vue'
import AppFooter from '../components/AppFooter.vue'

type ViewMode = 'desktop' | 'tablet' | 'mobile'
type MobileTab = 'nav' | 'douban' | 'realtime'
type RankingTab = 'douban' | 'realtime'

const viewMode = ref<ViewMode>('desktop')
const mobileTab = ref<MobileTab>('nav')
const rankingTab = ref<RankingTab>('douban')

const mobileTabs: { key: MobileTab; label: string; sub: string }[] = [
  { key: 'nav', label: '网站导航', sub: '影视资源' },
  { key: 'douban', label: '豆瓣周榜', sub: '口碑精选' },
  { key: 'realtime', label: '实时榜单', sub: '热播票房' },
]

const isDesktop = computed(() => viewMode.value === 'desktop')
const isTablet = computed(() => viewMode.value === 'tablet')
const isMobile = computed(() => viewMode.value === 'mobile')

const updateViewport = () => {
  const w = window.innerWidth
  if (w > 1220) viewMode.value = 'desktop'
  else if (w > 768) viewMode.value = 'tablet'
  else viewMode.value = 'mobile'
}

onMounted(() => {
  updateViewport()
  window.addEventListener('resize', updateViewport)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewport)
})
</script>

<template>
  <div class="home-view">
    <TopBar />

    <main class="main-content">
      <div class="page-shell">

        <!-- ============ 移动端：主 Tab 导航 ============ -->
        <nav v-if="isMobile" class="mobile-tabs">
          <button
            v-for="tab in mobileTabs"
            :key="tab.key"
            class="mobile-tab"
            :class="{ active: mobileTab === tab.key }"
            @click="mobileTab = tab.key"
          >
            <span class="mobile-tab-label">{{ tab.label }}</span>
            <span class="mobile-tab-sub">{{ tab.sub }}</span>
          </button>
        </nav>

        <!-- ============ 移动端：Tab 内容 ============ -->
        <template v-if="isMobile">
          <VideoNav v-show="mobileTab === 'nav'" />
          <DoubanWeeklyRankings v-show="mobileTab === 'douban'" />
          <RealtimeRanking v-show="mobileTab === 'realtime'" />
        </template>

        <!-- ============ 桌面端：三栏 ============ -->
        <div v-else-if="isDesktop" class="three-col">
          <div class="col-side col-left">
            <DoubanWeeklyRankings />
          </div>
          <div class="col-main">
            <VideoNav />
          </div>
          <div class="col-side col-right">
            <RealtimeRanking />
          </div>
        </div>

        <!-- ============ 中屏：双栏（导航 + 榜单Tab） ============ -->
        <div v-else-if="isTablet" class="two-col">
          <div class="col-main">
            <VideoNav />
          </div>
          <div class="col-rankings">
            <div class="ranking-switcher">
              <button
                class="ranking-sw-btn"
                :class="{ active: rankingTab === 'douban' }"
                @click="rankingTab = 'douban'"
              >
                豆瓣周榜
              </button>
              <button
                class="ranking-sw-btn"
                :class="{ active: rankingTab === 'realtime' }"
                @click="rankingTab = 'realtime'"
              >
                实时榜单
              </button>
            </div>
            <DoubanWeeklyRankings v-show="rankingTab === 'douban'" />
            <RealtimeRanking v-show="rankingTab === 'realtime'" />
          </div>
        </div>

      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  max-width: 1480px;
  margin: 0 auto;
  padding: var(--sp-4);
  width: 100%;
}

.page-shell {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

/* ========== 移动端 Tab 导航 ========== */
.mobile-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-2);
  position: sticky;
  top: 45px;
  z-index: 50;
  background: color-mix(in srgb, var(--bg-base) 90%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: var(--sp-2) 0;
  margin: 0 calc(-1 * var(--sp-3));
  padding-left: var(--sp-3);
  padding-right: var(--sp-3);
}

.mobile-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--sp-2) var(--sp-1);
  border-radius: var(--radius-lg);
  border: 1px solid transparent;
  background: var(--bg-surface);
  transition: all var(--duration-fast) var(--ease-out);
}

.mobile-tab.active {
  border-color: color-mix(in srgb, var(--c-accent) 40%, var(--border-hover));
  background: color-mix(in srgb, var(--c-accent) 8%, var(--bg-surface));
}

.mobile-tab-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

.mobile-tab.active .mobile-tab-label {
  color: var(--text-primary);
}

.mobile-tab-sub {
  font-size: 10px;
  color: var(--text-tertiary);
}

.mobile-tab.active .mobile-tab-sub {
  color: var(--c-accent-light);
}

/* ========== 桌面端三栏 ========== */
.three-col {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr) 340px;
  gap: var(--sp-4);
  align-items: start;
}

.col-side {
  min-width: 0;
}

.col-main {
  min-width: 0;
}

/* ========== 中屏双栏 ========== */
.two-col {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: var(--sp-4);
  align-items: start;
}

.col-rankings {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  min-width: 0;
}

/* 榜单切换 */
.ranking-switcher {
  display: flex;
  gap: var(--sp-1);
  padding: var(--sp-1);
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
}

.ranking-sw-btn {
  flex: 1;
  padding: var(--sp-2) var(--sp-3);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  border-radius: var(--radius-md);
  text-align: center;
  transition: all var(--duration-fast) var(--ease-out);
}

.ranking-sw-btn:hover {
  color: var(--text-primary);
}

.ranking-sw-btn.active {
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-weight: var(--font-medium);
}

/* ========== 响应式微调 ========== */
@media (max-width: 1380px) {
  .three-col {
    grid-template-columns: 320px minmax(0, 1fr) 320px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: var(--sp-3);
  }

  .page-shell {
    gap: var(--sp-3);
  }
}
</style>
