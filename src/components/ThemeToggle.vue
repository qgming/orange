<script setup lang="ts">
/**
 * ThemeToggle - 主题切换
 * 简洁设计
 */
import { ref, onMounted, onUnmounted } from 'vue'

type Theme = 'light' | 'dark' | 'system'

const currentTheme = ref<Theme>('system')

const themes: { value: Theme; label: string }[] = [
  { value: 'light', label: '亮色' },
  { value: 'dark', label: '暗色' },
  { value: 'system', label: '系统' }
]

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'dark'
}

const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  root.classList.add('theme-transition')
  root.removeAttribute('data-theme')
  
  if (theme === 'system') {
    root.setAttribute('data-theme', getSystemTheme())
  } else {
    root.setAttribute('data-theme', theme)
  }
  
  localStorage.setItem('theme', theme)
  currentTheme.value = theme
  
  setTimeout(() => root.classList.remove('theme-transition'), 300)
}

const cycleTheme = () => {
  const order: Theme[] = ['light', 'dark', 'system']
  const currentIndex = order.indexOf(currentTheme.value)
  const nextIndex = (currentIndex + 1) % order.length
  applyTheme(order[nextIndex])
}

const handleSystemChange = () => {
  if (currentTheme.value === 'system') {
    applyTheme('system')
  }
}

onMounted(() => {
  const saved = localStorage.getItem('theme') as Theme | null
  if (saved && themes.some(t => t.value === saved)) {
    applyTheme(saved)
  } else {
    applyTheme('system')
  }
  
  if (typeof window !== 'undefined' && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemChange)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleSystemChange)
  }
})
</script>

<template>
  <button class="theme-btn" @click="cycleTheme" :title="themes.find(t => t.value === currentTheme)?.label">
    <svg v-if="currentTheme === 'light'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
    <svg v-else-if="currentTheme === 'dark'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  </button>
</template>

<style scoped>
.theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: var(--text-tertiary);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-out);
}

.theme-btn:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}
</style>
