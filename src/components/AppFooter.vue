<script setup lang="ts">
/**
 * AppFooter - 页脚组件
 * 简洁风格
 */
import ThemeToggle from './ThemeToggle.vue'

interface Props {
  githubUrl?: string
  showPrivacyLink?: boolean
}

withDefaults(defineProps<Props>(), {
  githubUrl: 'https://github.com/qgming/orange',
  showPrivacyLink: true
})

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-left">
        <span class="copyright">© 2024-{{ currentYear }} QGMING</span>
        <span class="divider">·</span>
        <router-link v-if="showPrivacyLink" to="/privacy" class="footer-link">隐私政策</router-link>
      </div>
      
      <div class="footer-right">
        <a :href="githubUrl" target="_blank" rel="noopener noreferrer" class="footer-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
        <ThemeToggle />
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: var(--sp-8);
  padding: var(--sp-6) var(--sp-4);
  border-top: 1px solid var(--border-default);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--sp-4);
}

.footer-left {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.copyright {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.divider {
  color: var(--text-tertiary);
}

.footer-link {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  transition: color var(--duration-fast) var(--ease-out);
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
}

.footer-link:hover {
  color: var(--text-primary);
}

.footer-right {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
}

/* 响应式 */
@media (max-width: 640px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
