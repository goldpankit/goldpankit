<template>
  <ul class="service-list">
    <li v-for="service in services" @click.stop="$emit('click', service)">
      <h4>{{service.name}}</h4>
      <p>{{service.introduce}}</p>
      <section class="infos">
        <p>{{service.versionCount}} {{$t('service.versions')}}</p>
        <p>{{$t('service.latestVersion')}}: {{service.lastVersion}}</p>
      </section>
      <div class="price-wrap">
        <p class="text-info-1 text-mini">{{$t('service.lastPublish')}}: {{getDateOffsetText(service.lastPublish, $t)}}</p>
        <BeanAmount :price="service.price.price" :type="service.price.leaseType"/>
      </div>
    </li>
  </ul>
</template>

<script>
import BeanAmount from "../common/BeanAmount.vue";

export default {
  name: "ServiceList",
  components: {BeanAmount},
  props: {
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
  flex-wrap: wrap;
  & > li {
    width: 325px;
    margin-right: 10px;
    margin-bottom: 10px;
    border: 1px solid var(--border-default-color);
    padding: 20px;
    cursor: pointer;
    margin-bottom: 15px;
    border-radius: 10px;
    transition: all ease .15s;
    background: var(--background-color);
    &:nth-of-type(3n) {
      margin-right: 0;
    }
    &:hover {
      border-color: var(--primary-color);
      background: var(--background-color);
    }
    h4 {
      font-size: var(--font-size-middle);
      margin-bottom: 10px;
    }
    & > p {
      font-size: var(--font-size);
    }
    .infos {
      display: flex;
      margin-top: 5px;
      font-size: var(--font-size-mini);
      p {
        margin-right: 10px;
      }
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
