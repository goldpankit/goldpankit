<template>
  <div class="page">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="密码长度" prop="length" required>
        <el-input-number :min="4" :max="30" v-model="form.length" :controls="false"/>
      </el-form-item>
      <el-form-item label="生成规则" prop="rules" required>
        <el-checkbox-group v-model="form.rules">
          <el-checkbox value="lowercase">小写字母</el-checkbox>
          <el-checkbox value="uppercase">大写字母</el-checkbox>
          <el-checkbox value="numbers">数字</el-checkbox>
          <el-checkbox value="special">特殊字符</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="排除字符">
        <el-input v-model="form.excludeLetters"/>
      </el-form-item>
      <el-form-item label="生成结果">
        <el-input v-model="form.result"/>
      </el-form-item>
      <div class="opera">
        <el-button type="primary" size="default" @click="generate">立即生成</el-button>
        <el-button type="primary" size="default">复制</el-button>
        <el-button type="danger" size="default">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import PasswordGenerator from './password.generator'

export default {
  data () {
    return {
      developers: ['刘大逵', '天析'],
      form: {
        length: 8,
        rules: ['lowercase', 'uppercase', 'numbers', 'special'],
        excludeLetters: '1lI0oO',
        result: ''
      },
      rules: {
        length: [
          { required: true, message: '请输入密码长度' },
          { type: 'number', message: '长度必须为数字值' },
          {
            validator: (rule, value, callback) => {
              if (value >= 4 && value <= 30) {
                return callback()
              }
              callback(new Error('密码长度在4到30位之间'))
            }
          }
        ],
        rules: [
          { required: true, message: '请选择生成规则' }
        ]
      }
    }
  },
  methods: {
    generate () {
      this.$refs.form.validate((pass) => {
        if (!pass) {
          return
        }
        this.form.result = PasswordGenerator.generatePassword(this.form.length, this.form.rules, this.form.excludeLetters)
      })
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
  display: flex;
  justify-content: center;
  padding: 100px 0;
  overflow-y: auto;
  .el-form {
    width: 500px;
    height: 500px;
    border: 1px solid #eee;
    padding: 30px;
    background-color: #fff;
    :deep(.el-input-number) {
      width: 100%;
      .el-input__inner {
        text-align: left;
      }
    }
    .opera {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
