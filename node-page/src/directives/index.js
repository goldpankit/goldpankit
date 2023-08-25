import Sortable from "sortablejs";

export default {
  install(app, options) {
    app.directive('sortable', {
      mounted (el, params, vnode) {
        const _vue = params.instance
        let datalist = params.value.data
        const tbody = el.querySelector('.el-table__body-wrapper tbody')
        Sortable.create(tbody, {
          onEnd ({ newIndex, oldIndex}) {
            if (newIndex === oldIndex) {
              return
            }
            const originRow = datalist[oldIndex]
            // 从上拖到下
            if (newIndex > oldIndex) {
              datalist.splice(newIndex + 1,0,originRow)
              datalist.splice(oldIndex,1)
            }
            // 从下拖到上
            else {
              datalist.splice(oldIndex,1)
              datalist.splice(newIndex,0,originRow)
            }
            const newList = datalist.slice(0)
            params.value.onChange(newList)
          }
        })
      }
    })
  }
}
