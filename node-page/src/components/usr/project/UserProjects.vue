<template>
  <div class="user-projects">
    <div class="title">
      <h2>{{ $t('project.myProjects') }}</h2>
      <el-button type="primary" @click="$refs.operaProjectWindow.open()">
        <el-icon :size="14" style="margin-right: 5px;"><Plus /></el-icon>
        {{ $t('project.createProject') }}
      </el-button>
    </div>
    <ul v-if="projects.length > 0">
      <li v-for="project in projects" :key="project.id">
        <div class="avatar">{{project.name.substring(0,1)}}</div>
        <div class="info">
          <h3>{{project.name}}</h3>
          <p>{{project.codespace}}</p>
          <p>{{project.remark}}</p>
        </div>
        <div class="opera">
          <el-button type="primary" size="small" @click="$router.push({ name: 'Databases', params: { projectId: project.id } })">数据库</el-button>
          <el-button size="small" icon="Edit" @click="editProject(project)">{{$t('common.edit')}}</el-button>
          <el-button type="danger" text @click="deleteProject(project)">{{$t('common.delete')}}</el-button>
        </div>
      </li>
    </ul>
    <Empty v-else :description="$t('project.noProjects')"/>
    <OperaProjectWindow ref="operaProjectWindow" @success="search"/>
  </div>
</template>

<script>
import Empty from '@/components/common/Empty'
import OperaProjectWindow from './OperaProjectWindow'
import { deleteProject, search } from '@/api/project'

export default {
  name: 'UserProjects',
  components: {
    OperaProjectWindow, Empty
  },
  data () {
    return {
      projects: []
    }
  },
  methods: {
    search () {
      search()
        .then(data => {
          this.projects = data
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 编辑项目
    editProject (project) {
      this.$refs.operaProjectWindow.open(project)
    },
    // 删除项目
    deleteProject (project) {
      this.deleteConfirm(this.$t('project.deleteTip', {value: `「${project.name}」`}))
        .then(() => {
          deleteProject(project.id)
            .then(() => {
              this.search()
            })
            .catch(e => {
              this.$tip.apiFailed(e)
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
      top: 6px;
      right: 5px;
      .el-button {
        margin-left: 10px;
      }
    }
  }
}
</style>
