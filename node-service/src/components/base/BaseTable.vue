<script>
import BasePage from './BasePage'
export default {
  name: 'BaseTable',
  extends: BasePage,
  data () {
    return {
      // 接口
      api: null,
      // 模块名称
      module: '数据',
      // 配置数据
      configData: {
        // id字段
        'field.id': 'id',
        // 主字段
        'field.main': 'name'
      },
      // 是否正在执行
      isWorking: {
        // 搜索中
        search: false,
        // 删除中
        delete: false,
        // 导出中
        export: false
      },
      // 表格数据
      tableData: {
        // 已选中的数据
        selectedRows: [],
        // 排序的字段
        sorts: [],
        // 当前页数据
        list: [],
        // 分页
        pagination: {
          pageIndex: 1,
          pageSize: 10,
          total: 0
        }
      }
    }
  },
  methods: {
    /**
     * 配置
     *
     * @param extParams 配置参数
     */
    config (extParams) {
      if (extParams == null) {
        throw new Error('Parameter can not be null of method \'config\' .')
      }
      if (extParams.api == null) {
        throw new Error('Missing config option \'api\'.')
      }
      this.api = require('@/api' + extParams.api)
      extParams.module && (this.module = extParams.module)
      extParams['field.id'] && (this.configData['field.id'] = extParams['field.id'])
      extParams['field.main'] && (this.configData['field.main'] = extParams['field.main'])
      this.tableData.sorts = extParams.sorts
    },
    /**
     * 搜索（点击搜索按钮时触发）
     */
    search () {
      this.handlePageChange(1)
    },
    /**
     * 导出Excel（点击导出按钮时触发）
     */
    exportExcel () {
      this.__checkApi()
      this.$dialog.exportConfirm('确认导出吗？')
        .then(() => {
          this.isWorking.export = true
          this.api.exportExcel({
            page: this.tableData.pagination.pageIndex,
            capacity: 1000000,
            model: this.searchForm,
            sorts: this.tableData.sorts
          })
            .then(response => {
              this.download(response)
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
            .finally(() => {
              this.isWorking.export = false
            })
        })
        .catch(() => {})
    },
    /**
     * 重置搜索条件（点击重置按钮时触发）
     */
    reset () {
      this.$refs.searchForm.resetFields()
      this.search()
    },
    /**
     * 页容量变更处理（切换页容量时触发）
     *
     * @param pageSize 页容量
     */
    handleSizeChange (pageSize) {
      this.tableData.pagination.pageSize = pageSize
      this.search()
    },
    /**
     * 行选中处理（点击选中列时触发）
     *
     * @param selectedRows 已选中的行数组
     */
    handleSelectionChange (selectedRows) {
      this.tableData.selectedRows = selectedRows
    },
    /**
     * 排序（点击列头排序时触发）
     *
     * @param sortData 排序参数
     */
    handleSortChange (sortData) {
      this.tableData.sorts = []
      if (sortData.order != null) {
        this.tableData.sorts.push({
          property: sortData.column.sortBy,
          direction: sortData.order === 'descending' ? 'DESC' : 'ASC'
        })
      }
      this.handlePageChange()
    },
    /**
     * 页码变更处理（分页时触发）
     *
     * @param pageIndex 新页码
     */
    handlePageChange (pageIndex) {
      this.__checkApi()
      this.tableData.pagination.pageIndex = pageIndex || this.tableData.pagination.pageIndex
      this.isWorking.search = true
      this.api.fetchList({
        page: this.tableData.pagination.pageIndex,
        capacity: this.tableData.pagination.pageSize,
        model: this.searchForm,
        sorts: this.tableData.sorts
      })
        .then(data => {
          this.tableData.list = data.records
          this.tableData.pagination.total = data.total
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.isWorking.search = false
        })
    },
    /**
     * 删除（点击行操作/删除时触发）
     *
     * @param row 行对象
     * @param childConfirm 删除子节点时是否进行二次确认
     */
    deleteById (row, childConfirm = true) {
      this.__checkApi()
      let message = `确认删除${this.module}【${row[this.configData['field.main']]}】吗?`
      if (childConfirm && row.children != null && row.children.length > 0) {
        message = `确认删除${this.module}【${row[this.configData['field.main']]}】及其子${this.module}吗?`
      }
      this.$dialog.deleteConfirm(message)
        .then(() => {
          this.isWorking.delete = true
          this.api.deleteById(row[this.configData['field.id']])
            .then(() => {
              this.__afterDelete()
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
            .finally(() => {
              this.isWorking.delete = false
            })
        })
        .catch(() => {})
    },
    /**
     * 批量删除（点击批量删除时触发）
     *
     * @param childConfirm 删除子节点时是否进行二次确认
     */
    deleteByIdInBatch (childConfirm = true) {
      this.__checkApi()
      if (this.tableData.selectedRows.length === 0) {
        this.$tip.warning('请至少选择一条数据')
        return
      }
      let message = `确认删除已选中的 ${this.tableData.selectedRows.length} 条${this.module}记录吗?`
      if (childConfirm) {
        const containChildrenRows = []
        for (const row of this.tableData.selectedRows) {
          if (row.children != null && row.children.length > 0) {
            containChildrenRows.push(row[this.configData['field.main']])
          }
        }
        if (containChildrenRows.length > 0) {
          message = `本次将删除${this.module}【${containChildrenRows.join('、')}】及其子${this.module}记录，确认删除吗？`
        }
      }
      this.$dialog.deleteConfirm(message)
        .then(() => {
          this.isWorking.delete = true
          this.api.deleteByIdInBatch(this.tableData.selectedRows.map(row => row.id).join(','))
            .then(() => {
              this.__afterDelete(this.tableData.selectedRows.length)
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
            .finally(() => {
              this.isWorking.delete = false
            })
        })
        .catch(() => {})
    },
    /**
     * 删除后处理，在单行删除或多行删除后调用
     *
     * @param deleteCount 删除数量
     * @private
     */
    __afterDelete (deleteCount = 1) {
      this.$tip.apiSuccess('删除成功')
      // 删除当前页最后一条记录时查询上一页数据
      if (this.tableData.list.length - deleteCount === 0) {
        this.handlePageChange(this.tableData.pagination.pageIndex - 1 === 0 ? 1 : this.tableData.pagination.pageIndex - 1)
      } else {
        this.handlePageChange(this.tableData.pagination.pageIndex)
      }
    },
    /**
     * 检查接口是否配置，在调用接口时调用
     *
     * @private
     */
    __checkApi () {
      if (this.api == null) {
        throw new Error('The page is not initialized, you can use method \'this.config\' to initialize this page.')
      }
    }
  }
}
</script>
