<template>
  <el-form v-if="target != null" class="setting-form">
    <el-form-item label="Enable Express">
      <el-input v-model="target.enableExpress" type="textarea" :rows="8" @input="saveFileSetting"/>
    </el-form-item>
    <el-form-item label="Variables" class="item-variables">
      <template #label>
        <div>
          <label>Variables</label>
          <div class="opera">
            <el-button icon="Top" class="button-icon"></el-button>
            <el-button icon="Bottom" class="button-icon"></el-button>
            <el-button @click="createVariable">Add</el-button>
          </div>
        </div>
      </template>
      <el-table :data="target.variables">
        <el-table-column label="*Name" min-width="120px">
          <template #default="{ row }">
            <el-input v-model="row.name" @input="saveFileSetting"/>
          </template>
        </el-table-column>
        <el-table-column label="*Compiler" min-width="120px">
          <template #default="{ row }">
            <CompilerSelect v-model="row.compiler" @change="saveFileSetting"/>
          </template>
        </el-table-column>
        <el-table-column label="*Input Type" min-width="120px">
          <template #default="{ row }">
            <InputTypeSelect v-model="row.inputType" @change="saveFileSetting"/>
          </template>
        </el-table-column>
        <el-table-column label="Remark" min-width="200px">
          <template #default="{ row }">
            <el-input type="textarea" :rows="1" v-model="row.remark" @input="saveFileSetting"/>
          </template>
        </el-table-column>
        <el-table-column v-if="target.variables.length > 0" min-width="60px" fixed="right">
          <template #default="{ row, index }">
            <el-button icon="Delete" class="button-icon" @click="deleteVariable(index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</template>

<script>
import {saveFileSetting} from "../../../api/service";
import CompilerSelect from "../../common/CompilerSelect.vue";
import InputTypeSelect from "../../common/InputTypeSelect.vue";

export default {
  name: "SettingForm",
  components: {InputTypeSelect, CompilerSelect},
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
          ...this.target,
          variables: this.target.variables.filter(v => v.name.trim().length > 0)
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
    },
    // 创建变量
    createVariable () {
      this.target.variables.push({
        name: '',
        compiler: 'static',
        inputType: 'input',
        remark: ''
      })
    },
    // 删除变量
    deleteVariable (index) {
      this.target.variables.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="scss">
.el-form.setting-form {
  :deep(.item-variables) {
    .el-form-item__label {
      padding-right: 0;
      height: 35px;
      margin-bottom: 10px;
      & > div {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
