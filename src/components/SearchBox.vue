<script setup>
import { ref, computed } from 'vue'
import { searchSites, performSearch, getSearchSiteName } from '../utils/searchService'

const searchQuery = ref('')
const currentSiteIndex = ref(0)

const currentSiteName = computed(() => getSearchSiteName(currentSiteIndex.value))
const placeholderText = computed(() => `在${searchSites[currentSiteIndex.value].name}中搜索视频`)

const toggleSearchSite = () => {
  currentSiteIndex.value = (currentSiteIndex.value + 1) % searchSites.length
}

const handleSearch = () => {
  performSearch(searchQuery.value, currentSiteIndex.value)
}
</script>

<template>
  <div class="search-container">
    <img src="@/assets/logo.svg" alt="橘子导航" class="logo" />
    <h1 class="title">橘子导航</h1>
    <div class="search-box-container">
      <div class="search-box">
        <div class="input-wrapper">
          <input type="text" v-model="searchQuery" :placeholder="placeholderText" @keyup.enter="handleSearch" />
        </div>
        <button class="search-button-icon" @click="handleSearch">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
      <div class="site-selector">
        <button v-for="(site, index) in searchSites" :key="index" class="site-button"
          :class="{ active: currentSiteIndex === index }" @click="currentSiteIndex = index">
          {{ site.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0 4rem 0;
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 0.8rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-10px) rotate(5deg);
  }

  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

.title {
  color: #1a1a1a;
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 2.5rem;
  position: relative;
  background: linear-gradient(45deg, #ff6b00, #ff8f00);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-box-container {
  width: 100%;
  padding: 0 1.5rem;
}

.search-box {
  display: flex;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 107, 0, 0.15);
  background: #ffffff;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 8px;
}

.search-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.input-wrapper {
  flex: 1;
  margin-right: 0.5rem;
}

input {
  width: 100%;
  padding: 0.9rem 1.2rem;
  border: none;
  font-size: 1.05rem;
  background: transparent;
  border-radius: 12px;
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
}

input::placeholder {
  color: #a0a0a0;
  opacity: 1;
}

.search-button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #404040, #2d2d2d);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-button-icon:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-button-icon svg {
  stroke: white;
}

.site-selector {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.site-button {
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  background: #f5f5f5;
  color: #666;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.site-button:hover {
  background: #eeeeee;
  transform: translateY(-1px);
}

.site-button.active {
  background: linear-gradient(135deg, #FFA07A, #FF7F50);
  color: white;
  border-color: #FF7F50;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.2);
}

@media (max-width: 640px) {
  .search-box {
    flex-direction: row;
    gap: 0.5rem;
  }

  .input-wrapper {
    margin-right: 0.3rem;
  }

  .search-button-icon {
    width: 44px;
    height: 44px;
  }

  .site-selector {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .site-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}

.domain-notice {
  margin-top: 1.5rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #FFA07A, #FF7F50);
  color: white;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.2);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .domain-notice {
    margin: 1rem 1.5rem 0;
    font-size: 0.85rem;
  }
}
</style>