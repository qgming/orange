<script setup lang="ts">
/**
 * GlassButton - Liquid Glass 按钮组件
 * 提供统一的玻璃态按钮样式和交互效果
 */

interface Props {
  /** 按钮变体 */
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'danger'
  /** 按钮大小 */
  size?: 'sm' | 'md' | 'lg'
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 是否全宽 */
  fullWidth?: boolean
  /** 图标位置 */
  iconPosition?: 'left' | 'right'
  /** 按钮类型 */
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  iconPosition: 'left',
  type: 'button'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :type="type"
    class="glass-btn"
    :class="[
      `variant-${variant}`,
      `size-${size}`,
      { 
        'is-disabled': disabled,
        'is-loading': loading,
        'full-width': fullWidth,
        'has-icon': $slots.icon
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="loading-spinner">
      <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    
    <span v-if="$slots.icon && iconPosition === 'left' && !loading" class="btn-icon icon-left">
      <slot name="icon"></slot>
    </span>
    
    <span class="btn-content">
      <slot></slot>
    </span>
    
    <span v-if="$slots.icon && iconPosition === 'right' && !loading" class="btn-icon icon-right">
      <slot name="icon"></slot>
    </span>
    
    <span class="btn-shine"></span>
  </button>
</template>

<style scoped>
.glass-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  font-family: var(--font-family-sans);
  font-weight: var(--font-semibold);
  cursor: pointer;
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-out);
  white-space: nowrap;
  text-decoration: none;
}

/* 光效层 */
.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--gradient-shine);
  transition: left var(--duration-slow) var(--ease-out);
  pointer-events: none;
}

.glass-btn:hover:not(.is-disabled) .btn-shine {
  left: 100%;
}

/* 尺寸变体 */
.size-sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  border-radius: var(--radius-lg);
}

.size-md {
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-base);
  border-radius: var(--radius-xl);
}

.size-lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-lg);
  border-radius: var(--radius-2xl);
}

/* 颜色变体 */
.variant-default {
  background: var(--glass-bg);
  border-color: var(--glass-border);
}

.variant-default:hover:not(.is-disabled) {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
  transform: translateY(-2px);
  box-shadow: var(--glass-shadow);
}

.variant-primary {
  background: var(--gradient-accent);
  border-color: var(--color-accent);
  color: #ffffff;
}

.variant-primary:hover:not(.is-disabled) {
  background: linear-gradient(135deg, var(--color-accent-light) 0%, var(--color-accent) 100%);
  border-color: var(--color-accent-light);
  box-shadow: 0 8px 24px rgba(255, 160, 122, 0.4);
  transform: translateY(-2px);
}

.variant-secondary {
  background: var(--gradient-primary);
  border-color: var(--color-primary);
  color: #ffffff;
}

.variant-secondary:hover:not(.is-disabled) {
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
  border-color: var(--color-primary-light);
  box-shadow: 0 8px 24px rgba(142, 197, 252, 0.4);
  transform: translateY(-2px);
}

.variant-ghost {
  background: transparent;
  border-color: transparent;
}

.variant-ghost:hover:not(.is-disabled) {
  background: var(--glass-bg);
  border-color: var(--glass-border);
}

.variant-danger {
  background: linear-gradient(135deg, var(--color-error) 0%, var(--color-error-light) 100%);
  border-color: var(--color-error);
  color: #ffffff;
}

.variant-danger:hover:not(.is-disabled) {
  background: linear-gradient(135deg, var(--color-error-light) 0%, var(--color-error) 100%);
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
  transform: translateY(-2px);
}

/* 激活状态 */
.glass-btn:active:not(.is-disabled) {
  transform: scale(0.96);
}

/* 禁用状态 */
.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* 加载状态 */
.is-loading {
  cursor: wait;
}

.is-loading .btn-content {
  opacity: 0.7;
}

/* 全宽 */
.full-width {
  width: 100%;
}

/* 图标 */
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-left {
  margin-right: var(--space-1);
}

.icon-right {
  margin-left: var(--space-1);
}

/* 加载动画 */
.loading-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--space-2);
}

.loading-spinner svg {
  width: 1em;
  height: 1em;
}

/* 性能优化 */
.glass-btn {
  will-change: transform;
  transform: translateZ(0);
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .glass-btn {
    transition: none !important;
  }
  
  .glass-btn:hover:not(.is-disabled) {
    transform: none;
  }
  
  .btn-shine {
    display: none;
  }
}
</style>
