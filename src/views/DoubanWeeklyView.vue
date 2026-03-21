<script setup lang="ts">
import { onMounted } from 'vue'
import DoubanWeeklyRankings from '@/components/DoubanWeeklyRankings.vue'

onMounted(() => {
  document.title = '豆瓣周榜 - 橘子导航'
})
</script>

<template>
  <div class="ranking-page">
    <div class="page-container">
      <header class="page-header">
        <router-link to="/" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          返回首页
        </router-link>
        <h1 class="page-title">豆瓣周榜</h1>
        <p class="page-subtitle">移动端单独查看全球电影、剧集与综艺周榜，切换更顺手。</p>
      </header>

      <DoubanWeeklyRankings />
    </div>
  </div>
</template>

<style scoped>
.ranking-page {
  min-height: 100vh;
  padding: var(--sp-6) var(--sp-4) var(--sp-10);
}

.page-container {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  transition: color var(--duration-fast) var(--ease-out);
}

.back-link:hover {
  color: var(--text-primary);
}

.page-title {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.05;
  color: var(--text-primary);
}

.page-subtitle {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 1.75;
}
</style>
