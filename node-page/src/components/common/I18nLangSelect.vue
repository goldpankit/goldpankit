<template>
  <el-radio-group v-if="!loading" class="i18n" v-model="$i18n.locale" @change="saveLang">
    <el-radio-button label="en">English</el-radio-button>
    <el-radio-button label="zh">简体中文</el-radio-button>
  </el-radio-group>
</template>

<script>

import {fetchLang, saveLang} from "../../api/client";

export default {
  name: "I18nLangSelect",
  data () {
    return {
      loading: true
    }
  },
  methods: {
    fetchLang () {
      this.loading = true
      fetchLang()
        .then(lang => {
          this.$i18n.locale = lang
          window.localStorage.setItem('lang', lang)
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    saveLang (value) {
      saveLang({
        lang: value
      })
        .then(() => {})
        .catch(e => {})
    }
  },
  created () {
    this.fetchLang()
  }
}
</script>

<style scoped lang="scss">

</style>
