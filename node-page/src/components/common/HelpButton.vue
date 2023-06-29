<template>
  <span class="help-button" @click="setHelpCode(code)">
    <el-icon :size="16">
      <QuestionFilled />
    </el-icon>
  </span>
</template>

<script>

import {mapMutations} from "vuex";

export default {
  name: "HelpButton",
  props: {
    code: {
      required: true
    }
  },
  methods: {
    ...mapMutations(['setHelpCode'])
  }
}
</script>

<style scoped lang="scss">
.help-button {
  margin-top: 3px;
  margin-left: 5px;
  color: #999;
  transition: all ease .15s;
  cursor: pointer;
  &:hover {
    color: #333;
  }
}
</style>
