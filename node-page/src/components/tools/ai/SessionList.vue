<template>
  <div class="ai-session-list">
    <div class="session-list__header">
      <h3>会话列表</h3>
    </div>
    <div class="session-list__body">
      <el-tabs v-model="currentTab">
        <el-tab-pane name="date" label="最近">
          <ul class="session-list">
            <li
              v-for="session in dateSessions"
              :key="session.title"
              :class="{ 'selected': modelValue === session }"
              @click="selectSession(session)"
            >
              <h4>{{getDayText(session.title)}}</h4>
              <p>vue3怎么集成element-ui</p>
              <p>{{session.count}}次提问</p>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane name="defined" label="自定义">
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
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="session-list__footer">
      <el-button type="primary" size="large" @click="$emit('open-settings')">参数设置</el-button>
      <el-button type="primary" size="large">新建会话</el-button>
    </div>
  </div>
</template>

<script>

import {fetchDateSessions, fetchSessionMessages} from "../../../api/user.ai";

export default {
  name: "SessionList",
  props: {
    modelValue: {}
  },
  data () {
    return {
      currentTab: 'date',
      dateSessions: []
    }
  },
  methods: {
    // 选择会话
    selectSession (session) {
      this.$emit('update:modelValue', session)
      fetchSessionMessages({
        page: 1,
        capacity: 10,
        model: {
          sessionId: session.id,
          date: session.id == null ? session.title : null
        }
      })
        .then(data => {
          session.messageData = data
          this.$emit('session-change', session)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 查询日期会话
    fetchDateSessions () {
      fetchDateSessions()
        .then(data => {
          this.dateSessions = data
          if (this.dateSessions.length > 0) {
            this.selectSession(this.dateSessions[0])
          }
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    }
  },
  created () {
    this.fetchDateSessions()
  }
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
    :deep(.el-tabs__item) {
      padding: 0 20px !important;
    }
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
