<script setup lang="ts">
import type { VideoSite } from '@/types'

interface Props {
  site: VideoSite
  iconUrl?: string
  isLoading?: boolean
  cardIndex?: number
}

interface Emits {
  (e: 'click', event: MouseEvent, url: string): void
}

const props = withDefaults(defineProps<Props>(), {
  iconUrl: '',
  isLoading: false,
  cardIndex: 0
})

const emit = defineEmits<Emits>()

const handleClick = (event: MouseEvent) => {
  emit('click', event, props.site.url)
}
</script>

<template>
  <a
    :href="site.url"
    @click="handleClick"
    :style="{ '--card-index': cardIndex }"
    class="site-card"
  >
    <div class="site-icon-wrapper">
      <div v-if="isLoading" class="skeleton-icon"></div>
      <img
        v-else-if="iconUrl"
        :src="iconUrl"
        :alt="site.name"
        class="site-icon"
        loading="lazy"
      />
      <div v-else class="site-icon-placeholder">
        {{ site.name.charAt(0) }}
      </div>
    </div>
    <div class="site-info">
      <h3 class="site-name">{{ site.name }}</h3>
      <span v-if="site.isRecommended" class="recommended-badge">推荐</span>
    </div>
  </a>
</template>

<style scoped>
.site-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(31, 38, 135, 0.1);
  animation: fadeInUp 0.5s ease-out backwards;
  animation-delay: calc(var(--card-index) * 0.05s);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.site-card:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(31, 38, 135, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.site-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.site-card:hover::before {
  opacity: 1;
}

.site-icon-wrapper {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  position: relative;
}

.site-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
  padding: 8px;
  transition: transform 0.3s ease;
}

.site-card:hover .site-icon {
  transform: scale(1.1) rotate(5deg);
}

.site-icon-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 2rem;
  font-weight: 700;
  border-radius: 12px;
  text-transform: uppercase;
}

.skeleton-icon {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.2) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 12px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.site-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.site-name {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  text-align: center;
  margin: 0;
  word-break: break-word;
  line-height: 1.4;
}

.recommended-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
}

@media (max-width: 640px) {
  .site-card {
    padding: 1.25rem;
    border-radius: 16px;
  }

  .site-icon-wrapper {
    width: 56px;
    height: 56px;
  }

  .site-name {
    font-size: 0.9rem;
  }

  .recommended-badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
  }
}
</style>
