<template>
  <div class="translator-setting">
    <div class="toolbar">
      <el-button type="primary" @click="add">Add</el-button>
      <el-button type="primary">Translate</el-button>
    </div>
    <el-table :data="translator.settings">
      <el-table-column label="*Path Pattern">
        <template #default="{ row }">
          <el-input v-model="row.path"/>
        </template>
      </el-table-column>
      <el-table-column label="*Source String">
        <template #default="{ row }">
          <el-input v-model="row.source"/>
        </template>
      </el-table-column>
      <el-table-column label="*Target String">
        <template #default="{ row }">
          <el-input v-model="row.target"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "TranslatorSetting",
  props: {
    translator: {
      required: true
    }
  },
  methods: {
    add () {
      const newSetting = {
        path: '',
        source: '',
        target: ''
      }
      this.translator.settings.push(newSetting)
    }
  },
  created () {
    console.log('translator', this.translator)
  }
}
</script>

<style scoped lang="scss">
.translator-setting {
  width: 100%;
  .toolbar {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
