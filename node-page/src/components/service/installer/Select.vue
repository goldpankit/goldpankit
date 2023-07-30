<template>
  <template v-if="options.length > 0">
    <div class="install-radio-select">
      <el-select
        :model-value="modelValue.value"
        clearable
        @change="handleSelect"
      >
        <el-option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :label="option.label"
        />
      </el-select>
      <el-button v-if="currentOption != null && currentOption.settings.length > 0" type="primary" icon="Setting" class="button-icon" @click="optionSettingData.visible = true"></el-button>
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
          >
            <el-input v-model="setting.value"/>
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
    currentOption () {
      return this.options.find(opt => opt.value === this.modelValue.value)
    }
  },
  methods: {
    handleSelect (value) {
      const currentOption = this.options.find(opt => opt.value === value)
      const valueObj = {
        value: value,
        settings: currentOption.settings
      }
      this.$emit('update:modelValue', valueObj)
      this.$emit('change', valueObj)
      // 填充设置值
      this.$nextTick(() => {
        for (const setting of this.currentOption.settings) {
          setting.value = setting.value || setting.defaultValue
        }
      })
    }
  },
  created () {
    console.log('radio value', this.modelValue)
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
