<template>
  <div class="app-layout">
    <slot></slot>
    <Toolbar/>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import Toolbar from '@/components/tools/Toolbar'

export default {
  name: 'AppLayout',
  components: { Toolbar },
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
