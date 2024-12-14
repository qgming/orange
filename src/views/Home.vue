<script setup>
import { ref, onMounted } from 'vue'
import SearchBox from '../components/SearchBox.vue'
import VideoList from '../components/VideoList.vue'

const isLoading = ref(true)

onMounted(() => {
  document.title = '橘子导航'
  setTimeout(() => isLoading.value = false, 300)
})
</script>

<template>
  <main class="main">
    <Transition name="fade" appear>
      <div v-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
      </div>
    </Transition>

    <Transition name="fade" appear>
      <div v-show="!isLoading" class="content">
        <div class="title-container">
          <img src="@/assets/logo.svg" alt="橘子导航" class="logo" />
          <h1 class="title">橘子导航</h1>
        </div>
        <SearchBox class="search-container" />
        <VideoList class="video-container" />
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.main {
  min-height: 100vh;
  padding: 2rem 1rem;
  background-color: #fff8f3;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #ff8c3d 0%, #ff6b1a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(255, 107, 26, 0.1);
}

.logo {
  width: 48px;
  height: 48px;
  animation: bounce 2s ease-in-out infinite;
}

.search-container {
  margin-bottom: 2rem;
}

.video-container {
  animation: slideUp 0.6s ease-out;
}

.loading {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-background);
  z-index: 100;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #ffe4d3;
  border-top-color: #ff6b1a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

@media (max-width: 768px) {
  .main {
    padding: 1rem 0.75rem;
  }

  .title {
    font-size: 2rem;
  }

  .logo {
    width: 36px;
    height: 36px;
  }

  .search-container {
    margin-bottom: 1.5rem;
  }
}

@media (prefers-color-scheme: dark) {
  .main {
    background-color: #1a1a1a;
  }
  
  .title {
    background: linear-gradient(135deg, #ff8c3d 0%, #ff6b1a 100%);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .loading-spinner {
    border-color: #2c2c2c;
    border-top-color: #ff8c3d;
  }
}
</style>
