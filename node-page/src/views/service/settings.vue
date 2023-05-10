<template>
  <div class="service-settings">
    <div class="header">
      <h2>Eva for SpringBoot</h2>
      <div class="opera">
        <el-button>Push</el-button>
        <el-button>Publish</el-button>
      </div>
    </div>
    <div class="wrap">
      <div class="nav">
        <ul class="tabs">
          <li class="selected">Files</li>
          <li>Variables</li>
        </ul>
        <div class="tree">
          <el-input placeholder="Filter keyword" />
          <el-tree :data="data"/>
        </div>
      </div>
      <div class="settings-wrap">
      <h4>File Settings</h4>
      <div class="content-wrap">
        <el-form>
          <el-form-item label="Enable Express">
            <el-input type="textarea" :rows="8"/>
          </el-form-item>
          <el-form-item label="Git">
            <el-input/>
          </el-form-item>
          <el-form-item label="Variables" class="item-variables">
            <template #label>
              <div>
                <label>Variables</label>
                <el-button>Add</el-button>
              </div>
            </template>
            <el-table>
              <el-table-column label="*Name" min-width="120px"></el-table-column>
              <el-table-column label="*Compiler" min-width="120px"></el-table-column>
              <el-table-column label="*Input Type" min-width="120px"></el-table-column>
              <el-table-column label="Remark" min-width="200px"></el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: [
        {
          label: 'Level one 1',
          children: [
            {
              label: 'Level two 1-1',
              children: [
                {
                  label: 'Level three 1-1-1',
                },
              ],
            },
          ],
        },
        {
          label: 'Level one 2',
          children: [
            {
              label: 'Level two 2-1',
              children: [
                {
                  label: 'Level three 2-1-1',
                },
              ],
            },
            {
              label: 'Level two 2-2',
              children: [
                {
                  label: 'Level three 2-2-1',
                },
              ],
            },
          ],
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.service-settings {
  width: 1000px;
  height: 800px;
  margin: 0 auto;
  .header {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
  }
  .wrap {
    display: flex;
    .nav {
      width: 180px;
      flex-shrink: 0;
      background: #fff;
      margin-right: 10px;
      border-radius: 30px;
      padding: 30px 20px;
      // 页签
      .tabs {
        display: flex;
        margin-bottom: 10px;
        li {
          margin-right: 10px;
          &.selected {
            font-weight: bold;
          }
          &:last-of-type {
            margin-right: 0;
          }
        }
      }
      // 文件树
      .tree {
        .el-input {
          margin-bottom: 5px;
        }
      }
    }
    .settings-wrap {
    flex-grow: 1;
    background: #fff;
    padding: 20px 50px;
    h4 {
      padding: 10px 0;
    }
    .content-wrap {
      padding: 20px 0;
      .el-form {
        :deep(.item-variables) {
          .el-form-item__label {
            padding-right: 0;
            & > div {
              width: 100%;
              display: flex;
              justify-content: space-between;
            }
          }
        }
      }
    }
  }
  }
}
</style>
