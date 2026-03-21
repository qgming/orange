<script setup lang="ts">
/**
 * VideoNav - 网站导航
 * 紧凑卡片风格
 */
import { ref, computed, onMounted, watch } from 'vue'
import { videoSites } from '../data/videoSites'
import type { VideoSiteCategory } from '@/types'
import { getWebsiteIcon, isInitialIcon, parseInitialIcon } from '../utils/iconService'

const activeCategory = ref('全部')
const siteIcons = ref(new Map<string, string>())

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

const loadIcon = async (url: string, name: string) => {
  const key = `${name}-${url}`
  if (siteIcons.value.has(key)) return

  const icon = await getWebsiteIcon(url, { cache: true, siteName: name })
  siteIcons.value.set(key, icon)
}

const getIcon = (url: string, name: string) => {
  return siteIcons.value.get(`${name}-${url}`) || ''
}

const hasIcon = (url: string, name: string) => {
  return siteIcons.value.has(`${name}-${url}`)
}

const isInitial = (url: string, name: string) => {
  const icon = getIcon(url, name)
  return isInitialIcon(icon)
}

const getInitialData = (url: string, name: string) => {
  const icon = getIcon(url, name)
  return parseInitialIcon(icon)
}

const categories = computed(() => ['全部', '推荐', ...Object.keys(videoSites)])

const filteredSites = computed(() => {
  if (activeCategory.value === '全部') return videoSites
  if (activeCategory.value === '推荐') {
    const filtered: VideoSiteCategory = {}
    Object.entries(videoSites).forEach(([cat, sites]) => {
      const rec = sites.filter(s => s.isRecommended)
      if (rec.length > 0) filtered[cat] = rec
    })
    return filtered
  }
  const sites = videoSites[activeCategory.value]
  return sites ? { [activeCategory.value]: sites } : {}
})

const totalCount = computed(() => {
  return Object.values(videoSites).reduce((sum, sites) => sum + sites.length, 0)
})

const recCount = computed(() => {
  return Object.values(videoSites).reduce((sum, sites) => sum + sites.filter(s => s.isRecommended).length, 0)
})

const showTitles = computed(() => activeCategory.value === '全部')

const loadIcons = () => {
  Object.values(filteredSites.value).forEach(sites => {
    sites.forEach(site => loadIcon(site.url, site.name))
  })
}

onMounted(loadIcons)
watch(activeCategory, loadIcons)
</script>

<template>
  <section class="nav-section">
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

    <div class="sites-container">
      <div v-for="(sites, category) in filteredSites" :key="category" class="category-block">
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
  gap: var(--sp-4);
  padding: var(--sp-4) var(--sp-5);
  border-bottom: 1px solid var(--border-default);
  flex-wrap: wrap;
}

.section-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.category-tabs {
  display: flex;
  gap: var(--sp-1);
  flex-wrap: wrap;
  margin-left: auto;
}

.cat-btn {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  padding: var(--sp-1) var(--sp-3);
  font-size: var(--text-sm);
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
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  padding: 0 var(--sp-1);
  background: var(--bg-elevated);
  border-radius: var(--radius-sm);
}

.cat-btn.active .count {
  background: var(--c-accent);
  color: white;
}

.sites-container {
  padding: var(--sp-4) var(--sp-5);
}

.category-block {
  margin-bottom: var(--sp-6);
}

.category-block:last-child {
  margin-bottom: 0;
}

.category-title {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-tertiary);
  margin: 0 0 var(--sp-3) 0;
  padding-bottom: var(--sp-2);
  border-bottom: 1px solid var(--border-default);
}

.sites-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--sp-3);
}

.site-card {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3);
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  transition: all var(--duration-fast) var(--ease-out);
  position: relative;
}

.site-card:hover {
  border-color: var(--border-hover);
  background: var(--bg-hover);
}

.site-icon {
  width: 36px;
  height: 36px;
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
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: white;
  border-radius: var(--radius-md);
}

.site-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
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
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: var(--font-medium);
  color: white;
  background: var(--c-accent);
  border-radius: 0 var(--radius-lg) 0 var(--radius-md);
}

@media (max-width: 1200px) {
  .sites-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .sites-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--sp-2);
  }

  .site-card {
    padding: var(--sp-2);
  }

  .site-icon {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 480px) {
  .sites-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
