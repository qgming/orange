<template>
  <div class="checker-view">
    <div class="checker-notice">
      <div class="notice-content">
        <svg class="notice-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <div>
          <h4>检测说明</h4>
          <p>网站检测可能受浏览器权限、CORS跨域策略、网络环境等因素影响，检测结果仅供参考。如遇到网站显示不可用，建议直接访问确认。</p>
        </div>
      </div>
    </div>
    <SiteChecker />
  </div>
</template>

<script>
import SiteChecker from '@/components/SiteChecker.vue'

export default {
  name: 'CheckerView',
  components: {
    SiteChecker
  }
}
</script>

<style scoped>
.checker-view {
  padding: 20px;
  min-height: 100vh;
}

.checker-notice {
  max-width: 800px;
  margin: 0 auto 20px;
  padding: 16px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
}

.notice-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.notice-icon {
  width: 20px;
  height: 20px;
  color: #856404;
  flex-shrink: 0;
  margin-top: 2px;
}

.notice-content h4 {
  margin: 0 0 8px 0;
  color: #856404;
  font-size: 16px;
  font-weight: 600;
}

.notice-content p {
  margin: 0;
  color: #856404;
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .checker-view {
    padding: 10px;
  }

  .checker-notice {
    margin: 0 10px 20px;
    padding: 12px;
  }

  .notice-content {
    flex-direction: column;
    gap: 8px;
  }

  .notice-icon {
    width: 18px;
    height: 18px;
  }
}
</style>