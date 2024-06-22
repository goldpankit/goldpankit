<template>
  <el-dialog
    v-model="visible"
    :title="$t('service.settings.variable.optionSettings')"
    append-to-body
    class="option-setting-window"
  >
    <div class="toolbar">
      <el-button icon="Plus" type="primary" @click="add">{{$t('common.add')}}</el-button>
    </div>
    <el-table :data="option.settings">
      <el-table-column prop="label" :label="$t('service.settings.variable.label')">
        <template #default="{row}">
          <el-input v-model="row.label" @input="emitChange"/>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="$t('service.settings.variable.name')">
        <template #default="{row}">
          <el-input v-model="row.name" @input="emitChange"/>
        </template>
      </el-table-column>
      <el-table-column prop="inputType" :label="$t('service.settings.variable.inputType')">
        <template #default="{row}">
          <el-select v-model="row.inputType" @change="emitChange">
            <el-option value="input" label="Input"/>
            <el-option value="number_input" label="Number Input"/>
            <el-option value="textarea" label="Textarea"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="required" :label="$t('service.settings.variable.required')">
        <template #default="{row}">
          <el-switch v-model="row.required"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="defaultValue" :label="$t('service.settings.variable.defaultValue')">
        <template #default="{row}">
          <OptionValueInput :option-setting="row" v-model="row.defaultValue" @input="emitChange"/>
        </template>
      </el-table-column>
      <el-table-column width="60px">
        <template #default="{row, $index}">
          <el-button icon="Delete" @click="deleteSetting($index)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>

import OptionValueInput from "../../installer/OptionValueInput.vue";

export default {
  name: "OptionSettingWindow",
  components: {OptionValueInput},
  data () {
    return {
      visible: false,
      option: null
    }
  },
  methods: {
    open (option) {
      this.option = option
      this.visible = true
    },
    add () {
      this.option.settings.push({
        label: '',
        name: '',
        inputType: 'input',
        required: true,
        defaultValue: ''
      })
    },
    deleteSetting (index) {
      this.option.settings.splice(index, 1)
      this.emitChange()
    },
    emitChange () {
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss">
.option-setting-window {
  .toolbar {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
