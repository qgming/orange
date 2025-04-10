<script setup>
import { ref } from 'vue'
import { videoSites } from '../data/videoSites'

const activeCategory = ref('全部') // 当前选中的分类

// 所有分类标签
const categories = ['全部','推荐', '动漫', '欧美剧', '日韩剧', '高清','直播']

const filteredSites = (category) => {
  return videoSites[category].filter(site =>
    (activeCategory.value === '全部' || site.tags.includes(activeCategory.value))
  )
}
</script>

<template>
  <div class="video-nav">
    <div class="category-filter">
      <button v-for="cat in categories" :key="cat" @click="activeCategory = cat"
        :class="{ active: activeCategory === cat }" class="filter-btn">
        {{ cat }}
      </button>
    </div>

    <div v-for="(sites, category) in videoSites" :key="category" class="category">
      <h2>{{ category }}</h2>
      <div class="site-list">
        <a v-for="site in filteredSites(category)" :key="site.name" :href="site.url" target="_blank" class="site-card">
          <h3>{{ site.name }}</h3>
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

.category-filter {
  display: flex;
  gap: 0.8rem;
  margin-top: 1rem;
  flex-wrap: wrap;
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
  background: linear-gradient(135deg, #FFA07A, #FF7F50);;
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
  background: #fef9f5; /* 米色背景 */
  color: #666;
  font-size: 0.85rem;
  font-weight: 400;
  transition: all 0.2s ease;
  border: 0.1px solid #FFD3B6; /* 新增浅橙色边框 */
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