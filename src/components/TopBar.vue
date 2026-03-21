<script setup lang="ts">
/**
 * TopBar - 顶部导航条
 */
import ThemeToggle from './ThemeToggle.vue'
</script>

<template>
  <header class="top-bar">
    <div class="bar-content">
      <router-link to="/" class="logo-link">
        <img src="@/assets/logo.svg" alt="橘子导航" class="logo" />
        <span class="logo-text">橘子导航</span>
      </router-link>
      
      <div class="bar-right">
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<style scoped>
.top-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-base);
  border-bottom: 1px solid var(--border-default);
}

.bar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--sp-3) var(--sp-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.logo {
  width: 28px;
  height: 28px;
}

.logo-text {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.bar-right {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}
</style>
