<template>
  <div class="search-box-container">
    <div class="search-box">
      <div class="input-wrapper">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索视频..."
          @keyup.enter="handleSearch"
        />
      </div>
      <button @click="handleSearch">
        <span>搜索</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')

const handleSearch = () => {
  const query = searchQuery.value.trim()
  if (query) {
    const searchUrl = `https://zhuiyingmao5.com/vodsearch/-------------.html?wd=${encodeURIComponent(query)}`
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

.search-box {
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1.25rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(255, 107, 26, 0.1);
}

.input-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

input {
  flex: 1;
  padding: 0.875rem 1rem 0.875rem 1rem;
  width: 100%;
  border: 2px solid #ffe5d4;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fff8f3;
  color: #333;
}

input:focus {
  outline: none;
  border-color: #ff6b1a;
  background: white;
  box-shadow: 0 0 0 4px rgba(255, 107, 26, 0.1);
}

input::placeholder {
  color: #ffb38a;
}

button {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #ff8c3d 0%, #ff6b1a 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  min-width: 100px;
  box-shadow: 0 2px 8px rgba(255, 107, 26, 0.2);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 26, 0.3);
  background: linear-gradient(135deg, #ffa666 0%, #ff8c3d 100%);
}

button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(255, 107, 26, 0.2);
  background: linear-gradient(135deg, #ff6b1a 0%, #ff5500 100%);
}

@media (max-width: 680px) {
  .search-box-container {
    padding: 0.75rem;
  }

  .search-box {
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 16px;
  }

  input {
    padding: 0.75rem 1rem 0.75rem 2.25rem;
    font-size: 0.875rem;
  }

  .search-icon {
    font-size: 0.875rem;
    left: 0.875rem;
  }

  button {
    width: 100%;
    padding: 0.75rem;
    font-size: 0.875rem;
    min-width: auto;
  }
}

@media (prefers-color-scheme: dark) {
  .search-box {
    background: #222;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  input {
    background: #2a2a2a;
    border-color: rgba(255, 140, 61, 0.3);
    color: #fff;
  }

  input:focus {
    background: #333;
    border-color: #ff8c3d;
    box-shadow: 0 0 0 4px rgba(255, 140, 61, 0.15);
  }

  input::placeholder {
    color: #ff8c3d;
    opacity: 0.6;
  }

  button {
    background: linear-gradient(135deg, #ff8c3d 0%, #ff6b1a 100%);
  }

  button:hover {
    background: linear-gradient(135deg, #ffa666 0%, #ff8c3d 100%);
  }

  button:active {
    background: linear-gradient(135deg, #ff6b1a 0%, #ff5500 100%);
  }
}
</style>