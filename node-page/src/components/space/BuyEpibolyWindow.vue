<template>
  <el-dialog
    v-model="visible"
    title="购买技术支持"
    width="600"
    align-center
    class="buy-window"
  >
    <div class="message-wrap">
      <p>此购买方式适用于需要我方进行项目定制、维护和部署的用户，我们将为您提供全面的技术支持和产品建议。如需要开发定制化的功能，下单后可与我方说明需求，我们将进行大致的价格估算（另收费），如未能达成协议，我方不会收取任何费用，确认下单「{{ project.label }}」系统吗？</p>
    </div>
    <div class="step-wrap">
      <h3>服务流程（无定制化需求）</h3>
      <el-steps align-center>
        <el-step title="确认下单" />
        <el-step title="获得联系二维码" />
        <el-step title="支付款项" />
        <el-step title="部署上线" />
        <el-step title="交付源码" />
      </el-steps>
    </div>
    <template #footer>
      <div class="price-wrap">
        <label>订单金额</label>
        <span class="text-price">{{ project.price < 3000 ? 3000 : project.price }}</span>
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
      <p>请复制订单号，并扫描下方二维码添加我方微信做进一步咨询、说明和付款，完成后我们将尽快为您部署项目并提供一年免费维护！</p>
    </div>
    <div class="qr-code-wrap">
      <img src="/images/wechat.png" alt="金镐技术社区微信二维码">
      <label>请备注：技术支持</label>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import IconSuccess from '@/components/common/IconSuccess'
import { createEpibolyOrder } from '@/api/user.order'
import copy from 'copy-to-clipboard'

export default {
  name: 'BuyEpibolyWindow',
  components: { IconSuccess },
  data () {
    return {
      visible: false,
      visibleContactUs: false,
      project: null,
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
    open (project) {
      this.project = project
      this.serialNumber = null
      this.copied = false
      this.visible = true
    },
    // 确认下单
    confirmOrder () {
      // 未登录
      if (this.userInfo == null) {
        this.$router.push('/signin')
        return
      }
      createEpibolyOrder({
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
  padding: 30px 0;
  border-top: 1px solid var(--border-default-color);
  h3 {
    margin-bottom: 20px;
    text-align: center;
  }
  :deep(.el-step__icon) {
    border-width: 1px;
    border-color: var(--font-color);
    .el-step__icon-inner {
      font-weight: normal;
      color: var(--font-color);
    }
  }
  :deep(.el-step__title) {
    font-size: 13px;
    color: var(--font-color);
    font-weight: normal;
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
