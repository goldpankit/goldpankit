<template>
  <main>
    <el-button type="primary" @click="test">测试接口</el-button>
  </main>
</template>

<script>
import { test } from '@/api/test'

export default {
  methods: {
    test () {
      test()
        .then(data => {
          console.log('data', data)
        })
        .catch(e => {
          console.error(e)
        })
    }
  }
}
</script>
