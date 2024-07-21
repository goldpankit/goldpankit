<template>
  <div class="service-build-list">
    <div class="toolbar">
      <p v-if="withUnbuild">{{$t('service.settings.build.unBuildTip')}}</p>
      <p v-else>{{$t('service.settings.build.buildTip')}}</p>
      <el-button type="primary" @click="create">{{$t('common.create')}}</el-button>
    </div>
    <template v-if="builds.length > 0">
      <ul
        v-for="(build,index) in builds"
        :key="build.id"
      >
        <li>
          <div class="title-wrap">
            <el-form :model="build">
              <el-form-item label="名称" required>
                <el-input
                  class="name"
                  v-model="build.name"
                  @click.stop
                  @keypress="handleKeypress"
                  @input="handleSave"
                />
              </el-form-item>
              <el-form-item label="类型" class="build-type" required>
                <BuildCommandTypeSelect class="type" v-model="build.type" @change="handleSave"/>
              </el-form-item>
            </el-form>
            <!-- 操作 -->
            <div class="opera">
              <el-button icon="Delete" link type="danger" @click.stop="deleteBuild(index)">{{$t('common.delete')}}</el-button>
            </div>
          </div>
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
        </li>
      </ul>
    </template>
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
    handleKeypress (e) {
      console.log(e.keyCode)
      e.stopPropagation()
    },
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
  & > ul {
    & > li {
      margin-bottom: 20px;
    }
  }
  .title-wrap {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-form {
      display: flex;
      .el-form-item {
        flex-direction: row;
        .name {
          .el-input__inner {
            color: var(--primary-color-match-2);
            font-weight: bold;
          }
        }
        // 构建类型
        &.build-type {
          margin-left: 20px;
          .build-command-type-select {
            width: 120px;
          }
        }
      }
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
</style>
