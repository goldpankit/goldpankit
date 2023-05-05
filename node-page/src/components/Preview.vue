<template>
  <component :is="data.component"/>
</template>

<script lang="ts" setup>
import fs from 'fs'
import { defineAsyncComponent, defineProps, onServerPrefetch, ref } from 'vue'
const data = ref({
  component: defineAsyncComponent(() => import('./Holder.vue'))
})
const props = defineProps(['dataModel', 'filepath'])
// 动态引入预览vue文件
/* @vite-ignore */
// let PreviewVue = defineAsyncComponent(() => import('./Holder.vue'))
onServerPrefetch(async () => {
  console.log('onServerPrefetch')
  // 组件作为初始请求的一部分被渲染
  // 在服务器上预抓取数据，因为它比在客户端上更快。
  // data.value = await fetchOnServer(/* ... */)
})
// export default {
//   props: ['dataModel', 'filepath'],
//   data () {
//     return {
//       component: defineAsyncComponent(() => import('./Holder.vue')),
//       completed: true
//     }
//   },
//   // setup () {
//   //   console.log('setup', arguments)
//   //   PreviewVue = defineAsyncComponent(() => import(props.filepath))
//   //   this.completed = false
//   //   this.$nextTick(() => {
//   //     this.completed = true
//   //     console.log('PreviewVue', PreviewVue)
//   //   })
//   // },
//   mounted () {
//     console.log('onMounted', arguments)
//     console.log('props.filepath', this.filepath)
//     // const fileContent = fs.readFileSync(this.filepath)
//     // fs.writeFileSync('./modules/test.vue', fileContent)
//     // const arr = this.filepath.split('/')
//     // console.log(arr.fill('').join('../'))
//     // this.component = defineAsyncComponent(() => import(`../../../${this.filepath}.vue`))
//     // this.completed = false
//     // setTimeout(() => {
//     //   this.completed = true
//     //   // console.log('PreviewVue', PreviewVue)
//     // }, 1000)
//   }
// }
</script>

<style scoped>

</style>
