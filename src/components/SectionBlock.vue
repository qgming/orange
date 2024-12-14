<template>
  <div class="section">
    <div class="section-header">
      <h3>{{ title }}</h3>
      <button 
        class="expand-btn" 
        @click="toggleExpand" 
        v-if="items.length > getDefaultVisibleCount()"
      >
        {{ isExpanded ? '收起' : '展开' }}
        <span class="arrow" :class="{ 'arrow-up': isExpanded }">▼</span>
      </button>
    </div>
    <div class="cardContainer">
      <div 
        v-for="item in visibleItems" 
        :key="item.id" 
        class="card" 
        @click="goToUrl(item.url)"
      >
        <div class="logo-container">
          <img 
            v-if="hasFavicon(item.url)" 
            :src="getFavicon(item.url)" 
            alt="logo" 
            class="logo" 
            @error="handleFaviconError(item.url)"
          />
          <div v-else class="text-logo">{{ getFirstChar(item.title) }}</div>
        </div>
        <a>{{ item.title }}</a>
        <div class="tooltip">{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  }
})

const isExpanded = ref(false)
const faviconCache = ref({})

// 每行显示的卡片数量（根据屏幕宽度动态计算）
const getCardsPerRow = () => {
  const width = window.innerWidth
  if (width >= 1024) return 5
  if (width >= 648) return 4
  return 3
}

// 计算默认显示的卡片数量（两行）
const getDefaultVisibleCount = () => getCardsPerRow() * 2

// 获取应该显示的卡片
const visibleItems = computed(() => {
  const visibleCount = isExpanded.value ? props.items.length : getDefaultVisibleCount()
  return props.items.slice(0, visibleCount)
})

// 切换展开状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const getFirstChar = (title) => {
  return title.charAt(0)
}

const getFavicon = (url) => {
  try {
    const hostname = new URL(url).hostname
    
    // 检查缓存
    if (faviconCache.value[hostname] === false) {
      return null
    }
    if (faviconCache.value[hostname]) {
      return faviconCache.value[hostname]
    }

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
    return faviconUrl
  } catch (e) {
    console.error('获取favicon出错:', e)
    return null
  }
}

const handleFaviconError = (url) => {
  try {
    const hostname = new URL(url).hostname
    faviconCache.value[hostname] = false
  } catch (e) {
    console.error('处理favicon错误时出错:', e)
  }
}

const hasFavicon = (url) => {
  try {
    const hostname = new URL(url).hostname
    return faviconCache.value[hostname] !== false
  } catch (e) {
    return false
  }
}

const goToUrl = (url) => {
  window.open(url, '_blank')
}
</script>

<style scoped>
.section {
  position: relative;
  margin-bottom: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0.75rem;
  position: relative;
  z-index: 1;
}

.section h3 {
  font-size: 1.5rem;
  color: #ff6b1a;
  margin: 0;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(255, 107, 26, 0.1);
}

.cardContainer {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  padding: 0.5rem;
  transition: all 0.3s ease-in-out;
}

.card {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 1rem;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.3s ease;
  text-align: center;
  width: calc(20% - 1rem);
  min-width: 140px;
  z-index: 1;
  position: relative;
  border: 1px solid rgba(255, 107, 26, 0.1);
  box-shadow: 0 2px 8px rgba(255, 107, 26, 0.05);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(255, 107, 26, 0.15);
  border-color: rgba(255, 107, 26, 0.2);
  z-index: 2;
}

.logo-container {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border-radius: 14px;
  background: #fff8f3;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 107, 26, 0.1);
}

.card:hover .logo-container {
  transform: scale(1.05);
  background: #fff1e6;
}

.logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.text-logo {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff8c3d;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
}

a {
  margin-top: 0.75rem;
  color: #444;
  font-size: 1rem;
  text-decoration: none;
  word-break: break-all;
  line-height: 1.4;
  max-width: 100%;
  font-weight: 500;
  transition: color 0.3s ease;
}

.card:hover a {
  color: #ff6b1a;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background-color: #ff6b1a;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 9999999;
  width: 200px;
  white-space: normal;
  word-wrap: break-word;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  box-shadow: 0 4px 12px rgba(255, 107, 26, 0.2);
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px 6px 0;
  border-style: solid;
  border-color: #ff6b1a transparent transparent;
}

.card:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-5px);
}

.expand-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 107, 26, 0.2);
  background-color: #fff8f3;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  color: #ff6b1a;
  transition: all 0.3s ease;
  font-weight: 500;
}

.expand-btn:hover {
  background-color: #fff1e6;
  border-color: rgba(255, 107, 26, 0.4);
}

.arrow {
  display: inline-block;
  transition: transform 0.3s ease;
  font-size: 0.75rem;
  color: #ff6b1a;
}

.arrow-up {
  transform: rotate(180deg);
}

@media (max-width: 1024px) {
  .section-header {
    padding: 1.25rem 0.5rem;
  }

  .card {
    width: calc(25% - 1rem);
  }

  .section h3 {
    font-size: 1.25rem;
  }
}

@media (max-width: 648px) {
  .section-header {
    padding: 1rem 0.5rem;
  }

  .card {
    width: calc(33.33% - 0.85rem);
    padding: 1rem;
  }

  .logo-container {
    width: 48px;
    height: 48px;
  }

  .logo, .text-logo {
    width: 32px;
    height: 32px;
  }

  .tooltip {
    width: 160px;
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }

  a {
    font-size: 0.875rem;
  }
}

@media (prefers-color-scheme: dark) {
  .section h3 {
    color: #ff8c3d;
  }

  .card {
    background: #222;
    border-color: rgba(255, 140, 61, 0.2);
  }

  .card:hover {
    border-color: rgba(255, 140, 61, 0.4);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  .logo-container {
    background: #2a2a2a;
    border-color: rgba(255, 140, 61, 0.2);
  }

  .card:hover .logo-container {
    background: #333;
  }

  .text-logo {
    background-color: #ff8c3d;
    color: #fff;
  }

  a {
    color: #bbb;
  }

  .card:hover a {
    color: #ff8c3d;
  }

  .tooltip {
    background-color: #ff8c3d;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .tooltip::after {
    border-color: #ff8c3d transparent transparent;
  }

  .expand-btn {
    background-color: #2a2a2a;
    border-color: rgba(255, 140, 61, 0.3);
    color: #ff8c3d;
  }

  .expand-btn:hover {
    background-color: #333;
    border-color: rgba(255, 140, 61, 0.5);
  }

  .arrow {
    color: #ff8c3d;
  }
}
</style>
