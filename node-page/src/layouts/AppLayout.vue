<template>
  <div>
    <header v-if="headerVisible">DevX</header>
    <main>
      <slot></slot>
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
  header {
    padding: 10px 30px;
    font-size: var(--font-size-big);
    display: flex;
  }
</style>
