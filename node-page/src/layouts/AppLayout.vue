<template>
  <slot></slot>
  <!-- 执行构建窗口 -->
  <BuildNotice :install-data="installData"/>
</template>

<script>
import {mapActions} from "vuex";
import BuildNotice from "../components/service/installer/BuildNotice.vue";

export default {
  name: 'AppLayout',
  components: {BuildNotice},
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
  header {
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    background-color: var(--primary-color);
    font-size: var(--font-size-big);
    padding: 0 30px;
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
  main {

  }
}
</style>
