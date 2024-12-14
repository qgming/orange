import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PrivacyPolicy from '../views/PrivacyPolicy.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: PrivacyPolicy
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
