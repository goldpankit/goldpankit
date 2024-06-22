<template>
  <QueryModelView :project-id="projectId" :database-id="databaseId"/>
</template>

<script>
import QueryModelView from '@/components/database/query-model/QueryModelView'

export default {
  components: { QueryModelView },
  data () {
    return {
      projectId: null,
      databaseId: null
    }
  },
  created () {
    this.projectId = this.$route.query.pid
    this.databaseId = this.$route.query.did
  }
}
</script>
