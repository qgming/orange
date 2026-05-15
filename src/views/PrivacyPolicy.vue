<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
import TopBar from '@/components/TopBar.vue'
import { usePageMeta } from '@/composables/usePageMeta'

usePageMeta({
  title: '隐私政策 - 橘子导航',
  description: '查看橘子导航关于本地缓存、第三方链接、访问统计与联系方式的隐私政策说明。',
  canonicalPath: '/privacy',
})

const policySections = [
  {
    title: '我们收集什么',
    body: '橘子导航不提供账号体系、评论区或站内私信，也不会主动要求你提交姓名、手机号、身份证号等个人敏感信息。正常浏览页面时，我们不会在站内建立可识别你的个人档案。',
  },
  {
    title: '本地缓存与主题设置',
    body: '为了让页面打开更快，部分站点目录、精选推荐、主题偏好和刷新时间会保存在你的浏览器本地存储中。这些数据只存在你的设备里，用于提升访问速度和记住界面状态，不会直接回传到橘子导航服务器。',
  },
  {
    title: '第三方数据与外部链接',
    body: '网站导航、实时榜单、豆瓣周榜和外链跳转依赖第三方数据源或第三方站点。点击跳转后，你将直接访问对应站点，对方可能按其自己的规则收集日志、Cookie 或行为数据，请在访问前自行判断和确认。',
  },
  {
    title: '访问统计与性能监测',
    body: '为了判断页面是否可用、哪些入口更常被使用，以及发现明显的性能问题，我们会使用站点级统计和监测脚本。我们尽量只关注聚合后的访问趋势、页面性能和异常信息，不会将其用于个体画像或定向营销。',
  },
  {
    title: '政策更新',
    body: '如果橘子导航的功能、数据来源或统计方式发生变化，我们会同步更新本页内容。继续使用站点，表示你理解并同意按最新版本的隐私政策使用相关功能。',
  },
]
</script>

<template>
  <div class="privacy-page">
    <TopBar />

    <main class="privacy-main">
      <header class="hero">
        <div class="hero-copy">
          <span class="eyebrow">Privacy Policy</span>
          <h1>隐私政策</h1>
        </div>
      </header>

      <section class="policy-grid" aria-label="隐私政策内容">
        <article class="policy-card policy-card-highlight">
          <span class="policy-kicker">核心原则</span>
          <h2>少收集，少打扰，少打断。</h2>
          <p>
            站点本身不要求注册登录，不提供站内个人资料，也不会为了浏览导航功能额外索取敏感信息。你看到的大部分数据更新都围绕内容发现和页面可用性展开。
          </p>
          <ul class="policy-points">
            <li>不要求提交账号资料才能使用。</li>
            <li>本地缓存优先服务于速度与界面偏好。</li>
            <li>外部站点访问行为适用对方自己的规则。</li>
          </ul>
        </article>

        <article v-for="section in policySections" :key="section.title" class="policy-card">
          <h2>{{ section.title }}</h2>
          <p>{{ section.body }}</p>
        </article>
      </section>

      <section class="contact-card" aria-label="联系信息">
        <div>
          <span class="policy-kicker">Contact</span>
          <h2>对政策内容有疑问</h2>
          <p>如果你对缓存、第三方跳转或统计脚本有疑问，可以直接通过邮箱联系。</p>
        </div>
        <a href="mailto:qgming@qq.com" class="contact-link">qgming@qq.com</a>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.privacy-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.privacy-main {
  flex: 1;
  width: min(100%, 1180px);
  margin: 0 auto;
  padding: var(--sp-6) var(--sp-4) 0;
}

.hero {
  margin-bottom: var(--sp-6);
}

.hero-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--sp-3);
  max-width: 760px;
}

.eyebrow,
.policy-kicker {
  color: var(--c-accent-light);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero h1,
.contact-card h2,
.policy-card h2 {
  margin: 0;
  color: var(--text-primary);
}

.hero h1 {
  font-size: clamp(2.125rem, 5vw, 3.75rem);
  line-height: 1;
}

.policy-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--sp-4);
}

.policy-card,
.contact-card {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  padding: var(--sp-5);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: var(--surface-card);
  box-shadow: var(--shadow-sm);
}

.policy-card-highlight {
  grid-column: 1 / -1;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--c-accent) 8%, var(--surface-card)), var(--surface-card));
}

.policy-card h2,
.contact-card h2 {
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  line-height: 1.2;
}

.policy-card p,
.contact-card p {
  margin: 0;
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

.policy-points {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  color: var(--text-secondary);
}

.policy-points li {
  position: relative;
  padding-left: 18px;
  line-height: var(--leading-relaxed);
}

.policy-points li::before {
  content: '';
  position: absolute;
  top: 0.7em;
  left: 0;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--c-accent);
}

.contact-card {
  margin-top: var(--sp-6);
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
}

.contact-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 var(--sp-4);
  border-radius: var(--radius-full);
  background: var(--c-accent);
  color: var(--text-on-accent);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: transform var(--duration-fast) var(--ease-out), filter var(--duration-fast) var(--ease-out);
}

.contact-link:hover {
  transform: translateY(-1px);
  filter: brightness(1.06);
}

@media (max-width: 860px) {
  .policy-grid {
    grid-template-columns: 1fr;
  }

  .contact-card {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 620px) {
  .privacy-main {
    padding-top: var(--sp-4);
  }

}
</style>
