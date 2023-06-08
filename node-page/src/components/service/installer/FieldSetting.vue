<template>
  <h5>{{group.label}}</h5>
  <MySqlFieldSelect @update:modelValue="handleSelect" :model-value="group[valueKey]" :table="table" placeholder="Select fields"/>
  <el-table size="small" :data="group[valueKey]">
    <el-table-column label="字段名" width="100px" prop="name" fixed></el-table-column>
    <el-table-column
      v-for="variable in group.children"
      :key="variable.name"
      :label="variable.label"
    >
      <template #default="{ row }">
        <el-input v-model="row[variable.name]"/>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import MySqlFieldSelect from "../../database/MySqlFieldSelect.vue";

export default {
  name: "FieldSetting",
  components: {MySqlFieldSelect},
  props: {
    valueKey: {
      default: 'value'
    },
    table: {
      required: true
    },
    group: {
      required: true
    }
  },
  methods: {
    handleSelect (fields) {
      for (const field of fields) {
        for (const variable of this.group.children) {
          field[variable.name] = field[variable.name] || ''
        }
      }
      this.group[this.valueKey] = fields
    }
  }
}
</script>

<style scoped lang="scss">
h5 {
  font-size: var(--font-size);
  color: var(--el-text-color-regular);
  font-weight: normal;
  margin-top: 20px;
}
</style>
