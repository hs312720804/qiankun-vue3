<template lang="">
  <!-- 虚拟列表的实现 -->
  <div>
    虚拟列表:
    <VirtualList :listData="data" :estimatedItemSize="100" >
    </VirtualList>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import VirtualList from './components/virtualList2.vue'
// import Item from './components/item.vue'
import { faker } from '@faker-js/faker'
const d = []
for (let i = 0; i < 1000; i++) {
  d.push({
    id: i,
    value: faker.lorem.sentences() // 长文本
  })
}
const data = reactive(d)
console.log('data------>', data)

</script>
<style lang="">

</style>
