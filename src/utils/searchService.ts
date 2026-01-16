import type { SearchSite } from '@/types'

// 搜索站点配置
export const searchSites: SearchSite[] = [
  { name: "247看", url: "https://247kan.com/search?q=" },
  { name: "简单TV", url: "https://jiandantv.com/?key=" },
  { name: "搜片", url: "https://soupian.plus/frame?movie=" },
  {
    name: "追影猫",
    url: "https://zhuiyingmao5.com/vodsearch/-------------.html?wd=",
  },
  {
    name: "奈飞工厂",
    url: "https://www.netflixgc.com/vodsearch/-------------.html?wd=",
  },
]

/**
 * 执行搜索
 * @param query - 搜索关键词
 * @param siteIndex - 搜索站点索引，默认为 0
 */
export const performSearch = (query: string, siteIndex = 0): void => {
  if (!query || typeof query !== "string") {
    console.warn("搜索关键词无效")
    return
  }

  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    console.warn("搜索关键词为空")
    return
  }

  const site = searchSites[siteIndex] || searchSites[0]
  const searchUrl = site.url + encodeURIComponent(trimmedQuery)
  window.open(searchUrl, "_blank")
}

/**
 * 获取搜索站点名称
 * @param siteIndex - 搜索站点索引
 * @returns 站点名称
 */
export const getSearchSiteName = (siteIndex = 0): string => {
  const site = searchSites[siteIndex] || searchSites[0]
  return site.name
}
