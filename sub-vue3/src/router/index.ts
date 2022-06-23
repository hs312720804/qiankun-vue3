import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
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
// vue2：
// Vue.use(VueRouter)
// new VueRouter()


const router = createRouter({
  routes,
  history: createWebHashHistory()
})

// 初始化站点信息
router.beforeEach(async () => {
  return true
})

export default router