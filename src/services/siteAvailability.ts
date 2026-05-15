export type SiteAvailabilityStatus = 'online' | 'offline' | 'unknown'

interface SiteAvailabilityOptions {
  cache?: boolean
  timeout?: number
}

const DEFAULT_TIMEOUT = 4000
const statusCache = new Map<string, SiteAvailabilityStatus>()
const pendingRequests = new Map<string, Promise<SiteAvailabilityStatus>>()

const createTimeoutController = (timeout: number) => {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeout)

  return {
    signal: controller.signal,
    cleanup: () => window.clearTimeout(timer),
  }
}

const classifyResponse = (response: Response): SiteAvailabilityStatus => {
  if (response.ok) return 'online'
  if ([401, 403, 404].includes(response.status) || response.status >= 500) return 'offline'
  return 'unknown'
}

const probeWithFetch = async (url: string, method: 'HEAD' | 'GET', timeout: number) => {
  const { signal, cleanup } = createTimeoutController(timeout)

  try {
    return await fetch(url, {
      method,
      mode: 'no-cors',
      cache: 'no-store',
      redirect: 'follow',
      signal,
    })
  } finally {
    cleanup()
  }
}

const probeDirectFavicon = async (url: URL, timeout: number): Promise<SiteAvailabilityStatus> => {
  const faviconUrl = new URL('/favicon.ico', url).toString()

  return await new Promise(resolve => {
    const img = new Image()
    const timer = window.setTimeout(() => {
      cleanup()
      resolve('unknown')
    }, timeout)

    const cleanup = () => {
      window.clearTimeout(timer)
      img.onload = null
      img.onerror = null
    }

    img.onload = () => {
      cleanup()
      resolve('online')
    }

    img.onerror = () => {
      cleanup()
      resolve('unknown')
    }

    img.referrerPolicy = 'no-referrer'
    img.src = faviconUrl
  })
}

const isMixedContentProbe = (url: URL) => {
  return window.location.protocol === 'https:' && url.protocol === 'http:'
}

const isExplicitReadableResponse = (response: Response) => {
  return response.type === 'basic' || response.type === 'cors'
}

export const getSiteAvailability = async (
  rawUrl: string,
  options: SiteAvailabilityOptions = {},
): Promise<SiteAvailabilityStatus> => {
  const { cache = true, timeout = DEFAULT_TIMEOUT } = options

  if (cache && statusCache.has(rawUrl)) {
    return statusCache.get(rawUrl) as SiteAvailabilityStatus
  }

  if (cache && pendingRequests.has(rawUrl)) {
    return pendingRequests.get(rawUrl) as Promise<SiteAvailabilityStatus>
  }

  const request = (async () => {
    try {
      const url = new URL(rawUrl)

      if (!['http:', 'https:'].includes(url.protocol)) {
        return 'offline'
      }

      if (isMixedContentProbe(url)) {
        return 'unknown'
      }

      try {
        const getResponse = await probeWithFetch(url.toString(), 'GET', timeout)
        const getStatus = classifyResponse(getResponse)

        if (isExplicitReadableResponse(getResponse)) {
          return getStatus
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return 'unknown'
        }
      }

      try {
        const headResponse = await probeWithFetch(url.toString(), 'HEAD', timeout)
        const headStatus = classifyResponse(headResponse)

        if (isExplicitReadableResponse(headResponse)) {
          return headStatus
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return 'unknown'
        }
      }

      return await probeDirectFavicon(url, timeout)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'unknown'
      }

      return 'unknown'
    }
  })()

  if (cache) {
    pendingRequests.set(rawUrl, request)
  }

  try {
    const result = await request
    if (cache) {
      statusCache.set(rawUrl, result)
    }
    return result
  } finally {
    pendingRequests.delete(rawUrl)
  }
}
