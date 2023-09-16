<template>
  <div class="page">
    <div class="wrap">
      <ServiceInstaller
        v-if="space != null && service != null"
        :space="space.name"
        :service="service.name"
        :service-price="service.price.price"
        :service-lease="service.latestLease"
        :version="service.defaultMajorVersion.version"
        :with-title="true"
        :with-install-button="true"
        @installed="$router.push({name: 'Workbench'})"
      />
    </div>
  </div>
</template>

<script>
import ServiceInstaller from "@/components/space/ServiceInstaller.vue";
import { fetchServiceDetail } from "@/api/service";
import { fetchProfileByName } from "@/api/service.space";

export default {
  components: {ServiceInstaller},
  data () {
    return {
      // 路由信息
      route: {
        space: null,
        service: null,
        majorVersion: null
      },
      space: null,
      service: null
    }
  },
  methods: {
    // 查询空间
    fetchSpace() {
      fetchProfileByName(this.$route.params.spaceName)
        .then(data => {
          this.space = data
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 查询服务信息
    fetchService () {
      fetchServiceDetail({
        space: this.route.space,
        service: this.route.service,
        majorVersion: this.route.majorVersion
      })
        .then(data => {
          this.service = data
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    }
  },
  created () {
    this.route.space = this.$route.params.spaceName
    this.route.service = this.$route.params.serviceName
    this.route.majorVersion = this.$route.query.major
    this.fetchSpace()
    this.fetchService()
  }
}
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  overflow-y: auto;
  .wrap {
    min-height: 100%;
    width: var(--page-width);
    margin: 0 auto 100px auto;
    background: var(--color-light);
    padding: var(--gap-page-padding);
    box-sizing: border-box;
    border-radius: var(--radius-page);
    box-shadow: var(--page-shadow);
  }
}
</style>
