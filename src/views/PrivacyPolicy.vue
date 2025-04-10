<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.title = '隐私政策 - 橘子导航'
})
</script>

<template>
  <div class="privacy-policy">
    <div class="container">
      <h1>隐私政策</h1>
      <div class="content">
        <section>
          <h2>1. 信息收集</h2>
          <p>橘子导航（以下简称“本网站”）不会收集任何个人信息。本网站仅提供影视资源导航服务，不存储任何用户数据。由于本网站不提供注册功能，因此不会保存用户的账号、密码或其他个人信息。</p>
        </section>

        <section>
          <h2>2. Cookie 使用</h2>
          <p>本网站不使用 Cookie 或其他追踪技术来收集用户信息。但请注意，本网站集成了第三方浏览统计功能，该功能可能会使用 Cookie
            或其他技术来统计访问量、用户行为等匿名数据。这些数据仅用于分析网站流量和优化服务，不会识别个人身份。</p>
        </section>

        <section>
          <h2>3. 第三方链接</h2>
          <p>本网站包含指向第三方网站的链接。这些网站有其自己的隐私政策，我们建议您在使用前查看这些政策。橘子导航对第三方网站的内容、隐私做法及安全性不承担任何责任。</p>
        </section>

        <section>
          <h2>4. 安全措施</h2>
          <p>我们采取适当的技术措施来保护网站的安全性，确保用户访问过程中的数据安全。但请注意，互联网传输数据并非100%安全，我们不能保证信息的绝对安全性。</p>
        </section>

        <section>
          <h2>5. 第三方统计功能</h2>
          <p>本网站使用了第三方浏览统计功能，用于分析访问量、用户行为等匿名数据。这些数据仅用于优化网站服务，不会用于识别个人身份或与其他数据关联。</p>
        </section>

        <section>
          <h2>6. 政策更新</h2>
          <p>我们可能会不时更新本隐私政策。更新后的政策将在本页面上发布，并注明最新更新时间。本隐私政策最后更新日期为2024年12月31日。</p>
        </section>

        <section>
          <h2>7. 联系我们</h2>
          <p>如果您对本隐私政策有任何问题或建议，请通过邮箱 <a href="mailto:qgming@qq.com">qgming@qq.com</a> 联系我们。</p>
        </section>

        <div class="back-link">
          <router-link to="/" class="back-button">返回首页</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.privacy-policy {
  min-height: 100vh;
  background-color: #fff8f3;
  padding: 2rem 1rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #ff6b1a;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(255, 107, 26, 0.1);
  animation: fadeIn 0.5s ease-out;
}

section {
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.5);
  animation: slideUp 0.5s ease-out;
}

h2 {
  color: #ff8c3d;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  font-weight: 600;
}

p {
  color: #555;
  line-height: 1.8;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

a {
  color: #ff6b1a;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

a:hover {
  color: #ff8c3d;
  text-decoration: underline;
}

.back-link {
  margin-top: 2.5rem;
  text-align: center;
}

.back-button {
  display: inline-block;
  padding: 0.8rem 2rem;
  background-color: #ff6b1a;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 107, 26, 0.2);
}

.back-button:hover {
  background-color: #ff8c3d;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 26, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
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

@media (max-width: 768px) {
  .privacy-policy {
    padding: 1rem 0.75rem;
  }

  .content {
    padding: 1.5rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  p {
    font-size: 1rem;
  }

  section {
    padding: 0.75rem;
    margin-bottom: 1.5rem;
  }
}

@media (prefers-color-scheme: dark) {
  .privacy-policy {
    background-color: #1a1a1a;
  }

  .content {
    background: #222;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }

  section {
    background: rgba(255, 255, 255, 0.03);
  }

  h1 {
    color: #ff8c3d;
  }

  h2 {
    color: #ff8c3d;
  }

  p {
    color: #bbb;
  }

  a {
    color: #ff8c3d;
  }

  a:hover {
    color: #ffa666;
  }

  .back-button {
    background-color: #ff8c3d;
  }

  .back-button:hover {
    background-color: #ffa666;
  }
}
</style>
