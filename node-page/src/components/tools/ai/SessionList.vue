<template>
  <div class="ai-session-list">
    <div class="session-list__header">
      <h3>会话列表</h3>
    </div>
    <div class="session-list__body">
      <ul class="session-list">
        <li class="selected">
          <h4>今天</h4>
          <p>vue3怎么集成element-ui</p>
          <p>32次提问</p>
        </li>
        <li>
          <h4>昨天</h4>
          <p>vue3怎么集成element-ui</p>
          <p>16次提问</p>
        </li>
        <li>
          <h4>2023/8/27</h4>
          <p>vue3怎么集成element-ui</p>
          <p>16次提问</p>
        </li>
      </ul>
    </div>
    <div class="session-list__footer">
      <el-button type="primary" size="large" @click="$emit('open-settings')">参数设置</el-button>
      <el-button type="primary" size="large">新建会话</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: "SessionList"
}
</script>

<style scoped lang="scss">
.ai-session-list {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .session-list__header {
    flex-shrink: 0;
    height: 25px;
    display: flex;
    padding: 10px;
    box-sizing: content-box;
    & > * {
      height: 100%;
      line-height: 25px;
    }
    & > span {
      width: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #ccc;
    }
  }
  .session-list__body {
    flex-grow: 1;
    .session-list {
      padding: 0 5px;
      li {
        padding: 10px 20px;
        border-bottom: 1px solid #eee;
        border-radius: 10px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
        &.selected {
          background: var(--primary-color-match-1);
        }
        h4 {
          font-size: var(--font-size-middle);
        }
      }
    }
  }
  .session-list__footer {
    flex-shrink: 0;
    padding: 20px;
    display: flex;
    border-top: 2px solid #eee;
    justify-content: space-between;
    .el-button {
      width: 100%;
      margin-right: 0;
    }
  }
}
</style>
