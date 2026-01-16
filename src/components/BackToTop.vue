<script setup lang="ts">
interface Props {
  show: boolean
}

interface Emits {
  (e: 'click'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <Transition name="fade">
    <button
      v-if="show"
      @click="handleClick"
      class="back-to-top"
      aria-label="返回顶部"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #2d3748;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(31, 38, 135, 0.15);
  z-index: 1000;
}

.back-to-top:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(31, 38, 135, 0.25);
}

.back-to-top:active {
  transform: translateY(-2px);
}

.back-to-top svg {
  transition: transform 0.3s ease;
}

.back-to-top:hover svg {
  transform: translateY(-2px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 640px) {
  .back-to-top {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 48px;
    height: 48px;
  }

  .back-to-top svg {
    width: 20px;
    height: 20px;
  }
}
</style>
