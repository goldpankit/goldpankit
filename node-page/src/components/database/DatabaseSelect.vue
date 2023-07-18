<template>
  <div class="database-select">
    <el-select :model-value="modelValue" @change="$emit('change', $event)" clearable>
      <el-option
        v-for="item in list"
        :value="item.id"
        :key="item.id"
        :label="item.name"
      />
      <template v-if="withPrefix" #prefix>Database:</template>
    </el-select>
    <el-button v-if="withCreateButton" class="button-icon" type="primary" icon="Plus" @click="$refs.createDatabaseWindow.open()"></el-button>
    <CreateDatabaseWindow ref="createDatabaseWindow"/>
  </div>
</template>

<script>
import {search} from "../../api/database";
import CreateDatabaseWindow from "./CreateDatabaseWindow.vue";

export default {
  name: "DatabaseSelect",
  components: {CreateDatabaseWindow},
  props: {
    modelValue: {},
    withPrefix: {
      default: true
    },
    withCreateButton: {
      default: true
    }
  },
  data () {
    return {
      list: []
    }
  },
  methods: {
    fetchList () {
      search ()
        .then(data => {
          this.list = data
        })
        .catch(e => {
          console.log('e', e)
        })
    },
  },
  created () {
    this.fetchList()
  }
}
</script>

<style scoped lang="scss">
.database-select {
  display: flex;
  border: 1px solid var(--border-default-color);
  border-radius: 5px;
  overflow: hidden;
  :deep(.el-select) {
    width: 175px;
    .el-input__wrapper {
      box-shadow: none !important;
    }
    .el-input__prefix-inner {
      color: var(--font-color);
    }
  }
  :deep(.el-button) {
    border: 0;
    border-left: 1px solid var(--border-default-color);
    border-radius: 0;
  }
}
</style>
