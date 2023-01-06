<template>
  <div>子组件helloword.vue</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const count = ref(123456)
defineExpose({
  count
})
</script>

<style scoped lang="less">
</style>