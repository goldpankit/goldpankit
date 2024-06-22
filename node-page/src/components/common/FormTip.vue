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
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 20px;
  :deep(em) {
    border-radius: 5px;
    font-style: normal;
    font-weight: bold;
    margin: 0 5px;
    color: var(--primary-color-match-2);
  }
}
</style>
