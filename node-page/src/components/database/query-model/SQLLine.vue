<template>
  <div class="sql-line" :class="{'sql-line__hide': !visible}" :style="{ 'padding-left': indent + 'px' }">
    <p class="code">
      <slot></slot>
    </p>
    <ul class="opera">
      <li v-if="type === 'field'">
        <el-button v-show="visible" icon="View" @click="$emit('update:visible', false)"></el-button>
        <el-button v-show="!visible" icon="Hide" @click="$emit('update:visible', true)"></el-button>
      </li>
      <!-- 暂时去掉虚拟字段 -->
<!--      <li v-if="type === 'virtual-field'">-->
<!--        <el-button icon="Delete" @click="$emit('field:delete', false)"></el-button>-->
<!--      </li>-->
<!--      <li v-if="type === 'select'">-->
<!--        <el-button icon="Plus" @click="$emit('field:create')"></el-button>-->
<!--      </li>-->
    </ul>
  </div>
</template>

<script>
export default {
  name: "SQLLine",
  props: {
    // 类型(field字段)
    type: {},
    // 缩进
    indent: {
      default: 0
    },
    // 是否展示
    visible: {
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
.sql-line {
  height: 28px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding: 0 10px 0 0;
  letter-spacing: 1px;
  justify-content: space-between;
  color: var(--color-gray);
  position: relative;
  &.sql-line__hide {
    .code {
      opacity: .35;
    }
  }
  &:hover {
    background: #eee;
    .opera {
      opacity: 1;
    }
  }
  // 代码
  .code {
    flex-grow: 1;
    display: flex;
    align-items: center;
    & > :deep(*) {
      display: inline-block;
      margin-right: 5px;
      vertical-align: middle;
    }
    :deep(.dynamic-width-input)  {
      //font-weight: bold;
      //text-decoration: underline;
    }
    :deep(em, .keyword) {
      color: var(--primary-color-match-2);
      font-style: normal;
    }
    // 注释
    :deep(span.comment) {
      color: var(--color-gray);
      cursor: default;
    }
    :deep(span) {
      cursor: default;
      &.hidden {
        width: 0;
        overflow: hidden;
      }
    }
  }
  // 操作
  .opera {
    position: absolute;
    top: 0;
    right: 0;
    flex-shrink: 0;
    display: flex;
    opacity: 0;
    transition: all ease .3s;
    background-color: rgba(0, 0, 0, .2);
    border-radius: 5px;
    li {
      &:deep(.el-button) {
        margin: 0;
        height: auto;
        padding: 5px;
        border: 1px solid transparent;
        background-color: transparent;
        &:hover {
          // border: 1px solid var(--primary-color);
        }
        .el-icon {
          font-size: 15px;
          color: var(--font-color);
        }
      }
    }
  }
}
</style>
