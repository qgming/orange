// 搜索站点配置
export const searchSites = [
  { name: '追影猫', url: 'https://zhuiyingmao5.com/vodsearch/-------------.html?wd=' },
  { name: '搜片', url: 'https://soupian.plus/frame?movie=' },
  { name: 'VidHub', url: 'https://vidhub.tv/vodsearch/-------------.html?wd=' }
]

/**
 * 执行搜索
 * @param {string} query - 搜索关键词
 * @param {number} siteIndex - 搜索站点索引，默认为 0（追影猫）
 */
export const performSearch = (query, siteIndex = 0) => {
  if (!query || typeof query !== 'string') {
    console.warn('搜索关键词无效')
    return
  }

  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    console.warn('搜索关键词为空')
    return
  }

  const site = searchSites[siteIndex] || searchSites[0]
  const searchUrl = site.url + encodeURIComponent(trimmedQuery)
  window.open(searchUrl, '_blank')
}

/**
 * 获取搜索站点名称
 * @param {number} siteIndex - 搜索站点索引
 * @returns {string} 站点名称
 */
export const getSearchSiteName = (siteIndex = 0) => {
  const site = searchSites[siteIndex] || searchSites[0]
  return site.name
}
