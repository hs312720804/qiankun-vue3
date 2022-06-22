<template>
  <el-container class="dev-layout">
    <el-header class="dev_header">
      <!-- <h1>酷开云控制台 -- {{ productName }}【开发者模式】</h1> -->
      <h1>Vite+Typescript</h1>
      <div class="dev_setting">
        <el-icon :size="20" class="icon" title="预览" @click="handleView()"><View /></el-icon>
        <el-icon :size="20" class="icon" title="重置" @click="handleLogin()"><Refresh /></el-icon>
        <span>{{userLoginName}}</span>
      </div>
    </el-header>

    <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
      <el-radio-button :label="false">expand</el-radio-button>
      <el-radio-button :label="true">collapse</el-radio-button>
    </el-radio-group> -->

    <el-container class="dev_content">
      <el-aside width="200px">
        <!-- {{prodMenus}} -->
        <!-- <c-menu
          :default-active="$route.name"
          :items="prodMenus"
          background-color="#222a35"
          text-color="#fff"
          active-text-color="#eb603a">
        </c-menu> -->
        
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          @open="handleOpen"
          @close="handleClose"
          background-color="#222a35"
          text-color="#fff"
          active-text-color="#eb603a"
        >
          <el-menu-item index="/directory" @click="getRouter('/directory')">
            <el-icon><icon-menu /></el-icon>
            <template #title>目录管理</template>
          </el-menu-item>
          <el-menu-item index="/" @click="getRouter('/')">
            <el-icon><setting /></el-icon>
            <template #title>主页</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main class="dev_main">
        <!-- {{ $route }}
        <hr/>
        1214=={{menuId}} -->
        <!-- <keep-alive> -->
          <router-view :menu-id="menuId" :key="$route.path"/>
        <!-- </keep-alive> -->
      </el-main>
    </el-container>
    
    <login-dialog v-model="isShowLogin" :re-login-msg="reLoginMsg"></login-dialog>
  </el-container>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  // import { useRouter, useRoute } from 'vue-router'
  import { useRouter, useRoute, RouteRecordRaw } from 'vue-router'

  import {
    // Document,
    Menu as IconMenu,
    // Location,
    // Setting,
  } from '@element-plus/icons-vue'
  import LoginDialog from '@/components/LoginDialog.vue'
  // import { getMenusService } from '@/services/common'
  // import { store } from '@/store'


  // -------初始化---------start
  // const menuId = 133
  const menuId = ref('133')
  const isCollapse = ref(false)
  const isShowLogin = ref(false)
  const reLoginMsg = ref('')
  const userLoginName = ref('')
  // const prodMenus = ref([])
  // const menuIdMap = reactive({})

  
  // -------初始化---------end


  const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }

  const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }

  function handleLogin (msg = '') {
    isShowLogin.value = true
    reLoginMsg.value = msg
  }
  function handleView (msg = '') {
    
  }

  // function setMenus () {
  //   getMenusService({ productKey: process.env.VUE_APP_PROJECT_CODE }).then(res => {
  //     const { buttons } = res
  //     const menus = res.tenantMenus || res
  //     prodMenus.value = menus.map(genCMenu)
  //     // prodMenus.value = [ { "title": "概览", "icon": "Avatar", "route": "overview", "children": [ { "title": "介绍", "icon": "", "route": "home" } ] }, { "title": "示例页面", "icon": "Bowl", "route": "example", "children": [ { "title": "列表pro", "icon": "", "route": "example-listpro" }, { "title": "Iframe", "icon": "", "route": "Iframe" }, { "title": "测试页面", "icon": "", "route": "example-listpro-test" }, { "title": "文章列表", "icon": "", "route": "article" }, { "title": "卡片列表", "icon": "Grid", "route": "card-list" }, { "title": "文章列表(tony)", "icon": "", "route": "article11" }, { "title": "TabPage", "icon": "", "route": "tab-page" } ] }, { "title": "动画特效", "icon": "BrushFilled", "route": "animation", "children": [ { "title": "转场动画", "icon": "", "route": "TransitionAnimation" } ] }, { "title": "系统管理", "icon": "Shop", "route": "sys", "children": [ { "title": "基本信息", "icon": "", "route": "site-info" }, { "title": "用户管理", "icon": "", "route": "user" }, { "title": "角色管理", "icon": "", "route": "role" }, { "title": "枚举字典", "icon": "", "route": "enum" }, { "title": "菜单管理", "icon": "", "route": "menu" }, { "title": "部门管理", "icon": "", "route": "department" }, { "title": "资源管理", "icon": "", "route": "resource" }, { "title": "数据资源管理", "icon": "", "route": "data-resource" } ] } ]

  //     store.commit('dev/setAccess', { buttons })
  //   })
  // }
  // function genCMenu ({ id, alias, name, icon, children }: RouteRecordRaw) {
  //   menuIdMap[alias] = id
  //   const currentMenuItem = {
  //     title: name,
  //     icon: icon,
  //     route: alias
  //   }
  //   if (children) {
  //     currentMenuItem.children = children.reduce((result, item) => {
  //       const menuItem = genCMenu(item)
  //       if (menuItem) {
  //         result.push(menuItem)
  //       }
  //       return result
  //     }, [])
  //   }
  //   return currentMenuItem
  // }

  const $router = useRouter()
  const $route = useRoute()

  // 正式需打开
  // watch(
  //   () => $route.path,
  //   () => {
  //     const { name } = $route
  //     menuId.value = menuIdMap[name]
  //   },
  //   {
  //     deep: true,
  //     immediate: true
  //   }
  // )

  // setMenus()

  const getRouter = (url:string) => {
    console.log(url)
    $router.push(url)
  }

  

</script>

<style lang="stylus" scoped>
.dev-layout
  height 100%
  background-color #222a35
  .dev_header
    text-align right
    font-size 14px
    color #fff
    display flex
    justify-content space-between
    align-items center
    .dev_setting
      .icon
        cursor pointer
        margin-right 15px
        &:hover
          color #eb603a
  .dev_content
    height calc(100% - 60px)

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

</style>
