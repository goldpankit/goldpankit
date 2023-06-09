<template>
  <div class="translator-setting">
    <div class="toolbar">
      <el-button type="primary" @click="add">Add</el-button>
      <el-button type="primary" @click="translate">Translate</el-button>
    </div>
    <el-table :data="translator.settings">
      <el-table-column label="*Path Pattern">
        <template #default="{ row }">
          <el-input v-model="row.path" @input="save"/>
        </template>
      </el-table-column>
      <el-table-column label="*Source String">
        <template #default="{ row }">
          <el-input v-model="row.source" @input="save"/>
        </template>
      </el-table-column>
      <el-table-column label="*Target String">
        <template #default="{ row }">
          <el-input v-model="row.target" @input="save"/>
        </template>
      </el-table-column>
      <el-table-column width="120px">
        <template #default="{ row, $index }">
          <el-button icon="Delete" @click="deleteTranslator($index)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {translate} from "../../../../api/service";

export default {
  name: "TranslatorSetting",
  props: {
    space: {
      required: true
    },
    service: {
      required: true
    },
    translator: {
      required: true
    }
  },
  methods: {
    // 添加
    add () {
      const newSetting = {
        path: '',
        source: '',
        target: ''
      }
      this.translator.settings.push(newSetting)
    },
    // 删除
    deleteTranslator (index) {
      this.translator.settings.splice(index, 1)
      this.save()
    },
    // 处理输入
    save () {
      this.$emit('save')
    },
    // 翻译服务
    translate () {
      translate({
        space: this.space,
        service: this.service
      })
        .then(() => {
          console.log('翻译完成')
        })
        .catch(e => {
          console.log('e', e)
        })
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
