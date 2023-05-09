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
          path: '/create-factory',
          name: 'CreateFactory',
          component: () => import('@/views/create-factory.vue')
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
