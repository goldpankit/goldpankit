<template>
  <el-dialog
    v-model="visible"
    class="vip-expired-window"
    width="500px"
  >
    <div class="wrap">
      <h2>您的账号已过期，请添加下方微信，我们的客服人员会为您续费会员！</h2>
      <div class="wechat-wrap">
        <img src="/images/wechat.png"/>
        <span>小艺</span>
      </div>
      <div class="price-wrap">
        <h4>价格套餐</h4>
        <el-table :data="priceTableData">
          <el-table-column align="center" prop="dayCount" label="时长"/>
          <el-table-column align="center" prop="price" class-name="price" label="价格"/>
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'VipExpiredWindow',
  data () {
    return {
      visible: false,
      // 价格表
      priceTableData: [
        { dayCount: '90天', price: '299元' },
        { dayCount: '365天', price: '799元' }
      ]
    }
  },
  methods: {
    open () {
      this.visible = true
    }
  }
}
</script>

<style lang="scss">
.vip-expired-window {
  .wrap {
    padding: 0 30px 50px 30px;
    background-color: var(--color-light);
    box-sizing: border-box;
    // 头部
    h2 {
      padding: 10px 0 60px 0;
      font-size: 20px;
    }
    // 微信图片
    .wechat-wrap {
      margin: 20px 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 255px;
      }
    }
    // 价格套操
    .price-wrap {
      h4 {
        text-align: center;
        font-size: 16px;
      }
      ::v-deep(.el-table) {
        tbody {
          .cell {
            font-size: 20px;
          }
          .price {
            color: var(--primary-color-match-2);
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
