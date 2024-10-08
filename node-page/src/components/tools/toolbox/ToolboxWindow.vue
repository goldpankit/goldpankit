<template>
  <ToolWindow
    title="工具箱"
    width="1200px"
    v-model="visible"
    @switch-fullscreen="handleSwitchFullscreen"
  >
    <div class="toolbox-wrap">
      <div class="tool-list-wrap">
        <div class="search-wrap">
          <el-input size="default" placeholder="搜索" round/>
        </div>
        <ul>
          <li
            v-for="tool in tools"
            :key="tool.name"
            :class="{ selected: tool.name === currentTool.name }"
            @click="currentTool = tool"
          >
            <label>{{ tool.label }}</label>
          </li>
        </ul>
      </div>
      <div class="tool-body">
        <ToolRouter ref="toolRouter" :tool-name="currentTool.name"/>
      </div>
    </div>
  </ToolWindow>
</template>

<script>

import ToolWindow from '@/components/tools/ToolWindow'
import BaseToolWindow from '@/components/tools/BaseToolWindow'
import ToolRouter from "@/components/tools/toolbox/ToolRouter.vue";

export default {
  name: 'ToolboxWindow',
  extends: BaseToolWindow,
  components: {ToolRouter, ToolWindow },
  data () {
    return {
      tools: [
        { name: 'JsonFormatter', label: 'JSON格式化' },
        { name: 'NameGenerator', label: '名称生成' },
        { name: 'password-generator', label: '密码生成' },
        { name: 'qr-generator', label: '二维码生成' },
        { name: 'ip-query', label: 'IP地址查询' },
        { name: 'patter-test', label: '正则测试' },
        { name: 'image-to-base64', label: '图片转base64' },
        { name: 'image-compress', label: '图片压缩' },
        { name: 'http-status-code', label: 'http状态码' },
      ],
      currentTool: null
    }
  },
  methods: {
    // 处理全屏切换，切换时触发工具实现的onSwitchFullscreen方法
    handleSwitchFullscreen (fullscreen) {
      this.$refs.toolRouter.onSwitchFullscreen(fullscreen)
    }
  },
  created () {
    this.currentTool = this.tools[0]
  }
}
</script>

<style scoped lang="scss">
.toolbox-wrap {
  height: 100%;
  display: flex;
  .tool-list-wrap {
    flex: 0 0 200px;
    border-right: 1px solid #e6e6e6;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .search-wrap {
      flex-shrink: 0;
      border-bottom: 1px solid #e6e6e6;
      padding: 10px;
      .el-input {
        border-radius: 40px;
      }
    }
    ul {
      flex-grow: 1;
      list-style: none;
      padding: 0;
      margin: 0;
      overflow-y: auto;
      li {
        cursor: pointer;
        padding: 8px 10px;
        &.selected {
          background-color: var(--primary-color-match-1);
        }
        label {
          cursor: pointer;
          display: inline-block;
          width: 100%;
        }
      }
    }
  }
  .tool-body {
    flex: 1;
    overflow: auto;
  }
}
</style>
