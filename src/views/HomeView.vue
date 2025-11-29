<script setup>
import VideoNav from '../components/VideoNav.vue'
import SearchBox from '../components/SearchBox.vue'
</script>

<template>
  <div class="home-view">
    <SearchBox />
    <VideoNav />
    <footer class="footer">
      <div class="footer-links">
        <a href="https://github.com/qgming/orange" target="_blank" rel="noopener noreferrer" class="footer-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          开源地址
        </a>
        <router-link to="/privacy" class="footer-link">隐私政策</router-link>
      </div>
      <div class="copyright">
        © 2024-{{ new Date().getFullYear() }} QGMING 版权所有
      </div>
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

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.footer-link {
  color: #ff6b1a;
  text-decoration: none;
  transition: color 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.footer-link svg {
  transition: transform 0.3s;
}

.footer-link:hover {
  color: #ff8c3d;
  text-decoration: underline;
}

.footer-link:hover svg {
  transform: scale(1.1);
}

.copyright {
  margin-top: 0.5rem;
}
</style>