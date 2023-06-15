<template>
  <div class="sql-line" :style="{ 'padding-left': indent + 'px' }">
    <p class="code">
      <slot></slot>
    </p>
    <ul class="opera">
      <li v-if="type === 'field'"><el-button icon="Hide"></el-button></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SQLLine",
  props: {
    // 类型(field字段)
    type: {},
    indent: {
      default: 0
    }
  }
}
</script>

<style scoped lang="scss">
.sql-line {
  display: flex;
  align-items: center;
  padding: 5px 10px 5px 0;
  letter-spacing: 1px;
  justify-content: space-between;
  &:hover {
    background: var(--background-color);
    .opera {
      opacity: 1;
    }
  }
  // 代码
  .code {
    flex-grow: 1;
    & > :deep(*) {
      display: inline-block;
      margin-right: 5px;
      vertical-align: middle;
    }
    :deep(.dynamic-width-input)  {
      //font-weight: bold;
      //text-decoration: underline;
    }
    :deep(em) {
      color: var(--primary-color-match-2);
      font-style: normal;
    }
  }
  // 操作
  .opera {
    margin-left: 20px;
    flex-shrink: 0;
    display: flex;
    opacity: 0;
    transition: all ease .3s;
    li {
      &:deep(.el-button) {
        height: auto;
        padding: 5px;
        border: 1px solid transparent;
        &:hover {
          border: 1px solid var(--primary-color);
        }
        .el-icon {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
