import { createSSRApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-plus'
import '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

import './assets/style/app.scss'

const app = createSSRApp(App)

app.use(router)
app.use(ElementUI, {
  size: 'default'
})

app.mount('#app')
