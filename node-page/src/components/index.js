import Avatar from '@/components/common/Avatar'
import Scrollbar from '@/components/common/Scrollbar'
import SplitWindow from '@/components/common/SplitWindow'
import { SplitItem } from 'vue3-split'
export default {
  install(Vue) {
    // 布局组件
    Vue.component('Avatar', Avatar)
    // 分栏组件
    Vue.component('SplitWindow', SplitWindow)
    Vue.component('SplitPanel', SplitItem)
    // 滚动条
    Vue.component('Scrollbar', Scrollbar)
  }
}
