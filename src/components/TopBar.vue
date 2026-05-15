<script setup lang="ts">
/**
 * TopBar - 全站顶栏
 * 只负责品牌、快捷跳转和主题切换，搜索入口放回首页。
 */
import ThemeToggle from './ThemeToggle.vue'

const quickLinks = [
  { to: '/', name: 'home', label: '首页', icon: 'home' },
  { to: '/nav', name: 'site-nav', label: '网站导航', icon: 'grid' },
  { to: '/douban-weekly', name: 'douban-weekly', label: '豆瓣周榜', icon: 'star' },
  { to: '/realtime-rankings', name: 'realtime-rankings', label: '实时榜单', icon: 'activity' },
]

</script>

<template>
  <header class="top-bar">
    <div class="bar-content">
      <router-link to="/" class="logo-link" aria-label="橘子导航首页">
        <img src="@/assets/logo.svg" alt="" class="logo" />
        <span class="logo-text">橘子导航</span>
      </router-link>

      <nav class="quick-nav" aria-label="快捷跳转">
        <RouterLink
          v-for="link in quickLinks"
          :key="link.name"
          :to="link.to"
          custom
          v-slot="{ href, navigate, isExactActive }"
        >
          <a
            :href="href"
            class="quick-link"
            :class="{ active: isExactActive }"
            :aria-current="isExactActive ? 'page' : undefined"
            @click="navigate"
          >
            <svg v-if="link.icon === 'home'" class="quick-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m3 10.5 9-7 9 7"></path>
              <path d="M5 9.5V20h14V9.5"></path>
              <path d="M9 20v-6h6v6"></path>
            </svg>
            <svg v-else-if="link.icon === 'grid'" class="quick-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
              <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
              <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
              <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
            </svg>
            <svg v-else-if="link.icon === 'star'" class="quick-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m12 3 2.8 5.68 6.27.91-4.54 4.42 1.07 6.24L12 17.31l-5.6 2.94 1.07-6.24-4.54-4.42 6.27-.91L12 3Z"></path>
            </svg>
            <svg v-else class="quick-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 14h4l2-7 4 12 2-5h4"></path>
            </svg>
            <span class="quick-label">{{ link.label }}</span>
          </a>
        </RouterLink>
      </nav>

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
  background: var(--surface-backdrop);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border-default);
}

.bar-content {
  max-width: 1240px;
  margin: 0 auto;
  padding: var(--sp-2) var(--sp-4);
  display: flex;
  align-items: center;
  gap: var(--sp-4);
}

.logo-link {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-shrink: 0;
  min-width: 128px;
}

.logo {
  width: 26px;
  height: 26px;
}

.logo-text {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  white-space: nowrap;
}

.quick-nav {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-1);
  overflow-x: auto;
  scrollbar-width: none;
}

.quick-nav::-webkit-scrollbar {
  display: none;
}

.quick-link {
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 var(--sp-3);
  border-radius: calc(var(--radius-xl) - 4px);
  border: 1px solid transparent;
  background: color-mix(in srgb, var(--surface-chip) 86%, transparent);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  white-space: nowrap;
  transition:
    color var(--duration-fast) var(--ease-out),
    background var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);
}

.quick-link:hover {
  color: color-mix(in srgb, var(--c-accent) 42%, var(--text-primary));
  border-color: transparent;
  background: color-mix(in srgb, var(--c-accent) 9%, var(--bg-elevated));
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.quick-link.active {
  color: var(--text-primary);
  border-color: transparent;
  background: color-mix(in srgb, var(--c-accent) 15%, var(--bg-elevated));
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--c-white) 12%, transparent),
    var(--shadow-sm);
}

.quick-link.active:hover {
  background: color-mix(in srgb, var(--c-accent) 18%, var(--bg-elevated));
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--c-white) 14%, transparent),
    var(--shadow);
}

.quick-link.active .quick-icon {
  color: color-mix(in srgb, var(--c-accent-light) 86%, var(--text-primary));
}

.quick-link.active .quick-label {
  color: color-mix(in srgb, var(--c-accent-dark) 24%, var(--text-primary));
  font-weight: var(--font-semibold);
}

.quick-icon {
  width: 15px;
  height: 15px;
  color: color-mix(in srgb, var(--text-primary) 18%, var(--text-secondary));
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex-shrink: 0;
}

.bar-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  min-width: 44px;
}

@media (max-width: 760px) {
  .bar-content {
    gap: var(--sp-2);
  }

  .logo-link {
    min-width: auto;
  }

  .logo-text {
    display: none;
  }

  .quick-nav {
    justify-content: flex-start;
  }

  .quick-link {
    padding: 0 var(--sp-2);
    font-size: var(--text-xs);
  }

}

@media (max-width: 460px) {
  .quick-label {
    display: none;
  }

  .quick-link {
    width: 34px;
    padding: 0;
  }
}
</style>
