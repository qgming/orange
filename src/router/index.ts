import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PrivacyPolicy from '@/views/PrivacyPolicy.vue'
import DoubanWeeklyView from '@/views/DoubanWeeklyView.vue'
import RealtimeRankingsView from '@/views/RealtimeRankingsView.vue'
import SiteNavView from '@/views/SiteNavView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/nav',
      name: 'site-nav',
      component: SiteNavView,
    },
    {
      path: '/douban-weekly',
      name: 'douban-weekly',
      component: DoubanWeeklyView,
    },
    {
      path: '/realtime-rankings',
      name: 'realtime-rankings',
      component: RealtimeRankingsView,
    },
    {
      path: '/privacy',
      name: 'Privacy',
      component: PrivacyPolicy,
    },
  ],
})

export default router
