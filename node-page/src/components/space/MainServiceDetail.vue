<template>
  <div v-if="majorVersionDetail != null" class="service-detail">
    <div class="nav">
      <div class="title">
        <el-button class="button-icon" icon="ArrowLeftBold" @click="$emit('back')"></el-button>
        <h4>{{service}}</h4>
      </div>
      <ul>
        <li
          v-for="version in majorVersions"
          :key="version"
          :class="{ selected: version === currentMajorVersion }"
          @click="changeMajorVersion(version)"
        >v{{version}}</li>
      </ul>
    </div>
    <div class="install">
      <el-button type="important" @click="$emit('install', currentVersion)">
        <h5>{{$t('service.install')}}</h5>
      </el-button>
    </div>
    <div class="content-wrap">
      <ul class="service-dimensions">
        <li :class="{ selected: currentDim === 'readme' }" @click="currentDim = 'readme'">{{ $t('common.readme') }}</li>
        <li :class="{ selected: currentDim === 'subServices' }" @click="currentDim = 'subServices'">{{ $t('service.subServices') }}</li>
        <li :class="{ selected: currentDim === 'structure' }" @click="currentDim = 'structure'">{{ $t('service.structure') }}</li>
      </ul>
      <MarkdownEditor v-show="currentDim === 'readme'" v-model="majorVersionDetail.description" :readonly="true"/>
      <SubServiceList v-show="currentDim === 'subServices'" :services="majorVersionDetail.subServices"/>
      <ServiceStructureView v-show="currentDim === 'structure'" :nodes="majorVersionDetail.structure"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ServiceListView from "./ServiceListView.vue";
import {fetchMainServiceDetail} from "../../api/service";
import ServiceStructureView from "./ServiceStructureView.vue";
import MarkdownEditor from "../common/MarkdownEditor.vue";
import SubServiceList from "../service/SubServiceList.vue";
export default {
  name: "MainServiceDetail",
  components: {SubServiceList, MarkdownEditor, ServiceStructureView, ServiceListView},
  props: {
    space: {
      required: true
    },
    service: {
      required: true
    }
  },
  data () {
    return {
      currentMajorVersion: '',
      currentVersion: '',
      currentDim: 'readme',
      majorVersions: [],
      // 大版本详情
      majorVersionDetail: null
    }
  },
  computed: {
    ...mapState(['currentProject'])
  },
  methods: {
    changeMajorVersion (majorVersion) {
      this.currentMajorVersion = majorVersion
      this.fetchDetail(majorVersion)
    },
    // 查询详情
    fetchDetail (majorVersion) {
      fetchMainServiceDetail({
        space: this.space,
        service: this.service,
        majorVersion
      })
        .then(data => {
          this.majorVersions = data.majorVersions
          this.currentMajorVersion = majorVersion || this.majorVersions[0]
          this.majorVersionDetail = data.defaultMajorVersion
          this.currentVersion = this.majorVersionDetail.version
          if (this.majorVersionDetail.description == null && this.majorVersionDetail.description.trim() === '') {
            this.majorVersionDetail.description = 'No Descriptions'
          }
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    }
  },
  created () {
    this.fetchDetail()
  }
}
</script>

<style scoped lang="scss">
.service-detail {
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      align-items: center;
      display: flex;
      .el-button {
        border: 0;
      }
      h4 {
        font-size: var(--font-size-middle);
      }
    }
    & > ul {
      display: flex;
      align-items: center;
      li {
        padding: 0 10px;
        cursor: pointer;
        font-size: var(--font-size-middle);
        font-weight: bold;
        font-style: italic;
        text-transform: uppercase;
        &.selected {
          color: var(--primary-color-match-2);
        }
      }
    }
  }
  .install {
    margin: 10px 0;
    .el-button {
      width: 100%;
      height: 70px;
      :deep(span) {
        display: flex;
        flex-direction: column;
        h5 {
          font-size: var(--font-size-large);
          margin-bottom: 5px;
        }
      }
    }
  }
  .content-wrap {
    padding-top: 10px;
  }
  // 服务信息维度
  ul.service-dimensions {
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
</style>
