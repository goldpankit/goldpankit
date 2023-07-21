<template>
  <div class="project-databases">
    <div class="title">
      <h2>Databases</h2>
      <el-button type="primary" @click="$router.push({ name: 'Databases' })">
        <el-icon :size="20"><Plus /></el-icon>
      </el-button>
    </div>
    <ul>
      <li v-for="database in databases">
        <div class="info">
          <h3>{{database.name}}</h3>
          <p class="text-info-1 text-mini">{{database.type}}</p>
        </div>
        <div class="opera">
          <el-button @click="setCurrentDatabase(database.name)">Use It</el-button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import {search} from "../../../api/database";

export default {
  name: "ProjectDatabasesSelect",
  data () {
    return {
      databases: [],
      pagination: {
        pageIndex: 1,
        capacity: 1000,
        total: 0
      }
    }
  },
  computed: {
    ...mapState(['currentProject', 'currentDatabase'])
  },
  methods: {
    ...mapMutations(['setCurrentDatabase']),
    // 查询数据库集
    fetchDatabases () {
      search (this.pagination)
        .then(data => {
          this.databases = data.records
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
  },
  created () {
    this.fetchDatabases()
  }
}
</script>

<style scoped lang="scss">
// 我的项目
.project-databases {
  background: var(--color-light);
  padding: 30px;
  .title {
    display: flex;
    justify-content: space-between;
    padding-bottom: 15px;
    .el-button {
      flex-shrink: 0;
      padding: 0;
      width: 40px;
      height: 40px;
    }
  }
  li {
    padding: 15px 0;
    display: flex;
    border-top: 1px solid var(--border-default-color);
    .avatar {
      flex-shrink: 0;
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--primary-color-match-2);
      font-size: 35px;
      font-weight: bold;
      border-radius: 10px;
      color: var(--color-light);
      margin-right: 20px;
      text-transform: uppercase;
    }
    .info {
      flex-grow: 1;
      //h3 {
      //  margin-bottom: 5px;
      //}
    }
    .opera {
      flex-shrink: 0;
      width: 100px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
