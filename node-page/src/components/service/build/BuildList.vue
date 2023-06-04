<template>
  <div class="service-build-list">
    <div class="toolbar">
      <p>tips: The following builds are performed after the service is installed</p>
      <el-button type="primary" @click="create">Create</el-button>
    </div>
    <el-collapse v-if="builds.length > 0" v-model="actives" @change="handleChange">
      <el-collapse-item
        v-for="(build,index) in builds"
        :key="build.id"
        :title="build.type"
        :name="build.id"
      >
        <template #title>
          <div class="title-wrap">
            <div v-if="build.__readonly" class="view">
              <p class="name">{{build.name}}</p>
              <p class="type">{{build.type}}</p>
            </div>
            <div v-else class="edit">
              <el-form :model="build">
                <el-form-item label="Name" required>
                  <el-input class="name" v-model="build.name" @click.stop @keypress.stop @input="handleSave"/>
                </el-form-item>
                <el-form-item label="Type" required>
                  <BuildCommandTypeSelect class="type" v-model="build.type" @change="handleSave"/>
                </el-form-item>
              </el-form>
            </div>
            <!-- 操作 -->
            <div class="opera">
              <el-button icon="Delete" @click.stop="deleteBuild(index)">Delete</el-button>
            </div>
          </div>
        </template>
        <!-- 命令输入 -->
        <el-input
          v-model="build.content"
          type="textarea"
          placeholder="Build command"
          :rows="5"
          @input="handleSave"
        />
      </el-collapse-item>
    </el-collapse>
    <Empty v-else/>
  </div>
</template>

<script>
import { ref } from 'vue'
import BuildCommandTypeSelect from "./BuildCommandTypeSelect.vue";
import Empty from "../../common/Empty.vue";

export default {
  name: "BuildList",
  components: {Empty, BuildCommandTypeSelect},
  props: {
    builds: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      actives: [],
      varIndex: 1
    }
  },
  watch: {
    builds: {
      immediate: true,
      handler () {
        this.builds.forEach(item => {
          item.id = '' + Math.random()
          item.__readonly = true
        })
      }
    }
  },
  methods: {
    // 创建
    create () {
      const id = '' + Math.random()
      this.builds.push({
        id,
        name: this.__generateBuildName(),
        type: 'NODE',
        content: '',
        __readonly: false
      })
      this.actives.push(id)
    },
    // 打开/隐藏
    handleChange (actives) {
      for (const build of this.builds) {
        const exists = actives.find(id => id === build.id) != null
        build.__readonly = !exists
      }
    },
    // 保存
    handleSave () {
      this.$emit('save')
    },
    // 删除
    deleteBuild (index) {
      this.builds.splice(index,1)
      this.handleSave()
    },
    // 生成构建名称
    __generateBuildName () {
      let buildName
      while(true) {
        buildName = `build${this.varIndex}`
        this.varIndex ++
        if (this.builds.findIndex(b => b.name === buildName) === -1) {
          return buildName
        }
      }
    },
  }
}
</script>

<style scoped lang="scss">
.service-build-list {
  width: 100%;
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > p {
      font-weight: bold;
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
            .el-input__inner {
              color: var(--primary-color-match-2);
              font-weight: bold;
            }
          }
        }
      }
      .name {
        width: 150px;
        font-weight: bold;
        color: var(--primary-color-match-2);
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
