import {install} from "@/api/service.compile";
import store from '../../store/index.js'

export function exec (params) {
  return Promise.resolve('服务安装完成')
  // const currentProject = store.state.currentProject
  // const currentDatabase = store.state.currentDatabase
  // // 开始安装
  // install({
  //   projectId: this.currentProject,
  //   database: this.currentDatabase,
  //   space: this.space,
  //   service: this.service,
  //   plugin: this.plugin,
  //   version: this.selectedVersion,
  //   variables
  // })
  //   .then(installData => {
  //     // 此处需要额外补充安装状态，否则无法触发installing属性的更新
  //     this.isWorking.install = false
  //     this.$tip.success(this.$t('service.installSuccessfully'))
  //     this.setInstallData(installData)
  //     this.refreshBalance()
  //     this.$emit('installed')
  //   })
  //   .catch(e => {
  //     if (e.code === 6000) {
  //       this.$refs.serviceCodeErrorWindow.open(e.errorData)
  //       return
  //     }
  //     this.$tip.apiFailed(e)
  //   })
  //   .finally(() => {
  //     this.isWorking.install = false
  //   })
}
