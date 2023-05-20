<template>
  <div class="designer-layout">
    <header>
      <h1>Gold Pan Kit</h1>
    </header>
    <main>
      <div class="tools"></div>
      <div class="design-space">
        <div class="pc">
          <Grid v-for="component in components" :component="component"/>
        </div>
      </div>
      <div class="attributes"></div>
    </main>
  </div>
</template>

<script>
import Input from "../../../components/ui/design/pc/Input.vue";
import ComponentWrap from "../../../components/ui/design/ComponentWrap.vue";
import Grid from "../../../components/ui/design/Grid.vue";

export default {
  components: {Grid, ComponentWrap, Input},
  data () {
    return {
      components: [
        {
          type: 'form',
          style: 'width: 100%;padding: 30px;',
          children: [
            { type: 'input', style: 'width: 200px;height:40px;' }
          ]
        },
        { type: 'input', style: 'width: 200px;height:40px;' }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.designer-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}
header {
  flex-shrink: 0;
  padding: 10px;
  border-bottom: 3px solid;
  border-image: linear-gradient(to right, var(--primary-color-match-1), var(--primary-color-match-2), var(--primary-color)) 1;
  h1 {
    font-size: var(--font-size-middle);
  }
}
main {
  flex-grow: 1;
  display: flex;
  & > * {
    height: 100%;
  }
  .tools {
    flex-shrink: 0;
    width: 255px;
  }
  .attributes {
    flex-shrink: 0;
    width: 220px;
  }
  .design-space {
    flex-grow: 1;
    background: #ccc;
    padding: 30px;
    .pc {
      width: 100%;
      height: 100%;
      background: #fff;
      box-shadow: 0 0 10px -2px #999;
      border-radius: 10px;
    }
  }
}
</style>
