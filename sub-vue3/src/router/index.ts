import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue')
  // },
  // {
  //   name: 'directory',
  //   path: '/directory',
  //   // component: () => import(/* webpackChunkName: "baseListDirectory" */ '@/components/HelloWorld.vue')
  //   component: () => import('@/components/HelloWorld.vue'),
  // },
  // {
  //   name: 'main',
  //   path: '/main',
  //   // component: () => import(/* webpackChunkName: "baseListDirectory" */ '@/components/HelloWorld.vue')
  //   component: () => import('@/views/directory/Index.vue'),
  // },

  {
    name: 'home',
    path: '/',
    component: () => import('@/components/HelloWorld.vue'),
  },
  {
    name: 'directory',
    path: '/directory',
    component: () => import('@/views/directory/Index.vue')
  },
  
]

const router = createRouter({
  routes,
  history: createWebHashHistory()
})

// 初始化站点信息
router.beforeEach(async () => {
  return true
})

export default router