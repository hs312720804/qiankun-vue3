import { createPinia } from 'pinia'

const pinia = createPinia()

const myPiniaPlugin = ({ store }) => {
  store.env = 'dev'
}

pinia.use(myPiniaPlugin)
export default pinia
