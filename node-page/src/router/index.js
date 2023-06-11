import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import PCDesign from '../views/ui/design/pc.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/ui/design/pc',
      name: 'PCDesign',
      component: PCDesign
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
          path: '/spaces',
          name: 'PublicSpaces',
          component: () => import('@/views/space/list.vue')
        },
        {
          path: '/space/:name',
          name: 'SpaceDetail',
          component: () => import('@/views/space/detail.vue')
        },
        {
          path: '/workbench',
          name: 'Workbench',
          component: () => import('@/views/workbench.vue')
        },
        {
          path: '/usr/project/create',
          name: 'CreateProject',
          component: () => import('@/views/usr/project/create.vue')
        },
        {
          path: '/usr/project/databases',
          name: 'ProjectDatabases',
          component: () => import('@/views/usr/project/databases.vue')
        },
        {
          path: '/usr/project/:database/models',
          name: 'DatabaseModels',
          component: () => import('@/views/usr/project/database-query-models2.vue')
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
    }
  ]
})

export default router
