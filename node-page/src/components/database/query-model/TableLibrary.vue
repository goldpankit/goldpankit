<template>
  <div class="table-library">
    <div class="block">
      <InnerRouterViewWindow ref="routerViewWindow" default="query-models">
        <InnerRouterView name="query-models">
          <div class="header" slot="title">
            <h4>{{$t('database.queryModels')}}</h4>
            <el-button type="primary" icon="Plus" class="button-icon" @click="createQueryModel"></el-button>
          </div>
          <ul v-if="queryModels.length > 0" class="model-list">
            <li
              v-for="model in queryModels"
              :key="model.name"
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
            <el-form ref="createForm" :model="newModel" :rules="getRules()">
              <el-form-item :label="$t('common.name')" prop="name" required>
                <el-input v-model="newModel.name"/>
              </el-form-item>
              <el-form-item :label="$t('common.remark')" prop="comment">
                <el-input v-model="newModel.comment" type="textarea" :rows="2"/>
              </el-form-item>
            </el-form>
            <div class="opera">
              <el-button @click="$refs.routerViewWindow.back()">{{$t('common.cancel')}}</el-button>
              <el-button type="primary" @click="confirmCreate">{{$t('common.confirmAdd')}}</el-button>
            </div>
          </div>
        </InnerRouterView>
        <InnerRouterView name="update-model" :title="$t('database.updateModelTitle')">
          <div class="create-model-form">
            <el-form ref="editForm" :model="editModel" :rules="getRules()">
              <el-form-item :label="$t('common.name')" prop="name" required>
                <el-input v-model="editModel.name"/>
              </el-form-item>
              <el-form-item :label="$t('common.remark')" prop="comment">
                <el-input v-model="editModel.comment" type="textarea" :rows="2"/>
              </el-form-item>
            </el-form>
            <div class="opera">
              <el-button @click="$refs.routerViewWindow.back()">{{$t('common.cancel')}}</el-button>
              <el-button type="primary" @click="confirmUpdate">{{$t('common.confirmUpdate')}}</el-button>
            </div>
          </div>
        </InnerRouterView>
      </InnerRouterViewWindow>
    </div>
    <div class="block table-list-wrap">
      <div class="header">
        <h4>{{$t('database.tables')}}</h4>
        <el-button
          class="button-icon"
          type="primary"
          icon="Refresh"
          @click="$emit('tables:refresh')"
        ></el-button>
      </div>
      <ul class="table-list" v-loading="tablesLoading">
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
import {mapState} from "vuex";
import InnerRouterViewWindow from "@/components/common/InnerRouterView/InnerRouterViewWindow.vue";
import InnerRouterView from "@/components/common/InnerRouterView/InnerRouterView.vue";
import Empty from "@/components/common/Empty.vue";
import {createModel, deleteModel, updateModel} from "@/api/database";
import {checkTableName} from '@/utils/form.check'

export default {
  name: "TableLibrary",
  components: {Empty, InnerRouterView, InnerRouterViewWindow},
  props: {
    queryModels: {
      required: true
    },
    tables: {},
    // 是否正在加载表
    tablesLoading: {
      required: true
    },
    currentModel: {},
  },
  data () {
    return {
      newModel: {
        name: '',
        comment: ''
      },
      editModel: {
        id: null,
        name: '',
        comment: ''
      }
    }
  },
  computed: {
    ...mapState(['currentDatabase'])
  },
  methods: {
    getRules () {
      return {
        name: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('database.modelName') }) },
          { validator: (rule, value, callback) => checkTableName(rule, value, callback, this.$t('form.isIncorrect', { field: this.$t('database.modelName') })) },
        ]
      }
    },
    checkTableName,
    // 开始拖动表放置在设计器中
    handleDragStart (name) {
      this.$emit('table:drag', name)
    },
    // 创建查询模型
    createQueryModel () {
      this.$refs.routerViewWindow.push('create-model')
      for (const key in this.newModel) {
        this.newModel[key] = ''
      }
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
        this.$refs.createForm.clearValidate()
      })
    },
    // 确认修改
    confirmUpdate() {
      this.$refs.editForm.validate(pass => {
        if (!pass) {
          return
        }
        updateModel({
          database: this.currentDatabase,
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
        const newModel = {
          ...this.newModel,
          // 当前选择的关系线类型
          lineType: 'join',
          // 表
          tables: [],
          // 关联关系
          joins: [],
          // 聚合关系
          aggregates: []
        }
        createModel ({
          database: this.currentDatabase,
          model: newModel
        })
          .then(modelId => {
            newModel.id = modelId
            this.queryModels.unshift(newModel)
            this.selectModel(newModel)
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
          deleteModel({
            database: this.currentDatabase,
            model: model.id
          })
            .then(() => {
              const index = this.queryModels.findIndex(m => m.id === model.id)
              if (index !== -1) {
                const targetModel = this.queryModels[index]
                this.queryModels.splice(index, 1)
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
  }
  .block {
    border-top: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 20px 0;
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
    li {
      padding: 10px 10px 10px 20px;
      display: flex;
      justify-content: space-between;
      cursor: default;
      flex-direction: column;
      position: relative;
      & > label {
        word-break: break-all;
        font-weight: bold;
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
          margin-top: 2px;
          color: var(--color-gray);
          &:first-of-type {
            margin-left: 0;
          }
          &:hover {
            color: var(--font-color);
          }
        }
      }
      &.selected {
        background: var(--primary-color-match-1);
        &:hover {
          background: var(--primary-color-match-1);
        }
        & > p {
          color: var(--font-color);
        }
      }
      &:hover {
        background: var(--primary-color-match-1);
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
