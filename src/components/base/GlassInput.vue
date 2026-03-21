<script setup lang="ts">
/**
 * GlassInput - Liquid Glass 输入框组件
 * 提供统一的玻璃态输入框样式和交互效果
 */
import { ref, computed } from 'vue'

interface Props {
  /** 输入框类型 */
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'
  /** 占位符文本 */
  placeholder?: string
  /** 输入框值 */
  modelValue?: string | number
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 是否显示清除按钮 */
  clearable?: boolean
  /** 输入框大小 */
  size?: 'sm' | 'md' | 'lg'
  /** 前缀图标 */
  prefixIcon?: string
  /** 后缀图标 */
  suffixIcon?: string
  /** 最大长度 */
  maxlength?: number
  /** 是否显示字数统计 */
  showWordLimit?: boolean
  /** 输入框变体 */
  variant?: 'default' | 'filled' | 'bordered'
  /** 错误状态 */
  error?: boolean
  /** 错误信息 */
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  modelValue: '',
  disabled: false,
  readonly: false,
  clearable: false,
  size: 'md',
  maxlength: undefined,
  showWordLimit: false,
  variant: 'default',
  error: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'clear': []
  'input': [event: Event]
  'change': [event: Event]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const hasValue = computed(() => {
  return inputValue.value !== '' && inputValue.value !== undefined && inputValue.value !== null
})

const charCount = computed(() => {
  return String(inputValue.value || '').length
})

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleClear = () => {
  inputValue.value = ''
  emit('clear')
  inputRef.value?.focus()
}

const handleInput = (event: Event) => {
  emit('input', event)
}

const handleChange = (event: Event) => {
  emit('change', event)
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

defineExpose({
  focus,
  blur,
  inputRef
})
</script>

<template>
  <div
    class="glass-input-wrapper"
    :class="[
      `size-${size}`,
      `variant-${variant}`,
      {
        'is-focused': isFocused,
        'is-disabled': disabled,
        'is-readonly': readonly,
        'has-value': hasValue,
        'has-error': error,
        'has-prefix': prefixIcon || $slots.prefix,
        'has-suffix': suffixIcon || $slots.suffix || clearable
      }
    ]"
  >
    <!-- 前缀图标 -->
    <div v-if="prefixIcon || $slots.prefix" class="input-prefix">
      <slot name="prefix">
        <svg v-if="prefixIcon" class="prefix-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <template v-if="prefixIcon === 'search'">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </template>
          <template v-else-if="prefixIcon === 'user'">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </template>
          <template v-else-if="prefixIcon === 'mail'">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </template>
          <template v-else-if="prefixIcon === 'lock'">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </template>
        </svg>
      </slot>
    </div>

    <!-- 输入框 -->
    <input
      ref="inputRef"
      :type="type"
      class="glass-input"
      v-model="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
      @change="handleChange"
    />

    <!-- 后缀内容 -->
    <div class="input-suffix">
      <!-- 清除按钮 -->
      <button
        v-if="clearable && hasValue && !disabled && !readonly"
        type="button"
        class="clear-btn"
        @click="handleClear"
        aria-label="清除"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </button>

      <!-- 后缀图标 -->
      <slot name="suffix">
        <svg v-if="suffixIcon" class="suffix-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <template v-if="suffixIcon === 'eye'">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </template>
          <template v-else-if="suffixIcon === 'eye-off'">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </template>
        </svg>
      </slot>

      <!-- 字数统计 -->
      <span v-if="showWordLimit && maxlength" class="word-limit">
        {{ charCount }} / {{ maxlength }}
      </span>
    </div>

    <!-- 光效层 -->
    <div class="input-shine"></div>
  </div>
</template>

<style scoped>
.glass-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  transition: all var(--duration-normal) var(--ease-out);
  overflow: hidden;
}

/* 光效层 */
.input-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 100%);
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.glass-input-wrapper.is-focused .input-shine {
  opacity: 1;
}

/* 尺寸变体 */
.size-sm {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
}

.size-md {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-xl);
  font-size: var(--text-base);
}

.size-lg {
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-2xl);
  font-size: var(--text-lg);
}

/* 样式变体 */
.variant-default {
  background: var(--glass-bg);
}

.variant-filled {
  background: var(--bg-tertiary);
  border-color: transparent;
}

.variant-bordered {
  background: transparent;
  border: 2px solid var(--glass-border);
}

/* 输入框 */
.glass-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: var(--font-family-sans);
  font-weight: var(--font-medium);
  outline: none;
  width: 100%;
  min-width: 0;
}

.glass-input::placeholder {
  color: var(--text-muted);
}

/* 前缀 */
.input-prefix {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--space-2);
  color: var(--text-tertiary);
}

.prefix-icon {
  flex-shrink: 0;
}

/* 后缀 */
.input-suffix {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin-left: var(--space-2);
  color: var(--text-tertiary);
}

.suffix-icon {
  flex-shrink: 0;
}

/* 清除按钮 */
.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-1);
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  border-radius: var(--radius-full);
  transition: all var(--duration-fast) var(--ease-out);
}

.clear-btn:hover {
  background: var(--glass-bg-hover);
  color: var(--text-primary);
}

/* 字数统计 */
.word-limit {
  font-size: var(--text-xs);
  color: var(--text-muted);
  white-space: nowrap;
}

/* 状态样式 */
.glass-input-wrapper.is-focused {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(255, 160, 122, 0.2);
}

.glass-input-wrapper.is-focused .input-shine {
  opacity: 1;
}

.glass-input-wrapper.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.glass-input-wrapper.is-disabled .glass-input {
  cursor: not-allowed;
}

.glass-input-wrapper.is-readonly {
  background: var(--bg-tertiary);
}

.glass-input-wrapper.has-error {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.glass-input-wrapper.has-error.is-focused {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
}

/* 悬停效果 */
.glass-input-wrapper:not(.is-disabled):not(.is-focused):hover {
  border-color: var(--glass-border-hover);
  background: var(--glass-bg-hover);
}

/* 性能优化 */
.glass-input-wrapper {
  will-change: transform;
  transform: translateZ(0);
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .glass-input-wrapper {
    transition: none !important;
  }
  
  .input-shine {
    display: none;
  }
}
</style>
