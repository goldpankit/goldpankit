<template>
  <div class="translator-setting">
    <div class="toolbar">
      <p>tips: The translator can be configured to quickly translate source code into service code</p>
      <div class="opera">
        <el-button type="primary" @click="add">Add</el-button>
        <el-button type="primary" @click="translate">Translate</el-button>
      </div>
    </div>
    <el-collapse v-if="translators.length > 0" v-model="actives" @change="handleChange">
      <el-collapse-item
        v-for="(item,index) in translators"
        :key="item.id"
        :name="item.id"
      >
        <template #title>
          <div class="title-wrap">
            <div v-if="item.__readonly" class="view">
              <p class="name">{{item.name}}</p>
              <p class="path">{{item.path}}</p>
              <p class="type">{{item.type}}</p>
            </div>
            <div v-else class="edit">
              <el-form :model="item">
                <el-form-item label="Name" required>
                  <el-input class="name" v-model="item.name" @click.stop @keypress.stop @input="handleSave"/>
                </el-form-item>
                <el-form-item label="Path" required>
                  <el-input class="path" v-model="item.path" @click.stop @keypress.stop @input="handleSave"/>
                </el-form-item>
                <el-form-item label="Type" required>
                  <TranslatorTypeSelect class="type" v-model="item.type" @change="handleSave"/>
                </el-form-item>
              </el-form>
            </div>
            <!-- 操作 -->
            <div class="opera">
              <el-button icon="Delete" @click.stop="deleteTranslator(index)">Delete</el-button>
            </div>
          </div>
        </template>
        <!-- 正则翻译 -->
        <template v-if="item.type === 'pattern'">
          <el-form>
            <el-form-item label="Source" required>
              <el-input
                v-model="item.source"
                type="textarea"
                :rows="1"
                @input="handleSave"
              />
            </el-form-item>
            <el-form-item label="Target" required>
              <el-input
                v-model="item.target"
                type="textarea"
                :rows="1"
                @input="handleSave"
              />
            </el-form-item>
          </el-form>
        </template>
        <!-- 编码翻译 -->
        <template v-else-if="item.type === 'code'">
          <p>function translate(filepath, content, fileSetting) {</p>
          <el-input
            v-model="item.code"
            type="textarea"
            :rows="5"
            @input="handleSave"
          />
          <p>}</p>
        </template>
      </el-collapse-item>
    </el-collapse>
    <Empty v-else/>
  </div>
</template>

<script>
import Empty from "../../common/Empty.vue";
import {translate} from "../../../api/service";
import TranslatorTypeSelect from "./TranslatorTypeSelect.vue";

export default {
  name: "TranslatorList",
  components: {TranslatorTypeSelect, Empty},
  props: {
    space: {
      required: true
    },
    service: {
      required: true
    },
    translator: {
      required: true
    }
  },
  data () {
    return {
      actives: [],
      varIndex: 1
    }
  },
  computed: {
    translators () {
      return this.translator.settings
    }
  },
  watch: {
    translators: {
      immediate: true,
      handler () {
        this.translators.forEach(item => {
          item.id = '' + Math.random()
          item.__readonly = true
        })
      }
    }
  },
  methods: {
    // 添加
    add () {
      const id = '' + Math.random()
      this.translator.settings.push({
        id,
        name: this.__generateTranslatorName(),
        type: 'pattern',
        path: '.*',
        source: '',
        target: '',
        code: '  return {filepath: filepath, content: content};',
        __readonly: false
      })
      this.actives.push(id)
    },
    // 删除
    deleteTranslator (index) {
      this.translator.settings.splice(index, 1)
      this.handleSave()
    },
    // 打开/隐藏
    handleChange (actives) {
      for (const item of this.translators) {
        const exists = actives.find(id => id === item.id) != null
        item.__readonly = !exists
      }
    },
    // 处理输入
    handleSave () {
      this.$emit('save')
    },
    // 翻译服务
    translate () {
      translate({
        space: this.space,
        service: this.service
      })
        .then(() => {
          console.log('翻译完成')
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 生成构建名称
    __generateTranslatorName () {
      let buildName
      while(true) {
        buildName = `translator${this.varIndex}`
        this.varIndex ++
        if (this.translators.findIndex(b => b.name === buildName) === -1) {
          return buildName
        }
      }
    }
  },
  created () {
    console.log('translator', this.translator)
      // {
      //   "name": "logback %处理",
      //   "path": ".*logback.xml",
      //   "type": "pattern",
      //   "source": "\\%",
      //   "target": "<#noparse>%</#noparse>",
      //   "code": ""
      // }
  }
}
</script>

<style scoped lang="scss">
.translator-setting {
  width: 100%;
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    & > p {
      flex-grow: 1;
      font-weight: bold;
      line-height: 15px;
    }
    & > .opera {
      flex-shrink: 0;
      width: 150px;
      display: flex;
      justify-content: flex-end;
    }
  }
  .el-collapse {
    border-top: 0;
    .title-wrap {
      width: 100%;
      display: flex;
      align-items: center;
    }
    .view,.edit {
      display: flex;
      :deep(.el-form) {
        display: flex;
        .el-form-item {
          flex-direction: row;
          .name {
            width: 100px;
            .el-input__inner {
              color: var(--primary-color-match-2);
              font-weight: bold;
            }
          }
          .path {
            width: 120px;
          }
        }
      }
      .name {
        width: 100px;
        font-weight: bold;
        color: var(--primary-color-match-2);
        margin-right: 10px;
      }
      .path {
        width: 120px;
        margin-right: 10px;
      }
      .type {
        width: 100px;
      }
    }
    // 操作
    .opera {
      margin-left: 10px;
      display: flex;
      align-items: center;
    }
  }
}
</style>