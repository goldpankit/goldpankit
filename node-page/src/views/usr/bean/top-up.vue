<template>
  <div class="recharge">
    <div class="wrap">
      <h2>{{$t('topUp.title')}}</h2>
      <ul class="prices">
        <li>
          <em>¥10</em>
          <p>{{ $t('topUp.getBeansTip', { value: 100 }) }}</p>
        </li>
        <li>
          <em>¥50</em>
          <p>{{ $t('topUp.getBeansTip', { value: 505 }) }}</p>
        </li>
        <li>
          <em>¥100</em>
          <p>{{ $t('topUp.getBeansTip', { value: 1024 }) }}</p>
        </li>
        <li>
          <em>¥200</em>
          <p>{{ $t('topUp.getBeansTip', { value: 2048 }) }}</p>
        </li>
        <li>
          <em>¥1000</em>
          <p>{{ $t('topUp.getBeansTip', { value: 10240 }) }}</p>
        </li>
        <li>
          <em>¥2000</em>
          <p>{{ $t('topUp.getBeansTip', { value: 20480 }) }}</p>
        </li>
      </ul>
      <div class="pay-methods-wrap">
        <p>{{$t('topUp.payTip')}}</p>
<!--        <h2>Pay methods</h2>-->
<!--        <ul class="pay-methods">-->
<!--          <li>-->
<!--            <img src="/images/wechatpay.png" alt="">-->
<!--            <span>微信支付</span>-->
<!--          </li>-->
<!--          <li>-->
<!--            <img src="/images/alipay.png" alt="">-->
<!--            <span>支付宝支付</span>-->
<!--          </li>-->
<!--        </ul>-->
      </div>
      <div class="qrcode-wrap">
        <div class="qrcode">
          <img src="/images/top-up.png">
        </div>
        <p>{{$t('topUp.scanTip')}}</p>
      </div>
    </div>
  </div>
</template>

<script>

import DirectorySelect from "../../../components/common/DirectorySelect.vue";

export default {
  name: "recharge",
  components: {DirectorySelect}
}
</script>

<style scoped lang="scss">
.recharge {
  display: flex;
  justify-content: center;
  .wrap {
    margin-top: 50px;
    width: 500px;
    background: var(--primary-color-reverse);
    box-shadow: var(--page-shadow);
    border-radius: var(--radius-page);
    padding: var(--gap-page-padding);
  }
  // 价格规格
  ul.prices {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    & > li {
      width: 33%;
      height: 105px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &.selected {
        color: var(--primary-color-match-2);
      }
      em {
        font-size: 20px;
        font-weight: bold;
      }
      p {
        margin-top: 5px;
      }
    }
  }
  // 支付方式
  .pay-methods-wrap {
    border-top: 1px solid var(--border-default-color);
    padding-top: 20px;
    h2 {
      margin-bottom: 10px;
      font-size: var(--font-size-middle);
    }
    ul.pay-methods {
      display: flex;
      li {
        width: 32%;
        height: 50px;
        margin-right: 10px;
        border: 1px solid var(--border-default-color);
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 25px;
          margin-right: 5px;
        }
      }
    }
  }
  // 二维码
  .qrcode-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    .qrcode {
      width: 145px;
      height: 145px;
      background: #eee;
      img {
        width: 100%;
        height: 100%;
      }
    }
    p {
      margin-top: 10px;
    }
  }
}
</style>
