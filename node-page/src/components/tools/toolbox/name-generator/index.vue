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
          <el-button size="default" @click="copyText(item.value)">复制</el-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import NameGenerator from './name.generator'
export default {
  data () {
    return {
      developers: ['刘大逵', '天析'],
      value: 'Hello world, I am JaSon, a-b|c_d',
      records: [
        { label: '驼峰命名', value: '' },
        { label: '帕斯卡命名', value: '' },
        { label: '下划线命名', value: '' },
        { label: '中划线命名', value: '' },
        { label: '纯小写', value: '' },
        { label: '纯小写-下划线', value: '' },
        { label: '纯小写-中划线', value: '' },
        { label: '纯大写', value: '' },
        { label: '纯大写-下划线', value: '' },
        { label: '纯大写-中划线', value: '' },
      ]
    }
  },
  watch: {
    value: {
      immediate: true,
      handler () {
        this.rename()
      }
    }
  },
  methods: {
    // 重命名
    rename () {
      this.__getRecord('驼峰命名').value = NameGenerator.toCamelCase(this.value)
      this.__getRecord('帕斯卡命名').value = NameGenerator.toPascalCase(this.value)
      this.__getRecord('下划线命名').value = NameGenerator.toSnakeCase(this.value)
      this.__getRecord('中划线命名').value = NameGenerator.toKebabCase(this.value)
      this.__getRecord('纯小写').value = NameGenerator.toLowerCase(this.value)
      this.__getRecord('纯小写-下划线').value = NameGenerator.toSnakeCase(this.value, false)
      this.__getRecord('纯小写-中划线').value = NameGenerator.toKebabCase(this.value, false)
      this.__getRecord('纯大写').value = NameGenerator.toUpperCase(this.value)
      this.__getRecord('纯大写-下划线').value = NameGenerator.toSnakeCase(this.value, true)
      this.__getRecord('纯大写-中划线').value = NameGenerator.toKebabCase(this.value, true)
    },
    __getRecord (label) {
      return this.records.find(item => item.label === label)
    }
  },
  mounted() {
    this.$emit('on-rendered')
  }
}
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  overflow-y: auto;
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
    width: 960px;
    margin: 0 auto;
    gap: 10px;
    // 3列
    li {
      width: 32%;
      padding: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 1px solid #eee;
      background-color: #fff;
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
        word-break: break-all;
        padding: 0 15px;
      }
    }
  }
}
</style>
