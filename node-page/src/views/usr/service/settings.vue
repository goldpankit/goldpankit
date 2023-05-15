<template>
  <div class="page">
    <div class="wrap">
      <div class="header">
        <h2>Eva for SpringBoot</h2>
        <div class="opera">
          <el-button>Push</el-button>
          <el-button>Pull</el-button>
          <el-button type="reverse">Publish</el-button>
        </div>
      </div>
      <div class="main">
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
.page {
  width: var(--page-width);
  height: 100%;
  margin: 0 auto;
  padding-bottom: var(--gap-page-bottom);
  .wrap {
    height: 100%;
    box-shadow: var(--page-shadow);
    background: #fff;
    padding: var(--gap-page-padding) var(--gap-page-padding) 0 var(--gap-page-padding);
    border-radius: var(--radius-page);
    display: flex;
    flex-direction: column;
  }
  .header {
    flex-shrink: 0;
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 3px solid;
    border-image: linear-gradient(to right, var(--primary-color-match-1), var(--primary-color-match-2), var(--primary-color)) 1;
  }
  .main {
    flex-grow: 1;
    display: flex;
    .nav {
      width: 220px;
      flex-shrink: 0;
      padding: 20px 20px 20px 0;
      border-right: 1px solid var(--border-default-color);
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
      padding: 20px 0 20px 20px;
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
