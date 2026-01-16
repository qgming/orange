import { ref, computed } from 'vue'
import type { VideoSiteCategory } from '@/types'

export function useCategoryFilter(sites: VideoSiteCategory) {
  const activeCategory = ref('全部')

  const categories = computed(() => {
    return ['全部', '推荐', ...Object.keys(sites)]
  })

  const filteredSites = computed(() => {
    if (activeCategory.value === '全部') {
      return sites
    }

    if (activeCategory.value === '推荐') {
      const recommended: VideoSiteCategory = {}
      Object.entries(sites).forEach(([category, siteList]) => {
        const recommendedSites = siteList.filter(site => site.isRecommended)
        if (recommendedSites.length > 0) {
          recommended[category] = recommendedSites
        }
      })
      return recommended
    }

    return {
      [activeCategory.value]: sites[activeCategory.value] || []
    }
  })

  const totalSitesCount = computed(() => {
    return Object.values(sites).reduce(
      (count, categorySites) => count + categorySites.length,
      0
    )
  })

  const recommendedSitesCount = computed(() => {
    return Object.values(sites).reduce(
      (count, categorySites) =>
        count + categorySites.filter(site => site.isRecommended).length,
      0
    )
  })

  const setCategory = (category: string) => {
    activeCategory.value = category
  }

  return {
    activeCategory,
    categories,
    filteredSites,
    totalSitesCount,
    recommendedSitesCount,
    setCategory
  }
}
