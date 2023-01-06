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
            <el-icon><IconMenu /></el-icon>
            <template #title>目录管理</template>
          </el-menu-item>
          <el-menu-item index="a" @click="getRouter('/')">
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
  import { useRouter, useRoute } from 'vue-router'

  import {
    Menu as IconMenu,
  } from '@element-plus/icons-vue'
  import LoginDialog from '@/components/LoginDialog.vue'


  // -------初始化---------start
  // const menuId = ref('133')
  const menuId = ref('716')
  const isCollapse = ref(false)
  const isShowLogin = ref(false)
  const reLoginMsg = ref('')
  const userLoginName = ref('')

  
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
