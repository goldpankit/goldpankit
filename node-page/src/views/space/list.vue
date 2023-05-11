<template>
  <div class="page">
    <div class="warp">
      <h2>Public Spaces</h2>
      <ul>
        <li v-for="item of 3" :key="item">
          <router-link :to="{ name: 'SpaceDetail' }">
            <h3>Eva for Java</h3>
            <p>eva用于研发管理系统eva用于研发管理系统eva用于研发管理系统eva用于研发管理系统，目前已超过4000+项目沉淀，由devx团队研发和维护</p>
            <p class="tech-stack">Java · SpringBoot · MyBatisPlus · MySQL</p>
          </router-link>
        </li>
      </ul>
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
  overflow-y: auto;
  .warp {
    width: var(--page-width);
    margin: 30px auto 0 auto;
    h2 {
      font-size: var(--font-size-title);
      margin-bottom: var(--title-gap);
    }
    ul {
      width: 100%;
      li {
        margin-bottom: 20px;
        padding: 50px 30px;
        box-sizing: border-box;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: var(--font-size-middle);
        border-radius: 30px;
        h3 {
          font-size: var(--font-size-title);
          margin-bottom: 15px;
        }
        p {
          color: var(--font-color);
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }
        .tech-stack {
          margin-top: 10px;
          color: #747474;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
