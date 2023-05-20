<template>
  <div class="tree">
    <el-tree
      :data="variables"
      @node-click="$emit('node-click', $event)"
    />
  </div>
</template>

<script>
import {fetchFiles} from "../../../api/service";

export default {
  name: "SettingVariables",
  props: {
    serviceId: {
      required: true
    }
  },
  data () {
    return {
      variables: [
        {
          label: '路由方式',
          children: [
            { label: 'Hash' },
            { label: 'History' },
          ]
        }
      ]
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
