<template>
  <AppLayout class="default-layout">
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
import { mapState} from 'vuex'
import ProjectSelect from "../components/usr/project/ProjectSelect.vue";
import AppLayout from "./AppLayout.vue";
import LoginView from "../components/header/LoginView.vue";
import BaseLayout from "@/layouts/BaseLayout.vue";
import Logo from "@/components/common/Logo.vue";

export default {
  name: 'DefaultLayout',
  extends: BaseLayout,
  components: {Logo, LoginView, AppLayout, ProjectSelect },
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
