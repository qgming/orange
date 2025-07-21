import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import PrivacyPolicy from "@/views/PrivacyPolicy.vue";
import CheckerView from "@/views/CheckerView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/privacy",
      name: "Privacy",
      component: PrivacyPolicy,
    },
    {
      path: "/checker",
      name: "Checker",
      component: CheckerView,
    },
  ],
});

export default router;
