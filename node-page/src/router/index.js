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
          path: '/service/create',
          name: 'CreateService',
          component: () => import('@/views/service/create.vue')
        },
        {
          path: '/service/settings',
          name: 'ServiceSettings',
          component: () => import('@/views/service/settings.vue')
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
    },
    {
      path: '/service-list',
      name: 'list',
      component: () => import('@/views/service/list.vue')
    }
  ]
})

export default router
