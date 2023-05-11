<template>
  <div class="app-layout">
    <header>
      <h1>Gold Pan Kit</h1>
      <div class="buts">
<!--        <el-button>Databases</el-button>-->
<!--        <el-button>Create Factory</el-button>-->
<!--        <el-button>Create Template</el-button>-->
      </div>
    </header>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AppLayout',
  props: {
    headerVisible: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
.app-layout {
  display: flex;
  flex-direction: column;
  header {
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    background-color: var(--primary-color);
    font-size: var(--font-size-big);
    padding: 0 30px;
    h1 {
      font-size: var(--font-size-large);
      flex-shrink: 0;
    }
    .buts {
      flex-grow: 1;
      display: flex;
      justify-content: right;
      button {
        border: 0;
        background-color: rgba(99, 245, 88, 1);
      }
    }
  }
  main {

  }
}
</style>
