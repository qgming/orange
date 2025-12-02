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
        <button
          :class="['tab-btn', { active: activeTab === 'web' }]"
          @click="activeTab = 'web'"
        >
          <span class="button-content">
            网剧热度榜
          </span>
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'tv' }]"
          @click="activeTab = 'tv'"
        >
          <span class="button-content">
            电视收视榜
          </span>
        </button>
      </div>
      <button class="expand-btn" @click="toggleExpand">
        {{ isExpanded ? '收起' : '展开' }}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ rotated: isExpanded }">
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
        <div
          v-for="(item, index) in webRanking.slice(0, 28)"
          :key="item.series_id"
          class="ranking-card"
          :class="{ hidden: !isExpanded && index >= 4 }"
          @click="handleCardClick(item.series_name)"
        >
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
        <div
          v-for="(item, index) in tvRanking.slice(0, 28)"
          :key="index"
          class="ranking-card"
          :class="{ hidden: !isExpanded && index >= 4 }"
          @click="handleCardClick(item.programme_name)"
        >
          <div :class="['rank-badge', getRankingClass(index + 1)]">
            {{ index + 1 }}
          </div>
          <div class="ranking-info">
            <h3 class="ranking-name">{{ item.programme_name }}</h3>
            <div class="ranking-meta">
              <span v-if="item.market_rate" class="meta-item rating">{{ item.market_rate_desc || item.market_rate }}</span>
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
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.ranking-tabs {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  background: #ffffff;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  color: #666;
}

.tab-btn:hover {
  background: #f5f5f5;
}

.tab-btn.active {
  background: linear-gradient(135deg, #FFA07A, #FF7F50);
  color: white;
}

.button-content {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.expand-btn {
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  background: #ffffff;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  color: #666;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.expand-btn:hover {
  background: #f5f5f5;
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
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #FF7F50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
  font-size: 1.1rem;
  background: #fff5f5;
  border-radius: 12px;
}

.ranking-content {
  width: 100%;
}

.ranking-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.ranking-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  border: 1px solid #f0f0f0;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease,
    opacity 0.3s ease,
    max-height 0.3s ease;
  box-shadow: 0 2px 12px rgba(255, 107, 26, 0.06);
  cursor: pointer;
}

.ranking-card.hidden {
  display: none;
}

.ranking-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 12px 28px rgba(255, 107, 26, 0.15);
  border-color: #FF7F50;
  background: linear-gradient(135deg, #ffffff 0%, #fff5f2 100%);
}

.rank-badge {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  color: #999;
  background: #f5f5f5;
  border-radius: 10px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.ranking-card:hover .rank-badge {
  transform: scale(1.1);
}

.rank-first {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #fff;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.rank-second {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  color: #666;
  box-shadow: 0 4px 12px rgba(192, 192, 192, 0.4);
}

.rank-third {
  background: linear-gradient(135deg, #cd7f32, #e6a857);
  color: #fff;
  box-shadow: 0 4px 12px rgba(205, 127, 50, 0.4);
}

.ranking-info {
  flex: 1;
  min-width: 0;
}

.ranking-name {
  margin: 0 0 0.5rem 0;
  color: #2d2d2d;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ranking-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.meta-item {
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  background: #f5f5f5;
  color: #666;
  white-space: nowrap;
}

.meta-item.heat,
.meta-item.rating {
  background: linear-gradient(135deg, #fff5f0, #ffe8dc);
  color: #ff6b1a;
  font-weight: 600;
}

.meta-item.platform,
.meta-item.channel {
  background: #f0f4ff;
  color: #5b8def;
}

@media (max-width: 768px) {
  .realtime-ranking {
    padding: 0 0.5rem;
    margin: 1.5rem auto 2rem;
  }

  .ranking-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .expand-btn {
    margin-left: 0;
    align-self: flex-end;
  }

  .tab-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  .ranking-list {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .ranking-card {
    padding: 0.9rem 1rem;
  }

  .rank-badge {
    min-width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }

  .ranking-name {
    font-size: 0.95rem;
  }

  .ranking-meta {
    font-size: 0.75rem;
    gap: 0.4rem;
  }

  .meta-item {
    padding: 0.15rem 0.5rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .ranking-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
