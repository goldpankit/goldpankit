<template>
  <div class="user-projects">
    <div class="title">
      <h2>My Projects</h2>
      <el-button type="primary" @click="$router.push({ name: 'CreateProject' })">
        <el-icon :size="20"><Plus /></el-icon>
      </el-button>
    </div>
    <ul>
      <li v-for="project in projects">
        <div class="avatar">{{project.name.substring(0,1)}}</div>
        <div class="info">
          <h3>{{project.name}}</h3>
          <p>{{project.codespace}}</p>
          <p class="text-info-1">{{project.databases.length}} databases</p>
        </div>
        <div class="opera">
          <el-button @click="$router.push({ name: 'ProjectDatabases', query: { project_id: project.id } })">Databases</el-button>
          <el-button @click="setCurrentProject(project)">Use It</el-button>
          <el-button type="danger" text @click="deleteProject(project)">Delete</el-button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import {deleteProject, search} from "../../../api/user.project";

export default {
  name: "UserProjects",
  data () {
    return {
      projects: []
    }
  },
  methods: {
    ...mapMutations(['setCurrentProject']),
    search () {
      search()
        .then(data => {
          this.projects = data
        })
        .catch(e => {
          console.log('e')
        })
    },
    // 删除项目
    deleteProject (project) {
      const index = this.projects.find(p => p === project)
      this.$model.deleteConfirm(`Do you want to delete the project named 「${project.name}」 ?`)
        .then(() => {
          deleteProject(project.id)
            .then(() => {
              console.log('删除成功')
              this.search()
            })
            .catch(e => {
              console.log('删除失败', e)
            })
        })
        .catch(() => {})
    }
  },
  created () {
    this.search()
  }
}
</script>

<style scoped lang="scss">
// 我的项目
.user-projects {
  background: var(--color-light);
  padding: 30px;
  .title {
    display: flex;
    justify-content: space-between;
    padding-bottom: 15px;
    .el-button {
      padding: 0;
      width: 40px;
      height: 40px;
    }
  }
  li {
    padding: 15px 0;
    display: flex;
    border-top: 1px solid var(--border-default-color);
    position: relative;
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
      h3 {
        margin-bottom: 15px;
      }
      p {
        margin-top: 5px;
        &:first-of-type {
          margin-top: 10px;
        }
      }
    }
    .opera {
      position: absolute;
      top: 10px;
      right: 5px;
    }
  }
}
</style>
