<template>
  <div v-if="space != null" class="page">
    <div class="wrap">
      <h2>{{ space.name }}</h2>
      <div class="tech-stack-wrap">
        <em>Private</em>
        <p class="tech-stack">Java · SpringBoot · MyBatisPlus · MySQL</p>
      </div>
<!--      <div class="frameworks">-->
<!--        <ul>-->
<!--          <li class="selected">前端框架</li>-->
<!--          <li>后端框架</li>-->
<!--        </ul>-->
<!--      </div>-->
      <div class="content-wrap">
        <div class="dimension-wrap">
          <ul class="dimensions">
            <li>Readme</li>
            <li class="selected">Services</li>
            <li>Prices</li>
            <li>Issues</li>
          </ul>
          <div class="detail">
            <ul class="service-types">
              <li class="selected">Framework</li>
              <li>Common</li>
              <li>Logic</li>
              <li>Page</li>
              <li>Issues</li>
            </ul>
            <ul class="service-list">
              <li v-for="i in 10" :key="i">
                <div class="service-info">
                  <h3>支付宝支付</h3>
                  <p>对接支付宝支付</p>
                </div>
                <ul>
                  <li><el-button>View Logic</el-button></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div class="info">
          <div class="user-profile">
            <div class="user-info">
              <img src="/avatar.png">
              <h4>Caesar Liu</h4>
            </div>
            <p class="description">Kit联合创始人，从业10年，精通Java、Vue等技术栈。</p>
          </div>
          <div class="install">
            <el-button
              type="primary"
              size="large"
              @click="$router.push({ name: 'CreateService', query: { space_id: spaceId } })"
            >Create New Service</el-button>
            <el-button
              type="primary"
              size="large"
              @click="$router.push({ name: 'CreateService', query: { space_id: spaceId } })"
            >Create New Issue</el-button>
            <el-button
              type="primary"
              size="large"
              @click="$router.push({ name: 'InstallService' })"
            >INSTALL</el-button>
          </div>
          <ul>
            <li>
              <label>Home Page</label>
              <a href="#">http://eva.adjustrd.com</a>
            </li>
            <li>
              <label>Repository</label>
              <p>http://gitee.com/eva.git</p>
            </li>
            <li>
              <label>Last Publish</label>
              <p>3 month ago</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {fetchById} from "../../api/service.space";

export default {
  data () {
    return {
      spaceId: null,
      space: null
    }
  },
  methods: {
    fetchById () {
      fetchById(this.spaceId)
        .then(data => {
          this.space = data
        })
        .catch(e => {
          console.log('e', e)
        })
    }
  },
  created () {
    this.spaceId = this.$route.query.space_id
    this.fetchById()
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
      // 空间维度
      .dimensions {
        display: flex;
        border-bottom: 3px solid;
        border-image: linear-gradient(to right, var(--primary-color-match-1), var(--primary-color-match-2), var(--primary-color)) 1;
        li {
          flex-grow: 1;
          text-align: center;
          line-height: 40px;
          font-size: var(--font-size-middle);
          cursor: pointer;
          &.selected {
            background-image: linear-gradient(to right, var(--primary-color-match-1-transition), var(--primary-color-match-1));
            color: var(--primary-color);
            border-radius: 10px 10px 0 0;
          }
        }
      }
      // 维度详情
      .detail {
        padding: 20px 20px 0 0;
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
        .description {
          margin-top: 5px;
          font-size: var(--font-size-mini);
        }
      }
      // 安装
      .install {
        border-bottom: 2px solid;
        border-color: linear-gradient(to right, var(--primary-color-match-1-transition), var(--primary-color-match-1)) 1;
        margin-bottom: 20px;
        .el-button {
          width: 100%;
          font-size: var(--font-size-middle);
          font-weight: bold;
          letter-spacing: 2px;
          margin: 0 0 10px 0;
          &:first-of-type {
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
}
</style>