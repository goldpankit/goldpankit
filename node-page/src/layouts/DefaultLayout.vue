<template>
  <div class="default-layout">
    <header>
      <h1>Gold Pan Kit</h1>
    </header>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
export default {
  name: 'WorkspaceLayout'
}
</script>

<style scoped lang="scss">
.default-layout {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
header {
  flex-shrink: 0;
  padding: 10px 30px;
  h1 {
    font-size: var(--font-size-large);
    font-style: italic;
    display: inline-block;
    border-bottom: 15px solid;
    border-image: linear-gradient(to right, #333, var(--primary-color)) 1;
    //border-image: linear-gradient(to right, #ffb208, #f616ff, #fff308) 1;
    position: relative;
    padding: 0 10px;
    //&::after {
    //  content: 'Gold Pan Kit';
    //  position: absolute;
    //  transform: rotateX(180deg);
    //  display: block;
    //  opacity: .3;
    //}
  }
}
main {
  flex-grow: 1;
  overflow: hidden;
}
</style>
