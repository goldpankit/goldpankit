<template>
  <div class="page">
    <div class="wrap">
      <h2>Purchased & private spaces</h2>
      <ul>
        <li v-for="i in 10" :key="i">
          <router-link :to="{ name: 'UserServices' }">
            <h3>Eva for SpringBoot</h3>
            <p>For all technical teams, you can click in to view all the service space, select and open the service space you need.</p>
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
  .wrap {
    width: var(--page-width);
    margin: 0 auto;
    overflow-y: auto;
  }
  h2 {
    margin-bottom: 20px;
  }
  ul {
    li {
      background-color: #fff;
      padding: 30px;
      margin-bottom: 20px;
      &:last-of-type {
        margin-bottom: 100px;
      }
      h3 {
        font-size: var(--font-size-large);
        margin-bottom: 10px;
        font-weight: normal;
      }
      p {
        font-size: var(--font-size-middle);
      }
    }
  }
}
</style>
