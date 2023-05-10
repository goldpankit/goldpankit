import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/public-spaces',
      name: 'PublicSpaces',
      component: HomeView
    },
    {
      path: '/',
      name: 'DefaultLayout',
      component: DefaultLayout,
      children: [
        {
          path: '/',
          name: 'Index',
          component: () => import('@/views/index.vue')
        },
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
    }
  ]
})

export default router
