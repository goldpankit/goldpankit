<template>
<div class="parameter-settings">
  <div class="settings__header">
    <span @click="$emit('close')"><el-icon><ArrowLeftBold /></el-icon></span>
    <h3>{{$t('tool.ai.parameterSettings')}}</h3>
  </div>
  <div class="settings__body">
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
              :content="$t('tool.ai.temperatureDescription')"
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
              :content="$t('tool.ai.frequencyPenaltyDescription')"
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
            <label>Presence Penalty</label>
            <el-popover
              placement="top-start"
              title="Presence Penalty"
              :width="200"
              trigger="hover"
              :content="$t('tool.ai.presencePenaltyDescription')"
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
    <!--          <el-form-item label="开启上下文" prop="enableContext">-->
    <!--            <el-switch v-model="config.enableContext"/>-->
    <!--          </el-form-item>-->
    <!--          <el-form-item :label="$t('tool.ai.autoScroll')" prop="autoScroll">-->
    <!--            <el-switch v-model="config.autoScroll"/>-->
    <!--          </el-form-item>-->
    <el-form-item :label="$t('tool.ai.outputAnimation')" prop="animation">
      <el-switch v-model="config.animation"/>
    </el-form-item>
  </el-form>
  </div>
  <div class="settings__footer">
    <el-button @click="$emit('close')" size="large">关闭</el-button>
    <el-button @click="reset" type="primary" size="large">{{$t('common.reset')}}</el-button>
  </div>
</div>
</template>

<script>

export default {
  name: "ParameterSettings",
  props: {
    // 配置
    config: {
      required: true
    },
    // ai参数
    aiParam: {
      required: true
    },
  },
  data () {
    return {}
  },
  methods: {
    // 重置
    reset () {
      this.$refs.aiForm.resetFields()
      this.$refs.configForm.resetFields()
    },
    // 设置默认值
    setDefault (event, key, defaultValue) {
      if (event.target.value === '') {
        this.aiParam[key] = defaultValue
      }
    },
  }
}
</script>

<style scoped lang="scss">
.parameter-settings {
  height: 100%;
  background: var(--background-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .settings__header {
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
      position: relative;
      top: -1px;
      &:hover {
        background: #eee;
      }
    }
  }
  .settings__body {
    padding: 30px;
    flex-grow: 1;
    overflow-y: auto;
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
  }
  .settings__footer {
    flex-shrink: 0;
    border-top: 2px solid #eee;
    background: var(--background-color);
    display: flex;
    justify-content: center;
    padding: 20px;
    .el-button {
      width: 100%;
    }
  }
}
</style>
