import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import I18nInput from "./components/common/I18nInput.vue";
import './assets/style/app.scss'
import store from './store'
import VueKonva from 'vue-konva'
import HelpButton from "./components/common/HelpButton.vue"
import VueMarkdownEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import theme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import plugins from "./plugins";

import Prism from 'prismjs'

VueMarkdownEditor.use(theme, {
  Prism,
})

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('I18nInput', I18nInput)
app.component('I18nInput', HelpButton)

app.use(VueMarkdownEditor)
app.use(VueKonva)
app.use(router)
app.use(store)
app.use(ElementUI, {
  size: 'default'
})
app.use(plugins)

app.mount('#app')
