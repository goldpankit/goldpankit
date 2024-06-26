<template>
  <div class="table-library">
    <div class="block">
      <InnerRouterViewWindow ref="routerViewWindow" default="query-models">
        <InnerRouterView name="query-models">
          <div class="header" slot="title">
            <h4>查询模型</h4>
            <el-button type="primary" size="default" icon="Plus" class="button-icon" @click="createQueryModel"></el-button>
          </div>
          <ul v-if="models.length > 0" class="model-list">
            <li
              v-for="model in models"
              :key="model.id"
              :class="{selected: currentModel != null && currentModel.id === model.id}"
              @click="selectModel(model)"
            >
              <label>{{model.name}}</label>
              <p>{{model.comment}}</p>
              <div>
                <span @click.stop="updateModel(model)"><el-icon><Edit/></el-icon></span>
                <span @click.stop="deleteModel(model)"><el-icon><Delete/></el-icon></span>
              </div>
            </li>
          </ul>
          <Empty v-else/>
        </InnerRouterView>
        <InnerRouterView name="create-model" :title="$t('database.createNewModel')">
          <div class="create-model-form">
            <el-form ref="createForm" :model="newModel" :rules="getRules()" @submit.prevent>
              <el-form-item :label="$t('common.name')" prop="name" required>
                <el-input v-model="newModel.name"/>
              </el-form-item>
              <el-form-item :label="$t('common.remark')" prop="comment">
                <el-input v-model="newModel.comment" type="textarea" :rows="2"/>
              </el-form-item>
            </el-form>
            <div class="opera">
              <el-button size="default" @click="$refs.routerViewWindow.back()">{{$t('common.cancel')}}</el-button>
              <el-button type="primary" size="default" @click="confirmCreate">{{$t('common.confirmAdd')}}</el-button>
            </div>
          </div>
        </InnerRouterView>
        <InnerRouterView name="update-model" :title="$t('database.updateModelTitle')">
          <div class="create-model-form">
            <el-form ref="editForm" :model="editModel" :rules="getRules()" @submit.prevent>
              <el-form-item :label="$t('common.name')" prop="name" required>
                <el-input v-model="editModel.name"/>
              </el-form-item>
              <el-form-item :label="$t('common.remark')" prop="comment">
                <el-input v-model="editModel.comment" type="textarea" :rows="2"/>
              </el-form-item>
            </el-form>
            <div class="opera">
              <el-button size="default" @click="$refs.routerViewWindow.back()">{{$t('common.cancel')}}</el-button>
              <el-button type="primary" size="default" @click="confirmUpdate">{{$t('common.confirmUpdate')}}</el-button>
            </div>
          </div>
        </InnerRouterView>
      </InnerRouterViewWindow>
    </div>
    <div class="block table-list-wrap">
      <div class="header">
        <h4>数据库表</h4>
        <el-button
          class="button-icon"
          size="default"
          type="primary"
          icon="Refresh"
          @click="fetchTables"
        ></el-button>
      </div>
      <ul class="table-list" v-loading="globalLoading.tables">
        <li
          v-for="table in tables"
          :key="table.name"
          draggable="true"
          @dragstart="handleDragStart(table.name)"
        >
          <label>{{table.name}}</label>
          <p>{{table.comment}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import InnerRouterViewWindow from '@/components/common/InnerRouterView/InnerRouterViewWindow'
import InnerRouterView from '@/components/common/InnerRouterView/InnerRouterView'
import Empty from '@/components/common/Empty'
import { create, deleteById, updateById } from '@/api/project.database.model'
import { checkTableName } from '@/utils/form.check'

export default {
  name: 'TableLibrary',
  components: { Empty, InnerRouterView, InnerRouterViewWindow },
  props: {
    // 当前选中的模型
    currentModel: {},
  },
  data () {
    return {
      // 新模型数据
      newModel: {
        // 模型名称
        name: '',
        // 备注
        comment: '',
        // 模型设计的数据库表
        tables: [],
        // join关联关系
        joins: [],
        // 聚合关联关系
        aggregates: [],
        // 关联线类型，默认为join
        __lineType: 'join',
        // 是否展示SQL预览窗口
        __visibleSQLPreviewWindow: false
      },
      // 编辑模型数据
      editModel: {
        id: null,
        name: '',
        comment: ''
      },
      // 模型数据副本
      modelTemplate: null,
    }
  },
  computed: {
    ...mapState(['tables', 'models', 'currentProject', 'currentDatabase', 'globalLoading'])
  },
  methods: {
    ...mapActions(['fetchTables']),
    getRules () {
      return {
        name: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('database.modelName') }) },
          { validator: (rule, value, callback) => checkTableName(rule, value, callback, '模型名称必须以字母开头，长度必须大于1，且只能包含字母、数字和下划线！' ) },
        ]
      }
    },
    // 开始拖动表放置在设计器中
    handleDragStart (name) {
      this.$emit('table:drag', name)
    },
    // 创建查询模型
    createQueryModel () {
      this.$refs.routerViewWindow.push('create-model')
      for (const key in this.newModel) {
        this.newModel[key] = this.modelTemplate[key]
      }
      // 清空表单验证
      this.$nextTick(() => {
        this.$refs.createForm.clearValidate()
      })
    },
    // 修改模型
    updateModel (model) {
      for (const key in this.editModel) {
        this.editModel[key] = model[key]
      }
      this.$refs.routerViewWindow.push('update-model')
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    // 确认修改
    confirmUpdate() {
      this.$refs.editForm.validate(pass => {
        if (!pass) {
          return
        }
        updateById({
          projectId: this.currentProject,
          databaseId: this.currentDatabase,
          model: this.editModel
        })
          .then(() => {
            Object.assign(this.currentModel, this.editModel)
            this.$refs.routerViewWindow.back()
          })
          .catch(e => {
            this.$tip.apiFailed(e)
          })
      })
    },
    // 确认创建
    confirmCreate () {
      this.$refs.createForm.validate(pass => {
        if (!pass) {
          return
        }
        // 构建新模型对象
        const newModel = JSON.parse(JSON.stringify(this.newModel))
        // 去掉私有属性
        for (const key in this.newModel) {
          if (key.startsWith('__')) {
            delete newModel[key]
          }
        }
        create ({
          projectId: this.currentProject,
          databaseId: this.currentDatabase,
          model: newModel
        })
          .then(modelId => {
            // 拷贝模型，避免内存模型引用当前this.newModel
            const copyModel = JSON.parse(JSON.stringify(this.newModel))
            copyModel.id = modelId
            this.models.unshift(copyModel)
            this.selectModel(copyModel)
            this.$refs.routerViewWindow.back()
          })
          .catch(e => {
            this.$tip.apiFailed(e)
          })
      })
    },
    // 删除模型
    deleteModel (model) {
      this.deleteConfirm(this.$t('database.deleteModelTip', { modelName: model.name }))
        .then(() => {
          deleteById({
            projectId: this.currentProject,
            databaseId: this.currentDatabase,
            modelId: model.id
          })
            .then(() => {
              const index = this.models.findIndex(m => m.id === model.id)
              if (index !== -1) {
                const targetModel = this.models[index]
                this.models.splice(index, 1)
                this.$emit('deleted', targetModel)
              }
              this.$tip.success(this.$t('common.deleteSuccessfully'))
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
        })
        .catch(() => {})
    },
    // 选择模型
    selectModel (model) {
      this.$emit('update:currentModel', model)
    }
  },
  created() {
    this.modelTemplate = {...this.newModel}
  }
}
</script>

<style scoped lang="scss">
.table-library {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .inner-router-view-window {
    padding: 0;
    height: 100%;
    overflow: hidden;
    :deep(.routers) {
      height: 100%;
      .inner-router-view {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    }
  }
  .create-model-form {
    padding: 20px;
    .opera {
      display: flex;
      justify-content: center;
    }
  }
  .table-list-wrap {
    flex-grow: 1;
    .connect-error {
      padding: 20px;
      color: var(--color-danger);
      h4 {
        margin-bottom: 5px;
      }
    }
  }
  .block {
    border-top: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 20px 0;
    background-color: transparent;
    .header {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      margin-bottom: 10px;
    }
    &:first-of-type {
      flex-grow: 1;
      flex-shrink: 0;
      height: 350px;
      border-top: 0;
    }
  }
  // 模型列表
  :deep(.model-list) {
    flex-grow: 1;
    overflow-y: auto;
    user-select: none;
    li {
      padding: 10px 10px 10px 20px;
      display: flex;
      justify-content: space-between;
      cursor: default;
      flex-direction: column;
      position: relative;
      & > label {
        word-break: break-all;
      }
      & > p {
        color: var(--color-gray);
        font-size: var(--font-size-mini);
      }
      & > div {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        opacity: 0;
        transition: all ease .15s;
        margin-left: 10px;
        position: absolute;
        top: 6px;
        right: 10px;
        span {
          padding: 3px;
          margin-left: 5px;
          color: var(--color-gray);
          font-size: 18px;
          &:first-of-type {
            margin-left: 0;
          }
          &:hover {
            color: var(--font-color);
          }
        }
      }
      &.selected {
        background: var(--primary-color-match-1-light);
        &:hover {
          background: var(--primary-color-match-1-light);
        }
        & > label {
          font-weight: bold;
        }
        & > p {
          color: var(--font-color);
        }
      }
      &:hover {
        background-color: #f0f0f0;
        & > div {
          opacity: 1;
        }
      }
    }
  }
  // 表格列表
  :deep(.table-list) {
    flex-grow: 1;
    overflow-y: auto;
    li {
      padding: 8px 20px;
      cursor: move;
      &:hover {
        background: #efefef;
      }
      label {
        cursor: move;
      }
      p {
        cursor: move;
        color: var(--color-gray);
        font-size: var(--font-size-mini);
      }
    }
  }
}
</style>
