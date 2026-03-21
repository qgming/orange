<script setup lang="ts">
/**
 * GlassCard - Liquid Glass 卡片组件
 * 提供统一的玻璃态卡片样式和交互效果
 */

interface Props {
  /** 是否可点击 */
  clickable?: boolean
  /** 是否悬停时显示光效 */
  showShine?: boolean
  /** 卡片变体 */
  variant?: 'default' | 'elevated' | 'bordered'
  /** 内边距大小 */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  /** 动画延迟（毫秒） */
  animationDelay?: number
  /** 是否禁用动画 */
  disableAnimation?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  clickable: false,
  showShine: true,
  variant: 'default',
  padding: 'md',
  animationDelay: 0,
  disableAnimation: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<template>
  <div
    class="glass-card"
    :class="[
      `variant-${variant}`,
      `padding-${padding}`,
      { 'is-clickable': clickable, 'show-shine': showShine }
    ]"
    :style="{
      '--animation-delay': `${animationDelay}ms`,
      animationDelay: `${animationDelay}ms`
    }"
    @click="handleClick"
  >
    <div v-if="showShine" class="card-shine"></div>
    <div class="card-content">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  position: relative;
  border-radius: var(--radius-2xl);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-spring);
}

/* 光效层 */
.card-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, transparent 100%);
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.glass-card.show-shine:hover .card-shine {
  opacity: 1;
}

/* 内容区域 */
.card-content {
  position: relative;
  z-index: 1;
}

/* 页脚区域 */
.card-footer {
  position: relative;
  z-index: 1;
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-secondary);
}

/* 变体样式 */
.variant-default {
  background: var(--glass-bg);
}

.variant-elevated {
  background: var(--glass-bg-hover);
  box-shadow: var(--glass-shadow-hover);
}

.variant-bordered {
  background: transparent;
  border: 2px solid var(--glass-border);
  box-shadow: none;
}

/* 内边距 */
.padding-none {
  padding: 0;
}

.padding-sm {
  padding: var(--space-3);
}

.padding-md {
  padding: var(--space-5);
}

.padding-lg {
  padding: var(--space-6);
}

.padding-xl {
  padding: var(--space-8);
}

/* 可点击状态 */
.is-clickable {
  cursor: pointer;
}

.is-clickable:hover {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
  box-shadow: var(--glass-shadow-hover);
  transform: translateY(-8px) scale(1.02);
}

.is-clickable:active {
  transform: scale(0.96);
}

/* 入场动画 */
.glass-card:not(.disable-animation) {
  animation: cardEnter var(--duration-slow) var(--ease-spring) backwards;
  animation-delay: var(--animation-delay, 0ms);
}

@keyframes cardEnter {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 性能优化 */
.glass-card {
  will-change: transform;
  transform: translateZ(0);
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .glass-card {
    animation: none !important;
    transition: none !important;
  }
  
  .is-clickable:hover {
    transform: none;
  }
}
</style>
