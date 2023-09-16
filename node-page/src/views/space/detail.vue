<template>
  <div v-loading="loading" class="page">
    <div v-if="space != null" class="wrap" >
      <h2>{{ space.name }}</h2>
      <div class="tech-stack-wrap">
        <em>{{ space.withPrivate ? $t('common.private') : $t('common.public') }}</em>
        <p class="tech-stack">{{space.services.length}} {{$t('service.services')}}</p>
      </div>
      <div class="content-wrap">
        <div class="dimension-wrap">
          <ul class="dimensions">
            <li :class="{ selected: currentTab === 'readme' }" @click="currentTab = 'readme'">{{$t('common.readme')}}</li>
            <li :class="{ selected: currentTab === 'services' }" @click="currentTab = 'services'">{{$t('service.services2')}}</li>
          </ul>
          <div class="detail">
            <template v-if="currentTab === 'readme'">
              <div class="readme">
                <MarkdownEditor readonly :without-padding="true" v-model="space.description"/>
              </div>
            </template>
            <template v-else-if="currentTab === 'services'">
              <ServiceList
                v-if="space.services > 0"
                :services="space.services"
                @select="$router.push({
                  name: 'ServiceDetail',
                  params: {
                    spaceName: space.name,
                    serviceName: $event.name
                  }
                })"
              />
              <Empty v-else :description="$t('service.noServices')"/>
            </template>
          </div>
        </div>
        <div class="info">
          <div class="user-profile">
            <div class="user-info">
              <img :src="getAccessUri(space.user.avatar, '/images/avatar/default.png')">
              <h4>{{space.user.username}}</h4>
            </div>
            <p class="introduce">
              {{space.user.introduce === '' || space.user.introduce == null ? 'No introduce' : space.user.introduce }}
            </p>
          </div>
          <div v-if="userInfo != null && userInfo.id === space.userId" class="opera-wrap">
            <el-button
              type="primary"
              size="large"
              @click="$router.push({ name: 'CreateService', query: { space: spaceName } })"
            >{{$t('service.createNewService')}}</el-button>
          </div>
          <ul>
            <li>
              <label>{{$t('space.homePage')}}</label>
              <a v-if="space.homepage != null && space.homepage !== ''" :href="space.homepage" target="_blank">{{space.homepage}}</a>
              <p v-else>{{$t('common.none')}}</p>
            </li>
            <li>
              <label>{{$t('service.services2')}}</label>
              <p>{{space.services.length}}</p>
            </li>
            <li>
              <label>{{$t('service.lastPublish')}}</label>
              <p v-if="space.lastPublish != null">{{getDateOffsetText(space.lastPublish)}}</p>
              <p v-else>None</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MainServiceDetail from "../../components/space/MainServiceDetail.vue";
import ServiceInstaller from "../../components/space/ServiceInstaller.vue";
import {fetchByName} from "../../api/service.space";
import {fetchList} from "../../api/service";
import MarkdownEditor from "../../components/common/MarkdownEditor.vue";
import Empty from "../../components/common/Empty.vue";
import IssueListView from "../../components/space/IssueListView.vue";
import ServiceListView from "../../components/space/ServiceListView.vue";
import ServiceList from "../../components/service/ServiceList.vue";
import {mapState} from "vuex";

export default {
  components: {ServiceList, IssueListView, ServiceListView, Empty, MarkdownEditor, ServiceInstaller, MainServiceDetail},
  data () {
    return {
      loading: true,
      // 路由信息
      route: {
        space: null
      },
      // 当前页签
      currentTab: 'readme',
      // 空间数据
      space: null,
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    // 查询空间信息
    fetchSpace () {
      fetchByName(this.route.space)
        .then(data => {
          this.space = data
          if (this.space.description == null) {
            this.space.description = ''
          }
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  created () {
    this.route.space = this.$route.params.name
    this.fetchSpace()
  }
}
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  overflow-y: auto;
  .wrap {
    width: var(--page-width);
    margin: 0 auto 100px auto;
    background: var(--color-light);
    padding: var(--gap-page-padding);
    box-sizing: border-box;
    border-radius: var(--radius-page);
    box-shadow: var(--page-shadow);
  }
  // 技术栈
  .tech-stack-wrap {
    display: flex;
    align-items: center;
    margin-top: 10px;
    em {
      //padding: 5px 15px;
      border-radius: 30px;
      //background-color: #efc3ff;
      margin-right: 10px;
      font-style: normal;
      color: var(--primary-color-match-3);
    }
  }
  // 框架列表
  .frameworks {
    display: flex;
    padding: 15px 0;
    border-bottom: 1px solid var(--border-default-color);
    margin-top: 10px;
    margin-bottom: var(--gap-title);
    ul {
      display: flex;
      font-size: var(--font-size-middle);
      li {
        margin-right: 30px;
        cursor: pointer;
        &.selected {
          font-weight: bold;
        }
        &:last-of-type {
          margin-right: 0;
        }
      }
    }
  }
  .content-wrap {
    display: flex;
    margin-top: 25px;
    .dimension-wrap {
      flex-grow: 1;
      overflow: hidden;
      // 空间维度
      .dimensions {
        display: flex;
        border-bottom: 3px solid;
        border-image: var(--border-colors);
        li {
          text-align: center;
          line-height: 40px;
          font-size: var(--font-size-middle);
          cursor: pointer;
          width: 25%;
          flex-shrink: 0;
          &.selected {
            background-image: linear-gradient(to right, var(--primary-color), var(--primary-color-5));
            color: var(--primary-color-reverse);
            border-radius: 10px 10px 0 0;
          }
          &.disabled {
            color: var(--color-gray-1);
          }
        }
      }
      // 维度详情
      .detail {
        padding: 20px 20px 0 0;
        :deep(.service-list) {
          justify-content: space-between;
          li {
            width: 49%;
            margin-right: 0;
          }
        }
      }
    }
    .info {
      width: 255px;
      flex-shrink: 0;
      border-left: 1px solid var(--border-default-color);
      padding: 0 30px;
      box-sizing: border-box;
      // 用户简介
      .user-profile {
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 2px solid;
        border-color: linear-gradient(to right, var(--primary-color-match-1-transition), var(--primary-color-match-1)) 1;
        .user-info {
          display: flex;
          align-items: center;
          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
          }
        }
        .introduce {
          margin-top: 5px;
          font-size: var(--font-size-mini);
        }
      }
      // 操作
      .opera-wrap {
        border-bottom: 2px solid;
        border-color: linear-gradient(to right, var(--primary-color), var(--primary-color-match-1)) 1;
        margin-bottom: 20px;
        .el-button {
          width: 100%;
          font-size: var(--font-size-middle);
          font-weight: bold;
          letter-spacing: 2px;
          margin: 0 0 10px 0;
          &:nth-of-type(1),&:nth-of-type(2) {
            font-size: var(--font-size);
            letter-spacing: 0;
          }
          &:last-of-type {
            margin-bottom: 20px;
          }
        }
      }
      ul {
        li {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          border-bottom: 1px solid var(--border-default-color);
          padding-bottom: 20px;
          label {
            color: var(--color-gray);
            margin-bottom: 5px;
          }
          p,a {
            font-size: var(--font-size-middle);
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
    // 服务类型
    ul.service-types {
      display: flex;
      border-bottom: 1px solid var(--border-default-color);
      li {
        padding: 10px 20px;
        margin-right: 10px;
        position: relative;
        border: 1px solid transparent;
        top: 1px;
        color: var(--color-gray);
        cursor: pointer;
        transition: all ease .15s;
        &.selected {
          border: 1px solid var(--border-default-color);
          border-bottom-color: var(--color-light);
          font-weight: bold;
          color: var(--font-color);
        }
        &:hover {
          color: var(--font-color);
        }
      }
    }
  }
}
</style>
