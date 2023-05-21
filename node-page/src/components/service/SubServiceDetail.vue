<template>
  <div class="service-detail">
    <div class="nav">
      <div class="title">
        <el-button class="button-icon" icon="ArrowLeftBold" @click="$emit('back')"></el-button>
        <h4>eva-vue2</h4>
      </div>
      <ul>
        <li class="selected"><em>V1</em></li>
        <li><em>V2</em></li>
        <li><em>V3</em></li>
      </ul>
    </div>
    <div class="content-wrap">
      <ul class="service-types">
        <li class="selected">Readme</li>
        <li>Files</li>
      </ul>
      <ul class="service-list">
        <li>
          <div class="service-info">
            <h3>日志管理/操作日志</h3>
            <p>为每一次增删改操作增加操作日志</p>
            <p class="text-mini text-info-1">Last publish: 3 weeks ago</p>
          </div>
          <ul>
            <li><el-button @click="$router.push({ name: 'InstallService', query: { space_id: spaceId, v: 'v3' } })">INSTALL</el-button></li>
          </ul>
        </li>
        <li>
          <div class="service-info">
            <h3>字典管理</h3>
            <p>可以将数据常量定义在字典里，通过提供的接口或service来获取，提高项目业务常量的实时修改。</p>
          </div>
          <ul>
            <li><el-button>INSTALL</el-button></li>
          </ul>
        </li>
        <li>
          <div class="service-info">
            <h3>部门管理</h3>
            <p>企业部门的管理功能，支持用户设定至部门</p>
          </div>
          <ul>
            <li><el-button>INSTALL</el-button></li>
          </ul>
        </li>
        <li>
          <div class="service-info">
            <h3>定时任务</h3>
            <p>通过spring自带的定时实现定时任务，可支持任务的分片功能</p>
          </div>
          <ul>
            <li><el-button>INSTALL</el-button></li>
          </ul>
        </li>
        <li>
          <div class="service-info">
            <h3>消息通知</h3>
            <p>可实现业务操作后添加消息通知，通过轮询的方式定时获取消息送达用户。</p>
          </div>
          <ul>
            <li><el-button>INSTALL</el-button></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "SubServiceDetail",
  props: {
    frameworkServiceId: {}
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
        &.selected {
          em {
            color: var(--primary-color-match-2);
          }
        }
        em {
          font-size: var(--font-size-middle);
          font-weight: bold;
        }
      }
    }
  }
  .content-wrap {
    padding-top: 10px;
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
}
</style>
