<template>
  <ul class="service-list">
    <li
      v-for="service in services"
      :key="service.name"
    >
      <ServiceTitle
        :space="space"
        :space-label="spaceLabel"
        :service="service.name"
        :service-label="service.label"
        :with-paths="false"
      />
      <p>{{ space }}-{{service.name}}-{{service.introduce}}</p>
      <div class="price-wrap">
        <p class="text-info-1 text-mini">{{getDateOffsetText(service.lastPublish)}}</p>
        <BeanAmount :price="service.price.price" :type="service.price.leaseType"/>
      </div>
    </li>
  </ul>
</template>

<script>
import BeanAmount from "../common/BeanAmount.vue";
import ServiceTitle from "./ServiceTitle.vue";

export default {
  name: "VerticalServiceList",
  components: { ServiceTitle, BeanAmount },
  props: {
    space: {
      require: true
    },
    spaceLabel: {
      require: false
    },
    services: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.service-list {
  display: flex;
  flex-direction: column;
  & > li {
    width: 100%;
    padding: 5px 0;
    line-height: 1.5;
    &:nth-of-type(3n) {
      margin-right: 0;
    }
    h4 {
      margin-bottom: 10px;
    }
    & > p {
      font-size: var(--font-size);
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 3;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }
    .price-wrap {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
    }
    .opera {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
