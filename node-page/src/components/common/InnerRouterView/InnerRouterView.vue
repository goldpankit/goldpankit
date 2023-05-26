<template>
  <div class="inner-router-view">
    <slot v-if="visible"></slot>
  </div>
</template>

<script>
export default {
  name: "InnerRouterView",
  props: {
    default: {
      type: Boolean,
      default: false
    },
    visible: {
      default: false
    },
    name: {
      type: String
    },
    title: {
      type: String
    }
  },
  data () {
    return {
      visible: false
    }
  },
  computed: {
    currentViewName () {
      return this.$parent.currentViewName
    }
  },
  watch: {
    currentViewName (newViewName) {
      this.visible = newViewName === this.name
    }
  },
  methods: {
  },
  created () {
    this.visible = this.$parent.currentViewName === this.name
  }
}
</script>

<style scoped>

</style>
