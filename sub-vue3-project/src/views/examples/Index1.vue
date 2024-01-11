<template lang="">
  <!-- 虚拟列表的实现 -->
  <div>
    虚拟列表:
    <VirtualList :listData="data" :itemSize="100"></VirtualList>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import VirtualList from './VirtualList.vue'

const d = []
for (let i = 0; i < 1000; i++) {
  d.push({ id: i, value: i })
}
const data = reactive(d)

</script>
<style lang="">

</style>
