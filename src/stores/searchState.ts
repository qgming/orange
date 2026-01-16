import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'orange-search-history'
const MAX_HISTORY_SIZE = 20

export const useSearchStateStore = defineStore('searchState', () => {
  const currentQuery = ref('')
  const currentSiteIndex = ref(0)
  const searchHistory = ref<string[]>([])

  const setQuery = (query: string) => {
    currentQuery.value = query
  }

  const setSiteIndex = (index: number) => {
    currentSiteIndex.value = index
  }

  const addToHistory = (query: string) => {
    if (!query.trim()) return

    const filtered = searchHistory.value.filter(item => item !== query)
    searchHistory.value = [query, ...filtered].slice(0, MAX_HISTORY_SIZE)
    saveHistoryToStorage()
  }

  const removeFromHistory = (query: string) => {
    searchHistory.value = searchHistory.value.filter(item => item !== query)
    saveHistoryToStorage()
  }

  const clearHistory = () => {
    searchHistory.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  const loadHistoryFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        searchHistory.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load search history:', error)
    }
  }

  const saveHistoryToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory.value))
    } catch (error) {
      console.error('Failed to save search history:', error)
    }
  }

  loadHistoryFromStorage()

  return {
    currentQuery,
    currentSiteIndex,
    searchHistory,
    setQuery,
    setSiteIndex,
    addToHistory,
    removeFromHistory,
    clearHistory,
    loadHistoryFromStorage
  }
})
