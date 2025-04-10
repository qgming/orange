<script setup>
import VideoNav from '../components/VideoNav.vue'
import SearchBox from '../components/SearchBox.vue'
</script>

<template>
  <div class="home-view">
    <SearchBox />
    <VideoNav />
    <footer class="footer">
      <div class="copyright">
        © 2024-{{ new Date().getFullYear() }} 极点维度 版权所有
      </div>
      <router-link to="/privacy" class="privacy-link">隐私政策</router-link>
    </footer>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  padding: 2rem 0;
  position: relative;
}

.footer {
  text-align: center;
  padding: 1.5rem 0;
  margin-top: 10rem;
  color: #666;
  font-size: 0.9rem;
}

.copyright {
  margin-bottom: 0.5rem;
}

.privacy-link {
  color: #ff6b1a;
  text-decoration: none;
  transition: color 0.3s;
}

.privacy-link:hover {
  color: #ff8c3d;
  text-decoration: underline;
}
</style>