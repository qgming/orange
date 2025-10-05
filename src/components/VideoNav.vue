<script setup>
import { ref, computed } from 'vue'
import { videoSites } from '../data/videoSites'

const activeCategory = ref('全部') // 当前选中的分类

// 所有分类标签
const categories = ['全部', '推荐', '高清', '欧美剧', '日韩剧', '体育']

// 筛选后的网站列表
const filteredSites = computed(() => {
  if (activeCategory.value === '全部') {
    // 如果选择"全部"，则显示所有网站
    return videoSites
  } else {
    // 否则只显示包含选中标签的网站
    const filtered = {}
    Object.entries(videoSites).forEach(([category, sites]) => {
      const categoryFilteredSites = sites.filter(site =>
        site.tags.includes(activeCategory.value)
      )
      if (categoryFilteredSites.length > 0) {
        filtered[category] = categoryFilteredSites
      }
    })
    return filtered
  }
})

// 判断是否显示分类标题
const showCategoryTitles = computed(() => activeCategory.value === '全部')
</script>

<template>
  <div class="video-nav">
    <div class="nav-header">
      <div class="category-filter">
        <button v-for="cat in categories" :key="cat" @click="activeCategory = cat"
          :class="{ active: activeCategory === cat }" class="filter-btn">
          {{ cat }}
        </button>
      </div>
      <div class="utility-links">
        <router-link to="/checker" class="utility-btn">
          🔍 网站检测
        </router-link>
      </div>
    </div>

    <div v-for="(sites, category) in filteredSites" :key="category" class="category">
      <h2 v-if="showCategoryTitles">{{ category }}</h2>
      <div class="site-list">
        <a v-for="site in sites" :key="site.name" :href="site.url" target="_blank" class="site-card">
          <h3>
            {{ site.name }}
            <svg v-if="site.tags.includes('推荐')" class="star-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </h3>
          <div class="tags">
            <span v-for="tag in site.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </a>
      </div>
    </div>
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
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.category-filter {
  display: flex;
  gap: 0.8rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.utility-links {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.utility-btn {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.utility-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.filter-btn {
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  background: #ffffff;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.filter-btn:hover {
  background: #e0e0e0;
}

.filter-btn.active {
  background: linear-gradient(135deg, #FFA07A, #FF7F50);
  ;
  color: white;
}

.category {
  margin-bottom: 2rem;
}

.site-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.site-card {
  padding: 1rem;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(255, 107, 26, 0.05);
  text-decoration: none;
  display: block;
}

.site-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.08);
  border-color: #ff6b00;
}

h2 {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  color: #2d2d2d;
  font-size: 1.5rem;
  font-weight: 600;
}

h3 {
  margin-bottom: 1rem;
  color: #404040;
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.4;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.star-icon {
  color: #FFD700;
  margin-left: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1rem;
}

.tag {
  padding: 0.3rem 0.7rem;
  border-radius: 8px;
  background: #fef9f5;
  /* 米色背景 */
  color: #666;
  font-size: 0.85rem;
  font-weight: 400;
  transition: all 0.2s ease;
  border: 0.1px solid #FFD3B6;
  /* 新增浅橙色边框 */
}

.tag:hover {
  background: #ff6b00;
  color: white;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .video-nav {
    padding: 0 0.5rem;
  }

  .nav-header {
    flex-direction: column;
    align-items: stretch;
  }

  .utility-links {
    justify-content: center;
    margin-top: 0.5rem;
  }

  .site-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  h2 {
    font-size: 1.3rem;
  }

  .filter-btn {
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
  }
}
</style>