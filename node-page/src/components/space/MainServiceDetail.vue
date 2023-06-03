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
          :class="{ selected: version === currentVersion }"
          @click="currentVersion = version"
        >v{{version}}</li>
      </ul>
    </div>
    <div class="install">
      <el-button type="important" @click="$emit('install', currentVersion)">
        <h5>INSTALL{{currentProject == null ? '' : ' to project ' + currentProject.name}}</h5>
        <p v-if="currentProject == null">Please select a project for install the framework.</p>
      </el-button>
    </div>
    <div class="content-wrap">
      <ul class="service-dimensions">
        <li class="selected">Readme</li>
        <li>Sub Services</li>
        <li>Structure</li>
      </ul>
      <SubServiceListView :services="majorVersionDetail.subServices"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SubServiceListView from "./SubServiceListView.vue";
import {fetchMainServiceDetail} from "../../api/service";
export default {
  name: "MainServiceDetail",
  components: {SubServiceListView},
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
      currentVersion: 'v3',
      majorVersions: [],
      // 大版本详情
      majorVersionDetail: null
    }
  },
  computed: {
    ...mapState(['currentProject'])
  },
  methods: {
    // 查询详情
    fetchDetail () {
      fetchMainServiceDetail({
        space: this.space,
        service: this.service
      })
        .then(data => {
          this.majorVersions = data.majorVersions
          this.currentVersion = this.majorVersions[0]
          this.majorVersionDetail = data.defaultMajorVersion
        })
        .catch(e => {
          console.log('e', e)
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
