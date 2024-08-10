<template>
  <div class="plugin-selector">
    <ul class="tabs">
      <li :class="{selected: currentTab === 'all'}" @click="currentTab = 'all'">插件市场</li>
      <li :class="{selected: currentTab === 'selected'}" @click="currentTab = 'selected'">已选择({{ selectedCount }})</li>
    </ul>
    <ul v-if="filteredPlugins.length > 0" class="plugin-list">
      <li v-for="plugin in filteredPlugins" :key="plugin.id" @click="switchPlugin(plugin)">
        <span class="checkbox" :class="{ checked: modelValue.find(p => p.name === plugin.name) != null }"><em></em></span>
        <div class="info">
          <h6>{{ plugin.label }}</h6>
          <p>最新版本：{{ plugin.lastVersion }}</p>
          <p>{{ plugin.introduce }}</p>
        </div>
        <div class="opera">
          <el-button size="default" type="text" @click.stop="$refs.markdownWindow.open(plugin.label, plugin.description)">查看介绍</el-button>
        </div>
      </li>
    </ul>
    <Empty v-else :description="emptyTip"/>
    <MarkdownWindow ref="markdownWindow"/>
  </div>
</template>

<script>
import { fetchList } from '@/api/plugin'
import Empty from '@/components/common/Empty'
import MarkdownWindow from '@/components/common/MarkdownWindow'

export default {
  name: 'PluginSelector',
  components: { Empty, MarkdownWindow },
  props: {
    // 选中的插件标识符
    modelValue: {
      required: true,
      type: Array
    },
    // 空间标识符
    space: {
      required: true
    },
    // 服务标识符
    service: {
      required: true
    },
    // 主版本
    majorVersion: {
      required: true
    }
  },
  data () {
    return {
      loading: false,
      currentTab: 'selected',
      plugins: [],
    }
  },
  computed: {
    // 已选插件
    selectedCount () {
      return this.plugins
        .filter(p => p.supportedPreset && this.modelValue.findIndex(selectedPlugin => selectedPlugin.name === p.name) !== -1).length
    },
    // 空提示
    emptyTip () {
      if (this.currentTab === 'selected') {
        return '暂未选择插件，可在插件市场选择'
      }
      return '该服务下暂无插件可选择'
    },
    // 过滤后的插件
    filteredPlugins () {
      if (this.currentTab === 'selected') {
        return this.plugins.filter(p => p.supportedPreset && this.modelValue.findIndex(selectedPlugin => selectedPlugin.name === p.name) !== -1)
      }
      return this.plugins.filter(p => p.supportedPreset)
    }
  },
  watch: {
    majorVersion () {
      this.fetchList()
      this.$emit('update:modelValue', [])
      this.$emit('change', [])
    }
  },
  methods: {
    // 选中和取消选中
    switchPlugin (plugin) {
      let newValue = [...this.modelValue]
      // 存在则删除
      let index = newValue.findIndex(p => p.name === plugin.name)
      if (index === -1) {
        newValue.push({
          name: plugin.name,
        })
      }
      // 不存在则添加
      else {
        newValue.splice(index, 1)
      }
      this.$emit('update:modelValue', newValue)
      this.$emit('change', newValue)
    },
    // 获取插件列表
    fetchList() {
      if (this.majorVersion === '') {
        this.plugins = []
        return
      }
      this.loading = true
      fetchList({
        space: this.space,
        service: this.service,
        majorVersion: this.majorVersion
      })
        .then(plugins => {
          this.plugins = plugins
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  created () {
    this.fetchList()
  }
}
</script>

<style scoped lang="scss">
.plugin-selector {
  width: 100%;
  padding: 0 10px 10px 10px;
  border: 1px solid #eee;
  border-radius: 5px;
  max-height: 500px;
  overflow-y: auto;
  ul.tabs {
    display: flex;
    border-bottom: 1px solid #eee;
    li {
      padding: 5px 15px;
      cursor: pointer;
      &.selected {
        font-weight: bold;
      }
    }
  }
  ul.plugin-list {
    li {
      display: flex;
      align-items: center;
      padding: 10px;
      border-bottom: 1px dashed #eee;
      cursor: pointer;
      position: relative;
      &:hover {
        background: #fafafa;
      }
      &:last-of-type {
        border-bottom: 0;
      }
      // 选中信息
      .checkbox {
        flex-shrink: 0;
        width: 16px;
        height: 16px;
        border: 1px solid #ccc;
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20px;
        em {
          width: 8px;
          height: 8px;
          background: #ccc;
        }
        // 已选中
        &.checked {
          em {
            background: var(--primary-color-match-2);
          }
        }
      }
      // 插件信息
      .info {
        line-height: 1.5;
        h6 {
          font-size: 14px;
        }
        p {
          color: var(--color-gray);
        }
      }
      // 操作
      .opera {
        position: absolute;
        top: 0;
        right: 10px;
        .el-button {
          color: var(--primary-color-match-2);
          &:hover {
            color: var(--primary-color-match-2-transition);
          }
        }
      }
    }
  }
}
</style>
