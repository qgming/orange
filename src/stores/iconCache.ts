import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useIconCacheStore = defineStore('iconCache', () => {
  const cache = ref(new Map<string, string>())
  const cacheHitCount = ref(0)
  const cacheMissCount = ref(0)

  const setIcon = (key: string, url: string) => {
    cache.value.set(key, url)
  }

  const getIcon = (key: string): string | undefined => {
    const icon = cache.value.get(key)
    if (icon) {
      cacheHitCount.value++
    } else {
      cacheMissCount.value++
    }
    return icon
  }

  const hasIcon = (key: string): boolean => {
    return cache.value.has(key)
  }

  const clearCache = () => {
    cache.value.clear()
    cacheHitCount.value = 0
    cacheMissCount.value = 0
  }

  const cacheStats = computed(() => ({
    size: cache.value.size,
    hits: cacheHitCount.value,
    misses: cacheMissCount.value,
    hitRate: cacheHitCount.value / (cacheHitCount.value + cacheMissCount.value) || 0
  }))

  return {
    cache,
    setIcon,
    getIcon,
    hasIcon,
    clearCache,
    cacheStats
  }
})
