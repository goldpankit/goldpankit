<template>
  <QueryModelView :database-id="databaseId"/>
</template>

<script>
import QueryModelView from '@/components/database/query-model/QueryModelView'
import {mapState} from "vuex";

export default {
  components: { QueryModelView },
  data () {
    return {
      databaseId: null
    }
  },
  computed: {
    ...mapState(['databases'])
  },
  created () {
    // 全局选中当前数据库
    this.databaseId = this.$route.query.db
  }
}
</script>
