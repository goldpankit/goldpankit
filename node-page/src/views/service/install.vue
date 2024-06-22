<template>
  <div class="page">
    <div v-loading="loading" class="wrap">
      <ServiceInstaller
        v-if="space != null && service != null"
        :space="space.name"
        :service="service.name"
        :service-price="service.price.price"
        :service-lease="service.latestLease"
        :version="service.defaultMajorVersion.version"
        :versions="service.defaultMajorVersion.versions"
        :project-config="project"
        :with-title="true"
        :with-install-button="true"
        @change-project="handleProjectChange"
        @installed="$router.push({name: 'Workbench'})"
      />
    </div>
  </div>
</template>

<script>
import ServiceInstaller from "@/components/space/ServiceInstaller.vue";
import { fetchServiceDetail } from "@/api/service";
import { fetchProfileByName } from "@/api/service.space";
import {fetchById} from "@/api/project";
import {mapState} from "vuex";

export default {
  components: {ServiceInstaller},
  data () {
    return {
      loading: true,
      // 路由信息
      route: {
        space: null,
        service: null,
        majorVersion: null
      },
      space: null,
      service: null,
      // 当前选中的项目
      project: null
    }
  },
  computed: {
    ...mapState(['currentProject'])
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
      this.loading = true
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
        .finally(() => {
          this.loading = false
        })
    },
    // 切换项目
    handleProjectChange (projectId) {
      if (projectId == null || projectId === '') {
        return
      }
      fetchById(projectId)
        .then(data => {
          this.project = data
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
    if (this.currentProject != null) {
      this.handleProjectChange(this.currentProject)
    }
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
