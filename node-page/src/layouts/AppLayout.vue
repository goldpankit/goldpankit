<template>
  <div class="app-layout">
    <slot></slot>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: 'AppLayout',
  props: {
    headerVisible: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    ...mapActions(['initToken'])
  },
  created () {
    this.initToken()
      .catch(e => {
        this.$tip.apiFailed(e)
      })
  }
}
</script>

<style scoped lang="scss">
.app-layout {
  display: flex;
  flex-direction: column;
  :deep(main) {
    position: relative;
  }
}
</style>
