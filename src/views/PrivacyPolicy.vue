<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.title = '隐私政策 - 橘子导航'
})
</script>

<template>
  <div class="privacy-policy">
    <div class="header-section">
      <img src="@/assets/logo.svg" alt="橘子导航" class="logo" />
      <h1 class="main-title">隐私政策</h1>
      <p class="subtitle">Privacy Policy</p>
    </div>

    <div class="container">
      <div class="content">
        <section class="policy-section">
          <div class="section-header">
            <span class="section-number">01</span>
            <h2>信息收集</h2>
          </div>
          <p>橘子导航（以下简称"本网站"）不会收集任何个人信息。本网站仅提供影视资源导航服务，不存储任何用户数据。由于本网站不提供注册功能，因此不会保存用户的账号、密码或其他个人信息。</p>
        </section>

        <section class="policy-section">
          <div class="section-header">
            <span class="section-number">02</span>
            <h2>Cookie 使用</h2>
          </div>
          <p>本网站不使用 Cookie 或其他追踪技术来收集用户信息。但请注意，本网站集成了第三方浏览统计功能，该功能可能会使用 Cookie
            或其他技术来统计访问量、用户行为等匿名数据。这些数据仅用于分析网站流量和优化服务，不会识别个人身份。</p>
        </section>

        <section class="policy-section">
          <div class="section-header">
            <span class="section-number">03</span>
            <h2>第三方链接</h2>
          </div>
          <p>本网站包含指向第三方网站的链接。这些网站有其自己的隐私政策，我们建议您在使用前查看这些政策。橘子导航对第三方网站的内容、隐私做法及安全性不承担任何责任。</p>
        </section>

        <section class="policy-section">
          <div class="section-header">
            <span class="section-number">04</span>
            <h2>安全措施</h2>
          </div>
          <p>我们采取适当的技术措施来保护网站的安全性，确保用户访问过程中的数据安全。但请注意，互联网传输数据并非100%安全，我们不能保证信息的绝对安全性。</p>
        </section>

        <section class="policy-section">
          <div class="section-header">
            <span class="section-number">05</span>
            <h2>第三方统计功能</h2>
          </div>
          <p>本网站使用了第三方浏览统计功能，用于分析访问量、用户行为等匿名数据。这些数据仅用于优化网站服务，不会用于识别个人身份或与其他数据关联。</p>
        </section>

        <section class="policy-section">
          <div class="section-header">
            <span class="section-number">06</span>
            <h2>政策更新</h2>
          </div>
          <p>我们可能会不时更新本隐私政策。更新后的政策将在本页面上发布，并注明最新更新时间。</p>
          <div class="update-info">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>最后更新时间：2024年12月31日</span>
          </div>
        </section>

        <section class="policy-section contact-section">
          <div class="section-header">
            <span class="section-number">07</span>
            <h2>联系我们</h2>
          </div>
          <p>如果您对本隐私政策有任何问题或建议，欢迎通过以下方式联系我们：</p>
          <div class="contact-info">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <a href="mailto:qgming@qq.com" class="email-link">qgming@qq.com</a>
          </div>
        </section>

        <div class="back-link">
          <router-link to="/" class="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            返回首页
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.privacy-policy {
  min-height: 100vh;
  background: linear-gradient(135deg, #f9f9f9 0%, #fff5f0 100%);
  padding: 2rem 1rem 4rem;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInDown 0.6s ease-out;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(255, 107, 0, 0.2));
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

.main-title {
  color: #1a1a1a;
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #ff6b00, #ff8f00);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #999;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.content {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.6s ease-out;
  border: 1px solid rgba(255, 107, 0, 0.1);
}

.policy-section {
  margin-bottom: 2.5rem;
  padding: 1.8rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
  border-left: 4px solid #ff6b00;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideUp 0.6s ease-out backwards;
}

.policy-section:nth-child(1) {
  animation-delay: 0.1s;
}

.policy-section:nth-child(2) {
  animation-delay: 0.2s;
}

.policy-section:nth-child(3) {
  animation-delay: 0.3s;
}

.policy-section:nth-child(4) {
  animation-delay: 0.4s;
}

.policy-section:nth-child(5) {
  animation-delay: 0.5s;
}

.policy-section:nth-child(6) {
  animation-delay: 0.6s;
}

.policy-section:nth-child(7) {
  animation-delay: 0.7s;
}

.policy-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 107, 0, 0.15);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.section-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #FFA07A, #FF7F50);
  color: white;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.2);
}

h2 {
  color: #2d2d2d;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

p {
  color: #555;
  line-height: 1.8;
  margin-bottom: 0;
  font-size: 1.05rem;
}

.update-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.8rem 1rem;
  background: linear-gradient(135deg, #fff5f0 0%, #ffe8d8 100%);
  border-radius: 8px;
  color: #ff6b00;
  font-size: 0.95rem;
  font-weight: 500;
}

.update-info svg {
  flex-shrink: 0;
}

.contact-section {
  border-left-color: #4CAF50;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1rem;
  padding: 1rem 1.2rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.contact-info:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
}

.contact-info svg {
  color: #4CAF50;
  flex-shrink: 0;
}

.email-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.email-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.back-link {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px dashed rgba(255, 107, 0, 0.15);
  text-align: center;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 2rem;
  background: linear-gradient(135deg, #404040, #2d2d2d);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.05rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-decoration: none;
}

.back-button:hover {
  background: linear-gradient(135deg, #2d2d2d, #1a1a1a);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.back-button svg {
  transition: transform 0.3s ease;
}

.back-button:hover svg {
  transform: translateX(-3px);
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .privacy-policy {
    padding: 1.5rem 0.75rem 3rem;
  }

  .header-section {
    margin-bottom: 2rem;
  }

  .logo {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
  }

  .main-title {
    font-size: 2rem;
    margin-bottom: 0.3rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .content {
    padding: 1.5rem;
    border-radius: 16px;
  }

  .policy-section {
    padding: 1.2rem;
    margin-bottom: 1.5rem;
  }

  .section-header {
    gap: 0.75rem;
  }

  .section-number {
    width: 32px;
    height: 32px;
    font-size: 0.85rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  p {
    font-size: 0.95rem;
  }

  .update-info,
  .contact-info {
    padding: 0.7rem 0.9rem;
    font-size: 0.9rem;
  }

  .back-link {
    margin-top: 2rem;
    padding-top: 1.5rem;
  }

  .back-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.75rem;
  }

  .content {
    padding: 1.2rem;
  }

  .policy-section {
    padding: 1rem;
  }

  .section-header {
    flex-direction: row;
    align-items: center;
  }

  h2 {
    font-size: 1.1rem;
  }

  p {
    font-size: 0.9rem;
  }
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
  .privacy-policy {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  }

  .main-title {
    color: #fff;
    background: linear-gradient(45deg, #FFA07A, #FF7F50);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    color: #888;
  }

  .content {
    background: #222;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    border-color: rgba(255, 107, 0, 0.2);
  }

  .policy-section {
    background: linear-gradient(135deg, #2a2a2a 0%, #333 100%);
    border-left-color: #FF7F50;
  }

  .policy-section:hover {
    box-shadow: 0 8px 24px rgba(255, 127, 80, 0.2);
  }

  h2 {
    color: #e0e0e0;
  }

  p {
    color: #bbb;
  }

  .update-info {
    background: linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%);
    color: #FFA07A;
  }

  .contact-section {
    border-left-color: #66BB6A;
  }

  .contact-info {
    background: linear-gradient(135deg, #2a3a40 0%, #1f2f35 100%);
  }

  .contact-info svg {
    color: #66BB6A;
  }

  .email-link {
    color: #60a5fa;
  }

  .email-link:hover {
    color: #93c5fd;
  }

  .back-link {
    border-top-color: rgba(255, 127, 80, 0.2);
  }

  .back-button {
    background: linear-gradient(135deg, #FF7F50, #FFA07A);
    color: white;
  }

  .back-button:hover {
    background: linear-gradient(135deg, #FFA07A, #FFB399);
    box-shadow: 0 6px 20px rgba(255, 127, 80, 0.3);
  }
}

/* 打印样式优化 */
@media print {
  .privacy-policy {
    background: white;
    padding: 0;
  }

  .logo,
  .back-button {
    display: none;
  }

  .policy-section {
    page-break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ddd;
  }

  .content {
    box-shadow: none;
    border: none;
  }
}
</style>
