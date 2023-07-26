<template>
  <div class="table-library">
    <div class="block">
      <InnerRouterViewWindow ref="routerViewWindow" default="query-models">
        <InnerRouterView name="query-models">
          <div class="header" slot="title">
            <h4>Query Models</h4>
            <el-button type="primary" icon="Plus" class="button-icon" @click="createQueryModel"></el-button>
          </div>
          <ul class="model-list">
            <li
              v-for="model in queryModels"
              :key="model.name"
              :class="{selected: currentModel != null && currentModel.name === model.name}"
              @click="selectModel(model)"
            >
              <p>{{model.name}}</p>
              <div>
                <span><el-icon><Edit/></el-icon></span>
                <span><el-icon><Delete/></el-icon></span>
              </div>
            </li>
          </ul>
        </InnerRouterView>
        <InnerRouterView name="create-model" title="Create New Model">
          <div class="create-model-form">
            <el-form :model="newModel">
              <el-form-item label="Model Name" required>
                <el-input v-model="newModel.name"/>
              </el-form-item>
              <el-form-item label="Comment" required>
                <el-input v-model="newModel.comment" type="textarea" :rows="2"/>
              </el-form-item>
            </el-form>
            <div class="opera">
              <el-button>Cancel</el-button>
              <el-button type="primary" @click="confirmCreate">Confirm</el-button>
            </div>
          </div>
        </InnerRouterView>
      </InnerRouterViewWindow>
    </div>
    <div class="block">
      <div class="header">
        <h4>Tables</h4>
      </div>
      <ul class="table-list">
        <li
          v-for="table in tables"
          :key="table.name"
          :name="table.name"
          draggable="true"
          @dragstart="handleDragStart"
        >{{table.name}}({{table.comment}})</li>
      </ul>
    </div>
  </div>
</template>

<script>
import InnerRouterViewWindow from "../../common/InnerRouterView/InnerRouterViewWindow.vue";
import InnerRouterView from "../../common/InnerRouterView/InnerRouterView.vue";

export default {
  name: "TableLibrary",
  components: {InnerRouterView, InnerRouterViewWindow},
  props: {
    queryModels: {
      required: true
    },
    tables: {},
    currentModel: {}
  },
  data () {
    return {
      newModel: {
        name: '',
        comment: ''
      }
    }
  },
  methods: {
    // 开始拖动表放置在设计器中
    handleDragStart (e) {
      this.$emit('table:drag', e.target.getAttribute('name'))
    },
    // 创建查询模型
    createQueryModel () {
      this.$refs.routerViewWindow.push('create-model')
    },
    // 确认创建
    confirmCreate () {
      this.queryModels.unshift({
        ...this.newModel,
        // 当前选择的关系线类型
        lineType: 'join',
        // 表
        tables: [],
        // 关联关系
        joins: [],
        // 聚合关系
        aggregates: [],
        // 当前选中的表
        selectedTableId: null,
        // 拖动数据
        dragData: null
      })
      this.selectModel(this.queryModels[this.queryModels.length - 1])
      this.$refs.routerViewWindow.back()
      this.$emit('created', this.queryModels[this.queryModels.length - 1])
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
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .inner-router-view-window {
    padding: 0;
  }
  .create-model-form {
    padding: 20px;
    .opera {
      display: flex;
      justify-content: center;
    }
  }
  .block {
    border-top: 1px solid #ccc;
    flex-grow: 1;
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
      flex-grow: 0;
      flex-shrink: 0;
      height: 300px;
      border-top: 0;
    }
  }
  // 模型列表
  :deep(.model-list) {
    flex-grow: 1;
    overflow-y: auto;
    li {
      padding: 5px 10px 5px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      & > p {
        word-break: break-all;
      }
      & > div {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        opacity: 0;
        transition: all ease .15s;
        margin-left: 10px;
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
        color: var(--primary-color-match-2);
        background: #e0e0e0;
        &:hover {
          background: #e0e0e0;
        }
      }
      &:hover {
        background: #efefef;
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
      padding: 5px 20px;
      &:hover {
        background: #efefef;
      }
    }
  }
}
</style>
