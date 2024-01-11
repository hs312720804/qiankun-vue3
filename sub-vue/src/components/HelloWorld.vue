<template>
  <div class="hello">
    <hr/>
    <button @click="update">改变名称</button>
    子应用的state：{{ JSON.stringify(user) }}
    <h1>sub-vue</h1>
    <h1>sub-vue</h1>
    <h1>sub-vue</h1>
    <h1>sub-vue</h1>
    <h1>sub-vue</h1>
    <h1>sub-vue</h1>
    <h1>sub-vue</h1>
    <h1>sub-vue</h1>
    <h1>sub-vue</h1>
    <h1>sub-vue</h1>
    <h1>sub-vue</h1>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
    // user: this.state
  },
  computed: {
    ...mapState('global', ['user'])
    //   user: state => {
    //     console.log('state==>', state)
    //     return state.user
    //   }, // 获取父应用的 user 信息
    // }),
  },
  created () {
  },
  methods: {
    ...mapActions('global', ['setGlobalState']),
    update () {
      this.setGlobalState({ user: { name: ('李四' + Math.round(Math.random() * 100)) } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
