import type { SearchSite } from '@/types'

export const searchSites: SearchSite[] = [
  {
    name: '布布影视',
    url: 'https://bbys.app/search?q=',
  },
  { name: '247看', url: 'https://247kan.com/search?q=' },
  { name: '简单TV', url: 'https://jiandantv.com/?key=' },
  { name: '搜片', url: 'https://soupian.plus/frame?movie=' },
  {
    name: '奈飞工厂',
    url: 'https://www.netflixgc.com/vodsearch/-------------.html?wd=',
  },
]

export const performSearch = (query: string, siteIndex = 0): void => {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) return

  const site = searchSites[siteIndex] ?? searchSites[0]
  window.open(`${site.url}${encodeURIComponent(trimmedQuery)}`, '_blank')
}

export const getSearchSiteName = (siteIndex = 0): string => {
  const site = searchSites[siteIndex] ?? searchSites[0]
  return site.name
}
