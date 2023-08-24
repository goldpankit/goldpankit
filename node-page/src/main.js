import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import router from './router'
import ElementUI from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './assets/style/app.scss'
import store from './store'
import VueKonva from 'vue-konva'
import I18nInput from "./components/common/I18nInput.vue";
import HelpButton from "./components/common/HelpButton.vue"
import SortableButton from "./components/common/SortableButton.vue";
import VueMarkdownEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import createHighlightLinesPlugin from '@kangc/v-md-editor/lib/plugins/highlight-lines/index';
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
import createMermaidPlugin from '@kangc/v-md-editor/lib/plugins/mermaid/cdn';
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import theme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import '@kangc/v-md-editor/lib/plugins/highlight-lines/highlight-lines.css';
import '@kangc/v-md-editor/lib/plugins/mermaid/mermaid.css';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
import plugins from "./plugins";
import directives from "./directives";

import Prism from 'prismjs'

VueMarkdownEditor.use(theme, {
  Prism,
})
VueMarkdownEditor.use(createHighlightLinesPlugin());
VueMarkdownEditor.use(createLineNumbertPlugin());
VueMarkdownEditor.use(createMermaidPlugin());
VueMarkdownEditor.use(createEmojiPlugin());

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('I18nInput', I18nInput)
app.component('HelpButton', HelpButton)
app.component('SortableButton', SortableButton)

app.use(i18n)
app.use(VueMarkdownEditor)
app.use(VueKonva)
app.use(router)
app.use(store)
app.use(ElementUI, {
  size: 'default'
})
app.use(plugins)
app.use(directives)
console.warn = function () {}

app.mount('#app')
