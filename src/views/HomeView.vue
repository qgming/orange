<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
import HomePromotions from '@/components/HomePromotions.vue'
import HomeRecommendedSites from '@/components/HomeRecommendedSites.vue'
import HomeSearch from '@/components/HomeSearch.vue'
import TopBar from '@/components/TopBar.vue'
import { usePageMeta } from '@/composables/usePageMeta'

usePageMeta({
  title: '橘子导航 - 影视、阅读、工具与社区资源导航',
  description: '橘子导航聚合影视、动漫、短剧、阅读、工具与社区站点，支持热门搜索、精选推荐、实时榜单与豆瓣周榜。',
  canonicalPath: '/',
})
</script>

<template>
  <div class="home-view">
    <TopBar />

    <main class="main-content">
      <HomeSearch />
      <HomePromotions />
      <HomeRecommendedSites />
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
</style>
