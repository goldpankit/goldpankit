<template>
  <div class="ai-session-list">
    <div class="session-list__header">
      <h3>{{$t('tool.ai.sessions')}}</h3>
    </div>
    <div class="session-list__body">
      <div class="tabs">
        <el-tabs v-model="currentTab">
          <el-tab-pane name="date" :label="$t('tool.ai.recent')"></el-tab-pane>
          <el-tab-pane name="defined" :label="$t('tool.ai.customized')"></el-tab-pane>
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
              <span>{{$t('tool.ai.timesQuestion', { times: session.count })}}</span>
              <span>
                <el-button
                  round
                  :disabled="session.__clearing"
                  @click.stop="clearDateSessionMessages(session)"
                >{{$t('common.clear')}}</el-button>
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
            <h4>{{session.title == null ? $t('tool.ai.newSession') : session.title}}</h4>
            <div class="info">
              <span>{{$t('tool.ai.timesQuestion', { times: session.count })}}</span>
              <span>{{getDateOffsetText(session.createTime)}}</span>
            </div>
            <span class="button-delete" @click.stop="deleteSession(session)"><el-icon><SemiSelect /></el-icon></span>
          </li>
        </ul>
        <Empty v-else/>
      </template>
    </div>
    <div class="session-list__footer">
      <el-button type="primary" size="large" @click="$emit('open-settings')">{{$t('tool.ai.parameterSettings')}}</el-button>
      <el-button type="primary" size="large" :loading="isWorking.create" :disabled="isWorking.create" @click="createSession">{{$t('tool.ai.createSession')}}</el-button>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {
  clearDateSessionMessages,
  createSession, deleteSession,
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
          session.messages = data.records
          this.$emit('session-change', session)
        })
        .catch(e => {
          // 未登录
          if (e.code === 4007) {
            session.messages = []
            this.$emit('session-change', session)
            return
          }
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          setTimeout(() => {
            session.loading = false
          }, 150)
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
          // 未登录
          if (e.code === 4007) {
            // 添加今日会话
            const todaySession = this.dateSessions.find(session => session.title === this.todayText)
            if (todaySession == null) {
              this.dateSessions.unshift({
                title: this.todayText,
                count: 0,
                loading: false
              })
              this.selectSession(this.dateSessions[0])
            }
            return
          }
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
          if (e.code === 4007) {
            return
          }
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
          console.log('newSession', newSession)
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
    // 删除会话
    deleteSession (session) {
      if (session.__deleting) {
        return
      }
      this.deleteConfirm('确认删除该会话吗？')
        .then(() => {
          session.__deleting = true
          deleteSession(session.id)
            .then(() => {
              const index = this.definedSessions.findIndex(s => s.id === session.id)
              if (index !== -1) {
                this.definedSessions.splice(index, 1)
              }
              // 删除的是当前这个
              if (this.modelValue === session) {
                if (this.definedSessions.length > 0) {
                  this.selectSession(this.definedSessions[0])
                } else {
                  this.selectSession(this.dateSessions[0])
                }
              }
            })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
            .finally(() => {
              session.__deleting = false
            })
        })
        .catch(() => {})
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
          // 清理的不是今天，则直接删除
          if (session.title !== this.todayText) {
            const targetIndex = this.dateSessions.findIndex(s => s.title === session.title)
            if (targetIndex !== -1) {
              this.dateSessions.splice(targetIndex, 1)
            }
          }
          // 如果清理的是当前这个会话，则选中今天
          if (session === this.modelValue) {
            this.selectSession(this.dateSessions[0])
          }
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
        position: relative;
        &:hover {
          background: #eee;
          .button-delete {
            opacity: 1;
          }
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
        .button-delete {
          transition: all ease .15s;
          position: absolute;
          top: 10px;
          right: 5px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ccc;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          &:hover {
            background: var(--color-danger);
            color: var(--color-light);
          }
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
