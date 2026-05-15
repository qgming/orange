<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import AppFooter from '@/components/AppFooter.vue'
import TopBar from '@/components/TopBar.vue'
import CategoryTabs from '@/components/CategoryTabs.vue'
import videoSitesData from '@/data/videoSites.json'
import type { VideoSiteCategory } from '@/types'
import { getWebsiteIcon, isInitialIcon, parseInitialIcon } from '@/utils/iconService'
import { getSiteAvailability, type SiteAvailabilityStatus } from '@/utils/siteAvailability'

const REMOTE_SITES_URL = '/orange/sites.json'
const localVideoSites = videoSitesData as VideoSiteCategory

const videoSites = ref<VideoSiteCategory>({})
const activeCategory = ref('全部')
const loading = ref(true)
const siteIcons = ref(new Map<string, string>())
const siteStatuses = ref(new Map<string, SiteAvailabilityStatus>())
const statusQueue: Array<{ url: string, name: string }> = []

let activeStatusChecks = 0
const MAX_STATUS_CHECKS = 6

const isVideoSiteCategory = (data: unknown): data is VideoSiteCategory => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false

  return Object.values(data).every(sites => {
    if (!Array.isArray(sites)) return false
    return sites.every(site => {
      if (!site || typeof site !== 'object' || Array.isArray(site)) return false
      const item = site as Record<string, unknown>
      return typeof item.name === 'string' && typeof item.url === 'string'
    })
  })
}

const fetchRemoteSites = async () => {
  try {
    const response = await fetch(REMOTE_SITES_URL, { cache: 'no-cache' })
    if (!response.ok) return null
    const data = await response.json()
    return isVideoSiteCategory(data) ? data : null
  } catch {
    return null
  }
}

const categories = computed(() => ['全部', '推荐', ...Object.keys(videoSites.value)])
const totalCount = computed(() => Object.values(videoSites.value).reduce((sum, sites) => sum + sites.length, 0))
const recommendedCount = computed(() => {
  return Object.values(videoSites.value).reduce((sum, sites) => sum + sites.filter(site => site.isRecommended).length, 0)
})
const categoryCount = (category: string) => {
  if (category === '全部') return totalCount.value
  if (category === '推荐') return recommendedCount.value
  return videoSites.value[category]?.length ?? 0
}

const filteredSites = computed(() => {
  if (activeCategory.value === '全部') return videoSites.value

  if (activeCategory.value === '推荐') {
    const filtered: VideoSiteCategory = {}
    Object.entries(videoSites.value).forEach(([category, sites]) => {
      const recommended = sites.filter(site => site.isRecommended)
      if (recommended.length) filtered[category] = recommended
    })
    return filtered
  }

  const sites = videoSites.value[activeCategory.value]
  return sites ? { [activeCategory.value]: sites } : {}
})

const categoryTabsList = computed(() => {
  return categories.value.map(category => ({
    key: category,
    label: category,
    count: categoryCount(category),
  }))
})

const getSiteKey = (url: string, name: string) => `${name}-${url}`

const loadIcon = async (url: string, name: string) => {
  const key = getSiteKey(url, name)
  if (siteIcons.value.has(key)) return
  const icon = await getWebsiteIcon(url, { cache: true, siteName: name })
  siteIcons.value.set(key, icon)
}

const runStatusQueue = () => {
  while (activeStatusChecks < MAX_STATUS_CHECKS && statusQueue.length > 0) {
    const nextSite = statusQueue.shift()
    if (!nextSite) return

    activeStatusChecks += 1
    getSiteAvailability(nextSite.url, { cache: true, timeout: 4000 })
      .then(status => siteStatuses.value.set(getSiteKey(nextSite.url, nextSite.name), status))
      .catch(() => siteStatuses.value.set(getSiteKey(nextSite.url, nextSite.name), 'offline'))
      .finally(() => {
        activeStatusChecks -= 1
        runStatusQueue()
      })
  }
}

const loadStatus = (url: string, name: string) => {
  const key = getSiteKey(url, name)
  if (siteStatuses.value.has(key)) return
  siteStatuses.value.set(key, 'unknown')
  statusQueue.push({ url, name })
  runStatusQueue()
}

const getIcon = (url: string, name: string) => siteIcons.value.get(getSiteKey(url, name)) || ''
const hasIcon = (url: string, name: string) => siteIcons.value.has(getSiteKey(url, name))
const isInitial = (url: string, name: string) => isInitialIcon(getIcon(url, name))
const getInitialData = (url: string, name: string) => parseInitialIcon(getIcon(url, name))
const getStatus = (url: string, name: string) => siteStatuses.value.get(getSiteKey(url, name)) || 'unknown'

const getHostname = (url: string) => {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

const openSite = (event: MouseEvent, url: string) => {
  event.preventDefault()
  try {
    const targetUrl = new URL(url)
    targetUrl.searchParams.append('from', 'v.qgming.com')
    window.open(targetUrl.toString(), '_blank')
  } catch {
    window.open(url, '_blank')
  }
}

const loadVisibleAssets = () => {
  Object.values(filteredSites.value).forEach(sites => {
    sites.forEach(site => {
      loadIcon(site.url, site.name)
      loadStatus(site.url, site.name)
    })
  })
}

onMounted(async () => {
  document.title = '网站导航 - 橘子导航'
  videoSites.value = (await fetchRemoteSites()) ?? localVideoSites
  loading.value = false
  loadVisibleAssets()
})

watch([activeCategory, filteredSites], loadVisibleAssets)
</script>

<template>
  <div class="site-page">
    <TopBar />

    <main class="site-main">
      <header class="hero">
        <div class="hero-copy">
          <span class="eyebrow">Site Directory</span>
          <h1>网站导航</h1>
        </div>
      </header>

      <CategoryTabs
        :tabs="categoryTabsList"
        :active-tab="activeCategory"
        aria-label="网站分类"
        @update:active-tab="activeCategory = $event"
      />

      <section v-if="loading" class="state-card">
        <span class="spinner"></span>
        <p>正在加载站点目录...</p>
      </section>

      <section v-else class="directory">
        <article v-for="(sites, category) in filteredSites" :key="category" class="category-section">
          <h2 class="category-title">{{ category }}</h2>

          <div class="site-grid">
            <a
              v-for="site in sites"
              :key="`${category}-${site.name}`"
              :href="site.url"
              class="site-card"
              @click="openSite($event, site.url)"
            >
              <span v-if="site.isRecommended" class="recommend-badge" title="推荐">推荐</span>
              <span class="status-dot" :class="`status-${getStatus(site.url, site.name)}`"></span>

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
                  <img v-else :src="getIcon(site.url, site.name)" :alt="site.name" loading="lazy" />
                </template>
              </div>

              <div class="site-copy">
                <strong>{{ site.name }}</strong>
                <span>{{ getHostname(site.url) }}</span>
              </div>
            </a>
          </div>
        </article>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.site-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-main {
  flex: 1;
  width: min(100%, 1240px);
  margin: 0 auto;
  padding: var(--sp-6) var(--sp-4) 0;
}

.hero {
  margin-bottom: var(--sp-5);
}

.hero-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--sp-2);
}

.eyebrow {
  color: var(--c-accent-light);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero h1 {
  margin: 0;
  color: var(--text-primary);
  font-size: clamp(2.125rem, 5vw, 3.75rem);
  line-height: 1;
  letter-spacing: 0;
}

.directory {
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
}

.category-section {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.category-title {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
}

.site-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--sp-3);
}

.site-card {
  position: relative;
  min-width: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-4);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: #ffffff;
  transition: all var(--duration-fast) var(--ease-out);
}

.site-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px -8px color-mix(in srgb, var(--c-accent) 20%, transparent);
}

.recommend-badge {
  position: absolute;
  top: var(--sp-2);
  right: var(--sp-2);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: var(--c-accent);
  color: white;
  font-size: 10px;
  font-weight: var(--font-medium);
  line-height: 1;
}

.status-dot {
  position: absolute;
  bottom: var(--sp-2);
  right: var(--sp-2);
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.site-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
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
  animation: shimmer 1.4s infinite;
}

.icon-initial {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: white;
  font-weight: var(--font-semibold);
}

.site-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.site-copy strong,
.site-copy span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-copy strong {
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
}

.site-copy span {
  color: var(--text-tertiary);
  font-size: var(--text-xs);
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

.state-card {
  min-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sp-3);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: var(--bg-surface);
  color: var(--text-secondary);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-default);
  border-top-color: var(--c-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1040px) {
  .site-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .site-main {
    padding-top: var(--sp-4);
  }

  .site-grid {
    grid-template-columns: 1fr;
  }
}
</style>
