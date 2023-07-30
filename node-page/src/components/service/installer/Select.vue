<template>
  <template v-if="options.length > 0">
    <div class="install-radio-select">
      <el-select
        :model-value="modelValue.value"
        clearable
        @change="handleSelect"
      >
        <el-option
          v-for="option in activeOptions"
          :key="option.value"
          :value="option.value"
          :label="option.label"
        />
      </el-select>
      <el-button
        v-if="currentOption != null && currentOption.settings.length > 0"
        type="primary"
        icon="Setting"
        class="button-icon"
        @click="optionSettingData.visible = true"
      ></el-button>
      <el-dialog
        v-if="currentOption != null"
        v-model="optionSettingData.visible"
        :title="`${currentOption.label} Settings`"
      >
        <el-form>
          <el-form-item
            v-for="setting in currentOption.settings"
            :key="setting.name"
            :label="setting.label"
            :required="setting.required"
          >
            <el-input v-model="setting.value" @input="$emit('change')"/>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </template>
  <p v-else>Please add options first.</p>
</template>

<script>
export default {
  name: "InstallSelect",
  props: {
    modelValue: {},
    options: {},
    // 取值select和radio
    type: {
      default: 'radio'
    }
  },
  data () {
    return {
      optionSettingData: {
        visible: false
      }
    }
  },
  computed: {
    activeOptions () {
      return this.options.filter(opt => opt.value.trim() !== '' && opt.label.trim() !== '')
    },
    currentOption () {
      return this.activeOptions.find(opt => opt.value === this.modelValue.value)
    },
    optionValues () {
      return this.activeOptions.map(opt => opt.value)
    },
    // 当前选项的设置选项
    currenOptionSettings () {
      if (this.currentOption == null) {
        return []
      }
      return this.currentOption.settings.map(sett => `${sett.name}_${sett.defaultValue}`)
    }
  },
  watch: {
    // 当选项列表发生变化时，触发handleSelect，避免不存在值继续被选中
    optionValues () {
      // 给定选中的值即可，即modelValue.value
      this.handleSelect(this.modelValue.value)
    },
    // 当前选项的设置选项发生变化时，为设置选项填充value值（例如添加了配置项，那么需要为新的配置项添加value字段）
    currenOptionSettings () {
      this.fillSettingValue()
    }
  },
  methods: {
    handleSelect (value) {
      // 获取当前选项
      const currentOption = this.activeOptions.find(opt => opt.value === value)
      // select的选中包含了选中的值和设置的值
      let valueObj = {
        value: null,
        settings: []
      }
      if (currentOption != null) {
        valueObj = {
          value: value,
          settings: currentOption.settings
        }
      }
      this.$emit('update:modelValue', valueObj)
      this.$emit('change', valueObj)
      // 切换了选项，需要为选项里的配置选项填充value
      this.fillSettingValue()
    },
    // 补充value字段（正式填写时填写的时value字段，保存安装值到配置文件中时也是使用value字段）
    fillSettingValue () {
      this.$nextTick(() => {
        if (this.currentOption != null) {
          for (const setting of this.currentOption.settings) {
            // 填充value时保留原有的value，如果没有再使用默认值
            setting.value = setting.value || setting.defaultValue
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.installer-checkbox {
  display: flex;
  flex-wrap: wrap;
  line-height: initial;
  li {
    padding: 5px 10px;
    background-color: var(--background-color);
    margin-right: 10px;
    cursor: pointer;
    border: 1px solid var(--background-color);
    border-radius: 5px;
    &.selected {
      background: var(--color-value);
      color: var(--color-light);
      font-weight: bold;
      border-color: var(--color-value);
      &:hover {
        border-color: var(--color-value);
      }
    }
    &:hover {
      border-color: var(--primary-color);
    }
  }
}
.install-radio-select {
  display: flex;
  border: 1px solid var(--border-default-color);
  border-radius: 5px;
  overflow: hidden;
  :deep(.el-select) {
    flex-grow: 1;
  }
  .el-button {
    flex-shrink: 0;
    border: 0;
    border-left: 1px solid var(--border-default-color);
    border-radius: 0;
  }
}
</style>
