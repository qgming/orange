<template>
  <div class="site-checker">
    <div class="checker-header">
      <h3>网站可用性检测</h3>
      <div class="controls">
        <button @click="startCheck" :disabled="isChecking" class="check-btn">
          {{ isChecking ? '检测中...' : '开始检测' }}
        </button>
        <button @click="clearResults" :disabled="isChecking" class="clear-btn">
          清空结果
        </button>
      </div>
    </div>

    <div v-if="stats.total > 0" class="stats">
      <div class="stat-item">
        <span class="stat-label">总数:</span>
        <span class="stat-value">{{ stats.total }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">可用:</span>
        <span class="stat-value available">{{ stats.available }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">不可用:</span>
        <span class="stat-value unavailable">{{ stats.unavailable }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">可用率:</span>
        <span class="stat-value">{{ stats.availabilityRate }}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">平均响应:</span>
        <span class="stat-value">{{ stats.avgResponseTime }}ms</span>
      </div>
    </div>

    <div v-if="isChecking" class="progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <span class="progress-text">{{ progress }}% ({{ completed }}/{{ total }})</span>
    </div>

    <div class="filters" v-if="results.length > 0">
      <label>
        <input type="radio" v-model="filter" value="all"> 全部
      </label>
      <label>
        <input type="radio" v-model="filter" value="available"> 可用
      </label>
      <label>
        <input type="radio" v-model="filter" value="unavailable"> 不可用
      </label>
    </div>

    <div class="results" v-if="filteredResults.length > 0">
      <div v-for="result in filteredResults" :key="result.url" class="result-item"
        :class="{ available: result.status, unavailable: !result.status }">
        <div class="result-info">
          <div class="site-name">{{ getSiteName(result.url) }}</div>
          <div class="site-url">{{ result.url }}</div>
          <div class="result-details">
            <span class="status" :class="result.status ? 'success' : 'error'">
              {{ result.status ? '可用' : '不可用' }}
            </span>
            <span v-if="result.responseTime > 0" class="response-time">
              {{ result.responseTime }}ms
            </span>
            <span v-if="!result.status && result.error" class="error-message">
              {{ result.error }}
            </span>
          </div>
        </div>
        <div class="result-actions">
          <button @click="recheckSite(result.url)" class="recheck-btn">
            重新检测
          </button>
          <a :href="result.url" target="_blank" class="visit-btn">
            访问
          </a>
        </div>
      </div>
    </div>

    <div v-else-if="!isChecking && results.length === 0" class="empty-state">
      <p>点击"开始检测"按钮检测网站可用性</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onUnmounted } from 'vue'
import { videoSites } from '@/data/videoSites.js'
import { checkSites, getStats } from '@/utils/siteChecker.js'

export default {
  name: 'SiteChecker',
  setup() {
    const isChecking = ref(false)
    const results = ref([])
    const progress = ref(0)
    const completed = ref(0)
    const total = ref(0)
    const filter = ref('all')

    // 获取所有网站URL
    const allUrls = computed(() => {
      const urls = []
      Object.values(videoSites).forEach(category => {
        category.forEach(site => {
          urls.push(site.url)
        })
      })
      return urls
    })

    // 计算统计信息
    const stats = computed(() => getStats(results.value))

    // 过滤结果
    const filteredResults = computed(() => {
      switch (filter.value) {
        case 'available':
          return results.value.filter(r => r.status)
        case 'unavailable':
          return results.value.filter(r => !r.status)
        default:
          return results.value
      }
    })

    // 获取网站名称
    const getSiteName = (url) => {
      for (const category of Object.values(videoSites)) {
        const site = category.find(s => s.url === url)
        if (site) return site.name
      }
      return '未知网站'
    }

    // 开始检测
    const startCheck = async () => {
      if (isChecking.value) return

      isChecking.value = true
      results.value = []
      progress.value = 0
      completed.value = 0
      total.value = allUrls.value.length

      try {
        const checkResults = await checkSites(allUrls.value, (completedCount, totalCount) => {
          completed.value = completedCount
          total.value = totalCount
          progress.value = Math.round((completedCount / totalCount) * 100)
        })

        results.value = checkResults
      } catch (error) {
        console.error('检测失败:', error)
      } finally {
        isChecking.value = false
      }
    }

    // 重新检测单个网站
    const recheckSite = async (url) => {
      const index = results.value.findIndex(r => r.url === url)
      if (index === -1) return

      try {
        const { checkSite } = await import('@/utils/siteChecker.js')
        const result = await checkSite(url)
        results.value[index] = result
      } catch (error) {
        console.error('重新检测失败:', error)
      }
    }

    // 清空结果
    const clearResults = () => {
      results.value = []
      progress.value = 0
      completed.value = 0
      total.value = 0
    }

    // 清理资源
    onUnmounted(() => {
      // 可以在这里清理缓存等资源
    })

    return {
      isChecking,
      results,
      stats,
      progress,
      completed,
      total,
      filter,
      filteredResults,
      getSiteName,
      startCheck,
      recheckSite,
      clearResults
    }
  }
}
</script>

<style scoped>
.site-checker {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.checker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.checker-header h3 {
  margin: 0;
  color: #333;
}

.controls {
  display: flex;
  gap: 10px;
}

.check-btn,
.clear-btn,
.recheck-btn,
.visit-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.check-btn {
  background: #007bff;
  color: white;
}

.check-btn:hover:not(:disabled) {
  background: #0056b3;
}

.check-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.clear-btn {
  background: #6c757d;
  color: white;
}

.clear-btn:hover:not(:disabled) {
  background: #545b62;
}

.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.stat-value.available {
  color: #28a745;
}

.stat-value.unavailable {
  color: #dc3545;
}

.progress {
  margin-bottom: 20px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: #007bff;
  transition: width 0.3s;
}

.progress-text {
  font-size: 14px;
  color: #666;
}

.filters {
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
}

.filters label {
  cursor: pointer;
  font-size: 14px;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  transition: all 0.3s;
}

.result-item.available {
  border-left: 4px solid #28a745;
  background: #f8fff9;
}

.result-item.unavailable {
  border-left: 4px solid #dc3545;
  background: #fff8f8;
}

.site-name {
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.site-url {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  word-break: break-all;
}

.result-details {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status.success {
  background: #d4edda;
  color: #155724;
}

.status.error {
  background: #f8d7da;
  color: #721c24;
}

.response-time {
  font-size: 12px;
  color: #666;
}

.error-message {
  font-size: 12px;
  color: #dc3545;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.recheck-btn {
  background: #ffc107;
  color: #212529;
  font-size: 12px;
  padding: 4px 8px;
}

.recheck-btn:hover {
  background: #e0a800;
}

.visit-btn {
  background: #17a2b8;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  text-decoration: none;
}

.visit-btn:hover {
  background: #138496;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

@media (max-width: 600px) {
  .checker-header {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .controls {
    justify-content: center;
  }

  .stats {
    justify-content: center;
  }

  .result-item {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .result-actions {
    justify-content: center;
  }
}
</style>