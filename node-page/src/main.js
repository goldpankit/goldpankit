import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import I18nInput from "./components/common/I18nInput.vue";
import './assets/style/app.scss'
import store from './store'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('I18nInput', I18nInput)

app.use(router)
app.use(store)
app.use(ElementUI, {
  size: 'default'
})

app.mount('#app')
