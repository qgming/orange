<script setup>
import VideoNav from '../components/VideoNav.vue'
import SearchBox from '../components/SearchBox.vue'
import RealtimeRanking from '../components/RealtimeRanking.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

<template>
  <div class="home-view">
    <SearchBox />
    <RealtimeRanking />
    <VideoNav />
    <AppFooter />
  </div>
</template>

<style scoped>
.home-view {
  max-width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  padding: 3rem 0;
  position: relative;
}
</style>