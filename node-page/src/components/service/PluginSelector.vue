<template>
  <div class="plugin-selector">
    <ul>
      <li v-for="plugin in plugins" :key="plugin.id" @click="switchPlugin(plugin)">
        <span class="checkbox" :class="{ checked: modelValue.find(p => p.name === plugin.name) != null }"><em></em></span>
        <div class="info">
          <h6>{{ plugin.label }}</h6>
          <p>最新版本：{{ plugin.lastVersion }}</p>
          <p>{{ plugin.introduce }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {fetchList} from "@/api/plugin";

export default {
  name: 'PluginSelector',
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
      plugins: [],
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
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
  max-height: 350px;
  overflow-y: auto;
  ul {
    li {
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px dashed #eee;
      cursor: pointer;
      &:last-of-type {
        border-bottom: 0;
      }
      // 选中信息
      .checkbox {
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
    }
  }
}
</style>
