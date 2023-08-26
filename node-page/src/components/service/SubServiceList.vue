<template>
  <ul v-if="services.length > 0" class="sub-service-list">
    <li
      v-for="service in services"
      :key="service.id"
      :class="{...customClass(service), 'service-installed': installed(service) === true}"
      @click.stop="$emit('click', service)"
    >
      <h5>
        <slot name="title" :service="service">
          {{service.name}}
        </slot>
      </h5>
      <p class="latest-version">
        <span>{{$t('service.latestVersion')}}: v{{service.lastVersion}}</span>
        <span v-if="installed(service) === true">{{$t('service.installed')}}</span>
      </p>
      <p>{{service.introduce}}</p>
      <!-- 用户信息 -->
      <div class="user-profile">
        <img :src="getAccessUri(service.user.avatar, '/images/avatar/default.png')">
        <span>{{service.user.username}}</span>
      </div>
      <div class="price-wrap">
        <p class="text-info-1 text-mini">{{$t('service.lastPublish')}}: {{getDateOffsetText(service.lastPublishTime)}}</p>
        <em v-if="service.latestLease != null">
          {{getRemainingDay(service.latestLease.leaseEndTime)}} {{$t('common.days')}}
        </em>
        <BeanAmount
          v-else
          :price="service.price.price"
          :type="service.price.leaseType"
        />
      </div>
    </li>
  </ul>
  <Empty v-else :description="$t('service.noSubServices')"/>
</template>

<script>

import BeanAmount from "../common/BeanAmount.vue";
import Empty from "../common/Empty.vue";

export default {
  name: "SubServiceList",
  components: {Empty, BeanAmount},
  props: {
    services: {
      type: Array,
      required: true
    },
    customClass: {
      type: Function,
      default () {
        return () => {}
      }
    },
    installed: {
      type: Function,
      default () {
        return () => {}
      }
    }
  }
}
</script>

<style scoped lang="scss">
// 服务列表
.sub-service-list {
  background-color: var(--color-light);
  overflow-y: auto;
  li {
    border-top: 1px solid var(--border-default-color);
    padding: 15px 0;
    cursor: pointer;
    &.selected {
      //background: var(--primary-color-match-1);
      color: var(--primary-color-match-2)
    }
    &.service-installed {
      color: var(--color-gray);
    }
    h5 {
      font-size: var(--font-size-middle);
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      em {
        color: var(--primary-color-match-2);
        font-size: var(--font-size-mini);
      }
    }
    p {
      color: var(--color-gray);
      font-size: var(--font-size-mini);
    }
    .price-wrap {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
    }
    .latest-version {
      margin-top: 10px;
      margin-bottom: 5px;
      color: var(--font-color);
      display: flex;
      justify-content: space-between;
      span:last-of-type {
        font-weight: bold;
        color: var(--color-gray);
      }
    }
    // 用户信息
    .user-profile {
      display: flex;
      align-items: center;
      margin-top: 10px;
      color: var(--font-color);
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        object-fit: contain;
        margin-right: 10px;
      }
    }
  }
}
</style>
