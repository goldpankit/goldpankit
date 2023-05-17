<template>
  <div class="tree">
    <el-input placeholder="Filter keyword" />
    <el-tree :data="files" :transition="false"/>
  </div>
</template>

<script>
import {getFiles} from "../../../api/service";

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
    getFiles () {
      getFiles(this.serviceId)
        .then(data => {
          this.files = data
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  },
  created () {
    this.getFiles()
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
