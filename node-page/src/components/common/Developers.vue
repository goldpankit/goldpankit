<template>
  <div class="developers-wrap">
    <label>开发者</label>
    <ul class="developers">
      <li
        v-for="item in developers"
        :key="item.name"
      >
        <img :src="`/images/developers/${item.name}.png`" :alt="`${item.name}头像`"/>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'Developers',
  props: {
    data: {
      required: true,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      allDevelopers: [
        {
          name: '刘大逵',
          email: '',
          github: 'https://github.com/jason',
          gitee: 'https://github.com/jason',
        },
        {
          name: '天析',
          email: '',
          github: 'https://github.com/jason',
          gitee: 'https://github.com/jason',
        }
      ]
    }
  },
  computed: {
    // 已参与的开发者
    developers () {
      return this.allDevelopers.filter(item => this.data.includes(item.name))
    }
  }
}
</script>

<style scoped lang="scss">
.developers-wrap {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  label {
    margin-right: 10px;
    color: var(--color-gray);
    font-size: var(--font-size-mini);
  }
}
.developers {
  display: flex;
  align-items: center;
  li {
    margin-right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    width: 25px;
    height: 25px;
    object-fit: cover;
    border-radius: 50%;
  }
}
</style>
