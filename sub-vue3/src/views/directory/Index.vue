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
  // import BaseList from './ExtendsIndex.vue'

  import pages from './pages/index'

  // import dialogs from './dialog'
  // import todo from './todo'
  // import renderMethods from './renderMethods'
  import fetch from '@/services/fetch'
  import { getMenusDetail } from '@/services/menu'
  import { reactive } from 'vue'
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
