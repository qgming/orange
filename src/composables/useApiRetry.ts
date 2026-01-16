import { ref } from 'vue'
import type { ApiRetryOptions } from '@/types'

export function useApiRetry<T>(
  apiHosts: string[],
  options: ApiRetryOptions = {}
) {
  const {
    maxRetries = apiHosts.length,
    timeout = 5000,
    onRetry
  } = options

  const currentHostIndex = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchWithRetry = async (endpoint: string): Promise<T> => {
    isLoading.value = true
    error.value = null

    for (let i = 0; i < maxRetries; i++) {
      const hostIndex = (currentHostIndex.value + i) % apiHosts.length
      const host = apiHosts[hostIndex]

      try {
        onRetry?.(i, host)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(`${host}${endpoint}`, {
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' }
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()
        currentHostIndex.value = hostIndex
        isLoading.value = false
        return data
      } catch (err) {
        if (i === maxRetries - 1) {
          error.value = err instanceof Error ? err.message : 'Unknown error'
          throw err
        }
        continue
      }
    }

    isLoading.value = false
    throw new Error('All API hosts failed')
  }

  return {
    fetchWithRetry,
    currentHostIndex,
    isLoading,
    error
  }
}
