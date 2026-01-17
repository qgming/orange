<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { videoSites } from '../data/videoSites'
import type { VideoSite, VideoSiteCategory } from '@/types'
import { getWebsiteIcon } from '../utils/iconService'

// 处理链接点击，添加来源参数
const handleLinkClick = (event: MouseEvent, url: string) => {
  event.preventDefault()

  try {
    const urlObj = new URL(url)
    // 添加来源参数
    urlObj.searchParams.append('from', 'v.qgming.com')
    // 在新标签页打开
    window.open(urlObj.toString(), '_blank')
  } catch (e) {
    // 如果URL解析失败，直接打开原链接
    window.open(url, '_blank')
  }
}

const activeCategory = ref('全部') // 当前选中的分类
const siteIcons = ref(new Map<string, string>()) // 存储网站图标
const loadingIcons = ref(new Set<string>()) // 正在加载的图标
const isInitialLoading = ref(true) // 初始加载状态
const categoryTabsRef = ref<HTMLElement | null>(null) // 分类标签引用

// 获取网站主机名
const getHostname = (url: string): string => {
  try {
    return new URL(url).hostname
  } catch (e) {
    return url
  }
}

// 加载网站图标（优化版）
const loadSiteIcon = async (url: string, siteName: string): Promise<string> => {
  const key = `${siteName}-${url}`

  // 如果已加载，直接返回
  if (siteIcons.value.has(key)) {
    return siteIcons.value.get(key)!
  }

  // 标记为加载中
  loadingIcons.value.add(key)

  // 异步获取图标（总是返回有效值，失败时返回 emoji）
  const iconUrl = await getWebsiteIcon(url, { cache: true, siteName })
  siteIcons.value.set(key, iconUrl)
  loadingIcons.value.delete(key)
  return iconUrl
}

// 获取图标URL
const getSiteIcon = (url: string, siteName: string): string => {
  const key = `${siteName}-${url}`
  return siteIcons.value.get(key) || ''
}

// 检查图标是否已加载
const hasIconLoaded = (url: string, siteName: string): boolean => {
  const key = `${siteName}-${url}`
  return siteIcons.value.has(key) && !!siteIcons.value.get(key)
}





// 动态分类标签
const categories = computed(() => {
  return ['全部', '推荐', ...Object.keys(videoSites)]
})

// 筛选后的网站列表
const filteredSites = computed((): VideoSiteCategory => {
  if (activeCategory.value === '全部') {
    return videoSites
  } else if (activeCategory.value === '推荐') {
    const filtered: VideoSiteCategory = {}
    Object.entries(videoSites).forEach(([category, sites]) => {
      const categoryFilteredSites = sites.filter(site => site.isRecommended)
      if (categoryFilteredSites.length > 0) {
        filtered[category] = categoryFilteredSites
      }
    })
    return filtered
  } else {
    // 具体分类
    const sites = videoSites[activeCategory.value]
    return sites ? { [activeCategory.value]: sites } : {}
  }
})

// 计算总网站数量
const totalSitesCount = computed(() => {
  let count = 0
  Object.values(videoSites).forEach(categorySites => {
    count += categorySites.length
  })
  return count
})

// 计算推荐网站数量
const recommendedSitesCount = computed(() => {
  let count = 0
  Object.values(videoSites).forEach(categorySites => {
    categorySites.forEach(site => {
      if (site.isRecommended) {
        count++
      }
    })
  })
  return count
})

// 判断是否显示分类标题
const showCategoryTitles = computed(() => activeCategory.value === '全部')

// 智能预加载：优先加载推荐网站
const preloadRecommendedIcons = async () => {
  const recommendedSites: VideoSite[] = []

  Object.values(videoSites).forEach(categorySites => {
    categorySites.forEach(site => {
      if (site.isRecommended) {
        recommendedSites.push(site)
      }
    })
  })

  if (recommendedSites.length > 0) {
    console.log(`预加载 ${recommendedSites.length} 个推荐网站图标...`)
    // 并发加载推荐网站图标
    const promises = recommendedSites.map(site => loadSiteIcon(site.url, site.name))
    await Promise.allSettled(promises)
    console.log('推荐网站图标预加载完成')
  }
}

// 加载当前分类的图标（优化版）
const loadCurrentCategoryIcons = async () => {
  const currentSites = filteredSites.value
  const loadPromises: Promise<string>[] = []

  // 分批加载，避免一次性加载过多
  Object.values(currentSites).forEach((categorySites: VideoSite[]) => {
    categorySites.forEach(site => {
      loadPromises.push(loadSiteIcon(site.url, site.name))
    })
  })

  // 并发加载，但不阻塞UI
  Promise.all(loadPromises).then(() => {
    isInitialLoading.value = false
  })
}

// 返回顶部功能
const showBackToTop = ref(false)

const checkScroll = () => {
  showBackToTop.value = window.scrollY > 500
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 组件挂载后初始化（合并两个 onMounted）
onMounted(async () => {
  // 先预加载推荐网站图标
  await preloadRecommendedIcons()

  // 然后加载当前分类的所有图标
  loadCurrentCategoryIcons()

  // 添加滚动监听
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})

// 监听分类变化，加载对应图标
watch(activeCategory, () => {
  loadCurrentCategoryIcons()
  // 滑动到选择栏顶部
  if (categoryTabsRef.value) {
    categoryTabsRef.value.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    })
  }
})
</script>

<template>
  <div class="video-nav">
    <div class="nav-header">
      <div ref="categoryTabsRef" class="category-tabs">
        <button v-for="cat in categories" :key="cat" @click="activeCategory = cat"
          :class="{ active: activeCategory === cat }" class="tab-btn">
          <span class="button-content">
            {{ cat }}
            <span v-if="cat === '全部'" class="count">{{ totalSitesCount }}</span>
            <span v-else-if="cat === '推荐'" class="count">{{ recommendedSitesCount }}</span>
            <span v-else class="count">{{ videoSites[cat]?.length || 0 }}</span>
          </span>
        </button>
      </div>
    </div>

    <div v-for="(sites, category) in filteredSites" :key="category" class="category">
      <h2 v-if="showCategoryTitles">{{ category }}</h2>
      <div class="site-list">
        <a v-for="(site, index) in sites" :key="site.name" :href="site.url" @click="handleLinkClick($event, site.url)"
          :style="{ '--card-index': index }"
          class="site-card">
          <div class="card-header">
            <div class="site-icon-wrapper">
              <!-- 加载中或未加载时显示骨架屏 -->
              <div v-if="!hasIconLoaded(site.url, site.name)" class="icon-skeleton"></div>
              <!-- 图标 - 只在加载完成后显示 -->
              <template v-else>
                <!-- 如果是 emoji (单个字符),直接显示文本 -->
                <div v-if="getSiteIcon(site.url, site.name).length <= 2" class="site-icon-emoji">
                  {{ getSiteIcon(site.url, site.name) }}
                </div>
                <!-- 否则显示图片 -->
                <img v-else :src="getSiteIcon(site.url, site.name)" alt="" class="site-icon" loading="lazy" />
              </template>
            </div>
            <div class="site-info">
              <h3>
                {{ site.name }}
              </h3>
              <p class="site-url">{{ getHostname(site.url) }}</p>
            </div>
            <!-- 推荐角标 -->
            <div v-if="site.isRecommended" class="ribbon-badge" title="推荐站点">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>精选</span>
            </div>
          </div>
        </a>
      </div>
    </div>

    <!-- 返回顶部按钮 -->
    <Transition name="fade">
      <button v-show="showBackToTop" @click="scrollToTop" class="back-to-top" aria-label="返回顶部">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </Transition>
  </div>
</template>

<style scoped>
.video-nav {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 10;
}

.category-tabs {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 0.7rem 1.8rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 11;
}

.tab-btn:hover {
  background: rgba(255, 160, 122, 0.2);
  border-color: rgba(255, 160, 122, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 160, 122, 0.3);
}

.tab-btn.active {
  background: linear-gradient(135deg, rgba(255, 160, 122, 0.6), rgba(255, 184, 140, 0.6));
  color: #ffffff;
  border-color: rgba(255, 160, 122, 0.8);
  box-shadow: 0 8px 24px rgba(255, 160, 122, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.button-content {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.tab-btn .count {
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tab-btn:not(.active) .count {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 0.15);
}

.category {
  margin-bottom: 4rem;
}

.site-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.site-card {
  padding: 1.8rem;
  border-radius: 20px;
  background: rgba(30, 30, 50, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 160, 122, 0.15);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  text-decoration: none;
  display: block;
  animation: cardEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  animation-delay: calc(var(--card-index) * 0.03s);
}

@keyframes cardEnter {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.site-card:hover {
  transform: translateY(-8px) scale(1.02);
  background: rgba(40, 40, 60, 0.5);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 160, 122, 0.4) inset,
    0 0 40px rgba(255, 160, 122, 0.15);
  border-color: rgba(255, 160, 122, 0.4);
}

.site-card:active {
  transform: scale(0.96);
  background: rgba(255, 255, 255, 0.4);
  transition-duration: 0.1s;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.site-icon-wrapper {
  position: relative;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
}

.site-icon {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  object-fit: contain;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 2px solid rgba(255, 160, 122, 0.3);
  padding: 10px;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  color: transparent;
  font-size: 0;
}

.site-card:hover .site-icon {
  transform: scale(1.1) rotate(5deg);
  border-color: rgba(255, 160, 122, 0.5);
  box-shadow: 0 6px 16px rgba(255, 160, 122, 0.3);
  background: rgba(255, 160, 122, 0.15);
}

/* 图标加载骨架屏 */
.icon-skeleton {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  background: linear-gradient(90deg,
      rgba(255, 255, 255, 0.1) 25%,
      rgba(255, 160, 122, 0.2) 50%,
      rgba(255, 255, 255, 0.1) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border: 2px solid rgba(255, 160, 122, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* Emoji 图标样式 */
.site-icon-emoji {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 2px solid rgba(255, 160, 122, 0.3);
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.site-card:hover .site-icon-emoji {
  transform: scale(1.1) rotate(5deg);
  border-color: rgba(255, 160, 122, 0.5);
  box-shadow: 0 6px 16px rgba(255, 160, 122, 0.3);
  background: rgba(255, 160, 122, 0.15);
}

.site-info {
  flex: 1;
  min-width: 0;
}

h2 {
  margin-top: 2rem;
  margin-bottom: 2.5rem;
  color: #ffffff;
  font-size: 2rem;
  font-weight: 800;
  text-shadow: 0 0 20px rgba(255, 160, 122, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.02em;
  padding-left: 1rem;
  border-left: 4px solid rgba(255, 160, 122, 0.8);
}

h3 {
  margin: 0 0 0.4rem 0;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.site-url {
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.ribbon-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, #ff6b81, #ff4757);
  color: white;
  padding: 4px 8px;
  border-bottom-left-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 2px;
  box-shadow: -2px 2px 8px rgba(255, 71, 87, 0.2);
  z-index: 2;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.site-card:hover .ribbon-badge {
  padding-right: 10px;
  padding-left: 6px;
  box-shadow: -4px 4px 12px rgba(255, 71, 87, 0.3);
}

/* Liquid Glass 光泽效果 */
.site-card {
  position: relative;
  overflow: hidden;
}

.site-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom,
      rgba(255, 160, 122, 0.15) 0%,
      rgba(255, 160, 122, 0) 100%);
  border-radius: 20px 20px 0 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.site-card:hover::before {
  opacity: 1;
}

.tab-btn,
.submit-btn {
  position: relative;
  overflow: hidden;
}

.tab-btn::after,
.submit-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%);
  transition: left 0.5s ease;
}

.tab-btn:hover::after,
.submit-btn:hover::after {
  left: 100%;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .video-nav {
    padding: 0 0.5rem;
  }

  .nav-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .category-tabs {
    width: 100%;
    margin-bottom: 1rem;
  }

  .submit-btn {
    margin-left: 0;
    align-self: flex-end;
  }

  .site-list {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1.2rem;
  }

  .site-card {
    padding: 1.2rem;
    border-radius: 18px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .site-icon-wrapper {
    width: 44px;
    height: 44px;
  }

  h3 {
    font-size: 1rem;
  }

  .site-url {
    font-size: 0.8rem;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .tab-btn,
  .submit-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    border-radius: 14px;
  }
}

/* 返回顶部按钮样式 */
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 160, 122, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 160, 122, 0.5);
  box-shadow: 0 4px 16px rgba(255, 160, 122, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  z-index: 100;
  transition: all 0.3s ease;
}

.back-to-top:hover {
  transform: translateY(-4px);
  background: rgba(255, 160, 122, 1);
  box-shadow: 0 8px 24px rgba(255, 160, 122, 0.6);
  color: #ffffff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>