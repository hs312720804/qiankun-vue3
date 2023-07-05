import { initGlobalState } from 'qiankun';
import Vue from 'vue'

//父应用的初始state
// Vue.observable是为了让 initialState 变成可响应：https://cn.vuejs.org/v2/api/#Vue-observable。
let initialState = Vue.observable({
  user: {name: "李四80"}
});

const actions = initGlobalState(initialState)

actions.onGlobalStateChange((newState, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log('main change', JSON.stringify(newState), JSON.stringify(prev))

  for (let key in newState) {
    initialState[key] = newState[key]
  }
})

// 定义一个获取state的方法下发到子应用
actions.getGlobalState = (key) => {
  // 有key，表示取globalState下的某个子级对象
  // 无key，表示取全部
  return key ? initialState[key] : initialState
}

export default actions;
// actions.setGlobalState({user: {name: '黄三'}})
// actions.offGlobalStateChange()