import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { VideoSiteCategory } from '@/types'
import { fetchRemoteSites, localVideoSites } from '@/services/siteDirectory'

export const useSiteDirectoryStore = defineStore('siteDirectory', () => {
  const loading = ref(false)
  const loaded = ref(false)
  const videoSites = ref<VideoSiteCategory>({})

  const categories = computed(() => ['全部', '推荐', ...Object.keys(videoSites.value)])
  const totalCount = computed(() => Object.values(videoSites.value).reduce((sum, sites) => sum + sites.length, 0))
  const recommendedCount = computed(() => {
    return Object.values(videoSites.value).reduce((sum, sites) => sum + sites.filter(site => site.isRecommended).length, 0)
  })

  const categoryCount = (category: string) => {
    if (category === '全部') return totalCount.value
    if (category === '推荐') return recommendedCount.value
    return videoSites.value[category]?.length ?? 0
  }

  const filteredSites = (category: string) => {
    if (category === '全部') return videoSites.value

    if (category === '推荐') {
      const filtered: VideoSiteCategory = {}
      Object.entries(videoSites.value).forEach(([siteCategory, sites]) => {
        const recommended = sites.filter(site => site.isRecommended)
        if (recommended.length) filtered[siteCategory] = recommended
      })
      return filtered
    }

    const sites = videoSites.value[category]
    return sites ? { [category]: sites } : {}
  }

  const loadSites = async () => {
    if (loading.value || loaded.value) return

    loading.value = true
    videoSites.value = (await fetchRemoteSites()) ?? localVideoSites
    loaded.value = true
    loading.value = false
  }

  return {
    loading,
    loaded,
    videoSites,
    categories,
    totalCount,
    recommendedCount,
    categoryCount,
    filteredSites,
    loadSites,
  }
})
