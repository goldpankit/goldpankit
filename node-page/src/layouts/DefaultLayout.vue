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
    </header>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout'
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
