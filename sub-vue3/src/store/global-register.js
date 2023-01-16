import { useGlobalStore } from '@/store/myStore'
/**
 * 
 * @param {vuex实例} store 
 * @param {qiankun下发的props} props 
 */
function registerGlobalModule (store, props = {}) {
  console.log('store--->', store)
  console.log('props--->', props)

  if (!store || !store.state) {
    return;
  }

  // 获取初始化的state
  const initState = props.getGlobalState && props.getGlobalState() || {
    user: {}
  }

  // 设置子应用的 state 值
  setPiniaState(initState)
  setPiniaState({props})

  // // 通知父应用
  // emitGlobalState(props)
  
  // 监听父应用数据的变化
  if (props.onGlobalStateChange) {
    props.onGlobalStateChange((newState) => {
      setPiniaState(newState)
    }, true)

  }

  
};

// 根据父应用 设置子应用的数据
function setPiniaState (newState) {
  const globalStore = useGlobalStore()
  console.log('globalStore--->', globalStore)

  globalStore.setGlobalState(newState)

}

// 通知父应用
function emitGlobalState (props) {
  const globalStore = useGlobalStore()

  const subscribe = globalStore.$subscribe((mutation, state) => {
    /*
    * mutation主要包含三个属性值：
    *   events：当前state改变的具体数据，包括改变前的值和改变后的值等等数据
    *   storeId：是当前store的id
    *   type：用于记录这次数据变化是通过什么途径，主要有三个分别是
    *         “direct” ：通过 action 变化的
              ”patch object“ ：通过 $patch 传递对象的方式改变的
              “patch function” ：通过 $patch 传递函数的方式改变的
    *
    * */
    // 我们就可以在此处监听store中值的变化，当变化为某个值的时候，去做一些业务操作之类的
    // console.log('subscribe mutation-->', mutation)
    // console.log('subscribe mutation-->', state)
    // if (props.setGlobalState) {
    //   props.setGlobalState(state);
    // }
   
  }, {detached: false})
  //第二个参数 options 对象，是各种配置参数
  //detached:布尔值，默认是 false，正常情况下，当订阅所在的组件被卸载时，订阅将被停止删除，
  // 如果设置detached值为 true 时，即使所在组件被卸载，订阅依然在生效
  //参数还有immediate，deep，flush等等参数 和vue3 watch的参数是一样的，多的就不介绍了，用到再看文档吧
}

export default registerGlobalModule;

