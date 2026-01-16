import { computed } from 'vue'

export function useSearch(searchStore: any, performSearchService: any) {
  const searchQuery = computed({
    get: () => searchStore.currentQuery,
    set: (value: string) => searchStore.setQuery(value)
  })

  const currentSiteIndex = computed({
    get: () => searchStore.currentSiteIndex,
    set: (value: number) => searchStore.setSiteIndex(value)
  })

  const performSearch = (query?: string, siteIndex?: number) => {
    const finalQuery = query ?? searchQuery.value
    const finalSiteIndex = siteIndex ?? currentSiteIndex.value

    if (!finalQuery.trim()) return

    searchStore.addToHistory(finalQuery)
    performSearchService(finalQuery, finalSiteIndex)
  }

  return {
    searchQuery,
    currentSiteIndex,
    searchHistory: computed(() => searchStore.searchHistory),
    performSearch,
    clearHistory: () => searchStore.clearHistory(),
    removeFromHistory: (query: string) => searchStore.removeFromHistory(query)
  }
}
