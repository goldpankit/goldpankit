import { createSSRApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

import './assets/style/app.scss'

const app = createSSRApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(ElementUI, {
  size: 'default'
})

app.mount('#app')
