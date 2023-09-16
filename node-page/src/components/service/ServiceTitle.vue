<template>
  <div class="service-title">
    <div v-if="withType" class="type-tag">
      <em :class="{service: service != null && plugin == null}">
        {{ plugin != null ? '插件' : '服务' }}
      </em>
    </div>
    <h3 class="paths">
      <!-- 只有空间 -->
      <template v-if="service == null && plugin == null">
        {{space}}
      </template>
      <!-- 空间和服务 -->
      <template v-else-if="service != null && plugin == null">
        <template v-if="withPaths">
          <router-link :target="withNewPage ? '_blank': ''" :to="{
            name: 'SpaceDetail',
            params: {
              name: space
            }
          }">@{{space}}</router-link>
          /
        </template>
        <router-link :target="withNewPage ? '_blank': ''" :to="{
          name: 'ServiceDetail',
          params: {
            spaceName: space,
            serviceName: service
          }
        }">{{serviceLabel || service}}</router-link>
      </template>
      <!-- 空间、服务和插件 -->
      <template v-else>
        <template v-if="withPaths">
          <router-link :target="withNewPage ? '_blank': ''" :to="{
            name: 'SpaceDetail',
            params: {
              name: space
            }
          }">@{{space}}</router-link>
          /
          <router-link :target="withNewPage ? '_blank': ''" :to="{
            name: 'ServiceDetail',
            params: {
              spaceName: space,
              serviceName: service
            }
          }">{{serviceLabel || service}}</router-link>
          /
        </template>
        <span>{{pluginLabel || plugin}}</span>
      </template>
    </h3>
  </div>
</template>

<script>

export default {
  name: "ServiceTitle",
  props: {
    // 包含类型标签
    withType: {
      default: false
    },
    // 包含路径
    withPaths: {
      default: true
    },
    // 在新页面中打开
    withNewPage: {
      default: false
    },
    space: {
      required: true
    },
    service: {
      required: false
    },
    serviceLabel: {
      required: false
    },
    plugin: {
      required: false
    },
    pluginLabel: {
      required: false
    }
  }
}
</script>

<style scoped lang="scss">
.service-title {
  display: flex;
  align-items: center;
  h3 {
    flex-grow: 1;
    font-size: var(--font-size-middle);
    & > a {
      color: var(--color-service-name) !important;
      &:hover {
        color: var(--color-service-name-hover) !important;
      }
    }
  }
  .type-tag {
    flex-shrink: 0;
    margin-right: 10px;
    em {
      background: var(--color-gray-2);
      font-size: var(--font-size-mini);
      padding: 2px 10px;
      border-radius: 5px;
      font-style: normal;
      &.service {
        background: var(--primary-color-match-2-light);
      }
    }
  }
}
</style>
