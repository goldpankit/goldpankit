<template>
  <el-dialog
    v-model="visible"
    title="Option Settings"
    append-to-body
    custom-class="option-setting-window"
  >
    <div class="toolbar">
      <el-button icon="Plus" type="primary" @click="add">Add</el-button>
    </div>
    <el-table :data="option.settings">
      <el-table-column prop="label" label="Label">
        <template #default="{row}">
          <el-input v-model="row.label" @input="emitChange"/>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Name">
        <template #default="{row}">
          <el-input v-model="row.name" @input="emitChange"/>
        </template>
      </el-table-column>
      <el-table-column prop="inputType" label="Input Type">
        <template #default="{row}">
          <el-select v-model="row.inputType" @change="emitChange">
            <el-option value="input" label="Input"/>
            <el-option value="number_input" label="Number Input"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="required" label="Input Type">
        <template #default="{row}">
          <el-switch v-model="row.required"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="Default Value">
        <template #default="{row}">
          <el-input v-model="row.value" @input="emitChange"/>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>

export default {
  name: "OptionSettingWindow",
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
        value: ''
      })
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
