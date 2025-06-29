<template>
  <el-dialog
    v-model="visible"
    title="购买源码"
    width="600"
    align-center
    class="buy-window"
  >
    <div class="message-wrap">
      <p v-if="isRenewal">您已购买该项目源码，确认额外支付{{project.maintenancePrice}}元延长1年「{{ project.label }}」源码的使用期限吗？</p>
      <p v-else>此购买方式适用于外包企业或个人开发者用户，购买后，源码可通过社区站点或Node客户端进行构建和下载，有效期1年，次年仅收取维护费即可延续使用！有效期内可不限次数对源码进行升级、部署和使用工程插件生成代码，并可获得系统的技术问答支持，确认下单购买「{{ project.label }}」系统源码吗？</p>
    </div>
    <template #footer>
      <div class="price-wrap">
        <label>订单金额</label>
        <span class="text-price">
          <template v-if="isRenewal">{{project.maintenancePrice}}</template>
          <template v-else>{{ project.price }}</template>
        </span>
      </div>
      <div class="dialog-footer">
        <el-button @click="visible = false">再想想</el-button>
        <el-button type="primary" @click="confirmOrder">
          {{ userInfo == null ? '登录后下单' : '确认下单' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="visibleContactUs"
    title="下单成功"
    width="600"
    align-center
  >
    <div class="icon-wrap">
      <IconSuccess/>
      <h2>下单成功，谢谢您的信任</h2>
      <p>{{ serialNumber }}</p>
      <div v-if="copied" class="copied-text">
        <span>订单号已复制</span>
        <el-icon><Check/></el-icon>
      </div>
      <el-button v-else type="primary" @click="copySerialNumber">复制订单号</el-button>
    </div>
    <div class="message-wrap">
      <p>请扫描下方二维码添加我方微信进行付款，完成后即可立即构建项目源码！同时我们将邀请您进入KIT付费用户群，以更好的为您提供技术支持和服务。</p>
    </div>
    <div class="qr-code-wrap">
      <img src="/images/wechat.png" alt="金镐技术社区微信二维码">
      <label>请备注：购买源码</label>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import IconSuccess from '@/components/common/IconSuccess'
import { createCodeOrder } from '@/api/user.order'
import copy from 'copy-to-clipboard'

export default {
  name: 'BuySourceCodeWindow',
  components: { IconSuccess },
  data () {
    return {
      visible: false,
      visibleContactUs: false,
      project: null,
      // 是否为续费
      isRenewal: false,
      // 订单编号
      serialNumber: null,
      // 是否已复制订单号
      copied: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    // 打开窗口
    open (project, isRenewal = false) {
      this.project = project
      this.serialNumber = null
      this.copied = false
      this.isRenewal = isRenewal
      this.visible = true
    },
    // 确认下单
    confirmOrder () {
      // 未登录
      if (this.userInfo == null) {
        this.$router.push('/signin')
        return
      }
      createCodeOrder({
        spaceName: this.project.name
      })
        .then(serialNumber => {
          this.serialNumber = serialNumber
          this.visible = false
          this.visibleContactUs = true
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 复制订单号
    copySerialNumber () {
      copy(this.serialNumber)
      this.copied = true
    }
  }
}
</script>

<style scoped lang="scss">
.icon-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
  border-bottom: 1px solid var(--border-default-color);
  h2 {
    font-size: var(--font-size-large);
    margin-top: 10px;
  }
  p {
    color: var(--primary-color-common);
    margin: 10px;
  }
  .copied-text {
    display: flex;
    align-items: center;
    .el-icon {
      margin-left: 5px;
    }
  }
}
.message-wrap {
  padding: 30px 0;
  text-align: center;
  font-size: var(--font-size-middle);
  p {
    font-weight: bold;
    line-height: 1.8;
  }
}
.price-wrap {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  .text-price {
    position: relative;
    top: 2px;
  }
}
.step-wrap {
  h3 {
    margin-bottom: 20px;
    text-align: center;
  }
}
.qr-code-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top: 1px solid var(--border-default-color);
  padding: 30px 0;
  img {
    width: 200px;
    height: 200px;
  }
}
</style>
