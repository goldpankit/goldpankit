<template>
  <div class="tree">
    <el-input placeholder="Filter keyword" />
    <el-tree :data="data"/>
  </div>
</template>

<script>
export default {
  name: "SettingFiles",
  data () {
    return {
      data: [
        {
          label: 'Level one 1',
          children: [
            {
              label: 'Level two 1-1',
              children: [
                {
                  label: 'Level three 1-1-1',
                },
              ],
            },
          ],
        },
        {
          label: 'Level one 2',
          children: [
            {
              label: 'Level two 2-1',
              children: [
                {
                  label: 'Level three 2-1-1',
                },
              ],
            },
            {
              label: 'Level two 2-2',
              children: [
                {
                  label: 'Level three 2-2-1',
                },
              ],
            },
          ],
        }
      ]
    }
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
