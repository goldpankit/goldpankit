<template>
  <ul v-if="services.length > 0" class="service-list">
    <li v-for="service in services" :key="service.name">
      <div class="service-info">
        <h3>{{service.name}}</h3>
        <p>{{service.description}}</p>
        <p class="text-mini text-info-1">Last publish: {{service.lastPublishTime}}</p>
      </div>
    </li>
  </ul>
  <Empty v-else description="No Services"/>
</template>

<script>
import Empty from "../common/Empty.vue";

export default {
  name: "SubServiceListView",
  components: {Empty},
  props: {
    services: {
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
// 服务列表
ul.service-list {
  border: 1px solid var(--border-default-color);
  border-top: 0;
  padding: 0 20px;
  & > li {
    background-color: var(--color-light);
    padding: 15px 0;
    display: flex;
    border-bottom: 1px solid var(--border-default-color);
    &:last-of-type {
      border-bottom: 0;
    }
    .service-info {
      flex-grow: 1;
      h3 {
        font-size: var(--font-size-middle);
        margin-bottom: 10px;
      }
      p {
        font-size: var(--font-size);
      }
    }
    ul {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      margin-left: 30px;
    }
  }
}
</style>
