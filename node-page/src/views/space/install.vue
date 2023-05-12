<template>
  <div class="page">
    <div class="wrap">
      <div>
        <div class="header">
          <div class="title">
            <h2>Eva for SpringBoot·后端服务</h2>
            <div class="tech-stack-wrap">
              <em>Private</em>
              <p class="tech-stack">Java · SpringBoot · MyBatisPlus · MySQL</p>
            </div>
          </div>
          <div class="info">
            <em>V3</em>
            <p>current version</p>
          </div>
        </div>
        <div class="content-wrap">
          <!-- 服务 -->
          <div class="service-wrap">
            <!-- 搜索 -->
            <div class="search-box">
              <el-input size="large" placeholder="Search"/>
            </div>
            <!-- 服务列表 -->
            <ul class="service-list">
              <li v-for="i in 3" :key="i">
                <div class="info">
                  <h5>支付宝支付</h5>
                  <p>集成支付宝支付，提供完善健全的支付接口</p>
                </div>
                <div class="opera">
                  <el-button>Install</el-button>
                </div>
              </li>
            </ul>
          </div>
          <!-- 设置 -->
          <div class="setting-wrap">
            <h3>Settings</h3>
            <div class="main">
              <el-form>
                <el-form-item label="接口地址" required>
                  <el-input placeholder="/pay/alipay"/>
                </el-form-item>
                <el-form-item label="API KEY">
                  <el-input placeholder="type your API KEY"/>
                </el-form-item>
                <el-form-item label="API SECRET">
                  <el-input placeholder="type your API SECRET"/>
                </el-form-item>
              </el-form>
            </div>
            <div class="opera">
              <el-button type="reverse" size="large">Install</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  .wrap {
    width: var(--page-width);
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
    padding: 3px 3px var(--gap-page-bottom) 3px;
    & > div {
      background-color: #fff;
      border-radius: var(--radius-page);
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: var(--page-shadow);
    }
  }
  // 头部
  .header {
    padding: var(--gap-page-padding) var(--gap-page-padding) var(--gap-title) var(--gap-page-padding);
    border-bottom: 1px solid var(--border-default-color);
    display: flex;
    .title {
      flex-grow: 1;
      h2 {
        flex-shrink: 0;
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
    }
    .info {
      flex-shrink: 0;
      width: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      em {
        width: 100%;
        font-size: 40px;
        font-weight: bold;
        color: #fff;
        background-image: linear-gradient(to right, var(--primary-color-match-2), var(--primary-color));
        text-align: center;
      }
      p {
        font-size: var(--font-size-mini);
        color: var(--color-gray);
      }
    }
  }
  .content-wrap {
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    .service-wrap {
      width: 350px;
      flex-shrink: 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      // 搜索
      .search-box {
        flex-shrink: 0;
        margin-bottom: 15px;
        padding: 15px var(--gap-page-padding) 0 var(--gap-page-padding);
        .el-input {
          border-radius: 50px;
          :deep(.el-input__wrapper) {
            border-radius: 50px;
          }
        }
      }
      // 服务列表
      .service-list {
        flex-grow: 1;
        background-color: #fff;
        overflow-y: auto;
        li {
          border-top: 1px solid var(--border-default-color);
          padding: 15px var(--gap-page-padding);
          display: flex;
          // 服务信息
          .info {
            flex-grow: 1;
          }
          // 操作
          .opera {
            width: 70px;
            flex-shrink: 0;
            display: flex;
            justify-content: flex-end;
          }
        }
        h5 {
          font-size: var(--font-size-middle);
          margin-bottom: 5px;
        }
        p {
          color: var(--color-gray);
        }
      }
    }
    .setting-wrap {
      background-color: #fff;
      flex-grow: 1;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      border-left: 1px solid var(--border-default-color);
      h3 {
        flex-shrink: 0;
        margin: 20px 30px 10px 30px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--border-default-color);
      }
      .main {
        flex-grow: 1;
        overflow-y: auto;
        padding: 0 30px;
        .el-input {
          height: 40px;
        }
      }
      .opera {
        flex-shrink: 0;
        padding: 15px;
        border-top: 10px solid;
        border-image: linear-gradient(to right, var(--primary-color-match-1), var(--primary-color-match-2), var(--primary-color)) 1;
        display: flex;
        justify-content: center;
        .el-button {
          width: 200px;
          font-size: var(--font-size-middle);
        }
      }
    }
  }
}
</style>
