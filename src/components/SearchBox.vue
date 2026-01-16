<script setup lang="ts">
import { ref, computed } from 'vue'
import { searchSites, performSearch } from '../utils/searchService'

const searchQuery = ref('')
const currentSiteIndex = ref(0)

const placeholderText = computed(() => `在${searchSites[currentSiteIndex.value].name}中搜索视频`)

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
  width: 70px;
  height: 70px;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 8px 16px rgba(255, 255, 255, 0.3));
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-15px) rotate(5deg);
  }

  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

.title {
  color: #ffffff;
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-tight);
  margin-bottom: var(--space-3xl);
  position: relative;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Space Grotesk', 'DM Sans', sans-serif;
}

.search-box-container {
  width: 100%;
  padding: 0 1.5rem;
}

.search-box {
  display: flex;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 24px;
  background: var(--glass-medium);
  backdrop-filter: var(--liquid-glass-blur);
  -webkit-backdrop-filter: var(--liquid-glass-blur);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: var(--shadow-lg), var(--highlight-subtle);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  padding: 10px;
  position: relative;
}

.search-box:hover {
  transform: translateY(-6px);
  background: var(--glass-strong);
  box-shadow: var(--shadow-xl),
    0 0 40px rgba(142, 197, 252, 0.2),
    var(--highlight-strong);
  border-color: rgba(255, 255, 255, 0.4);
}

.input-wrapper {
  flex: 1;
  margin-right: 0.5rem;
}

input {
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  font-size: 1.05rem;
  background: transparent;
  border-radius: 16px;
  transition: all 0.2s ease;
  color: #2d3748;
  font-weight: 500;
}

input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
}

input::placeholder {
  color: rgba(45, 55, 72, 0.6);
  opacity: 1;
}

.search-button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(31, 38, 135, 0.15);
}

.search-button-icon:hover {
  transform: translateY(-2px) scale(1.05);
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 20px rgba(31, 38, 135, 0.25);
}

.search-button-icon:active {
  transform: translateY(0) scale(0.98);
}

.search-button-icon svg {
  stroke: #2d3748;
  stroke-width: 2.5;
}

.site-selector {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.site-button {
  padding: 0.7rem 1.5rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: rgba(45, 55, 72, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(31, 38, 135, 0.1);
  position: relative;
  overflow: hidden;
}

.site-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(31, 38, 135, 0.15);
}

.site-button.active {
  background: rgba(255, 255, 255, 0.4);
  color: #2d3748;
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 24px rgba(31, 38, 135, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
}

/* Liquid Glass 特效增强 */
.search-box::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.3) 100%);
  border-radius: 24px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: -1;
}

.search-box:hover::before {
  opacity: 1;
}

.site-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.05) 100%);
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.site-button:hover::before {
  opacity: 1;
}

@media (max-width: 640px) {
  .logo {
    width: 60px;
    height: 60px;
  }

  .title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }

  .search-box {
    flex-direction: row;
    gap: 0.5rem;
    border-radius: 20px;
    padding: 8px;
  }

  .input-wrapper {
    margin-right: 0.3rem;
  }

  input {
    padding: 0.8rem 1.2rem;
    font-size: 1rem;
  }

  .search-button-icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
  }

  .site-selector {
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .site-button {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    border-radius: 14px;
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