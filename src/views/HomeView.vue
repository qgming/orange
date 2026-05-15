<script setup lang="ts">
import { onMounted } from 'vue'
import AppFooter from '@/components/AppFooter.vue'
import HomeSearch from '@/components/HomeSearch.vue'
import TopBar from '@/components/TopBar.vue'

const entryCards = [
  {
    to: '/nav',
    title: '网站导航',
    description: '把影视站点按分类整理成独立页面，适合快速跳转和长期维护。',
    meta: '站点入口',
  },
  {
    to: '/douban-weekly',
    title: '豆瓣周榜',
    description: '独立查看全球电影、华语剧集、综艺等口碑周榜。',
    meta: '周更榜单',
  },
  {
    to: '/realtime-rankings',
    title: '实时排行榜',
    description: '网剧热度、电视收视、电影票房实时切换。',
    meta: '热度追踪',
  },
]

onMounted(() => {
  document.title = '橘子导航'
})
</script>

<template>
  <div class="home-view">
    <TopBar />

    <main class="main-content">
      <HomeSearch />

      <section class="entry-grid" aria-label="页面入口">
        <router-link v-for="card in entryCards" :key="card.to" :to="card.to" class="entry-card">
          <span class="entry-meta">{{ card.meta }}</span>
          <h2>{{ card.title }}</h2>
          <p>{{ card.description }}</p>
          <span class="entry-action">
            进入页面
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14"></path>
              <path d="m13 6 6 6-6 6"></path>
            </svg>
          </span>
        </router-link>
      </section>
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
  width: min(100%, 1240px);
  margin: 0 auto;
  padding: 0 var(--sp-4);
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--sp-4);
  padding-bottom: var(--sp-8);
}

.entry-card {
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--sp-3);
  padding: var(--sp-5);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background:
    radial-gradient(circle at 16% 18%, color-mix(in srgb, var(--c-accent) 14%, transparent), transparent 36%),
    var(--bg-surface);
  transition:
    border-color var(--duration-fast) var(--ease-out),
    background var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);
}

.entry-card:hover {
  border-color: var(--border-hover);
  background:
    radial-gradient(circle at 16% 18%, color-mix(in srgb, var(--c-accent) 20%, transparent), transparent 38%),
    var(--bg-elevated);
  transform: translateY(-2px);
}

.entry-meta {
  padding: 4px 9px;
  border-radius: var(--radius-full);
  background: var(--bg-elevated);
  color: var(--c-accent-light);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.entry-card h2 {
  margin: auto 0 0;
  color: var(--text-primary);
  font-size: var(--text-2xl);
  line-height: var(--leading-tight);
}

.entry-card p {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.entry-action {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.entry-action svg {
  width: 16px;
  height: 16px;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform var(--duration-fast) var(--ease-out);
}

.entry-card:hover .entry-action svg {
  transform: translateX(2px);
}

@media (max-width: 860px) {
  .entry-grid {
    grid-template-columns: 1fr;
  }

  .entry-card {
    min-height: 180px;
  }
}
</style>
