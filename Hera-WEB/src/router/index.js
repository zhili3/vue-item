import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/403',component: () => import('@/views/errorPage/403'),hidden: true },

  {
    path: '',
    component: Layout,
    redirect: 'home',
    children: [{
      path: 'home',
      component: () => import('@/views/home/index'),
      name: 'Home',
      meta: { title: 'Home', icon: 'home' }
    }]
  },

  {
    path: '/order',
    name: 'Order',
    component: Layout,
    redirect: 'noredirect',
    meta: { title: 'Order', icon: 'order' },
    children: [
      {
        path: 'all',
        name: 'AllOrders',
        component: () => import('@/views/order/all'),
        meta: { title: 'AllOrders' }
      },
      {
        path: 'obligation',
        name: 'Obligation',
        component: () => import('@/views/order/obligation'),
        meta: { title: 'Obligation'}
      },
      {
        path: 'unshipped',
        name: 'Unshipped',
        component: () => import('@/views/order/unshipped'),
        meta: { title: 'Unshipped'}
      },
      {
        path: 'partial-shipped',
        name: 'PartialShipped',
        component: () => import('@/views/order/partialShipped'),
        meta: { title: 'PartialShipped'}
      },
      {
        path: 'full-shipped',
        name: 'FullShipped',
        component: () => import('@/views/order/fullShipped'),
        meta: { title: 'FullShipped'}
      },
      {
        path: 'completed',
        name: 'Completed',
        component: () => import('@/views/order/completed'),
        meta: { title: 'Completed'}
      },
      {
        path: 'pending',
        name: 'Pending',
        component: () => import('@/views/order/pending'),
        meta: { title: 'Pending'}
      }
    ]
  },

  {
    path: '/product',
    name: 'Product',
    component: Layout,
    redirect: 'noredirect',
    meta: { title: 'Prodcut', icon: 'product' },
    children: [
      {
        path: 'all',
        name: 'All-Product',
        component: () => import('@/views/product/all'),
        meta: { title: 'All-Product'}
      },
      {
        path: 'transfers',
        name: 'Transfers',
        component: () => import('@/views/product/transfers'),
        meta: { title: 'Transfers'}
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('@/views/product/inventory'),
        meta: { title: 'Inventory'}
      },
      {
        path: 'collections',
        name: 'Collections',
        component: () => import('@/views/product/collections'),
        meta: { title: 'Collections'}
      },
      {
        path: 'gift',
        name: 'Gift',
        component: () => import('@/views/product/gift'),
        meta: { title: 'Gift' }
      }
    ]
  },

  {
    path: '/customers',
    component: Layout,
    redirect: '/customers/index',
    children: [{
      path: 'index',
      name: 'Customers',
      component: () => import('@/views/customers/index'),
      meta: { title: 'Customers', icon: 'customer' }
    }]
  },

  // {
  //   path: '/customer',
  //   component: Layout,
  //   hidden: true,
  //   redirect: '/customer/info',
  //   children: [{
  //     path: 'info/:userId',
  //     name: 'CustomerInfo',
  //     component: () => import('@/views/customers/detail'),
  //     meta: { title: 'CustomerInfo', noCache: true}
  //   }]
  // },

  {
    path: '/analytics',
    name: 'Analytics',
    component: Layout,
    redirect: 'noredirect',
    meta: { title: 'Analytics', icon: 'analytics' },
    children: [
      {
        path: 'dashboards',
        name: 'Dashboard',
        component: () => import('@/views/analytics/dashboards'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/analytics/reports'),
        meta: { title: 'Reports'}
      },
      {
        path: 'live',
        name: 'Live',
        component: () => import('@/views/analytics/live'),
        meta: { title: 'Live' }
      }
    ]
  },

  {
    path: '/discounts',
    component: Layout,
    redirect: '/discounts/index',
    children: [{
      path: 'index',
      name: 'Discounts',
      component: () => import('@/views/discounts/index'),
      meta: { title: 'Discounts', icon: 'discount' }
    }]
  },

  {
    path: '/admin',
    name: 'Admin',
    component: Layout,
    redirect: 'noredirect',
    meta: { title: 'Admin', icon: 'setting' },
    children: [
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/admin/role'),
        meta: { title: 'Role' }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/admin/user'),
        meta: { title: 'User' }
      },
      {
        path: 'resource',
        name: 'Resource',
        component: () => import('@/views/admin/resource'),
        meta: { title: 'Resource' }
      }
    ]
  },

  {
    path: '/detail',
    name: 'Detail',
    component: Layout,
    redirect: 'noredirect',
    hidden: true,
    meta: { title: 'Detail' },
    children: [
      {
        path: 'order/:id',
        name: 'OrderInfo',
        // hidden: true,
        component: () => import('@/views/order/orderInfo'),
        meta: { title: 'OrderInfo', noCache: true }
      },
      {
        path: 'customer/:userId',
        name: 'CustomerInfo',
        // hidden: true,
        component: () => import('@/views/customers/detail'),
        meta: { title: 'CustomerInfo', noCache: true }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

