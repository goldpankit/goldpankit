import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WorkspaceLayout from '../layouts/WorkspaceLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/',
      name: 'WorkspaceLayout',
      component: WorkspaceLayout,
      children: [
        {
          path: '/create-service',
          name: 'CreateService',
          component: () => import('@/views/create-service.vue')
        },
        {
          path: '/create-space',
          name: 'CreateSpace',
          component: () => import('@/views/create-space.vue')
        },
        {
          path: '/login',
          name: 'login',
          component: () => import('@/views/login.vue')
        }
      ]
    }
  ]
})

export default router
