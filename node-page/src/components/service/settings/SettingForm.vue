<template>
  <el-form v-if="target != null" class="setting-form">
    <el-form-item label="Enable Express">
      <el-input v-model="target.enableExpress" type="textarea" :rows="8" @input="saveFileSetting"/>
    </el-form-item>
    <el-form-item label="Variables" class="item-variables">
      <template #label>
        <div>
          <label>Variables</label>
          <el-button>Add</el-button>
        </div>
      </template>
      <el-table :data="target.variables">
        <el-table-column label="*Name" min-width="120px"></el-table-column>
        <el-table-column label="*Compiler" min-width="120px"></el-table-column>
        <el-table-column label="*Input Type" min-width="120px"></el-table-column>
        <el-table-column label="Remark" min-width="200px"></el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</template>

<script>
import {saveFileSetting} from "../../../api/service";

export default {
  name: "SettingForm",
  props: {
    serviceId: {
      required: true
    },
    target: {
      type: Object
    }
  },
  data () {
    return {
      saveTimeout: null,
      isWorking: false
    }
  },
  methods: {
    // 保存文件配置
    saveFileSetting () {
      if (this.saveTimeout != null) {
        clearTimeout(this.saveTimeout)
      }
      this.saveTimeout = setTimeout(() => {
        this.isWorking = true
        saveFileSetting({
          serviceId: this.serviceId,
          ...this.target
        })
          .then(() => {
            console.log('保存成功')
          })
          .catch(e => {
            console.log('e', e)
          })
          .finally(() => {
            this.isWorking = false
          })
      }, 300)
    }
  }
}
</script>

<style scoped lang="scss">
.el-form.setting-form {
  :deep(.item-variables) {
    .el-form-item__label {
      padding-right: 0;
      & > div {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
