<template>
  <div class="database-query-models">
    <v-stage
      :config="configKonva"
    >
      <Table
        v-for="(table,index) in tables"
        :key="table.name"
        :x="index * 220 + 50"
        :y="80"
        :table="table"
      />
    </v-stage>
  </div>
</template>

<script>
import Table from "../../../components/database/query-model/Table.vue";

export default {
  name: "database-query-models",
  components: {Table},
  data () {
    return {
      configKonva: {
        // 设计区宽度
        width: 1960,
        // 设计区高度
        height: 1000,
        draggable: true
      },
      tables: [
        {
          name: 'user',
          fields: ['id', 'name', 'create_time']
        },
        {
          name: 'order',
          fields: ['id', 'user_id', 'create_time']
        }
      ]
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style scoped lang="scss">
.database-query-models {
  height: 100%;
}
</style>
