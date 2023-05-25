/...
import router from './router'
+import ElementUI from 'element-plus'
+import * as ElementPlusIconsVue from '@element-plus/icons-vue'
+import 'element-plus/dist/index.css'
...
const app = createApp(App)
+for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
+  app.component(key, component)
+}
...
app.use(store)
+app.use(ElementUI, {
+  size: 'default'
+})
.../

/...start
+加入到文件最开始
.../

/...end
+加入到文件最末尾
.../
