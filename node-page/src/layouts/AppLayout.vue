<template>
  <div class="app-layout">
    <header>
      <div class="nav">
        <h1>Gold Pan Kit</h1>
        <div class="buts">
          <el-button>Databases</el-button>
          <el-button>Create Factory</el-button>
          <el-button>Create Template</el-button>
        </div>
      </div>
      <div class="blank"></div>
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
    display: flex;
    flex-shrink: 0;
    height: 260px;
    flex-direction: column;
    .nav {
      background-color: var(--primary-color);
      font-size: var(--font-size-big);
      padding: 10px 30px;
      flex-shrink: 0;
      display: flex;
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
    .blank {
      flex-grow: 1;
      background-color: rgba(224, 224, 224, 1);
    }
  }
  main {

  }
}
</style>
