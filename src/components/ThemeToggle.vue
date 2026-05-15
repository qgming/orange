<script setup lang="ts">
/**
 * ThemeToggle - 主题切换
 * 简洁设计
 */
import { useTheme } from '@/composables/useTheme'

const { currentTheme, currentThemeLabel, cycleTheme } = useTheme()
</script>

<template>
  <button class="theme-btn" @click="cycleTheme" :title="currentThemeLabel" :aria-label="`切换主题，当前为${currentThemeLabel}`">
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
  width: 36px;
  height: 36px;
  padding: 0;
  color: var(--text-tertiary);
  border: 1px solid color-mix(in srgb, var(--border-default) 88%, transparent);
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--bg-surface) 92%, var(--bg-elevated));
  box-shadow: var(--shadow-sm);
  transition:
    color var(--duration-fast) var(--ease-out),
    background-color var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.theme-btn:hover {
  color: var(--text-primary);
  border-color: color-mix(in srgb, var(--c-accent) 24%, var(--border-hover));
  background: color-mix(in srgb, var(--c-accent) 10%, var(--bg-elevated));
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.theme-btn svg {
  flex-shrink: 0;
}
</style>
