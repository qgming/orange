import { onMounted, watchEffect } from 'vue'

interface PageMetaOptions {
  title: string
  description?: string
  robots?: string
  canonicalPath?: string
}

const APP_NAME = '橘子导航'
const DEFAULT_DESCRIPTION = '橘子导航提供影视、动漫、短剧、阅读、工具与社区站点聚合，支持热门搜索、网站导航、实时榜单与豆瓣周榜。'
const DEFAULT_ROBOTS = 'index, follow'

const setOrCreateMeta = (selector: string, create: () => HTMLMetaElement | HTMLLinkElement, apply: (el: HTMLMetaElement | HTMLLinkElement) => void) => {
  if (typeof document === 'undefined') return

  const existing = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null
  const element = existing ?? create()
  apply(element)

  if (!existing) {
    document.head.appendChild(element)
  }
}

const setMetaContent = (selector: string, create: () => HTMLMetaElement, content: string) => {
  setOrCreateMeta(selector, create, (element) => {
    element.setAttribute('content', content)
  })
}

export const usePageMeta = (options: PageMetaOptions) => {
  const applyMeta = () => {
    if (typeof document === 'undefined') return

    document.title = options.title

    const description = options.description ?? DEFAULT_DESCRIPTION
    const robots = options.robots ?? DEFAULT_ROBOTS

    setMetaContent('meta[name="description"]', () => {
      const meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      return meta
    }, description)

    setMetaContent('meta[name="robots"]', () => {
      const meta = document.createElement('meta')
      meta.setAttribute('name', 'robots')
      return meta
    }, robots)

    setMetaContent('meta[property="og:title"]', () => {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:title')
      return meta
    }, options.title)

    setMetaContent('meta[property="og:description"]', () => {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:description')
      return meta
    }, description)

    setMetaContent('meta[property="og:site_name"]', () => {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:site_name')
      return meta
    }, APP_NAME)

    setMetaContent('meta[name="twitter:title"]', () => {
      const meta = document.createElement('meta')
      meta.setAttribute('name', 'twitter:title')
      return meta
    }, options.title)

    setMetaContent('meta[name="twitter:description"]', () => {
      const meta = document.createElement('meta')
      meta.setAttribute('name', 'twitter:description')
      return meta
    }, description)

    const canonicalPath = options.canonicalPath

    if (canonicalPath) {
      const canonicalUrl = new URL(canonicalPath, window.location.origin).toString()

      setOrCreateMeta('link[rel="canonical"]', () => {
        const link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        return link
      }, (element) => {
        element.setAttribute('href', canonicalUrl)
      })

      setMetaContent('meta[property="og:url"]', () => {
        const meta = document.createElement('meta')
        meta.setAttribute('property', 'og:url')
        return meta
      }, canonicalUrl)
    }
  }

  onMounted(applyMeta)
  watchEffect(applyMeta)
}
