<script setup>
import SearchBox from './components/SearchBox.vue'
import VideoList from './components/VideoList.vue';
</script>

<template>
  <main class="main">
    <div class="searchBox">
      <SearchBox />
    </div>
    <div class="videoList">
      <VideoList />
    </div>
  </main>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 100px;
}

@media screen and (max-width: 768px) {
  .main {
    margin: 20px;
  }
}
</style>
