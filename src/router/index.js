import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *若你想不管路由下面的 children 声明的个数都显示你的根路由
 *你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 *
 * redirect: noRedirect           当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin', 'editor'] //设置该路由进入的权限，支持多个权限叠加
    title: 'title' //设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name' //设置该路由的图标
    noCache: true //如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    breadcrumb: false // 如果设置为false，则不会在breadcrumb面包屑中显示 activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
/* eslint-disable */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '资源中心', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/table/index'),
        meta: {
          // role: ['admin'],
          title: '资源监控',
          icon: 'example'
        }
      }
    ]
  },
  {
    path: '/formApply',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '内容管理', icon: 'form' },
    children: [
      {
        path: 'broadcast',
        name: 'broadcast',
        component: () => import('@/views/form/apply'),
        meta: { title: '播出内容', icon: 'shopping-bag-line' }
      },
      {
        path: 'forward',
        name: 'forward',
        component: () => import('@/views/form/forward'),
        meta: { title: '转发内容', icon: 'link' }
      }
    ]
  },
  {
    path: '/secureForm',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '安全播出', icon: 'integral' },
    children: [
      {
        path: 'broadcast',
        name: 'broadcast',
        component: () => import('@/views/form/signalquality'),
        meta: { title: '信号质量', icon: 'table' }
      },
      {
        path: 'network',
        name: 'network',
        component: () => import('@/views/form/datasecurity'),
        meta: { title: '数据安全', icon: 'exchange-funds-fill' }
      }
    ]
  },
  {
    path: '/productForm',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '产品服务', icon: 'price-tag-2-fill' },
    children: [
      {
        path: 'broadcast',
        name: 'broadcast',
        component: () => import('@/views/form/broadcast'),
        meta: { title: '广播RTK', icon: 'nested' }
      },
      {
        path: 'network',
        name: 'network',
        component: () => import('@/views/form/network'),
        meta: { title: '网络RTK', icon: 'tree' }
      },
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/form/millimeter'),
        meta: { title: '基合见毫', icon: 'coupon-5-line' }
      },
      {
        path: 'tree2',
        name: 'Tree2',
        component: () => import('@/views/form/signalquality'),
        meta: { title: '基合CORS', icon: 'example' }
      }
    ]
  },
  {
    path: '/formAdress',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '位置服务', icon: 'address' },
    children: [
      {
        path: 'monitoring',
        name: 'monitoring',
        component: () => import('@/views/form/monitoring'),
        meta: { title: '物联网节点监控', icon: 'home page' }
      },
    ]
  },

  /*{
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },*/

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
