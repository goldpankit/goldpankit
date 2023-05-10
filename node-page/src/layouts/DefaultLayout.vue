<template>
  <div class="default-layout">
    <header>Gold Pan Kit</header>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
export default {
  name: 'WorkspaceLayout'
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
  font-size: var(--font-size-big);
}
main {
  flex-grow: 1;
  overflow: hidden;
}
</style>
