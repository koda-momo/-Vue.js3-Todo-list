import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("../views/Top.vue"),
  },
  {
    path: "/kakeibo",
    component: () => import("../views/Kakeibo.vue"),
  },
  {
    path: "/credit",
    component: () => import("../views/Credit.vue"),
  },
  {
    path: "/todoList",
    component: () => import("../views/TodoList.vue"),
  },
  {
    path: "/kotei",
    component: () => import("../views/Kotei.vue"),
  },
  {
    path: "/hendo",
    component: () => import("../views/Hendo.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
