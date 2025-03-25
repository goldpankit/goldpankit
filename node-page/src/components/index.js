import Avatar from '@/components/common/Avatar'
import Scrollbar from '@/components/common/Scrollbar'
import Icon from '@/components/common/Icon'
import IconButton from '@/components/common/IconButton'
import SplitWindow from '@/components/common/SplitWindow'
import { SplitItem } from 'vue3-split'
export default {
  install(Vue) {
    // 布局组件
    Vue.component('Avatar', Avatar)
    // 基础组件
    Vue.component('Scrollbar', Scrollbar)
    Vue.component('Icon', Icon)
    Vue.component('IconButton', IconButton)
    // 分栏组件
    Vue.component('SplitWindow', SplitWindow)
    Vue.component('SplitPanel', SplitItem)
  }
}
