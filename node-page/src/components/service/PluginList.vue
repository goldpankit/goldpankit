<template>
  <el-scrollbar>
    <ul v-if="plugins.length > 0" class="plugin-list">
      <li
        v-for="plugin in plugins"
        :key="plugin.id"
        :class="{...customClass(plugin), 'plugin-installed': installed(plugin) === true}"
        @click.stop="$emit('click', plugin)"
      >
        <h5>
          <slot name="title" :plugin="plugin">
            {{plugin.label || plugin.name}}
          </slot>
        </h5>
        <p class="latest-version">
          <span>{{$t('service.latestVersion')}}: v{{plugin.lastVersion}}</span>
          <span v-if="installed(plugin) === true">{{$t('service.installed')}}</span>
        </p>
        <p class="introduce">{{plugin.introduce}}</p>
        <div class="price-wrap">
          <p class="text-info-1 text-mini">
            {{getDateOffsetText(plugin.lastPublishTime)}}
          </p>
        </div>
      </li>
    </ul>
    <Empty v-else :description="$t('service.noSubServices')"/>
  </el-scrollbar>
</template>

<script>

import BeanAmount from "../common/BeanAmount.vue";
import Empty from "../common/Empty.vue";
import ServiceStatus from "./ServiceStatus.vue";

export default {
  name: "PluginList",
  components: {ServiceStatus, Empty, BeanAmount},
  props: {
    plugins: {
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
.plugin-list {
  background-color: var(--color-light);
  li {
    border-top: 1px solid var(--border-default-color);
    padding: 15px 0;
    cursor: pointer;
    &.selected {
      //background: var(--primary-color-match-1);
      color: var(--primary-color-match-2) !important;
    }
    &.plugin-installed {
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
    .introduce {
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }
    .price-wrap {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      & > em {
        font-size: var(--font-size-mini);
        font-style: normal;
      }
    }
    .latest-version {
      margin-top: 10px;
      margin-bottom: 5px;
      color: var(--font-color);
      display: flex;
      justify-content: space-between;
      span:last-of-type {
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
        width: 20px;
        height: 20px;
        border-radius: 50%;
        object-fit: contain;
        margin-right: 5px;
      }
    }
  }
}
</style>
