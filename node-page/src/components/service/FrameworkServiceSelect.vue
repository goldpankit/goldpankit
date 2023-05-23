<template>
  <el-select class="framework-service-select">
    <el-option
      v-for="service in services"
      :key="service.name"
      :value="service.id"
      :label="service.name"
    />
  </el-select>
</template>

<script>
import {search} from "../../api/service";

export default {
  name: "FrameworkServiceSelect",
  props: {
    spaceName: {
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
      search({
        spaceName: this.spaceName,
        serviceTypes: ['framework']
      })
        .then(data => {
          this.services = data
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  },
  created () {
    this.fetchServices()
  }
}
</script>

<style scoped lang="scss">
.framework-service-select {
  width: 100%;
}
</style>
