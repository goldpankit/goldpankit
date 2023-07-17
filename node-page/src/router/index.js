import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import PCDesign from '../views/ui/design/pc.vue'
import UserLayout from "../layouts/UserLayout.vue";
import NonProjectLayout from "../layouts/NonProjectLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/ui/design/pc',
      name: 'PCDesign',
      component: PCDesign
    },
    {
      path: '/DefaultLayout',
      name: 'DefaultLayout',
      component: DefaultLayout,
      children: [
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
          path: '/usr/bean/recharge',
          name: 'RechargeBean',
          component: () => import('@/views/usr/bean/recharge.vue')
        },
        {
          path: '/usr/project/create',
          name: 'CreateProject',
          component: () => import('@/views/usr/project/create.vue')
        },
        {
          path: '/usr/project/:database/models',
          name: 'DatabaseModels',
          component: () => import('@/views/usr/project/database-query-models.vue')
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
        }
      ]
    },
    {
      path: '/NonProjectLayout',
      name: 'NonProjectLayout',
      component: NonProjectLayout,
      children: [
        {
          path: '/',
          name: 'Index',
          component: () => import('@/views/index.vue')
        },
        {
          path: '/login',
          name: 'Login',
          component: () => import('@/views/login.vue')
        },
        {
          path: '/signup',
          name: 'SignUp',
          component: () => import('@/views/signup.vue')
        },
        {
          path: '/spaces',
          name: 'PublicSpaces',
          component: () => import('@/views/spaces.vue')
        },
        {
          path: '/databases',
          name: 'Databases',
          component: () => import('@/views/database/list.vue')
        },
      ]
    },
    {
      path: '/UserLayout',
      name: 'UserLayout',
      component: UserLayout,
      children: [
        {
          path: '/usr/profile',
          name: 'UserProfile',
          component: () => import('@/views/usr/profile/profile.vue')
        }
      ]
    }
  ]
})

export default router
