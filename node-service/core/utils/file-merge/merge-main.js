import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import router from './router1'
import ElementUI from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import I18nInput from "./components/common/I18nInput.vue";
import './assets/style/app.scss'
import store from './store'

const app = createApp(App)
app.component('I18nInput', I18nInput)

app.use(router)
app.use(store)

app.mount('#app')
