<template>
  <div class="directory-select">
    <div class="header">
      <h4>{{ title }}</h4>
      <div class="opera">
        <el-button type="reverse" icon="Plus">New Folder</el-button>
      </div>
    </div>
    <ul class="paths">
      <li>Users</li>
      <li>Caesar</li>
      <li>orders</li>
      <li>quanzhi</li>
      <li>codespace</li>
      <li>Users</li>
      <li>Caesar</li>
      <li>orders</li>
      <li>quanzhi</li>
      <li class="current">codespace</li>
    </ul>
    <div class="directories">
      <ul>
        <li>
          <el-icon><Folder /></el-icon>
          <p>quanzhi-server</p>
        </li>
        <li>
          <el-icon><Folder /></el-icon>
          <p>quanzhi-front</p>
        </li>
        <li>
          <el-icon><Folder /></el-icon>
          <p>quanzhi-swyj-front</p>
        </li>
        <li>
          <el-icon><Folder /></el-icon>
          <p>quanzhi-swyj-server</p>
        </li>
        <li>
          <el-icon><Folder /></el-icon>
          <p>quanzhi-server</p>
        </li>
        <li>
          <el-icon><Folder /></el-icon>
          <p>quanzhi-front</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "DirectorySelect",
  props: {
    title: {
      default: 'Select Folder'
    }
  }
}
</script>

<style scoped lang="scss">
.directory-select {
  text-align: initial;
  width: 100%;
  //background: var(--background-color);
  padding: 20px;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-default-color);
    padding-bottom: 15px;
    h4 {
      flex-shrink: 0;
      font-size: var(--font-size-middle);
    }
    .opera {
      flex-shrink: 0;
    }
  }
  .paths {
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    padding: 10px 0 5px 0;
    border-bottom: 1px solid var(--border-default-color);
    li {
      background: var(--background-color);
      padding: 5px 8px;
      position: relative;
      cursor: pointer;
      margin-right: 15px;
      margin-bottom: 5px;
      border-radius: 5px;
      transition: all ease .15s;
      &.current {
        font-weight: bold;
        color: var(--primary-color-match-2);
      }
      &:hover {
        color: var(--primary-color-match-2);
      }
      &::after {
        content: '/';
        position: absolute;
        right: -11px;
        color: var(--font-color);
      }
      &:last-of-type {
        &::after {
          content: '';
        }
      }
    }
  }
  .directories {
    flex-grow: 1;
    background: var(--color-light);
    height: 350px;
    display: flex;
    flex-direction: column;
    ul {
      flex-grow: 1;
      overflow-y: auto;
      li {
        padding: 0 10px;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px dashed var(--border-default-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        &:last-of-type {
          border-bottom: 0;
        }
        .el-icon {
          margin-right: 10px;
        }
        &:hover {
          color: var(--primary-color-match-2);
        }
      }
    }
  }
}
</style>
