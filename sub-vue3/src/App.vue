<template>
  <DevLayout></DevLayout>
</template>

<!-- 需要将 setup attribute 添加到 <script> 代码块上 -->

<!-- 里面的代码会被编译成组件 setup() 函数的内容。
    这意味着与普通的 <script> 只在组件被首次引入的时候执行一次不同，
    <script setup> 中的代码会在每次组件实例被创建的时候执行 
-->
<script setup>
import HelloWorld from './components/HelloWorld.vue'
import DevLayout from './components/layout/DevLayout.vue'
</script>

<style >
html, body, #app {
  height: 100%;
  margin: 0;
}

</style>
