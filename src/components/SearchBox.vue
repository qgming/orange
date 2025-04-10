<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const currentSiteIndex = ref(0)
const searchSites = [
  { name: '追影猫', url: 'https://zhuiyingmao5.com/vodsearch/-------------.html?wd=' },
  { name: '皮皮蛋', url: 'https://ppdys.vip/vodsearch/-------------.html?wd=' },
  { name: '来看点播', url: 'https://lkvod.me/nk/-------------.html?wd=' },
]

const currentSiteName = computed(() => searchSites[currentSiteIndex.value].name)

const toggleSearchSite = () => {
  currentSiteIndex.value = (currentSiteIndex.value + 1) % searchSites.length
}

const handleSearch = () => {
  const query = searchQuery.value.trim()
  if (query) {
    const searchUrl = searchSites[currentSiteIndex.value].url + encodeURIComponent(query)
    window.open(searchUrl, '_blank')
  }
}
</script>

<template>
  <div class="search-container">
    <img src="@/assets/logo.svg" alt="橘子导航" class="logo" />
    <h1 class="title">橘子导航</h1>
    <div class="search-box-container">
      <div class="search-box">
        <button class="toggle-button" @click="toggleSearchSite">
          <span>{{ currentSiteName }}</span>
        </button>
        <div class="input-wrapper">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索视频..." 
            @keyup.enter="handleSearch" 
          />
        </div>
        <button class="search-button" @click="handleSearch">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>搜索</span>
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

.toggle-button {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #FFA07A, #FF7F50);  /* 修改为更深的橙色渐变 */
  color: #ffffff; 
  border: none;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.toggle-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.2);
}

.input-wrapper {
  flex: 1;
  margin: 0 0.5rem;
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

.search-button {
  padding: 0.75rem 1.8rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #404040, #2d2d2d);  /* 改为明显的高级灰渐变 */
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
}

.search-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-button svg {
  stroke: white;
}

@media (max-width: 640px) {
  .search-box {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .toggle-button,
  .search-button {
    width: 100%;
    justify-content: center;
  }
  
  .input-wrapper {
    margin: 0;
  }
}
</style>