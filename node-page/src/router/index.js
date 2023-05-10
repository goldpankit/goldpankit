import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/spaces',
      name: 'PublicSpaces',
      component: () => import('@/views/spaces.vue')
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
          path: '/login',
          name: 'login',
          component: () => import('@/views/login.vue')
        },
        {
          path: '/usr/space/create',
          name: 'CreateSpace',
          component: () => import('@/views/usr/create-space.vue')
        },
        {
          path: '/usr/spaces',
          name: 'UserSpaces',
          component: () => import('@/views/usr/spaces.vue')
        },
        {
          path: '/usr/service/create',
          name: 'CreateService',
          component: () => import('@/views/usr/service/create.vue')
        },
        {
          path: '/usr/service/settings',
          name: 'ServiceSettings',
          component: () => import('@/views/usr/service/settings.vue')
        },
        {
          path: '/usr/services',
          name: 'UserServices',
          component: () => import('@/views/usr/services.vue')
        }
      ]
    },
    {
      path: '/',
      name: 'AppLayout',
      component: AppLayout,
      children: [
        {
          path: '/warehouse',
          name: 'warehouse',
          component: () => import('@/views/template/warehouse.vue')
        }
      ]
    }
  ]
})

export default router
