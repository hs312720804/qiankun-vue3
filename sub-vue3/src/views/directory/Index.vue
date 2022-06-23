<template>
  <div>
    <BaseList
      :menu-id="menuId"
      :fetch-method="fetch"
      :menu-detail-method="getMenusDetail"
      :handle-resource="handleResource"
    ></BaseList>
  </div>
</template>

<script setup lang="ts">
  import BaseList from '@/components/baseList/views/Index.vue'
  import pages from './pages/index'

  // import dialogs from './dialog'
  // import todo from './todo'
  // import renderMethods from './renderMethods'
  import fetch from '@/services/fetch'
  import { getMenusDetail } from '@/services/menu'
  import { reactive } from 'vue'

  // defineProps 和 defineEmits 都是只在 <script setup> 中才能使用的编译器宏。
  // 他们不需要导入且会随着 <script setup> 处理过程一同被编译掉。
  defineProps({
    menuId: {
      type: [Number],
      default: ''
    }
  })

  const handleResource = reactive({
    pages
    // dialogs,
    // todo,
    // renderMethods
  })


</script>

<style scoped>
a {
  color: #42b983;
}
</style>
