<template>
  <AppLayout :header-visible="false">
    <header>
      DevX
      <div class="buts">
        <el-button>Databases</el-button>
        <el-button>Create Factory</el-button>
        <el-button>Create Template</el-button>
      </div>
    </header>
    <main></main>
    <footer>
      <ul>
        <li class="title"><h4>factories</h4></li>
        <li v-for="item of 3" :key="item">
          <h4>Eva for Java</h4>
          <p>eva用于研发管理系统，+目前已超过4000目前已超过4000目前已超过4000目前已超过4000，由devx团队研发和维护</p>
          <span>Java ·SpringBoot·MyBatisPlus·MySQL</span>
          <div class="install">
            <span>last modified by 2023/5/7</span>
            <el-button>Install</el-button>
          </div>
        </li>
      </ul>
    </footer>
  </AppLayout>
</template>

<script>
import WorkspaceLayout from '@/layouts/WorkspaceLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'
export default {
  name: 'list',
  components: { AppLayout, WorkspaceLayout }
}
</script>

<style scoped lang="scss">
header {
  padding: 5px 30px;
  display: flex;
  align-items: center;
  font-size: var(--font-size-big);
  background-color: var(--primary-color);
  .buts {
    width: 100%;
    display: flex;
    justify-content: right;
    button {
      height: 40px;
      border: 0;
      background-color: rgba(99, 245, 88, 1);
      color: var(--font-color);
      &:hover {
        color: var(--font-color);
      }
      &:active {
        color: var(--font-color);
      }
    }
  }
}
main {
  height: 200px;
  background-color: rgba(224, 224, 224, 1);
}
footer {
  box-sizing: border-box;
  background-color: var(--background-color);
  ul {
    width: 830px;
    display: flex;
    flex-wrap: wrap;
    margin: 50px auto 0 auto;
    justify-content: space-between;
    li {
      width: 400px;
      height: 200px;
      padding: 20px 20px 10px 20px;
      box-sizing: border-box;
      background-color: #fff;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 16px;
      p {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      h4 {
        margin: 0;
        padding: 0;
        font-size: 20px;
      }
      &.title {
        width: 100%;
        height: 40px;
        padding: 0;
        line-height: 40px;
        margin: 0;
        background-color: var(--background-color);
        font-size: 20px;
      }
      span {
        color: #747474;
      }
      .install {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        span {
          color: rgba(181, 181, 181, 1);
        }
        button {
          height: 30px;
          width: 100px;
          border-radius: 20px;
          border: 0;
          color: var(--font-color);
          background-color: var(--primary-color);
          &:hover {
            color: var(--font-color);
          }
          &:active {
            color: var(--font-color);
          }
        }
      }

    }
  }
}
</style>
