<template>
  <QueryModelView :database-id="databaseId"/>
</template>

<script>
import { mapMutations } from 'vuex'
import QueryModelView from '@/components/database/query-model/QueryModelView'
import { fetchById } from '@/api/project'

export default {
  components: { QueryModelView },
  data () {
    return {
      databaseId: null
    }
  },
  methods: {
    ...mapMutations(['setCurrentProject', 'setCurrentProjectDetail', 'setCurrentDatabase']),
  },
  created () {
    fetchById(this.$route.query.project)
      .then(project => {
        this.setCurrentProject(project.id)
        this.setCurrentProjectDetail(project)
        this.setCurrentDatabase(this.$route.query.db)
      })
      .catch(() => {
        this.$tip.apiFailed('找不到项目信息！')
        this.$router.push({ name: 'Desktop' })
      })
  }
}
</script>
