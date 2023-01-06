import { createApp } from 'vue'
import AppCom from './App.vue'
import {renderWithQiankun, qiankunWindow} from 'vite-plugin-qiankun'


let instance;

function render(props) {
  const { container } = props;

  instance = createApp(AppCom);
  instance.mount(typeof(container) === 'string' ? container : (container.querySelector("#app")))
}

if (!(window).__POWERED_BY_QIANKUN__) {
  render({ container: '#app' })
}

export async function bootstrap() {
  console.log('%c ', 'color: green;', 'vue3.0 app bootstraped')
}

export async function mount(props) {
  render(props);
}

export async function unmount() {
  instance.unmount();
  if(instance._container) {
    instance._container.innerHTML = '';
  }
}
