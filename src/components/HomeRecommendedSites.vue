<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { getHostname, openSiteWithSource } from '@/services/siteDirectory'
import { getWebsiteIcon, isInitialIcon, parseInitialIcon } from '@/services/siteIcons'
import { useSiteDirectoryStore } from '@/stores/siteDirectory'
import type { VideoSite } from '@/types'

interface RecommendedSite extends VideoSite {
  category: string
}

const siteDirectoryStore = useSiteDirectoryStore()
const { loading, videoSites } = storeToRefs(siteDirectoryStore)
const siteIcons = ref(new Map<string, string>())

const recommendedSites = computed<RecommendedSite[]>(() => {
  return Object.entries(videoSites.value).flatMap(([category, sites]) =>
    sites.filter(site => site.isRecommended).map(site => ({ ...site, category })),
  )
})

const getSiteKey = (url: string, name: string) => `${name}-${url}`

const loadIcon = async (url: string, name: string) => {
  const key = getSiteKey(url, name)
  if (siteIcons.value.has(key)) return

  const icon = await getWebsiteIcon(url, { cache: true, siteName: name })
  siteIcons.value.set(key, icon)
}

const getIcon = (url: string, name: string) => siteIcons.value.get(getSiteKey(url, name)) || ''
const hasIcon = (url: string, name: string) => siteIcons.value.has(getSiteKey(url, name))
const isInitial = (url: string, name: string) => isInitialIcon(getIcon(url, name))
const getInitialData = (url: string, name: string) => parseInitialIcon(getIcon(url, name))

const openSite = (event: MouseEvent, url: string) => {
  event.preventDefault()
  openSiteWithSource(url)
}

const loadRecommendedIcons = () => {
  recommendedSites.value.forEach(site => {
    void loadIcon(site.url, site.name)
  })
}

onMounted(async () => {
  await siteDirectoryStore.loadSites()
  loadRecommendedIcons()
})

watch(recommendedSites, loadRecommendedIcons)
</script>

<template>
  <section class="home-nav" aria-labelledby="home-nav-title">
    <div class="section-head">
      <h2 id="home-nav-title">网站导航</h2>
      <router-link to="/nav" class="section-link">全部导航</router-link>
    </div>

    <div v-if="loading && !recommendedSites.length" class="state-card">
      正在加载推荐站点...
    </div>

    <div v-else class="site-grid">
      <a
        v-for="site in recommendedSites"
        :key="`${site.category}-${site.name}`"
        :href="site.url"
        class="site-card"
        @click="openSite($event, site.url)"
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
            <img v-else :src="getIcon(site.url, site.name)" :alt="site.name" loading="lazy" />
          </template>
        </div>

        <div class="site-copy">
          <strong>{{ site.name }}</strong>
          <span>{{ getHostname(site.url) }}</span>
        </div>
      </a>
    </div>
  </section>
</template>

<style scoped>
.home-nav {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  padding: 0 0 var(--sp-12);
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
}

.section-head h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
}

.section-link {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 var(--sp-4);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--bg-surface) 88%, var(--bg-base));
  color: var(--text-secondary);
  font-size: var(--text-sm);
  transition: border-color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out);
}

.section-link:hover {
  border-color: var(--border-hover);
  background: var(--bg-elevated);
  color: var(--text-primary);
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
  background: var(--surface-card);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-fast) var(--ease-out);
}

.site-card:hover {
  border-color: var(--border-hover);
  background: var(--surface-card-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.site-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--surface-card-muted);
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

.state-card {
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: var(--surface-card);
  color: var(--text-secondary);
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 1040px) {
  .site-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .site-grid {
    grid-template-columns: 1fr;
  }
}
</style>
