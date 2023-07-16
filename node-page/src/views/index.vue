<template>
  <div class="page">
    <div class="wrap">
      <div class="line gap-bottom">
        <router-link :to="{ name: 'PublicSpaces' }" class="module public-space">
          <h2>Public Spaces</h2>
          <p>For all technical teams, you can click in to view all the service space, select and open the service space you need.</p>
        </router-link>
        <router-link :to="{ name: 'UserProfile' }" class="module profile">
          <h2>Profile</h2>
        </router-link>
      </div>
      <router-link class="module private-space" :to="{ name: 'UserSpaces' }">
        <h2>Private service spaces</h2>
        <p>Private space only serves you or your team, you can organize technical staff to create and develop your service space for better and more efficient research and development work.</p>
      </router-link>
      <div class="line gap-top">
        <router-link :to="{ name: 'CreateSpace' }" class="module new-space">
          <h2>Create New Space</h2>
          <p>Create a new service space and start a new journey of research and development.</p>
        </router-link>
        <router-link to="#" class="module database">
          <h2>Databases</h2>
          <p>Connect and save your database connection information to help you get the code you want more easily.</p>
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

export default {
  components: {UserProjects}
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
      color: #555;
    }
  }
  // 公共空间
  .public-space h2 {
    color: var(--primary-color-match-2);
  }
  // 私有空间
  .private-space h2 {
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
