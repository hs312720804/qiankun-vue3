import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue')
  // },
  {
    name: 'directory',
    path: '/directory',
    // component: () => import(/* webpackChunkName: "baseListDirectory" */ '@/components/HelloWorld.vue')
    component: () => import('@/components/HelloWorld.vue'),
  },
 
  
]

const router = createRouter({
  routes,
  history: createWebHashHistory()
})

export default router