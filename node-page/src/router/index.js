import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/index.js'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import PCDesign from '../views/ui/design/pc.vue'
import NoneLayout from "../layouts/NoneLayout.vue";
import WorkbenchLayout from "../layouts/WorkbenchLayout.vue";
import WithDatabaseLayout from "../layouts/WithDatabaseLayout.vue";
import {getLoginInfo} from "../api/user.login";

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
          path: '/desktop',
          name: 'Desktop',
          component: () => import('@/views/desktop.vue')
        },
        {
          path: '/',
          name: 'Index',
          component: () => import('@/views/guide.vue')
        },
        {
          path: '/signin',
          name: 'SignIn',
          component: () => import('@/views/signin.vue')
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
          path: '/services',
          name: 'PublicServices',
          component: () => import('@/views/services.vue')
        },
        {
          path: '/databases',
          name: 'Databases',
          component: () => import('@/views/database/list.vue')
        },
        {
          path: '/space/:name',
          name: 'SpaceDetail',
          component: () => import('@/views/space/detail.vue')
        },
        {
          path: '/space/:spaceName/:serviceName',
          name: 'ServiceDetail',
          component: () => import('@/views/service/detail.vue')
        },
        {
          path: '/space/:spaceName/:serviceName/install',
          name: 'ServiceInstaller',
          component: () => import('@/views/service/install.vue')
        },
        {
          path: '/workbench',
          name: 'Workbench',
          component: () => import('@/views/workbench.vue')
        },
        {
          path: '/usr/bean/top-up',
          name: 'TopUpBean',
          component: () => import('@/views/usr/bean/top-up.vue')
        },
        {
          path: '/usr/project/create',
          name: 'CreateProject',
          component: () => import('@/views/usr/project/create.vue')
        },
        {
          path: '/usr/space/create',
          name: 'CreateSpace',
          component: () => import('@/views/usr/create-space.vue')
        },
        {
          path: '/usr/services',
          name: 'UserServices',
          component: () => import('@/views/usr/services.vue')
        },
        {
          path: '/usr/service/create',
          name: 'CreateService',
          component: () => import('@/views/usr/service/create.vue')
        },
        {
          path: '/usr/profile',
          name: 'UserProfile',
          component: () => import('@/views/usr/profile/profile.vue')
        }
      ]
    },
    {
      path: '/NoneLayout',
      name: 'NoneLayout',
      component: NoneLayout,
      children: [
        {
          path: '/signin',
          name: 'SignIn',
          component: () => import('@/views/signin.vue')
        },
        {
          path: '/signup',
          name: 'SignUp',
          component: () => import('@/views/signup.vue')
        }
      ]
    },
    {
      path: '/WorkbenchLayout',
      name: 'WorkbenchLayout',
      component: WorkbenchLayout,
      children: [
        {
          path: '/workbench',
          name: 'Workbench',
          component: () => import('@/views/workbench.vue')
        },
        {
          path: '/usr/service/settings',
          name: 'ServiceSettings',
          component: () => import('@/views/usr/service/settings.vue')
        },
      ]
    },
    {
      path: '/WithDatabaseLayout',
      name: 'WithDatabaseLayout',
      component: WithDatabaseLayout,
      children: [
        {
          path: '/database/query-models',
          name: 'DatabaseQueryModel',
          component: () => import('@/views/database/query-models.vue')
        },
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 非用户页面：直接放行
  if (!to.path.startsWith('/usr')) {
    next()
    return
  }
  // 用户页面：如果拿到了登录信息，直接放行
  getLoginInfo()
    .then(data => {
      // 获取到了登录信息：放行
      if (data != null) {
        next()
        return
      }
      // 未获取到登录信息：退出登录
      store.dispatch('logout')
      // 跳转到登录页
      next({
        name: 'SignIn',
        query: {
          redirect_uri: to.path
        }
      })
    })
    .catch(() => {
      next({
        name: 'SignIn'
      })
    })
})

export default router
