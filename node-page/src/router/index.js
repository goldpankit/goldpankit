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
          component: () => import('@/views/service/create.vue')
        },
        {
          path: '/usr/service/settings',
          name: 'ServiceSettings',
          component: () => import('@/views/service/settings.vue')
        }
      ]
    }
  ]
})

export default router
