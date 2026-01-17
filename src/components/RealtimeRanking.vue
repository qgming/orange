<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { performSearch } from '../utils/searchService'

const webRanking = ref([])
const tvRanking = ref([])
const loading = ref(true)
const error = ref(null)
const activeTab = ref('web') // 'web' or 'tv'
const autoRefreshInterval = ref(null)
const isExpanded = ref(false) // 是否展开

// API备用地址列表
const apiHosts = [
  'https://60s.viki.moe',
  'https://60api.09cdn.xyz',
  'https://60s.zeabur.app',
  'https://60s.crystelf.top',
  'https://cqxx.site',
  'https://api.yanyua.icu',
  'https://60s.tmini.net',
  'https://60s.7se.cn',
  'https://60s.mizhoubaobei.top'
]

let currentHostIndex = 0

const fetchWebRanking = async () => {
  for (let i = 0; i < apiHosts.length; i++) {
    try {
      const host = apiHosts[(currentHostIndex + i) % apiHosts.length]
      const response = await fetch(`${host}/v2/maoyan/realtime/web`, {
        method: 'GET',
        redirect: 'follow',
        signal: AbortSignal.timeout(5000) // 5秒超时
      })
      const result = await response.json()
      webRanking.value = result.data?.list || []
      // 请求成功，更新当前主机索引
      currentHostIndex = (currentHostIndex + i) % apiHosts.length
      return
    } catch (err) {
      console.warn(`获取网剧榜单失败 (${apiHosts[(currentHostIndex + i) % apiHosts.length]}):`, err)
      // 继续尝试下一个地址
    }
  }
  console.error('所有API地址均不可用')
}

const fetchTvRanking = async () => {
  for (let i = 0; i < apiHosts.length; i++) {
    try {
      const host = apiHosts[(currentHostIndex + i) % apiHosts.length]
      const response = await fetch(`${host}/v2/maoyan/realtime/tv`, {
        method: 'GET',
        redirect: 'follow',
        signal: AbortSignal.timeout(5000) // 5秒超时
      })
      const result = await response.json()
      tvRanking.value = result.data?.list || []
      // 请求成功，更新当前主机索引
      currentHostIndex = (currentHostIndex + i) % apiHosts.length
      return
    } catch (err) {
      console.warn(`获取电视榜单失败 (${apiHosts[(currentHostIndex + i) % apiHosts.length]}):`, err)
      // 继续尝试下一个地址
    }
  }
  console.error('所有API地址均不可用')
}

const fetchAllRankings = async () => {
  loading.value = true
  error.value = null
  try {
    await Promise.all([fetchWebRanking(), fetchTvRanking()])
  } catch (err) {
    error.value = '加载失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const getRankingClass = (rank) => {
  if (rank === 1) return 'rank-first'
  if (rank === 2) return 'rank-second'
  if (rank === 3) return 'rank-third'
  return ''
}

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const handleCardClick = (name) => {
  // 使用搜索服务进行搜索，默认使用追影猫（索引 0）
  performSearch(name, 0)
}

onMounted(() => {
  fetchAllRankings()
  // 每5分钟自动刷新一次
  autoRefreshInterval.value = setInterval(fetchAllRankings, 5 * 60 * 1000)
})

onUnmounted(() => {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value)
  }
})
</script>

<template>
  <div class="realtime-ranking">
    <div class="ranking-header">
      <div class="ranking-tabs">
        <button :class="['tab-btn', { active: activeTab === 'web' }]" @click="activeTab = 'web'">
          <span class="button-content">
            网剧热度榜
          </span>
        </button>
        <button :class="['tab-btn', { active: activeTab === 'tv' }]" @click="activeTab = 'tv'">
          <span class="button-content">
            电视收视榜
          </span>
        </button>
      </div>
      <button class="expand-btn" @click="toggleExpand">
        {{ isExpanded ? '收起' : '展开' }}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          :class="{ rotated: isExpanded }">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>

    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="ranking-content">
      <!-- 网剧榜单 -->
      <div v-show="activeTab === 'web'" class="ranking-list" :class="{ collapsed: !isExpanded }">
        <div v-for="(item, index) in webRanking.slice(0, 28)" :key="item.series_id" class="ranking-card"
          :class="{ hidden: !isExpanded && index >= 4 }"
          :style="{ '--rank-index': index }"
          @click="handleCardClick(item.series_name)">
          <div :class="['rank-badge', getRankingClass(index + 1)]">
            {{ index + 1 }}
          </div>
          <div class="ranking-info">
            <h3 class="ranking-name">{{ item.series_name }}</h3>
            <div class="ranking-meta">
              <span v-if="item.curr_heat_desc" class="meta-item heat">{{ item.curr_heat_desc }}</span>
              <span v-if="item.platform_desc" class="meta-item platform">{{ item.platform_desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 电视榜单 -->
      <div v-show="activeTab === 'tv'" class="ranking-list" :class="{ collapsed: !isExpanded }">
        <div v-for="(item, index) in tvRanking.slice(0, 28)" :key="index" class="ranking-card"
          :class="{ hidden: !isExpanded && index >= 4 }"
          :style="{ '--rank-index': index }"
          @click="handleCardClick(item.programme_name)">
          <div :class="['rank-badge', getRankingClass(index + 1)]">
            {{ index + 1 }}
          </div>
          <div class="ranking-info">
            <h3 class="ranking-name">{{ item.programme_name }}</h3>
            <div class="ranking-meta">
              <span v-if="item.market_rate" class="meta-item rating">{{ item.market_rate_desc || item.market_rate
              }}</span>
              <span v-if="item.channel_name" class="meta-item channel">{{ item.channel_name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.realtime-ranking {
  max-width: 1440px;
  margin: 2rem auto 3rem;
  padding: 0 1rem;
}

.ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.ranking-tabs {
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

.expand-btn {
  padding: 0.7rem 1.5rem;
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
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.expand-btn:hover {
  background: rgba(255, 160, 122, 0.3);
  border-color: rgba(255, 160, 122, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 160, 122, 0.3);
}

.expand-btn svg {
  transition: transform 0.3s ease;
}

.expand-btn svg.rotated {
  transform: rotate(180deg);
}

.loading {
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.9);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error {
  text-align: center;
  padding: 2rem;
  color: #fff;
  font-size: 1.1rem;
  background: rgba(231, 76, 60, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
}

.ranking-content {
  width: 100%;
}

.ranking-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.2rem;
}

.ranking-card {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem 1.5rem;
  border-radius: 20px;
  background: rgba(30, 30, 50, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 160, 122, 0.2);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 160, 122, 0.1) inset;
  cursor: pointer;
  animation: rankingEnter 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards;
  animation-delay: calc(var(--rank-index) * 0.05s);
}

@keyframes rankingEnter {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.ranking-card.hidden {
  display: none;
}

.ranking-card:hover {
  transform: translateY(-8px) scale(1.02) rotate(0.5deg);
  background: rgba(40, 40, 60, 0.6);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 160, 122, 0.3) inset,
    0 0 60px rgba(255, 160, 122, 0.2);
  border-color: rgba(255, 160, 122, 0.4);
}

.rank-badge {
  min-width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.ranking-card:hover .rank-badge {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 8px 20px rgba(31, 38, 135, 0.15);
}

.rank-first {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.6), rgba(255, 237, 78, 0.6));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #ffd700;
  border-color: rgba(255, 215, 0, 0.6);
  box-shadow: 0 6px 16px rgba(255, 215, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  font-weight: 900;
}

.rank-second {
  background: linear-gradient(135deg, rgba(192, 192, 192, 0.6), rgba(232, 232, 232, 0.6));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #e8e8e8;
  border-color: rgba(192, 192, 192, 0.6);
  box-shadow: 0 6px 16px rgba(192, 192, 192, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  font-weight: 900;
}

.rank-third {
  background: linear-gradient(135deg, rgba(205, 127, 50, 0.6), rgba(230, 168, 87, 0.6));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #e6a857;
  border-color: rgba(205, 127, 50, 0.6);
  box-shadow: 0 6px 16px rgba(205, 127, 50, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  font-weight: 900;
}

.ranking-info {
  flex: 1;
  min-width: 0;
}

.ranking-name {
  margin: 0 0 0.6rem 0;
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.ranking-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  font-size: 0.85rem;
}

.meta-item {
  padding: 0.3rem 0.8rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.meta-item.heat,
.meta-item.rating {
  background: rgba(255, 160, 122, 0.3);
  color: #ffb88c;
  border-color: rgba(255, 160, 122, 0.4);
  font-weight: 700;
}

.meta-item.platform,
.meta-item.channel {
  background: rgba(142, 197, 252, 0.2);
  color: #8ec5fc;
  border-color: rgba(142, 197, 252, 0.3);
}

/* Liquid Glass 光泽效果 */
.ranking-card::before {
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

.ranking-card:hover::before {
  opacity: 1;
}

.ranking-card {
  position: relative;
  overflow: hidden;
}

.tab-btn,
.expand-btn {
  position: relative;
  overflow: hidden;
}

.tab-btn::after,
.expand-btn::after {
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
.expand-btn:hover::after {
  left: 100%;
}

@media (max-width: 768px) {
  .realtime-ranking {
    padding: 0 0.5rem;
    margin: 1.5rem auto 2rem;
  }

  .ranking-header {
    gap: 0.8rem;
  }

  .ranking-tabs {
    flex: 1;
    min-width: 0;
  }

  .tab-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    border-radius: 12px;
  }

  .expand-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    border-radius: 12px;
    flex-shrink: 0;
  }

  .ranking-list {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .ranking-card {
    padding: 1rem 1.2rem;
    border-radius: 18px;
  }

  .rank-badge {
    min-width: 38px;
    height: 38px;
    font-size: 1rem;
  }

  .ranking-name {
    font-size: 1rem;
  }

  .ranking-meta {
    font-size: 0.8rem;
    gap: 0.5rem;
  }

  .meta-item {
    padding: 0.25rem 0.6rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .ranking-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
