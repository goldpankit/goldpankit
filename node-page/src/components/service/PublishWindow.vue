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
    <el-form ref="form" :model="form" :rules="getRules()">
      <el-form-item :label="$t('service.versionNumber')" prop="version" required>
        <el-input v-model="form.version" @input="saveConfig">
          <template #prefix>v</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('service.versionDescription')" prop="publishDescription" required>
        <el-input type="textarea" :rows="5" v-model="form.publishDescription" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">Cancel</el-button>
        <el-button type="primary" :disabled="isWorking" @click="publish">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {fetchConfig, saveConfig} from "../../api/service";
import {publish} from "../../api/service.version";
import {checkVersionNumber} from "../../utils/form.check";

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
    getRules () {
      return {
        version: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('service.versionNumber') })},
          { validator: checkVersionNumber, message: this.$t('form.isIncorrect', { field: this.$t('service.versionNumber') }) }
        ],
        publishDescription: [
          { required: true, message: this.$t('form.isRequired', { value: this.$t('service.versionDescription') })}
        ]
      }
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
          this.$tip.apiFailed(e)
        })
    },
    // 保存配置
    saveConfig () {
      this.$refs.form.validate()
        .then(() => {
          saveConfig({
            space: this.space,
            service: this.service,
            version: this.form.version
          })
            .catch(e => {
              this.$tip.apiFailed(e)
            })
        })
        .catch(() => {})
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
          this.$tip.apiFailed(e)
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
