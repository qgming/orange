<script setup lang="ts">
/**
 * HomeView - 首页
 */
import { onMounted, onUnmounted, ref } from 'vue'
import TopBar from '../components/TopBar.vue'
import SearchBox from '../components/SearchBox.vue'
import RealtimeRanking from '../components/RealtimeRanking.vue'
import DoubanWeeklyRankings from '../components/DoubanWeeklyRankings.vue'
import VideoNav from '../components/VideoNav.vue'
import AppFooter from '../components/AppFooter.vue'

const isMobile = ref(false)

const mobileEntries = [
  {
    to: '/douban-weekly',
    title: '豆瓣周榜',
    desc: '全球电影、剧集、综艺周榜单独查看',
    meta: 'Weekly Curated',
  },
  {
    to: '/realtime-rankings',
    title: '实时榜单',
    desc: '网剧热度、电视收视、电影票房集中浏览',
    meta: 'Live Ranking',
  },
]

const updateViewport = () => {
  isMobile.value = window.innerWidth <= 768
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
        <SearchBox />

        <template v-if="isMobile">
          <div class="hub-grid">
            <router-link v-for="entry in mobileEntries" :key="entry.to" :to="entry.to" class="hub-card">
              <span class="hub-meta">{{ entry.meta }}</span>
              <strong class="hub-card-title">{{ entry.title }}</strong>
              <span class="hub-card-desc">{{ entry.desc }}</span>
            </router-link>
          </div>
          <VideoNav />
        </template>

        <div v-else class="dashboard-grid">
          <div class="dashboard-side-left">
            <DoubanWeeklyRankings />
          </div>
          <div class="dashboard-main">
            <VideoNav />
          </div>
          <div class="dashboard-side-right">
            <RealtimeRanking />
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
  gap: var(--sp-5);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr) 360px;
  gap: var(--sp-4);
  align-items: start;
}

.dashboard-side-left,
.dashboard-main,
.dashboard-side-right {
  min-width: 0;
}

.mobile-hub {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.hub-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-3);
}

.hub-card {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding: var(--sp-4);
  border-radius: var(--radius-xl);
  border: 1px solid color-mix(in srgb, var(--c-accent) 18%, var(--border-default));
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--c-accent) 14%, transparent), transparent 40%),
    color-mix(in srgb, var(--bg-elevated) 84%, transparent);
}

.hub-meta {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-accent-light);
}

.hub-card-title {
  color: var(--text-primary);
  font-size: var(--text-lg);
}

.hub-card-desc {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 1.7;
}

@media (max-width: 1220px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: var(--sp-3);
  }

  .page-shell {
    gap: var(--sp-4);
  }
}
</style>
