
/**
 *
 * @param {vuex实例} store
 * @param {qiankun下发的 props } props
 */

// qiankun通过 initGlobalState, onGlobalStateChange, setGlobalState 实现主应用的全局状态管理

function registerGlobalModule (store, props = {}) {
  if (!store || !store.hasModule) {
    return
  }

  // 获取初始化的state
  const initState = props.getGlobalState && props.getGlobalState() || {
    menu: [],
    user: {}
  }

  // Symbol
  // useRef /  ref / forwardsRef 的区别是什么?
  // useEffect的第二个参数, 传空数组和传依赖数组有什么区别?

  // 如果return 了一个函数, 传空数组的话是在什么时候执行? 传依赖数组的时候是在什么时候执行?

  // flex布局
  // ES5继承
  // ES6继承, 静态方法/属性和实例方法/属性 是什么时候挂载的
  // Promise各种api
  // 各种css属性

  // 作者：路从今夜白丶
  // 链接：https://juejin.cn/post/7142690757722243102
  // 来源：稀土掘金
  // 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

  // MyPromise.prototype.finally = function (cb) {
  //   return this.then(function (value) {
  //     return MyPromise.resolve(cb()).then(function () {
  //       return value
  //     })
  //   }, function (err) {
  //     return MyPromise.resolve(cb()).then(function () {
  //       throw err
  //     })
  //   })
  // }

  // 将父应用的数据存储到子应用中，命名空间固定为global
  if (!store.hasModule('global')) {
    const globalModule = {
      namespaced: true,
      state: initState,
      actions: {
        // 子应用改变state并通知父应用
        setGlobalState ({ commit }, payload) {
          commit('setGlobalState', payload)
          commit('emitGlobalState', payload)
        },
        // 初始化，只用于mount时同步父应用的数据
        initGlobalState ({ commit }, payload) {
          commit('setGlobalState', payload)
        }
      },
      mutations: {
        setGlobalState (state, payload) {
          // eslint-disable-next-line
          state = Object.assign(state, payload);
          // state = {
          //   ...state,
          //   ...payload
          // }
        },
        // 通知父应用
        emitGlobalState (state) {
          if (props.setGlobalState) {
            props.setGlobalState(state)
          }
        }
      }
    }
    store.registerModule('global', globalModule)
  } else {
    // 每次mount时，都同步一次父应用数据
    store.dispatch('global/initGlobalState', initState)
  }
};

export default registerGlobalModule
