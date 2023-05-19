<template>
  <div class="default-layout">
    <header>
      <div class="logo-wrap" @click="$router.push({ name: 'Index' })">
        <h1>Gold Pan Kit</h1>
        <div class="decoration">
          <em></em>
          <em></em>
        </div>
      </div>
      <ul class="opera">
        <li>
          <el-popover placement="right" :width="600" trigger="click" popper-class="select-project-popover">
            <template #reference>
              <el-button type="reverse">{{ currentProject == null ? 'Select Project' : 'Current project: ' + currentProject.name }}</el-button>
            </template>
            <UserProjects/>
          </el-popover>
        </li>
      </ul>
    </header>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UserProjects from "../components/usr/project/UserProjects.vue";

export default {
  name: 'DefaultLayout',
  components: {UserProjects},
  computed: {
    ...mapState(['currentProject'])
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
  }
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
    background-color: var(--primary-color-match-1);
    display: flex;
    justify-content: space-between;
    em {
      width: 80px;
      height: 100%;
      border: 1px solid var(--primary-color-match-1);
      background-color: var(--primary-color);
      box-sizing: border-box;
      &:first-of-type {
        width: 10px;
      }
    }
  }
}
main {
  flex-grow: 1;
  overflow: hidden;
}
</style>
<style lang="scss">
.select-project-popover {
  .user-projects {
    padding: 15px;
  }
}
</style>
