<template>
  <header>Gold Pan Kit</header>
  <main>
    <router-view/>
  </main>
</template>

<script>
export default {
  name: 'WorkspaceLayout'
}
</script>

<style scoped lang="scss">
header {
  padding: 10px 30px;
  font-size: var(--font-size-big);
}
</style>
