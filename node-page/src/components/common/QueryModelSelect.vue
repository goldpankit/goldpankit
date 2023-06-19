<template>
  <el-select
    class="model-select"
    popper-class="model-select__popper"
  >
    <el-option
      v-for="model in models"
      :key="model.name"
      :value="model.name"
      :label="model.name"
    >
      <p class="option-content">
        <span>{{ model.name }}</span>
        <span class="text-info-1">{{ model.comment }}</span>
      </p>
    </el-option>
  </el-select>
</template>

<script>

import {mapState} from "vuex";

export default {
  name: "QueryModelSelect",
  props: {
  },
  data () {
    return {
      models: [],
      selected: null
    }
  },
  computed: {
    ...mapState(['currentProject', 'currentDatabase']),
    unique () {
      return [this.currentProject, this.currentDatabase]
    }
  },
  watch: {
    unique () {
      this.fetchModels()
    }
  },
  methods: {
    // 查询模型
    fetchModels () {
      const database = this.currentProject.databases.find(db => db.name === this.currentDatabase)
      if (database == null) {
        this.models = []
        return
      }
      this.models = database.models
    }
  },
  created () {
    this.fetchModels()
  }
}
</script>

<style scoped lang="scss">
.model-select {
  width: 100%;
}
</style>

<style scoped lang="scss">
.model-select__popper {
  .option-content {
    display: flex;
    justify-content: space-between;
  }
}
</style>
