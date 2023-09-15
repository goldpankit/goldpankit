<template>
  <AppLayout class="default-layout">
    <header>
      <div class="logo-wrap" @click="$router.push({ name: 'PublicServices' })">
        <h1>Gold Pan Kit</h1>
        <div class="decoration">
          <em></em>
          <em></em>
        </div>
      </div>
      <ul class="opera">
        <li>
          <LoginView/>
        </li>
      </ul>
    </header>
    <main>
      <router-view/>
    </main>
  </AppLayout>
</template>

<script>
import { mapState} from 'vuex'
import ProjectSelect from "../components/usr/project/ProjectSelect.vue";
import AppLayout from "./AppLayout.vue";
import LoginView from "../components/header/LoginView.vue";

export default {
  name: 'DefaultLayout',
  components: {LoginView, AppLayout, ProjectSelect },
  computed: {
    ...mapState(['userInfo'])
  }
}
</script>

<style scoped lang="scss">
.default-layout {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
header {
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
  padding: 10px 30px;
  .logo-wrap {
    cursor: pointer;
    width: 160px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h1 {
      font-size: var(--font-size-large);
      font-style: italic;
      display: inline-block;
      position: relative;
      padding: 0 10px;
    }
    .decoration {
      width: 160px;
      height: 15px;
      background-color: var(--primary-color);
      border: 1px solid var(--primary-color);
      display: flex;
      justify-content: space-between;
      em {
        width: 80px;
        height: 100%;
        //border: 1px solid var(--primary-color);
        background-color: var(--primary-color-match-1);
        box-sizing: border-box;
        &:first-of-type {
          width: 10px;
        }
      }
    }
  }
  .opera {
    display: flex;
    li {
      margin-left: 10px;
      display: flex;
      align-items: center;
    }
  }
}
main {
  flex-grow: 1;
  overflow: hidden;
}
</style>
<style lang="scss">
.select-project-popover,.select-database-popover {
  width: 600px !important;
  max-height: 90%;
  overflow-y: auto;
  overflow-x: hidden;
  .user-projects {
    padding: 15px;
  }
}
.select-database-popover {
  width: 300px !important;
}
</style>
