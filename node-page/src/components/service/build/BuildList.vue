<template>
  <div class="service-build-list">
    <div class="toolbar">
      <p v-if="withUnbuild">{{$t('service.settings.build.unBuildTip')}}</p>
      <p v-else>{{$t('service.settings.build.buildTip')}}</p>
      <el-button type="primary" @click="create">{{$t('common.create')}}</el-button>
    </div>
    <el-collapse v-if="builds.length > 0" v-model="actives" @change="handleChange">
      <el-collapse-item
        v-for="(build,index) in builds"
        :key="build.id"
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
                <el-form-item :label="$t('common.name')" required>
                  <el-input class="name" v-model="build.name" @click.stop @keypress.stop @input="handleSave"/>
                </el-form-item>
                <el-form-item :label="$t('common.type')" required>
                  <BuildCommandTypeSelect class="type" v-model="build.type" @change="handleSave"/>
                </el-form-item>
              </el-form>
            </div>
            <!-- 操作 -->
            <div class="opera">
              <el-button icon="Delete" @click.stop="deleteBuild(index)">{{$t('common.delete')}}</el-button>
            </div>
          </div>
        </template>
        <!-- 命令输入 -->
        <el-tabs v-model="build.contentType">
          <el-tab-pane name="string" :label="$t('service.settings.build.input')">
            <el-input
              v-model="build.content"
              type="textarea"
              :placeholder="$t('service.settings.build.buildCommand')"
              :rows="5"
              @input="handleSave"
            />
          </el-tab-pane>
          <el-tab-pane name="file" :label="$t('service.settings.build.file')">
            <div class="select-holder" @click="openSelectFileWindow(build)">
              <p v-if="build.__filepath == null || build.__filepath === ''" class="holder">{{$t('common.clickToSelectFile')}}</p>
              <p v-else>{{build.__filepath}}</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-collapse-item>
    </el-collapse>
    <Empty v-else/>
    <!-- 服务文件选择 -->
    <ServiceFileSelectWindow
      ref="serviceFileSelectWindow"
      :service-config="serviceConfig"
      @change="handleFileChange"
    />
  </div>
</template>

<script>
import BuildCommandTypeSelect from "./BuildCommandTypeSelect.vue";
import Empty from "../../common/Empty.vue";
import DirectorySelect from "../../common/DirectorySelect.vue";
import ServiceFileSelectWindow from "../../common/ServiceFileSelectWindow.vue";

export default {
  name: "BuildList",
  components: {ServiceFileSelectWindow, DirectorySelect, Empty, BuildCommandTypeSelect},
  props: {
    builds: {
      required: true,
      type: Array
    },
    withUnbuild: {
      default: false
    },
    serviceConfig: {
      required: true
    }
  },
  data () {
    return {
      actives: [],
      varIndex: 1,
      // 选择文件数据
      selectFileData: {
        currentBuild: null
      }
    }
  },
  watch: {
    builds: {
      immediate: true,
      handler () {
        this.__handleBuildList('builds')
      }
    },
    unbuilds: {
      immediate: true,
      handler () {
        this.__handleBuildList('unbuilds')
      }
    },
  },
  methods: {
    handleFileChange (value) {
      this.selectFileData.currentBuild.__filepath = value
      this.handleSave()
    },
    // 创建
    create () {
      const id = '' + Math.random()
      this.builds.push({
        id,
        name: this.__generateBuildName(),
        type: 'Node',
        contentType: 'string',
        content: '',
        __readonly: false,
        __filepath: ''
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
    // 打开选择文件窗口
    openSelectFileWindow(build) {
      this.selectFileData.currentBuild = build
      this.$refs.serviceFileSelectWindow.open()
    },
    // 生成构建名称
    __generateBuildName () {
      let buildName
      while(true) {
        buildName = `${this.withUnbuild ? 'un' : ''}build${this.varIndex}`
        this.varIndex ++
        if (this.builds.findIndex(b => b.name === buildName) === -1) {
          return buildName
        }
      }
    },
    // 处理build数据
    __handleBuildList(buildType) {
      if (this[buildType] == null) {
        return
      }
      this[buildType].forEach(item => {
        item.id = '' + Math.random()
        if (item.contentType === 'file') {
          item.__filepath = item.content
          item.content = ''
        }
        item.__readonly = true
      })
    }
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
    // 选择文件空提示
    .select-holder {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80px;
      cursor: pointer;
      .holder {
        font-size: var(--font-size-middle);
        color: var(--color-gray);
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
