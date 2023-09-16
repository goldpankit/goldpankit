<template>
  <ul class="service-list">
    <li
      v-for="service in services"
      :key="service.name"
    >
      <h4>
        <router-link :to="{
          name: 'ServiceDetail',
          params: {
            spaceName: space,
            serviceName: service.name
          }
        }">
          {{service.name}}
        </router-link>
      </h4>
      <p>{{service.introduce}}</p>
      <section class="infos">
        <p>{{service.versionCount}} {{$t('service.versions')}}</p>
        <p>{{$t('service.latestVersion')}}: {{service.lastVersion}}</p>
      </section>
      <div class="price-wrap">
        <p class="text-info-1 text-mini">{{$t('service.lastPublish')}}: {{getDateOffsetText(service.lastPublish)}}</p>
        <BeanAmount :price="service.price.price" :type="service.price.leaseType"/>
      </div>
    </li>
  </ul>
</template>

<script>
import BeanAmount from "../common/BeanAmount.vue";

export default {
  name: "VerticalServiceList",
  components: {BeanAmount},
  props: {
    space: {
      require: true
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
  flex-wrap: wrap;
  & > li {
    width: 325px;
    margin-right: 10px;
    border: 1px solid var(--border-default-color);
    padding: 20px;
    cursor: pointer;
    margin-bottom: 15px;
    border-radius: 10px;
    transition: all ease .15s;
    &:nth-of-type(3n) {
      margin-right: 0;
    }
    h4 {
      font-size: var(--font-size-middle);
      margin-bottom: 10px;
      & > a {
        color: var(--color-service-name) !important;
        &:hover {
          color: var(--color-service-name-hover) !important;
        }
      }
    }
    & > p {
      font-size: var(--font-size);
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 3;
      display: -webkit-box;
      -webkit-box-orient: vertical;
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
