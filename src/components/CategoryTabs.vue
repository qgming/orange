<script setup lang="ts">
import { useHorizontalWheelScroll } from '@/composables/useHorizontalWheelScroll'

interface Tab {
  key: string
  label: string
  count?: number
}

interface Props {
  tabs: Tab[]
  activeTab: string
  ariaLabel?: string
}

interface Emits {
  (e: 'update:activeTab', value: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

// @ts-expect-error containerRef 在模板中作为 ref 使用
const { containerRef, handleWheel } = useHorizontalWheelScroll()

const handleTabClick = (key: string) => {
  emit('update:activeTab', key)
}
</script>

<template>
  <nav ref="containerRef" class="category-tabs" :aria-label="ariaLabel || '分类导航'" @wheel="handleWheel">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      class="tab-button"
      :class="{ active: activeTab === tab.key }"
      @click="handleTabClick(tab.key)"
    >
      <span class="tab-label">{{ tab.label }}</span>
      <span v-if="tab.count !== undefined" class="tab-count">{{ tab.count }}</span>
    </button>
  </nav>
</template>

<style scoped>
.category-tabs {
  display: flex;
  gap: var(--sp-2);
  padding: var(--sp-2);
  margin-bottom: var(--sp-5);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: var(--bg-surface);
  overflow-x: auto;
  scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.tab-button {
  flex: 0 0 auto;
  min-width: 108px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  padding: 6px var(--sp-3);
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  color: var(--text-secondary);
  transition: all var(--duration-fast) var(--ease-out);
}

.tab-button:hover {
  border-color: transparent;
  background: color-mix(in srgb, var(--c-accent) 10%, var(--bg-elevated));
  color: color-mix(in srgb, var(--c-accent) 48%, var(--text-primary));
  transform: translateY(-1px);
  box-shadow: 0 8px 18px -14px color-mix(in srgb, var(--c-accent) 55%, transparent);
}

.tab-button.active {
  border-color: transparent;
  background: color-mix(in srgb, var(--c-accent) 16%, var(--bg-elevated));
  color: var(--text-primary);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--c-white) 14%, transparent),
    0 10px 18px -16px color-mix(in srgb, var(--c-accent) 48%, transparent);
}

.tab-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.tab-button.active .tab-label {
  color: color-mix(in srgb, var(--c-accent-dark) 28%, var(--text-primary));
  font-weight: var(--font-semibold);
}

.tab-count {
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--c-accent) 12%, var(--bg-elevated));
  color: color-mix(in srgb, var(--c-accent) 72%, var(--text-primary));
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}

.tab-button:hover .tab-count {
  background: color-mix(in srgb, var(--c-accent) 16%, var(--bg-surface));
  color: color-mix(in srgb, var(--c-accent-light) 78%, var(--text-primary));
}

.tab-button.active .tab-count {
  padding: 3px 9px;
  background: color-mix(in srgb, var(--c-accent) 24%, var(--bg-surface));
  color: color-mix(in srgb, var(--c-accent-dark) 60%, var(--text-primary));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c-accent) 18%, transparent);
}
</style>
