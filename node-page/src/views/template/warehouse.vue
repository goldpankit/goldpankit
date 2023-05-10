<template>
  <div class="main">
    <div class="space-warp">
      <h3>Public Spaces</h3>
      <ul>
        <li v-for="item of 3" :key="item">
          <h5>Eva for Java</h5>
          <p>eva用于研发管理系统eva用于研发管理系统eva用于研发管理系统eva用于研发管理系统，目前已超过4000+项目沉淀，由devx团队研发和维护</p>
          <span>Java ·SpringBoot·MyBatisPlus·MySQL</span>
          <div class="install-box">
            <span>last modified by 2023/5/7</span>
            <el-button>Install</el-button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'warehouse'
}
</script>

<style scoped lang="scss">
.main {
  .space-warp {
    width: 830px;
    margin: 30px auto 0 auto;
    h3 {
      font-size: 18px;
      margin-bottom: 10px;
    }
    ul {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      li {
        width: 400px;
        margin-bottom: 20px;
        height: 180px;
        padding: 15px;
        box-sizing: border-box;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: var(--font-size-middle);
        h5 {
          font-size: var(--font-size-title);
        }
        p {
          color: var(--font-color);
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }
        span {
          color: #747474;
          font-weight: 400;
        }
        .install-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            color: rgba(181, 181, 181, 1);
            font-size: var(--font-size);
          }
          button {
            background-color: var(--primary-color);
            border: 0;
          }
        }
      }
    }
  }
}
</style>
