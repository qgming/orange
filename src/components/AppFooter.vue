<script setup lang="ts">
interface Props {
  githubUrl?: string
  showPrivacyLink?: boolean
}

withDefaults(defineProps<Props>(), {
  githubUrl: 'https://github.com/qgming/orange',
  showPrivacyLink: true
})
</script>

<template>
  <footer class="footer">
    <div class="footer-links">
      <a href="https://github.com/qgming/orange/issues" target="_blank" rel="noopener noreferrer" class="footer-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.001 5.75c.69 0 1.251.56 1.251 1.25s-.561 1.25-1.251 1.25-1.249-.56-1.249-1.25.559-1.25 1.249-1.25zm2.001 12.25h-4v-1c.484-.179 1-.201 1-.735v-4.467c0-.534-.516-.618-1-.797v-1h3v6.265c0 .535.517.558 1 .735v1z" />
        </svg>
        网站提交
      </a>
      <a :href="githubUrl" target="_blank" rel="noopener noreferrer" class="footer-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        开源地址
      </a>
      <router-link v-if="showPrivacyLink" to="/privacy" class="footer-link">隐私政策</router-link>
    </div>
    <div class="copyright">
      © 2024-{{ new Date().getFullYear() }} QGMING 版权所有
    </div>
  </footer>
</template>

<style scoped>
.footer {
  text-align: center;
  padding: 2rem 0;
  margin-top: 8rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  position: relative;
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.footer-link {
  color: rgba(255, 255, 255, 0.95);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.footer-link svg {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.footer-link:hover {
  background: rgba(255, 160, 122, 0.3);
  border-color: rgba(255, 160, 122, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 160, 122, 0.3);
  text-decoration: none;
}

.footer-link:hover svg {
  transform: scale(1.15) rotate(5deg);
}

.copyright {
  margin-top: 1rem;
  font-weight: 500;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.7);
}
</style>
