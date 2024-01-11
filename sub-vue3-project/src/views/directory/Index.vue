<template>
  {{store}}
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
import pages from './pages/index.ts'

// import dialogs from './dialog'
// import todo from './todo'
// import renderMethods from './renderMethods'
import fetch from '@/services/fetch.ts'
import { getMenusDetail } from '@/services/menu.ts'
import { reactive } from 'vue'
import { useStore } from '@/store/index.ts'

const store = useStore()
store.httpHeaders.Authorization = ''

// defineProps 和 defineEmits 都a是只在 <script setup> 中才能使用的编译器宏。
// 他们不需要导入且会随着 <script setup> 处理过程一同被编译掉。
defineProps({
  menuId: {
    type: [Number],
    default: ''
  }
})

const handleResource = reactive < handleResourceType > ({
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
