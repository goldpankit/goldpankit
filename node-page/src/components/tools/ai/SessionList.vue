<template>
  <div class="ai-session-list">
    <div class="session-list__header">
      <h3>会话列表</h3>
    </div>
    <div class="session-list__body">
      <div class="tabs">
        <el-tabs v-model="currentTab">
          <el-tab-pane name="date" label="最近"></el-tab-pane>
          <el-tab-pane name="defined" label="自定义"></el-tab-pane>
        </el-tabs>
      </div>
      <template v-if="currentTab === 'date'">
        <ul class="session-list">
          <li
            v-for="session in dateSessions"
            :key="session.title"
            :class="{ 'selected': modelValue === session }"
            @click="selectSession(session)"
          >
            <h4>{{getDayText(session.title)}}</h4>
            <div class="info">
              <span>{{session.count}}次提问</span>
              <span v-if="todayText === session.title">
                <el-button :disabled="session.__clearing" @click="clearDateSessionMessages(session)">清空</el-button>
              </span>
            </div>
          </li>
        </ul>
      </template>
      <template v-if="currentTab === 'defined'">
        <ul v-if="definedSessions.length > 0" class="session-list">
          <li
            v-for="session in definedSessions"
            :key="session.id"
            :class="{ 'selected': modelValue === session }"
            @click="selectSession(session)"
          >
            <h4>{{session.title == null ? '新的会话' : session.title}}</h4>
            <div class="info">
              <span>{{session.count}}次提问</span>
              <span>{{getDateOffsetText(session.createTime)}}</span>
            </div>
          </li>
        </ul>
        <Empty v-else/>
      </template>
    </div>
    <div class="session-list__footer">
      <el-button type="primary" size="large" @click="$emit('open-settings')">参数设置</el-button>
      <el-button type="primary" size="large" :loading="isWorking.create" :disabled="isWorking.create" @click="createSession">新建会话</el-button>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {
  clearDateSessionMessages,
  createSession,
  fetchDateSessions,
  fetchDefinedSessions,
  fetchSessionMessages
} from "../../../api/user.ai";
import {reactive} from "vue";
import Empty from "../../common/Empty.vue";

export default {
  name: "SessionList",
  components: {Empty},
  props: {
    modelValue: {}
  },
  data () {
    return {
      todayText: dayjs().format('YYYY-MM-DD'),
      currentTab: 'date',
      dateSessions: [],
      definedSessions: [],
      isWorking: {
        create: false
      }
    }
  },
  methods: {
    // 选择会话
    selectSession (session) {
      session.loading = true
      this.$emit('update:modelValue', session)
      fetchSessionMessages({
        page: 1,
        capacity: 50,
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
        .finally(() => {
          setTimeout(() => {
            session.loading = false
          }, 300)
        })
    },
    // 查询会话
    fetchDateSessions () {
      // 查询日期会话
      fetchDateSessions()
        .then(data => {
          this.dateSessions = data
          // 添加今日会话
          const todaySession = this.dateSessions.find(session => session.title === this.todayText)
          if (todaySession == null) {
            this.dateSessions.unshift({
              title: this.todayText,
              count: 0,
              loading: false
            })
          }
          this.selectSession(this.dateSessions[0])
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
      // 查询自定义会话
      fetchDefinedSessions({
        page: 1,
        capacity: 10
      })
        .then(data => {
          this.definedSessions = data.records
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 新建会话
    createSession () {
      if (this.isWorking.create) {
        return
      }
      this.isWorking.create = true
      createSession()
        .then(data => {
          // 切换到自定义会话
          this.currentTab = 'defined'
          // 添加会话到顶部
          const newSession = reactive({
            ...data,
            title: null,
            count: 0
          })
          this.definedSessions.unshift(newSession)
          // 默认选中会话
          this.selectSession(newSession)
          // 滚动到顶部
          this.__scrollToTop()
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.isWorking.create = false
        })
    },
    // 清理日期会话消息
    clearDateSessionMessages (session) {
      if (session.__clearing) {
        return
      }
      session.__clearing = true
      clearDateSessionMessages({
        date: session.title
      })
        .then(() => {
          // 如果当前会话为清理的会话，重选一次会话更新消息
          if (session === this.modelValue) {
            this.selectSession(session)
          }
          this.$tip.success('数据清空成功')
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          session.__clearing = false
        })
    },
    // 滚动到底部
    __scrollToTop () {
      this.$nextTick(() => {
        document.querySelector('.session-list__body').scrollTop = 0
      })
    },
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
  position: relative;
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
    h3 {
      font-size: var(--font-size);
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
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .tabs {
      flex-shrink: 0;
      :deep(.el-tabs__item) {
        padding: 0 20px !important;
      }
    }
    .session-list {
      flex-grow: 1;
      overflow-y: auto;
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
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2; /* 控制显示行数 */
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          font-size: var(--font-size);
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
