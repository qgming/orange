<script setup lang="ts">
/**
 * VideoNav - 网站导航
 * 自包含分类 Tab + 站点卡片网格
 */
import { ref, computed, onMounted, watch } from 'vue'
import videoSitesData from '../data/videoSites.json'
import type { VideoSiteCategory } from '@/types'
import { getWebsiteIcon, isInitialIcon, parseInitialIcon } from '../utils/iconService'
import { getSiteAvailability } from '../utils/siteAvailability'
import type { SiteAvailabilityStatus } from '../utils/siteAvailability'

const REMOTE_SITES_URL = '/orange/sites.json'

const localVideoSites = videoSitesData as VideoSiteCategory
const videoSites = ref<VideoSiteCategory>({})
const isLoadingSites = ref(true)
const activeCategory = ref('全部')
const siteIcons = ref(new Map<string, string>())
const siteStatuses = ref(new Map<string, SiteAvailabilityStatus>())
const statusQueue: Array<{ url: string, name: string }> = []
const MAX_STATUS_CHECKS = 6
let activeStatusChecks = 0

const isVideoSiteCategory = (data: unknown): data is VideoSiteCategory => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false

  return Object.values(data).every(sites => {
    if (!Array.isArray(sites)) return false

    return sites.every(site => {
      if (!site || typeof site !== 'object' || Array.isArray(site)) return false

      const siteData = site as Record<string, unknown>
      const hasValidBase = typeof siteData.name === 'string' && typeof siteData.url === 'string'
      const hasValidRecommend =
        siteData.isRecommended === undefined || typeof siteData.isRecommended === 'boolean'

      return hasValidBase && hasValidRecommend
    })
  })
}

const fetchRemoteVideoSites = async () => {
  try {
    const response = await fetch(REMOTE_SITES_URL, { cache: 'no-cache' })
    if (!response.ok) return null

    const data = await response.json()
    if (isVideoSiteCategory(data)) return data
  } catch {
    return null
  }

  return null
}

const loadVideoSites = async () => {
  const remoteSites = await fetchRemoteVideoSites()
  videoSites.value = remoteSites ?? localVideoSites
  isLoadingSites.value = false
}

const handleLinkClick = (event: MouseEvent, url: string) => {
  event.preventDefault()
  try {
    const urlObj = new URL(url)
    urlObj.searchParams.append('from', 'v.qgming.com')
    window.open(urlObj.toString(), '_blank')
  } catch {
    window.open(url, '_blank')
  }
}

const getHostname = (url: string) => {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

const getSiteKey = (url: string, name: string) => `${name}-${url}`

const loadIcon = async (url: string, name: string) => {
  const key = getSiteKey(url, name)
  if (siteIcons.value.has(key)) return
  const icon = await getWebsiteIcon(url, { cache: true, siteName: name })
  siteIcons.value.set(key, icon)
}

const getIcon = (url: string, name: string) => {
  return siteIcons.value.get(getSiteKey(url, name)) || ''
}

const hasIcon = (url: string, name: string) => {
  return siteIcons.value.has(getSiteKey(url, name))
}

const isInitial = (url: string, name: string) => {
  const icon = getIcon(url, name)
  return isInitialIcon(icon)
}

const getInitialData = (url: string, name: string) => {
  const icon = getIcon(url, name)
  return parseInitialIcon(icon)
}

const runStatusQueue = () => {
  while (activeStatusChecks < MAX_STATUS_CHECKS && statusQueue.length > 0) {
    const nextSite = statusQueue.shift()
    if (!nextSite) return

    activeStatusChecks += 1
    getSiteAvailability(nextSite.url, { cache: true, timeout: 4000 })
      .then(status => {
        siteStatuses.value.set(getSiteKey(nextSite.url, nextSite.name), status)
      })
      .catch(() => {
        siteStatuses.value.set(getSiteKey(nextSite.url, nextSite.name), 'offline')
      })
      .finally(() => {
        activeStatusChecks -= 1
        runStatusQueue()
      })
  }
}

const loadSiteStatus = (url: string, name: string) => {
  const key = getSiteKey(url, name)
  if (siteStatuses.value.has(key)) return

  siteStatuses.value.set(key, 'unknown')
  statusQueue.push({ url, name })
  runStatusQueue()
}

const getSiteStatus = (url: string, name: string) => {
  return siteStatuses.value.get(getSiteKey(url, name)) || 'unknown'
}

const getSiteStatusLabel = (url: string, name: string) => {
  const status = getSiteStatus(url, name)

  if (status === 'online') return '网站状态：可用'
  if (status === 'offline') return '网站状态：不可用'
  return '网站状态：无法判断'
}

const categories = computed(() => ['全部', '推荐', ...Object.keys(videoSites.value)])

const filteredSites = computed(() => {
  if (activeCategory.value === '全部') return videoSites.value
  if (activeCategory.value === '推荐') {
    const filtered: VideoSiteCategory = {}
    Object.entries(videoSites.value).forEach(([cat, sites]) => {
      const rec = sites.filter(s => s.isRecommended)
      if (rec.length > 0) filtered[cat] = rec
    })
    return filtered
  }
  const sites = videoSites.value[activeCategory.value]
  return sites ? { [activeCategory.value]: sites } : {}
})

const totalCount = computed(() => {
  return Object.values(videoSites.value).reduce((sum, sites) => sum + sites.length, 0)
})

const recCount = computed(() => {
  return Object.values(videoSites.value).reduce((sum, sites) => {
    return sum + sites.filter(s => s.isRecommended).length
  }, 0)
})

const showTitles = computed(() => activeCategory.value === '全部')

const loadIcons = () => {
  Object.values(filteredSites.value).forEach(sites => {
    sites.forEach(site => loadIcon(site.url, site.name))
  })
}

const loadStatuses = () => {
  Object.values(filteredSites.value).forEach(sites => {
    sites.forEach(site => loadSiteStatus(site.url, site.name))
  })
}

onMounted(loadVideoSites)
watch([activeCategory, filteredSites], loadIcons, { immediate: true })
watch([activeCategory, filteredSites], loadStatuses, { immediate: true })
</script>

<template>
  <section class="nav-section">
    <!-- 分类导航 -->
    <div class="section-header">
      <h2 class="section-title">网站导航</h2>
      <div class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat"
          class="cat-btn"
          :class="{ active: activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat }}
          <span class="count">
            {{ cat === '全部' ? totalCount : cat === '推荐' ? recCount : (videoSites[cat]?.length || 0) }}
          </span>
        </button>
      </div>
    </div>

    <!-- 站点网格 -->
    <div class="sites-container">
      <div v-if="isLoadingSites" class="sites-loading" aria-live="polite">
        <div v-for="item in 6" :key="item" class="site-card loading-card">
          <div class="site-icon">
            <div class="icon-placeholder"></div>
          </div>
          <div class="site-info">
            <span class="loading-line loading-name"></span>
            <span class="loading-line loading-url"></span>
          </div>
        </div>
      </div>

      <div v-for="(sites, category) in filteredSites" v-else :key="category" class="category-block">
        <h3 v-if="showTitles" class="category-title">{{ category }}</h3>
        <div class="sites-grid">
          <a
            v-for="site in sites"
            :key="site.name"
            :href="site.url"
            @click="handleLinkClick($event, site.url)"
            class="site-card"
          >
            <div class="site-icon">
              <div v-if="!hasIcon(site.url, site.name)" class="icon-placeholder"></div>
              <template v-else>
                <div
                  v-if="isInitial(site.url, site.name)"
                  class="icon-initial"
                  :style="{ background: getInitialData(site.url, site.name)?.color }"
                >
                  {{ getInitialData(site.url, site.name)?.letter }}
                </div>
                <img
                  v-else
                  :src="getIcon(site.url, site.name)"
                  :alt="site.name"
                  loading="lazy"
                />
              </template>
            </div>
            <div class="site-info">
              <span class="site-name">{{ site.name }}</span>
              <span class="site-url">{{ getHostname(site.url) }}</span>
            </div>
            <span v-if="site.isRecommended" class="badge">精选</span>
            <span
              class="status-dot"
              :class="`status-${getSiteStatus(site.url, site.name)}`"
              :title="getSiteStatusLabel(site.url, site.name)"
              :aria-label="getSiteStatusLabel(site.url, site.name)"
            ></span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nav-section {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  border-bottom: 1px solid var(--border-default);
  flex-wrap: wrap;
}

.section-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  flex-shrink: 0;
}

.category-tabs {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
}

.cat-btn {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  padding: 5px var(--sp-2);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-out);
}

.cat-btn:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.cat-btn.active {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.cat-btn .count {
  font-size: 10px;
  color: var(--text-tertiary);
  padding: 0 4px;
  background: var(--bg-elevated);
  border-radius: var(--radius-sm);
}

.cat-btn.active .count {
  background: var(--c-accent);
  color: white;
}

.sites-container {
  padding: var(--sp-3) var(--sp-4);
}

.sites-loading {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--sp-2);
}

.category-block {
  margin-bottom: var(--sp-5);
}

.category-block:last-child {
  margin-bottom: 0;
}

.category-title {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text-tertiary);
  margin: 0 0 var(--sp-2) 0;
  padding-bottom: var(--sp-2);
  border-bottom: 1px solid var(--border-default);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.sites-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--sp-2);
}

.site-card {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  background: var(--bg-elevated);
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  transition: all var(--duration-fast) var(--ease-out);
  position: relative;
  padding-right: calc(var(--sp-3) + 12px);
}

.site-card:hover {
  border-color: var(--border-hover);
  background: var(--bg-hover);
  transform: translateY(-1px);
}

.site-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
}

.site-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.icon-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--bg-hover) 25%, var(--bg-elevated) 50%, var(--bg-hover) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.icon-initial {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: white;
  border-radius: var(--radius-md);
}

.site-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.site-name {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-url {
  font-size: 11px;
  color: var(--text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.loading-card {
  pointer-events: none;
}

.loading-line {
  display: block;
  height: 10px;
  border-radius: var(--radius-sm);
  background: linear-gradient(90deg, var(--bg-hover) 25%, var(--bg-elevated) 50%, var(--bg-hover) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.loading-name {
  width: 64px;
}

.loading-url {
  width: 96px;
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  padding: 1px 5px;
  font-size: 9px;
  font-weight: var(--font-medium);
  color: white;
  background: var(--c-accent);
  border-radius: 0 var(--radius-lg) 0 var(--radius-sm);
}

.status-dot {
  position: absolute;
  right: var(--sp-2);
  bottom: var(--sp-2);
  width: 8px;
  height: 8px;
  border-radius: 999px;
  border: 1.5px solid var(--bg-elevated);
  box-shadow: 0 0 0 1px rgb(15 23 42 / 0.08);
}

.status-online {
  background: #22c55e;
}

.status-offline {
  background: #ef4444;
}

.status-unknown {
  background: #f59e0b;
}

/* 在侧边栏中作为中间列时，降为2列 */
@media (max-width: 1220px) {
  .sites-grid,
  .sites-loading {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .sites-grid,
  .sites-loading {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--sp-2);
  }

  .section-header {
    padding: var(--sp-3);
  }

  .sites-container {
    padding: var(--sp-3);
  }
}

@media (max-width: 480px) {
  .sites-grid,
  .sites-loading {
    grid-template-columns: 1fr 1fr;
  }

  .site-card {
    padding: var(--sp-2);
    padding-right: calc(var(--sp-2) + 12px);
  }

  .site-icon {
    width: 28px;
    height: 28px;
  }
}
</style>
