<template>
  <header>DevX</header>
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
@import "../assets/style/app";
header {
  padding: 10px 30px;
  font-size: $font-size-big;
}
</style>
