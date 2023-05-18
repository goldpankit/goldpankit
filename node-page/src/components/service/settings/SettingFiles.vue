<template>
  <div class="tree">
    <el-input placeholder="Filter keyword" />
    <el-tree
      :data="files"
      @node-click="$emit('node-click', $event)"
    />
  </div>
</template>

<script>
import {fetchFiles} from "../../../api/service";

export default {
  name: "SettingFiles",
  props: {
    serviceId: {
      required: true
    }
  },
  data () {
    return {
      files: []
    }
  },
  methods: {
    fetchFiles () {
      fetchFiles(this.serviceId)
        .then(data => {
          this.files = data
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  },
  created () {
    this.fetchFiles()
  }
}
</script>

<style scoped lang="scss">
.tree {
  .el-input {
    margin-bottom: 5px;
  }
}
</style>
