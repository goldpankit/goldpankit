<template>
  <div class="page">
    <div class="wrap">
      <div class="line">
        <router-link :to="{ name: 'PublicServices' }" class="module public-space">
          <h2>{{$t('service.publicServices')}}</h2>
          <p>{{$t('service.publicServiceIntroduce')}}</p>
        </router-link>
        <a @click="toUserProfile" class="module profile">
          <h2 v-if="userInfo == null">{{$t('user.account')}}</h2>
          <h2 v-else>{{userInfo.username}}</h2>
          <ul v-if="userInfo != null">
            <li><el-button @click.stop="$router.push({ name: 'UserProfile' })" icon="UserFilled">{{$t('user.profile')}}</el-button></li>
            <li><el-button @click.stop="doLogout" :disabled="logoutData.isWorking">{{$t('user.logout')}}</el-button></li>
          </ul>
        </a>
      </div>
      <div class="line gap-top">
        <router-link class="module private-services" :to="{ name: 'UserServices' }">
          <h2>{{$t('user.leasedAndPrivateServices')}}</h2>
          <p>{{$t('user.leasedAndPrivateServiceIntroduce')}}</p>
        </router-link>
        <router-link class="module workbench" :to="{ name: 'Workbench' }">
          <h2>{{$t('space.workbench')}}</h2>
          <p>{{$t('space.workbenchIntroduce')}}</p>
        </router-link>
      </div>
      <div class="line gap-top">
        <router-link :to="{ name: 'CreateSpace' }" class="module new-space">
          <h2>{{$t('space.createNewSpace')}}</h2>
          <p>{{$t('space.createNewSpaceIntroduce')}}</p>
        </router-link>
        <router-link :to="{ name: 'Databases' }" class="module database">
          <h2>{{$t('database.databases')}}</h2>
          <p>{{$t('database.databaseIntroduce')}}</p>
        </router-link>
      </div>
      <div class="project-wrap">
        <UserProjects/>
      </div>
    </div>
  </div>
</template>

<script>
import UserProjects from "../components/usr/project/UserProjects.vue";
import {mapActions, mapState} from "vuex";

export default {
  components: {UserProjects},
  data () {
    return {
      logoutData: {
        isWorking: false
      }
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(['logout']),
    // 跳转到个人中心
    toUserProfile () {
      if (this.userInfo == null) {
        this.$router.push({ name: 'SignIn' })
        return
      }
      //this.$router.push({ name: 'UserProfile' })
    },
    // 退出登录
    doLogout () {
      if (this.logoutData.isWorking) {
        return
      }
      this.logoutData.isWorking = true
      this.logout()
        .then(() => {
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.logoutData.isWorking = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  overflow-y: auto;
  padding-bottom: var(--gap-page-bottom);
  .wrap {
    width: 780px;
    margin: 0 auto;
  }
  .line {
    display: flex;
    .module {
      flex-grow: 1;
      margin-right: 20px;
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
  .module {
    display: block;
    background: var(--color-light);
    padding: 25px;
    box-sizing: border-box;
    transition: all ease .15s;
    cursor: pointer;
    text-decoration: none;
    color: var(--font-color);
    &:hover {
      box-shadow: 0 0 10px -5px #999;
      transform: scale(1.01);
    }
    h2 {
      font-size: 45px;
      font-weight: normal;
      transition: all ease .15s;
    }
    p {
      font-size: var(--font-size-middle);
      line-height: 1.5;
      margin-top: 20px;
    }
  }
  // 个人设置
  .profile {
    width: 255px;
    flex-shrink: 0;
    h2 {
      font-size: 35px;
      color: #555;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis
    }
    ul {
      display: flex;
      margin-top: 10px;
      li {
        margin-right: 10px;
        &:nth-of-type(1) .el-button {
          background: #cfe4ff;
        }
        &:nth-of-type(2) .el-button {
          background: #ffcfec;
        }
        .el-button {
          border: 0 !important;
        }
      }
    }
  }
  // 公共空间
  .public-space h2 {
    color: var(--primary-color-match-2);
  }
  // 私有服务
  .private-services {
    width: 400px;
    flex-shrink: 0;
    h2 {
      font-size: 35px;
    }
  }
  // 工作台
  .workbench h2 {
    color: var(--primary-color-match-3);
  }
  // 创建新空间
  .new-space {
    width: 380px;
    flex-shrink: 0;
    h2 {
      font-size: 35px;
      color: #1861ff;
    }
  }
  // 数据库
  .database h2 {
    color: #ff188c;
  }
  .gap-top {
    margin-top: 20px;
  }
  .gap-bottom {
    margin-bottom: 20px;
  }
  // 我的项目
  .project-wrap {
    margin-top: 20px;
  }
}
</style>
