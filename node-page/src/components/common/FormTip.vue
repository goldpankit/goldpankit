<template>
  <section class="form-tip">
    <slot></slot>
  </section>
</template>

<script>

export default {
  name: "FormTip"
}
</script>

<style scoped lang="scss">
.form-tip {
  padding: 20px;
  background: var(--background-color-tip);
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  :deep(em) {
    background: rgba(0, 0, 0, .1);
    padding: 3px 5px;
    border-radius: 5px;
    font-style: normal;
    font-weight: bold;
    margin: 0 5px;
  }
}
</style>
