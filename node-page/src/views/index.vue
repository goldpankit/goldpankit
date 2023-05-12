<template>
  <div class="page">
    <div class="wrap">
      <div class="line gap-bottom">
        <router-link :to="{ name: 'PublicSpaces' }" class="module public-space">
          <h2>Public Spaces</h2>
          <p>For all technical teams, you can click in to view all the service space, select and open the service space you need.</p>
        </router-link>
        <router-link to="#" class="module profile">
          <h2>Profile</h2>
        </router-link>
      </div>
      <router-link class="module private-space" :to="{ name: 'UserSpaces' }">
        <h2>Purchased or private service spaces</h2>
        <p>Private space only serves you or your team, you can organize technical staff to create and develop your service space for better and more efficient research and development work.</p>
      </router-link>
      <div class="line gap-top">
        <router-link :to="{ name: 'CreateSpace' }" class="module new-space">
          <h2>Create New Space</h2>
          <p>Create a new service space and start a new journey of research and development.</p>
        </router-link>
        <router-link to="#" class="module database">
          <h2>Database</h2>
          <p>Connect and save your database connection information to help you get the code you want more easily.</p>
        </router-link>
      </div>
      <div class="project-wrap">
        <div class="title">
          <h2>My Projects</h2>
          <el-button type="reverse" @click="$router.push({ name: 'CreateProject' })">
            <el-icon :size="20"><Plus /></el-icon>
          </el-button>
        </div>
        <ul>
          <li v-for="i in 5">
            <div class="avatar">Q</div>
            <div class="info">
              <h3>quanzhi</h3>
              <p>/Users/Caesar/orders/quanzhi/codespace/quanzhi-server</p>
              <p class="color-info-1">3 databases</p>
            </div>
            <div class="opera">
              <el-button>Use It</el-button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
    background: #fff;
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
      color: #555;
    }
  }
  // 公共空间
  .public-space h2 {
    color: var(--primary-color-match-2);
  }
  // 私有空间
  .private-space h2 {
    font-size: 30px;
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
    background: #fff;
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
        color: #fff;
        margin-right: 20px;
      }
      .info {
        flex-grow: 1;
        h3 {
          margin-bottom: 15px;
        }
        p {
          margin-top: 5px;
        }
      }
      .opera {
        flex-shrink: 0;
        width: 80px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
