
<script setup>
import { storeToRefs } from 'pinia'
import pinia from '@/store'
import { useStore, useGlobalStore } from '../store/myStore'
import { watch } from 'vue'
// import registerGlobalModule from '@/store/global-register'

// import {
//   Check,
//   Delete,
//   Edit,
//   Message,
//   Search,
//   Star,
// } from '@element-plus/icons-vue'

defineProps({
  msg: String
})

const store  = useStore()
let { counter, banners } = storeToRefs(store)

const globalStore = useGlobalStore()
let { user } = storeToRefs(globalStore)
// const globalStore = registerGlobalModule()

// console.log('globalStore------------>', globalStore)

// const subscribe = globalStore.$subscribe((mutation, state) => {
//   /*
//   * mutation主要包含三个属性值：
//   *   events：当前state改变的具体数据，包括改变前的值和改变后的值等等数据
//   *   storeId：是当前store的id
//   *   type：用于记录这次数据变化是通过什么途径，主要有三个分别是
//   *         “direct” ：通过 action 变化的
//             ”patch object“ ：通过 $patch 传递对象的方式改变的
//             “patch function” ：通过 $patch 传递函数的方式改变的
//   *
//   * */
//   // 我们就可以在此处监听store中值的变化，当变化为某个值的时候，去做一些业务操作之类的
//   console.log('subscribe mutation-->', mutation)
//   console.log('subscribe mutation-->', state.baseUrl)
//   // if (state.baseUrl === afterChangeUrl) isShow.value = true
//   // else isShow.value = false
// }, {detached: false})  //第二个参数options对象，是各种配置参数
  //detached:布尔值，默认是 false，正常情况下，当订阅所在的组件被卸载时，订阅将被停止删除，
  // 如果设置detached值为 true 时，即使所在组件被卸载，订阅依然在生效
  //参数还有immediate，deep，flush等等参数 和vue3 watch的参数是一样的，多的就不介绍了，用到再看文档吧

// watch(
//   pinia.state,
//   (state) => {
//     // 每当它发生变化时，将整个状态持久化到本地存储
//     localStorage.setItem('piniaState', JSON.stringify(state))
//   },
//   { deep: true }
// )

// const count = ref(0)
function add () {
  // store.$state = { counter: 666, name: 'Paimon' }
  store.add()
}
function add10 () {
  // store.$state = { counter: 666, name: 'Paimon' }
  store.incrementNum(10)
}
function reset () {
  store.$reset()
}
function fetch () {
  store.fetchHomeMultidata()
}
function update () {
  
  const data = {
    user: {name: ('李四' + Math.round(Math.random() * 100))}
  }
  // 设置子应用的数据
  globalStore.setGlobalState(data)

  console.log('666666globalStore===', globalStore)
  if (globalStore.props && globalStore.props.setGlobalState) {
    // 设置父应用的数据
    globalStore.props.setGlobalState(data)
  }
}

</script>

<template>
  <k-button plain>k-button 按钮</k-button>
    <div>
      user: {{ user  }}  
      <el-button type="primary" @click="update">改变 vite 子应用名称 </el-button>
    </div> 
    <div>count: {{ counter  }}</div>
    <div>env: {{ store.env  }}</div>
    <!-- <div>
      <button type="button" @click="add">增加</button>
    </div>
    <div>
      <button type="button" @click="add10">增加10</button>
    </div>
    <div>
      <button type="button" @click="reset">重置</button>
    </div>
    <div>
      <button type="button" @click="fetch">fetch</button>
    </div> -->
    <!-- <el-input v-model="counter" placeholder="Please input" style="width: 40px" /> -->
    
    <el-button type="primary" @click="add">增加</el-button>
    <el-button type="success" @click="add10">增加10</el-button>
    <el-button type="info" @click="reset">重置</el-button>
    <el-button type="danger" @click="fetch">fetch</el-button>

    <el-table :data="banners" style="width: 100%; margin-top: 30px;" >
      <el-table-column prop="title" label="title" />
      <el-table-column prop="acm" label="Date" />
      <el-table-column prop="image" label="image" />
    </el-table>
  <!-- <h1>{{ msg }}</h1>
  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VS Code</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Documentation
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p> -->


  <!-- <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p> -->
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
