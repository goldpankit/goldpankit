<template>
  <div class="page">
    <div class="page-wrap">
      <div class="input-wrap">
        <el-input v-model="value" placeholder="请输入名称"/>
      </div>
      <ul>
        <li
          v-for="item in records"
          :key="item.label"
        >
          <h4>{{ item.label }}</h4>
          <h3>{{ item.value }}</h3>
          <el-button size="default">复制</el-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      value: 'hello world',
      records: [
        { label: '驼峰命名', value: 'helloWorld' },
        { label: '帕斯卡命名', value: 'HelloWorld' },
        { label: '下划线命名', value: 'hello_world' },
        { label: '中划线命名', value: 'hello-world' },
        { label: '纯小写', value: 'helloworld' },
        { label: '纯大写', value: 'HELLOWORLD' }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  .page-wrap {
    padding: 20px;
  }
  .input-wrap {
    margin-bottom: 20px;
    .el-input {
      font-size: 20px;
    }
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    width: 960px;
    margin: 0 auto;
    li {
      width: 313px;
      height: 150px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 1px solid #eee;
      &:hover {
        box-shadow: 0 0 10px -2px #eee;
      }
      h4 {
        font-weight: normal;
        color: var(--color-gray);
      }
      h3 {
        margin: 15px 0;
        font-size: 20px;
      }
    }
  }
}
</style>
