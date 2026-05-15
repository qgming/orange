import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { DoubanWeeklyItem, DoubanWeeklyTab } from '@/types'
import {
  createEmptyDoubanWeeklyErrors,
  createEmptyDoubanWeeklyRankings,
  doubanWeeklyTabs,
  fetchDoubanWeeklyItems,
} from '@/services/doubanWeekly'

export const useDoubanWeeklyStore = defineStore('doubanWeekly', () => {
  const loading = ref(false)
  const loaded = ref(false)
  const rankings = ref<Record<DoubanWeeklyTab, DoubanWeeklyItem[]>>(createEmptyDoubanWeeklyRankings())
  const errors = ref<Record<DoubanWeeklyTab, string | null>>(createEmptyDoubanWeeklyErrors())

  const fetchAll = async (options: { force?: boolean } = {}) => {
    if (loading.value || (loaded.value && !options.force)) return

    loading.value = true

    const responses = await Promise.all(
      doubanWeeklyTabs.map(async (tab) => {
        const items = await fetchDoubanWeeklyItems(tab.endpoint)
        return {
          key: tab.key,
          items: items ?? rankings.value[tab.key],
          failed: !items,
        }
      }),
    )

    const nextRankings = { ...rankings.value }
    const nextErrors = { ...errors.value }

    responses.forEach(({ key, items, failed }) => {
      nextRankings[key] = items
      nextErrors[key] = failed ? '这一份周榜暂时连接不上，可能是上游接口波动。' : null
    })

    rankings.value = nextRankings
    errors.value = nextErrors
    loaded.value = true
    loading.value = false
  }

  const tabCounts = computed(() => {
    return doubanWeeklyTabs.reduce<Record<DoubanWeeklyTab, number>>((result, tab) => {
      result[tab.key] = rankings.value[tab.key]?.length ?? 0
      return result
    }, {
      movie: 0,
      tv_chinese: 0,
      tv_global: 0,
      show_chinese: 0,
      show_global: 0,
    })
  })

  return {
    loading,
    loaded,
    rankings,
    errors,
    tabCounts,
    fetchAll,
  }
})
