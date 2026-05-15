<script setup lang="ts">
import { onMounted } from 'vue'
import AppFooter from '@/components/AppFooter.vue'
import HomeSearch from '@/components/HomeSearch.vue'
import TopBar from '@/components/TopBar.vue'

onMounted(() => {
  document.title = '橘子导航'
})
</script>

<template>
  <div class="home-view">
    <TopBar />

    <main class="main-content">
      <HomeSearch />
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
