<template>
  <div
    v-if="type !== 'FREE'"
    class="bean-amount"
  >
    <img src="/images/bean.png">
    <em>{{price}} / {{getTypeText()}}</em>
  </div>
</template>

<script>

export default {
  name: "BeanAmount",
  props: {
    type: {
      required: true
    },
    price: {
      required: true
    }
  },
  methods: {
    getTypeText () {
      return this.$const.getServiceLeaseTypes(this.$t).find(t => t.code === this.type).abbLabel
    }
  }
}
</script>

<style scoped lang="scss">
.bean-amount {
  display: inline-flex;
  align-items: center;
  img {
    width: 16px;
  }
  em {
    font-weight: bold;
    margin-left: 5px;
    color: var(--font-color);
    font-style: normal;
    font-size: var(--font-size-mini);
  }
}
</style>
