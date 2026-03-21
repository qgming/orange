<script setup lang="ts">
/**
 * PrivacyPolicy - 隐私政策
 */
import { onMounted } from 'vue'

onMounted(() => {
  document.title = '隐私政策 - 橘子导航'
})
</script>

<template>
  <div class="privacy-page">
    <div class="page-container">
      <header class="page-header">
        <router-link to="/" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          返回首页
        </router-link>
        <h1 class="page-title">隐私政策</h1>
        <p class="page-subtitle">更新于 2024年12月31日</p>
      </header>

      <div class="page-content">
        <section class="policy-section">
          <h2>零信息收集</h2>
          <p>我们承诺<strong>不收集任何个人敏感信息</strong>。作为纯粹的导航工具，无需注册登录即可使用所有功能。您的浏览历史仅保存在本地设备。</p>
        </section>

        <section class="policy-section">
          <h2>第三方链接</h2>
          <p>本站提供的第三方网站链接仅为方便用户。我们无法控制这些外部站点的隐私策略，请在访问时注意甄别。</p>
        </section>

        <section class="policy-section">
          <h2>统计与优化</h2>
          <p>我们可能会使用匿名统计工具（非个人追踪）来分析访问流量，仅旨在优化网站加载速度和用户体验。</p>
        </section>
      </div>

      <footer class="page-footer">
        <p>如有疑问，请联系 <a href="mailto:qgming@qq.com">qgming@qq.com</a></p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.privacy-page {
  min-height: 100vh;
  padding: var(--sp-8) var(--sp-4);
}

.page-container {
  max-width: 640px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--sp-8);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin-bottom: var(--sp-6);
  transition: color var(--duration-fast) var(--ease-out);
}

.back-link:hover {
  color: var(--text-primary);
}

.page-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--sp-2) 0;
}

.page-subtitle {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin: 0;
}

.page-content {
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
}

.policy-section {
  padding: var(--sp-5);
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
}

.policy-section h2 {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--sp-3) 0;
}

.policy-section p {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

.policy-section strong {
  color: var(--c-accent);
}

.page-footer {
  margin-top: var(--sp-8);
  text-align: center;
}

.page-footer p {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin: 0;
}

.page-footer a {
  color: var(--c-accent);
  transition: opacity var(--duration-fast) var(--ease-out);
}

.page-footer a:hover {
  opacity: 0.8;
}
</style>
