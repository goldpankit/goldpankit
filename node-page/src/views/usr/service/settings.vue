<template>
  <div class="page">
    <div class="wrap">
      <div class="header">
        <h2>Eva for SpringBoot</h2>
        <div v-if="service.initialized" class="opera">
          <el-button>Push</el-button>
          <el-button>Pull</el-button>
          <el-button type="reverse">Publish</el-button>
        </div>
      </div>
      <div class="main">
        <template v-if="service.initialized">
          <div class="nav">
            <ul class="tabs">
              <li class="selected">Files</li>
              <li>Variables</li>
            </ul>
            <SettingFiles/>
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
        </template>
        <template v-else>
          <div class="initialize-wrap">
            <div class="tip">
              <h3>Initialize Service</h3>
              <p>You must first specify or create a local directory and initialize the service. Then you can code the service in the specified local directory.</p>
            </div>
            <div class="directory-select-wrap">
              <DirectorySelect title="Select Service Folder"/>
            </div>
            <div class="opera-bottom">
              <el-button type="important" size="large">Initialize Service</el-button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import SettingFiles from "../../../components/service/settings/SettingFiles.vue";
import DirectorySelect from "../../../components/common/DirectorySelect.vue";

export default {
  components: {DirectorySelect, SettingFiles},
  data () {
    return {
      service: {
        initialized: false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  padding-bottom: var(--gap-page-bottom);
  overflow-y: auto;
  .wrap {
    width: var(--page-width);
    margin: 0 auto;
    box-shadow: var(--page-shadow);
    background: var(--color-light);
    padding: var(--gap-page-padding);
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
    // 文件&变量区域
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
    }
    // 设置区域
    .settings-wrap {
      flex-grow: 1;
      background: var(--color-light);
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
    // 初始化
    .initialize-wrap {
      width: 650px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      padding-top: var(--gap-page-bottom);
      .tip {
        text-align: center;
        h3 {
          margin-bottom: 20px;
          font-size: var(--font-size-large);
        }
        p {
          font-size: var(--font-size-middle);
          line-height: 1.5;
        }
      }
      .directory-select-wrap {
        margin-top: 20px;
        box-shadow: var(--form-shadow);
        border-radius: var(--radius-page);
      }
      .opera-bottom {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        .el-button {
          font-size: var(--font-size-middle);
        }
      }
    }
  }
}
</style>
