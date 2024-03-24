<template>
  <AppLayout class="workbench-layout">
    <header>
      <Logo/>
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
import {mapMutations, mapState} from 'vuex'
import DataSourceSelect from "../components/database/DataSourceSelect.vue";
import ProjectSelect from "../components/usr/project/ProjectSelect.vue";
import AppLayout from "./AppLayout.vue";
import LoginView from "../components/header/LoginView.vue";
import BaseLayout from "./BaseLayout.vue";
import Logo from "@/components/common/Logo.vue";

export default {
  name: 'WorkbenchLayout',
  extends: BaseLayout,
  components: {Logo, LoginView, AppLayout, ProjectSelect, DataSourceSelect },
  computed: {
    ...mapState(['currentDatabase', 'userInfo'])
  },
  methods: {
    ...mapMutations(['setCurrentProject', 'setCurrentDatabase'])
  }
}
</script>

<style scoped lang="scss">
.workbench-layout {
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
    .bean-wrap {
      margin-left: 30px;
      margin-right: 30px;
      cursor: pointer;
      img {
        width: 20px;
      }
      em {
        font-style: normal;
        font-weight: bold;
        margin-left: 2px;
      }
    }
  }
}
main {
  flex-grow: 1;
  overflow: hidden;
}
</style>
