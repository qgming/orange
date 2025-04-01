<template>
  <div class="search-box-container">
    <div class="search-box">
      <button class="toggle-button" @click="toggleSearchSite">
        <span>{{ currentSiteName }}</span>
      </button>
      <div class="input-wrapper">
        <input type="text" v-model="searchQuery" placeholder="搜索视频..." @keyup.enter="handleSearch" />
      </div>
      <button @click="handleSearch">
        <span>搜索</span>
      </button>
    </div>
  </div>
</template>

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

<style scoped>
.search-box-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.25rem;
}

.toggle-button {
  width: 90px;
  /* 固定宽度 */
  padding: 0 1rem;
  background: linear-gradient(135deg, #ffb38a 0%, #ff9e6b 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 180, 130, 0.25);
  background: linear-gradient(135deg, #ffc5a1 0%, #ffb38a 100%);
}

.toggle-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(255, 180, 130, 0.2);
  background: linear-gradient(135deg, #ffb38a 0%, #ff9e6b 100%);
}

.search-box {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 0.75rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(255, 180, 130, 0.15);
  transition: all 0.3s ease;
}

.input-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ffd8c0;
  border-radius: 12px;
  font-size: 0.95rem;
  background: #fff9f5;
  color: #5a4a42;
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #ffb38a;
  background: white;
  box-shadow: 0 0 0 4px rgba(255, 180, 130, 0.1);
}

input::placeholder {
  color: #ffb38a;
  opacity: 0.7;
}

button {
  padding: 0 1.5rem;
  background: linear-gradient(135deg, #ffb38a 0%, #ff9e6b 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 180, 130, 0.25);
  background: linear-gradient(135deg, #ffc5a1 0%, #ffb38a 100%);
}

button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(255, 180, 130, 0.2);
  background: linear-gradient(135deg, #ffb38a 0%, #ff9e6b 100%);
}

@media (max-width: 680px) {
  .search-box-container {
    padding: 0.75rem;
  }

  .toggle-button {
    width: 100%;
    margin-right: 0;
    margin-bottom: 0.5rem;
  }

  .search-box {
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
  }

  input {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }

  button {
    width: 100%;
    padding: 0.75rem;
    font-size: 0.875rem;
  }
}

@media (prefers-color-scheme: dark) {
  .search-box {
    background: #1e1e1e;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
  }

  input {
    background: #252525;
    border-color: rgba(255, 180, 130, 0.3);
    color: #e0d7d2;
  }

  input:focus {
    background: #2d2d2d;
    border-color: #ffb38a;
    box-shadow: 0 0 0 4px rgba(255, 180, 130, 0.15);
  }

  input::placeholder {
    color: #ffb38a;
    opacity: 0.5;
  }

  button {
    background: linear-gradient(135deg, #ff9e6b 0%, #ff8c52 100%);
  }

  button:hover {
    background: linear-gradient(135deg, #ffb38a 0%, #ff9e6b 100%);
  }

  button:active {
    background: linear-gradient(135deg, #ff8c52 0%, #ff7b3d 100%);
  }
}
</style>