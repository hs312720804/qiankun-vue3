<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" />
  APP APP APP APP APP APP APP APP  -->
  <!-- <HelloWorld msg="Hello Vue 3 + Vite" /> -->
  <DevLayout></DevLayout>
</template>

<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue'
import DevLayout from './components/layout/DevLayout.vue'

</script>
<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
html, body, #app {
  height: 100%;
  margin: 0;
}

</style>
