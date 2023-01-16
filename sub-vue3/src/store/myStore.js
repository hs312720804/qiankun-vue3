import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    user: {
      name: 'hs33336666'
    },
    props: undefined
  }),
  actions: {
    // // 通知父应用
    // emitGlobalState (props, state) {
    //   if (props.setGlobalState) {
    //     props.setGlobalState(state);
    //   }
    // },
    setGlobalState (newState) {
      this.$patch(state=> {
        // state = initState
        console.log('111=', state)
        console.log('222initState=', newState)
        state = Object.assign(state, newState);
      })

      // if (this.props && this.props.setGlobalState) {
      //   this.props.setGlobalState(newState)
      // }
    }
  }
})

export const useStore = defineStore('myStore', {
  state: () => ({
    counter: 1,
    name: 'sasa',
    isAdmin: true,
    banners: undefined,
    recommends: undefined,
  }),
  actions: {
    add() {
      this.counter++
    },
    incrementNum(num) {
      this.counter += num
    },
    async fetchHomeMultidata() {
      const res = await fetch("http://123.207.32.32:8000/home/multidata")
      const data = await res.json()
	  
      //得到数据后直接复制给state
      this.banners = data.data.banner.list
      this.recommends = data.data.recommend.list
      
      return 'success'
    }
  }
})



