<template>
  <el-dialog
    v-model="visible"
    class="publish-window"
    title="Publish version"
    width="500px"
    draggable
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form :model="form">
      <el-form-item label="Version" required>
        <el-input v-model="form.version" @input="saveConfig"/>
      </el-form-item>
      <el-form-item label="Description" required>
        <el-input type="textarea" :rows="5" v-model="form.publishDescription" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">Cancel</el-button>
        <el-button type="primary" @click="publish">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {fetchConfig, publish, saveConfig} from "../../api/service";

export default {
  name: "PublishWindow",
  data () {
    return {
      visible: false,
      isWorking: false,
      space: null,
      service: null,
      form: {
        version: '',
        publishDescription: ''
      }
    }
  },
  methods: {
    open (space, service) {
      this.space = space
      this.service = service
      this.visible = true
      this.fetchConfig()
    },
    // 获取版本配置
    fetchConfig () {
      fetchConfig({
        space: this.space,
        service: this.service
      })
        .then(config => {
          this.form.version = config.version
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 保存配置
    saveConfig () {
      saveConfig({
        space: this.space,
        service: this.service,
        version: this.form.version
      })
        .catch(e => {
          console.log('e', e)
        })
    },
    // 发布
    publish () {
      if (this.isWorking) {
        return
      }
      this.isWorking = true
      publish({
        space: this.space,
        service: this.service,
        publishDescription: this.form.publishDescription
      })
        .then(() => {
          this.visible = false
        })
        .catch(e => {
          console.log('e', e)
        })
        .finally(() => {
          this.isWorking = false
        })
    }
  }
}
</script>

<style lang="scss">
</style>
