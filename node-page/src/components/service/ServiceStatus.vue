<template>
  <em v-if="withPrivate" class="status-private">{{$t('common.private')}}</em>
  <em v-else class="status-public">{{$t('common.public')}}</em>
</template>

<script>

export default {
  name: "ServiceStatus",
  props: {
    withPrivate: {
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
em {
  font-style: normal;
}
.status-private {
  color: var(--color-gray-deep);
}
.status-public {
  color: var(--color-success);
}
</style>
