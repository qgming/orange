<script setup lang="ts">
import { computed } from 'vue'
import { useDeepRefresh } from '@/composables/useDeepRefresh'

const { canRefresh, isBusy, isCoolingDown, remainingSeconds, refreshAll } = useDeepRefresh()

const buttonTitle = computed(() => {
  if (isBusy.value) return '正在更新全部数据'
  if (isCoolingDown.value) return `更新冷却中，${remainingSeconds.value} 秒后可用`
  return '更新全部数据'
})
</script>

<template>
  <button
    type="button"
    class="deep-refresh-btn"
    :class="{ loading: isBusy }"
    :disabled="!canRefresh"
    :title="buttonTitle"
    :aria-label="buttonTitle"
    @click="refreshAll"
  >
    <svg class="refresh-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M21 12a9 9 0 0 1-15.4 6.36"></path>
      <path d="M3 12A9 9 0 0 1 18.4 5.64"></path>
      <path d="M18 2v4h-4"></path>
      <path d="M6 22v-4h4"></path>
    </svg>
  </button>
</template>

<style scoped>
.deep-refresh-btn {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--border-default) 88%, transparent);
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--surface-chip) 92%, var(--bg-elevated));
  color: var(--text-secondary);
  box-shadow: var(--shadow-sm);
  transition:
    color var(--duration-fast) var(--ease-out),
    background-color var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out),
    opacity var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.deep-refresh-btn:not(:disabled):hover {
  color: var(--text-primary);
  border-color: color-mix(in srgb, var(--c-accent) 24%, var(--border-hover));
  background: color-mix(in srgb, var(--c-accent) 10%, var(--bg-elevated));
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.deep-refresh-btn:disabled {
  cursor: not-allowed;
  opacity: 0.68;
}

.refresh-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.deep-refresh-btn.loading .refresh-icon {
  animation: refresh-spin 900ms linear infinite;
}

@keyframes refresh-spin {
  to { transform: rotate(360deg); }
}
</style>
