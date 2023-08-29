<template>
  <ToolWindow
    v-model="visible"
    title="AI问答"
    class="ai-window"
  >
    <div class="setting-wrap">
      <h3>参数设置</h3>
      <el-form ref="aiForm" :model="aiParam">
        <el-form-item label="Mode" prop="mode">
          <p class="mode">gpt-3.5-turbo</p>
        </el-form-item>
        <el-form-item label="Temperature" prop="temperature">
          <template #label>
            <div class="form-item-label">
              <label>Temperature</label>
              <el-popover
                placement="top-start"
                title="Temperature"
                :width="400"
                trigger="hover"
                content="用于调节生成文本的多样性和随机性。较高的Temperature值（例如1.0）会增加生成文本的随机性。这意味着模型更有可能选择不太常见或不太合理的单词，从而产生更具创造力但可能也更不准确或不连贯的回复。较低的Temperature值（例如0.2）会降低生成文本的随机性。这意味着模型更倾向于选择常见或合理的单词，从而产生更准确和连贯但可能也相对较少新颖或有趣的回复。根据任务和需求，您可以根据所需文本输出类型调整Temperature值以获得适当程度的多样性和创造力。"
              >
                <template #reference>
                  <el-icon><QuestionFilled /></el-icon>
                </template>
              </el-popover>
            </div>
          </template>
          <el-input-number v-model="aiParam.temperature" :min="0" :max="1" :step="0.1" @blur="setDefault($event, 'temperature', 0.2)"></el-input-number>
        </el-form-item>
        <el-form-item label="Frequency Penalty" prop="frequencyPenalty">
          <template #label>
            <div class="form-item-label">
              <label>Frequency Penalty</label>
              <el-popover
                placement="top-start"
                title="Frequency Penalty"
                :width="200"
                trigger="hover"
                content="用于控制生成文本中重复词语出现频率的惩罚力度。当设置较高的频率惩罚值时，模型将倾向于生成更多不同的词汇，减少相同词语的重复。"
              >
                <template #reference>
                  <el-icon><QuestionFilled /></el-icon>
                </template>
              </el-popover>
            </div>
          </template>
          <el-input-number v-model="aiParam.frequencyPenalty" :min="0" :max="1" :step="0.1" @blur="setDefault($event, 'frequencyPenalty', 0.8)"></el-input-number>
        </el-form-item>
        <el-form-item label="Presence Penalty" prop="presencePenalty">
          <template #label>
            <div class="form-item-label">
              <label>Frequency Penalty</label>
              <el-popover
                placement="top-start"
                title="Presence Penalty"
                :width="200"
                trigger="hover"
                content="用于控制生成文本中特定主题或关键词出现次数的惩罚力度。通过设置较高的存在惩罚值，可以强制模型避免过多地涉及特定主题或关键词，并鼓励它产生更加全面和多样化的回答。"
              >
                <template #reference>
                  <el-icon><QuestionFilled /></el-icon>
                </template>
              </el-popover>
            </div>
          </template>
          <el-input-number v-model="aiParam.presencePenalty" :min="0" :max="1" :step="0.1" @blur="setDefault($event, 'presencePenalty', 0.6)"></el-input-number>
        </el-form-item>
      </el-form>
      <el-form ref="configForm" :model="config">
        <el-form-item label="自动滚动" prop="autoScroll">
          <el-switch v-model="config.autoScroll"/>
        </el-form-item>
        <el-form-item label="输出动画" prop="animation">
          <el-switch v-model="config.animation"/>
        </el-form-item>
      </el-form>
      <div class="opera">
        <el-button @click="reset">重置</el-button>
        <el-button @click="clearMessages">清空记录</el-button>
      </div>
    </div>
    <div class="message-wrap">
      <ul class="message-list">
        <li v-if="messages.length === 0" class="tip-wrap">
          <h2>{{currentTitle}}</h2>
          <h4>使用说明：</h4>
          <ul>
            <li>每次提问将扣除1颗金豆</li>
            <li>您可以使用AI问答来快速解决您的技术问题</li>
            <li>如果您想要调试AI参数，可以通过左侧的参数配置快速调整</li>
            <li>国内网络可直接使用，如果出现错误请稍后再试</li>
            <li>在底部灰色的输入框中输入文字后按下Ctrl+Enter或Command+Enter即可发起提问</li>
            <li>综合考虑，暂时不支持问答上下文</li>
            <li>如果您在中华人民共和国之外的区域，访问速度可能较慢</li>
          </ul>
        </li>
        <li v-for="message in messages" :key="message.id" class="message" :class="{'self-message': message.self}">
          <template v-if="message.self">
            <img v-if="userInfo == null" src="/images/avatar/default.png">
            <img v-else :src="getAccessUri(userInfo.avatar)">
          </template>
          <svg v-else width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" strokewidth="2" class="scale-appear">
            <path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z" fill="#259c28"></path>
          </svg>
          <div>
            <svg v-if="message.loading" class="loading" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background:transparent;display:block;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
              <g transform="translate(20 50)">
                <circle cx="0" cy="0" r="6" fill="#e15b64">
                  <animateTransform attributeName="transform" type="scale" begin="-0.375s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform>
                </circle>
              </g><g transform="translate(40 50)">
              <circle cx="0" cy="0" r="6" fill="#f8b26a">
                <animateTransform attributeName="transform" type="scale" begin="-0.25s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform>
              </circle>
            </g><g transform="translate(60 50)">
              <circle cx="0" cy="0" r="6" fill="#abbd81">
                <animateTransform attributeName="transform" type="scale" begin="-0.125s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform>
              </circle>
            </g><g transform="translate(80 50)">
              <circle cx="0" cy="0" r="6" fill="#81a3bd">
                <animateTransform attributeName="transform" type="scale" begin="0s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform>
              </circle>
            </g>
            </svg><pre v-else>{{message.currentText}}</pre>
          </div>
        </li>
      </ul>
      <div class="input-wrap">
        <el-input ref="messageInput" v-model="message" type="textarea" :rows="5" @keydown="handleSend" placeholder="请输入问题"/>
        <el-button type="primary" :disabled="disabled" @click="send">发送</el-button>
      </div>
    </div>
  </ToolWindow>
</template>

<script>
import ToolWindow from "../ToolWindow.vue";
import BaseToolWindow from "../BaseToolWindow.vue";
import {mapActions, mapMutations, mapState} from "vuex";
import {askAi} from "../../../api/user.ai";
import {reactive} from "vue";

export default {
  name: "AIWindow",
  extends: BaseToolWindow,
  components: {ToolWindow},
  data () {
    return {
      disabled: true,
      // 配置
      config: {
        autoScroll: true,
        animation: true
      },
      // ai参数
      aiParam: {
        mode: 'gpt-3.5-turbo',
        temperature: 0.2,
        frequencyPenalty: 0.8,
        presencePenalty: 0.6
      },
      message: '',
      currentTitle: '欢迎使用AI问答',
      messages: [],
      businessMessages: [
        '毕竟是数据在球对面，数据拿过来需要些时间，超时甚至失败是难免的，来，重新试一遍～',
        '当前服务繁忙，多问几遍就好了，实在不行看看左侧站长其它作品？枇杷村IT面试宝典，CodeRd啥的其实做的都还可以的，瞅瞅瞅瞅吧～',
        '要不换个问题？比如"coderd好用吗？"'
      ]
    }
  },
  computed: {
    ...mapState(['userInfo']),
    disabled () {
      return this.message.trim().length === 0
    }
  },
  watch: {
    'config.animation': function () {
      const unCompleteMessages = this.messages.filter(msg => msg.content !== msg.currentText)
      for (const message of unCompleteMessages) {
        this.output(message)
      }
    },
    visible () {
      if (this.visible && this.messages.length === 0) {
        this.outputTitle()
        // 自动聚焦
        setTimeout(() => {
          this.$nextTick(() => {
            this.$refs.messageInput.focus()
          })
        }, 300)
      }
    }
  },
  methods: {
    ...mapActions(['refreshBalance']),
    // 发送
    send () {
      const message = this.message.trim()
      if (message === '') {
        return
      }
      // 添加用户消息
      this.messages.push({
        self: true,
        loading: false,
        content: message,
        currentText: this.message
      })
      // 添加加载中的AI消息
      const chatMessage = reactive({
        self: false,
        loading: true,
        content: '',
        currentText: ''
      })
      this.messages.push(chatMessage)
      this.__scrollToBottom()
      // 调用AI
      this.message = ''
      askAi({
        ...this.aiParam,
        message
      })
        .then(data => {
          chatMessage.loading = false
          // 失败
          if (!data.success) {
            chatMessage.content = data.errorMessage
            this.output(chatMessage)
            return
          }
          // 成功
          chatMessage.content = data.answer
          this.output(chatMessage)
          this.refreshBalance()
        })
        .catch(e => {
          chatMessage.loading = false
          if (e.code === 6001) {
            chatMessage.content = e.message
            this.output(chatMessage)
            return
          }
          chatMessage.content = this.businessMessages[Math.round(Math.random() * 2)]
          this.output(chatMessage)
        })
    },
    // 重置
    reset () {
      this.$refs.aiForm.resetFields()
      this.$refs.configForm.resetFields()
    },
    // 清空记录
    clearMessages () {
      this.messages = this.messages.filter(msg => msg.content !== msg.currentText)
    },
    // 回车
    handleSend(event) {
      if ((event.metaKey || event.ctrlKey) && event.keyCode === 13) {
        this.send()
      }
    },
    // 设置默认值
    setDefault (event, key, defaultValue) {
      if (event.target.value === '') {
        this.aiParam[key] = defaultValue
      }
    },
    // 输出内容
    output (message) {
      if (message.__timer != null) {
        clearInterval(message.__timer)
        message.__timer = null
      }
      if (!this.config.animation) {
        message.currentText = message.content
        return
      }
      const text = message.content.split('')
      let i = 0
      message.__timer = setInterval(() => {
        if (i >= text.length) {
          clearInterval(message.__timer)
          message.__timer = null
        } else {
          message.currentText = text.slice(0, i + 1).join('')
          i++
        }
        this.__scrollToBottom()
      }, 50)
    },
    // 输出标题
    outputTitle () {
      const text = '你好，欢迎使用AI问答！'.split('')
      let i = 0
      const timer = setInterval(() => {
        if (i >= text.length) {
          clearInterval(timer)
        } else {
          this.currentTitle = text.slice(0, i + 1).join('')
          i++
        }
      }, 50)
    },
    // 滚动到底部
    __scrollToBottom () {
      if (this.config.autoScroll) {
        this.$nextTick(() => {
          document.querySelector('.message-list').scrollTop = document.querySelector('.message-list').scrollHeight
        })
      }
    }
  },
  mounted () {
    this.outputTitle()
  }
}
</script>

<style scoped lang="scss">
.setting-wrap {
  flex-shrink: 0;
  padding: 30px 30px 80px 30px;
  background: var(--background-color);
  overflow-y: auto;
  h3 {
    margin-bottom: 20px;
  }
  .mode {
    font-weight: bold;
  }
  .form-item-label {
    display: flex;
    align-items: center;
    .el-icon {
      margin-left: 5px;
      font-size: 16px;
    }
  }
  .opera {
    border-top: 2px solid #eee;
    background: var(--background-color);
    width: 215px;
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    padding: 20px;
    .el-button {
      width: 45%;
    }
  }
}
.message-wrap {
  flex-grow: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  .message-list {
    padding: 0 50px 180px 50px;
    margin: 20px 0 0 0;
    list-style: none;
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background-clip: content-box;
      border-color: transparent;
      border-style: solid;
      border-width: 1px 2px;
    }
    .tip-wrap {
      h2 {
        font-size: 30px;
        margin-top: 60px;
        margin-bottom: 50px;
        line-height: 40px;
      }
      h4 {
        font-size: var(--font-size-large);
        margin-bottom: 20px;
      }
      ul {
        list-style: initial;
        padding-left: 20px;
        li {
          margin-top: 10px;
        }
      }
    }
    .self-message {
      font-size: 20px;
      line-height: 30px;
      background-color: transparent !important;
    }
    .message {
      display: flex;
      margin-bottom: 0;
      padding: 30px;
      border-radius: 10px 10px 0 0;
      background: var(--background-color);
      svg, img {
        flex-shrink: 0;
        margin-right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 5px;
      }
      & > div {
        flex-grow: 1;
        margin: 0;
        position: relative;
        top: 8px;
        .loading {
          transform: scale(1.8);
          position: relative;
          top: -8px;
          left: 8px;
        }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          word-break: break-all;
          margin: 0;
        }
      }
    }
  }
  .input-wrap {
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 30px 50px;
    box-sizing: border-box;
    background: #fff;
    :deep(.el-textarea) {
      .el-textarea__inner {
        background: var(--background-color);
        resize: none;
      }
    }
    :deep(.el-button) {
      position: absolute;
      right: 60px;
      bottom: 40px;
    }
  }
}
</style>

<style lang="scss">
.ai-window {
  .el-dialog__body {
    display: flex;
  }
}
</style>
