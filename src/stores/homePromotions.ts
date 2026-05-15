import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { HomePromotionsConfig } from '@/types'
import { fetchRemotePromotions, localHomePromotions } from '@/services/homePromotions'

export const useHomePromotionsStore = defineStore('homePromotions', () => {
  const loading = ref(false)
  const loaded = ref(false)
  const promotionsConfig = ref<HomePromotionsConfig | null>(null)

  const visiblePromotions = computed(() => promotionsConfig.value?.items.filter(item => item.isVisible) ?? [])
  const shouldShow = computed(() => {
    if (!loaded.value || !promotionsConfig.value) return false
    return Boolean(promotionsConfig.value.isVisible && visiblePromotions.value.length > 0)
  })

  const loadPromotions = async (options: { force?: boolean } = {}) => {
    if (loading.value || (loaded.value && !options.force)) return

    loading.value = true
    promotionsConfig.value = (await fetchRemotePromotions({ force: options.force })) ?? localHomePromotions
    loaded.value = true
    loading.value = false
  }

  return {
    loading,
    loaded,
    promotionsConfig,
    visiblePromotions,
    shouldShow,
    loadPromotions,
  }
})
