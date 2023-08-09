import Vue from 'vue'
import VueRouter from 'vue-router'
import AppLayout from '@/layouts/AppLayout'
import { getUserInfo } from '@/api/system/common'
const Login = () => import('@/views/login')
const ErrorNoPermissions = () => import('@/views/no-permissions')
const Error404 = () => import('@/views/not-found')

Vue.use(VueRouter)

const router = new VueRouter({
  base: process.env.VUE_APP_CONTEXT_PATH + (process.env.VUE_APP_ROUTER_MODE === 'hash' ? '#' : ''),
  mode: process.env.VUE_APP_ROUTER_MODE,
  routes: [
    // 登录
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    // 无权限
    {
      name: 'no-permissions',
      path: '/no-permissions',
      component: ErrorNoPermissions
    },
    // 404
    {
      name: 'not-found',
      path: '/not-found',
      component: Error404
    },
    // 内容页（动态加载）
    {
      name: 'layout',
      path: '',
      component: AppLayout,
      children: []
    }
  ]
})
router.beforeEach((to, from, next) => {
  // 无权访问&404页面可直接访问
  if (to.name === 'no-permissions' || to.name === 'not-found') {
    next()
    return
  }
  // 如果访问的是layout（回退时可能存在该情况），直奔index
  if (to.name === 'layout') {
    next({ name: 'index' })
    return
  }
  // 验证用户是否登录
  const userInfo = router.app.$options.store.state.userInfo
  if (userInfo != null) {
    // 如果用户不存在权限
    if (userInfo.permissions.length === 0) {
      next({ name: 'no-permissions' })
      return
    }
    // 如果访问的是登录页面，则直接跳转至首页
    if (to.name === 'login') {
      next({ name: 'index' })
      return
    }
    next()
    return
  }
  getUserInfo()
    .then(userInfo => {
      // 如果用户不存在权限
      if (userInfo.permissions.length === 0) {
        next({ name: 'no-permissions' })
        return
      }
      // 已登录，存储userInfo
      router.app.$store.commit('setUserInfo', userInfo)
      // 如果访问的是登录页面，则直接跳转至首页
      if (to.name === 'login') {
        next({ name: 'index' })
        return
      }
      next()
    })
    .catch(e => {
      // 如果访问的是登录页面，则直接放行
      if (to.name === 'login') {
        next()
        return
      }
      // 未登录，跳转至登录页
      next({ name: 'login' })
    })
})

export default router
