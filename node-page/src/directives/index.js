import Sortable from "sortablejs";

export default {
  install(app, options) {
    app.directive('sortable', {
      mounted (el, params, vnode) {
        let datalist = params.value.data
        let sortBody
        // el-table
        if (el.getAttribute('class').indexOf('el-table') !== -1) {
          sortBody = el.querySelector('.el-table__body-wrapper tbody')
        }
        // 其他
        else {
          sortBody = el
        }
        Sortable.create(sortBody, {
          onEnd ({ newIndex, oldIndex}) {
            if (newIndex === oldIndex) {
              return
            }
            const originRow = datalist[oldIndex]
            // 从上拖到下
            if (newIndex > oldIndex) {
              datalist.splice(newIndex + 1, 0, originRow)
              datalist.splice(oldIndex,1)
            }
            // 从下拖到上
            else {
              datalist.splice(oldIndex, 1)
              datalist.splice(newIndex, 0, originRow)
            }
            // console.log('datalist', datalist)
            // const newList = datalist.slice(0)
            params.value.onChange(datalist)
          }
        })
      }
    })
  }
}
