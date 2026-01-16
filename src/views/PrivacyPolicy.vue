<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.title = '隐私政策 - 橘子导航'
})
</script>

<template>
  <div class="privacy-container">
    <div class="privacy-card liquid-glass">
      <header class="privacy-header">
        <router-link to="/" class="close-btn" title="返回首页">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </router-link>
        <div class="logo-area">
          <img src="@/assets/logo.svg" alt="Logo" class="logo" />
          <h1>隐私政策</h1>
        </div>
        <p class="last-updated">更新于 2024年12月31日</p>
      </header>

      <div class="privacy-content">
        <div class="policy-item">
          <div class="icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div class="text-box">
            <h3>零信息收集</h3>
            <p>我们承诺<b>不收集任何个人敏感信息</b>。作为纯粹的导航工具，无需注册登录即可使用所有功能。您的浏览历史仅保存在本地设备。</p>
          </div>
        </div>

        <div class="policy-item">
          <div class="icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </div>
          <div class="text-box">
            <h3>第三方链接</h3>
            <p>本站提供的第三方网站链接仅为方便用户。我们无法控制这些外部站点的隐私策略，请在访问时注意甄别。</p>
          </div>
        </div>

        <div class="policy-item">
          <div class="icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div class="text-box">
            <h3>统计与优化</h3>
            <p>我们可能会使用匿名统计工具（非个人追踪）来分析访问流量，仅旨在优化网站加载速度和用户体验。</p>
          </div>
        </div>
      </div>

      <footer class="privacy-footer">
        <p>如有疑问，请联系 <a href="mailto:qgming@qq.com">qgming@qq.com</a></p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.privacy-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  /* 确保在body的背景之上 */
  z-index: 1;
}

.privacy-card {
  width: 100%;
  max-width: 600px;
  padding: 40px;
  border-radius: 24px;
  /* 使用 base.css 定义的 liquid-glass 类，这里做一些特定调整 */
  background: rgba(255, 255, 255, 0.7);
  /* 比默认稍不透明一点，保证文字可读性 */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05);
  animation: slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

/* 顶部区域 */
.privacy-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  opacity: 0.6;
  transition: all 0.3s ease;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.0);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.5);
  opacity: 1;
  transform: rotate(90deg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.logo {
  width: 72px;
  height: 72px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.privacy-header h1 {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #2c3e50;
  margin: 0;
  background: linear-gradient(135deg, #2c3e50 0%, #3b82f6 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.last-updated {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 8px;
  font-weight: 500;
  opacity: 0.8;
}

/* 内容区域 */
.privacy-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.policy-item {
  display: flex;
  gap: 20px;
  padding: 24px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.policy-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 10px 25px rgba(142, 197, 252, 0.25);
  border-color: rgba(255, 255, 255, 0.6);
}

.icon-box {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 8px 16px rgba(142, 197, 252, 0.4);
}

.text-box {
  flex: 1;
}

.text-box h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 8px;
}

.text-box p {
  font-size: 0.95rem;
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

.text-box b {
  color: #2b6cb0;
  font-weight: 600;
}

/* 底部区域 */
.privacy-footer {
  margin-top: 40px;
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.privacy-footer p {
  color: #718096;
  font-size: 0.9rem;
  font-weight: 500;
}

.privacy-footer a {
  color: #4299e1;
  font-weight: 600;
  text-decoration: none;
  position: relative;
  transition: color 0.2s;
}

.privacy-footer a::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: #4299e1;
  transform: scaleX(0);
  transform-origin: bottom right;
  transition: transform 0.3s ease-out;
}

.privacy-footer a:hover {
  color: #3182ce;
}

.privacy-footer a:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式调整 */
@media (max-width: 640px) {
  .privacy-container {
    padding: 15px;
    align-items: flex-start;
    /* 移动端靠上对齐 */
    padding-top: 30px;
  }

  .privacy-card {
    padding: 30px 20px;
  }

  .policy-item {
    flex-direction: column;
    gap: 15px;
    text-align: center;
    padding: 20px;
  }

  .icon-box {
    margin: 0 auto;
    width: 48px;
    height: 48px;
  }

  .text-box h3 {
    justify-content: center;
  }

  .close-btn {
    top: -10px;
    right: -10px;
  }

  .logo {
    width: 60px;
    height: 60px;
  }

  .privacy-header h1 {
    font-size: 1.75rem;
  }
}
</style>
