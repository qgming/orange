export interface ApiEnvelope<T> {
  data?: T
}

const API_HOSTS = [
  'https://60s.viki.moe',
  'https://60api.09cdn.xyz',
  'https://60s.zeabur.app',
  'https://60s.crystelf.top',
  'https://cqxx.site',
  'https://api.yanyua.icu',
  'https://60s.tmini.net',
  'https://60s.7se.cn',
  'https://60s.mizhoubaobei.top',
]

let currentHostIndex = 0

export const fetchSixtySecondsApi = async <T>(endpoint: string): Promise<T | null> => {
  for (let i = 0; i < API_HOSTS.length; i += 1) {
    try {
      const hostIndex = (currentHostIndex + i) % API_HOSTS.length
      const response = await fetch(`${API_HOSTS[hostIndex]}${endpoint}`, {
        signal: AbortSignal.timeout(5000),
      })

      if (!response.ok) continue

      currentHostIndex = hostIndex
      return (await response.json()) as T
    } catch {
      continue
    }
  }

  return null
}

export const fetchSixtySecondsData = async <T>(endpoint: string): Promise<T | null> => {
  const result = await fetchSixtySecondsApi<ApiEnvelope<T>>(endpoint)
  return result?.data ?? null
}
