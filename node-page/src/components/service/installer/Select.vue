<template>
  <template v-if="options.length > 0">
    <div class="installer-select">
      <el-select
        :model-value="modelValue.value"
        clearable
        @change="handleSelect"
      >
        <el-option
          v-for="option in validOptions"
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
        :title="`${currentOption.label}${$t('service.settingsForSelectType')}`"
        :append-to-body="true"
      >
        <el-form>
          <el-form-item
            v-for="setting in currentOption.settings"
            :key="setting.name"
            :label="setting.label"
            :required="setting.required"
          >
            <OptionValueInput v-model="modelValue.settings[setting.name]" :option-setting="setting" @input="$emit('change')"/>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </template>
  <p v-else>Please add options first.</p>
</template>

<script>
import OptionValueInput from "./OptionValueInput.vue";

export default {
  name: "InstallSelect",
  components: {OptionValueInput},
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
    validOptions () {
      return this.options.filter(opt => opt.value.trim() !== '' && opt.label.trim() !== '')
    },
    currentOption () {
      return this.validOptions.find(opt => opt.value === this.modelValue.value)
    },
    optionValues () {
      return this.validOptions.map(opt => opt.value)
    },
    // 当前选项的设置选项
    currenOptionSettings () {
      if (this.currentOption == null) {
        return []
      }
      return this.currentOption.settings.map(sett => sett.defaultValue)
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
    },
    // 监听modelValue
    modelValue: {
      immediate: true,
      handler () {
        this.fillSettingValueFromModelValue()
      }
    }
  },
  methods: {
    handleSelect (value) {
      // 获取当前选项
      const currentOption = this.validOptions.find(opt => opt.value === value)
      // select的选中包含了选中的值和设置的值
      let valueObj = {
        value: null,
        settings: {}
      }
      if (currentOption != null) {
        const settings = {}
        for (const sett of currentOption.settings) {
          settings[sett.name] = sett.defaultValue
        }
        valueObj = { value, settings }
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
            /**
             * 填充value，直接赋值默认值即可，不能先从value中获取再从defaultValue中获取
             * 因为当刚创建选项设置后，输入默认值时，会触发该方法，从而给value绑定了defaultValue，此时value已经存在了值，
             * 如果先从value中获取，当默认值刚输入“a”时，value为“a”，默认值修改为“aa”时，value依然保留“a”，从而丢失默认值。
             * 当前直接赋值默认值会出现一种情况，即当选项配置中任意一项的默认值发生了变化，都会整体覆盖现有的value。
             */
            setting.value = setting.defaultValue
          }
        }
      })
    },
    // 从modelValue中赋值
    fillSettingValueFromModelValue () {
      for (const settName in this.modelValue.settings) {
        const option = this.options.find(opt => opt.value === this.modelValue.value)
        if (option == null) {
          continue
        }
        const setting = option.settings.find(sett => sett.name === settName)
        if (setting != null) {
          setting.value = this.modelValue.settings[settName]
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.installer-select {
  display: flex;
  border-radius: 5px;
  overflow: hidden;
  :deep(.el-select) {
    flex-grow: 1;
    .el-input__wrapper {
      height: 40px;
      border-radius: 5px 0 0 5px;
    }
  }
  .el-button {
    border: 0;
    border-radius: 0;
    width: 40px;
    height: 40px;
  }
}
</style>
