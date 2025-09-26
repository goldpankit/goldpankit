<template>
  <div class="local-info">
    <div class="info-block">
      <h2>网络信息</h2>
      <ul>
        <li>
          <label>公网IP</label>
          <p class="text-danger">{{ localInfo.publicIP }}</p>
          <el-button size="small" type="primary" @click="copyText(localInfo.publicIP)">复制</el-button>
        </li>
        <li>
          <label>局域网IPv4</label>
          <p class="text-danger">{{ localInfo.ipv4 }}</p>
          <el-button size="small" type="primary" @click="copyText(localInfo.ipv4)">复制</el-button>
        </li>
        <li>
          <label>局域网IPv6</label>
          <p class="text-danger">{{ localInfo.ipv6 }}</p>
          <el-button size="small" type="primary" @click="copyText(localInfo.ipv6)">复制</el-button>
        </li>
        <li>
          <label>Mac</label>
          <p>{{ localInfo.mac }}</p>
          <el-button size="small" type="primary" @click="copyText(localInfo.mac)">复制</el-button>
        </li>
      </ul>
    </div>
    <div class="info-block">
      <h2>系统信息</h2>
      <ul>
        <li>
          <label>CPU</label>
          <p>{{ localInfo.cpu }}</p>
          <el-button size="small" type="primary" @click="copyText(localInfo.cpu)">复制</el-button>
        </li>
        <li>
          <label>操作系统内核</label>
          <p>{{ localInfo.os }}</p>
        </li>
        <li>
          <label>内存</label>
          <p>{{ localInfo.memory }}</p>
        </li>
        <!-- Windows系统不支持，暂不研究 -->
<!--        <li>-->
<!--          <label>硬盘</label>-->
<!--          <p>{{ localInfo.disk }}</p>-->
<!--        </li>-->
      </ul>
    </div>
    <div class="content-wrap">
      <div class="info-block">
        <h2>位置信息</h2>
        <ul>
          <li>
            <label>所在省份</label>
            <p>{{ localInfo.province }}</p>
          </li>
          <li>
            <label>所在城市</label>
            <p>{{ localInfo.city }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { fetchLocalInfo } from '@/api/local.info'
const axiosInstance = axios.create({
  timeout: 30000
})

export default {
  name: 'LocalInfo',
  data () {
    return {
      developers: ['刘大逵'],
      localInfo: {
        publicIP: 'pending...',
        province: 'pending...',
        city: 'pending...',
      }
    }
  },
  methods: {
    // 获取本地信息
    fetchLocalInfo () {
      fetchLocalInfo()
        .then(data => {
          this.localInfo = data
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 获取公网IP
    fetchPublicIP () {
      axiosInstance.get('https://ipinfo.io/json')
        .then(response => {
          console.log('response', response)
          this.localInfo.publicIP = response.data.ip
          this.localInfo.province = response.data.region
          this.localInfo.city = response.data.city
        })
        .catch(e => {
          console.error('获取公网IP失败', e.message)
          this.localInfo.publicIP = '获取失败'
          this.localInfo.province = '获取失败'
          this.localInfo.city = '获取失败'
        })
    }
  },
  created () {
    this.fetchLocalInfo()
    this.fetchPublicIP()
  },
  mounted () {
    this.$emit('on-rendered')
  }
}
</script>

<style scoped lang="scss">
.local-info {
  height: 100%;
  overflow-y: auto;
  padding: 30px;
}

// 信息块
.info-block {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  h2 {
    position: relative;
    padding-left: 15px;
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 15px;
    &::before {
      content: '';
      width: 5px;
      height: 12px;
      background-color: var(--primary-color);
      border-radius: 10px;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

// 信息列表
ul {
  li {
    padding: 12px 0;
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    label {
      flex-shrink: 0;
      width: 100px;
      text-align: right;
      color: var(--color-gray-deep);
      &::after {
        content: ": ";
        margin-left: 2px;
      }
    }
    p {
      font-weight: bold;
    }
    .el-button {
      position: absolute;
      right: 10px;
    }
  }
}
</style>
