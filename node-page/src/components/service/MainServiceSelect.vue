<template>
  <el-select class="main-service-select">
    <el-option
      v-for="service in services"
      :key="service.name"
      :value="service.name"
      :label="service.name"
    />
  </el-select>
</template>

<script>
import {fetchList} from "../../api/service";

export default {
  name: "MainServiceSelect",
  props: {
    space: {
      required: true
    }
  },
  data () {
    return {
      services: []
    }
  },
  methods: {
    fetchServices () {
      fetchList({
        space: this.space,
        serviceType: 'MAIN'
      })
        .then(data => {
          this.services = data
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    }
  },
  created () {
    this.fetchServices()
  }
}
</script>

<style scoped lang="scss">
.main-service-select {
  width: 100%;
}
</style>
