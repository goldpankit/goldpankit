<template>
  <div v-if="projectProfile != null" class="page">
    <!-- 顶部横幅 -->
    <div class="banner">
      <div class="banner-particles" :style="{ backgroundImage: `url(${getImageUri(projectProfile.cover)})` }"></div>
      <div class="banner-wrap">
        <div class="banner-content">
          <h1 class="banner-title">
            <span class="tech-text">
              {{ projectProfile.label == null ? projectProfile.name : projectProfile.label }}
            </span>
          </h1>
          <div class="banner-line"></div>
          <p class="banner-desc">{{ projectProfile.introduce }}</p>
        </div>
        <!-- 价格 -->
        <div v-if="projectProfile.price > 0 || projectProfile.epibolyPrice > 0" class="price-wrap">
          <template v-if="projectProfile.price > 0">
            <p>
              <label>源码价格为</label>
              <span class="text-price code-price">{{ projectProfile.price }}</span>
              <label>，次年仅需</label>
              <span class="text-price code-price">{{ projectProfile.maintenancePrice }}</span>
            </p>
            <p class="text-mini">（次年收取的为维护费，维护期间内依然可自行部署和升级）</p>
          </template>
          <p v-if="projectProfile.price > 0 && projectProfile.epibolyPrice > 0" class="space-holder"></p>
          <template v-if="projectProfile.epibolyPrice > 0">
            <p>
              <label>由我方提供技术支持，价格为</label>
              <span class="text-price deploy-price">{{ projectProfile.epibolyPrice }}</span>
            </p>
            <p class="text-mini">（不包含服务器、域名等第三方费用）</p>
            <p>
              <label>免费维护</label>
              <em>1</em>
              <label>年</label>
            </p>
          </template>
        </div>
        <div class="action-buttons">
          <template v-if="projectProfile.price > 0">
            <p v-if="lastEndTime != null" class="end-time-text">您已购买本系统源码，有效期至：{{ lastEndTime }}（剩余{{ $getRemainingDay(lastEndTime) }}天）</p>
            <el-button
              type="primary"
              @click="$refs.buySourceCodeWindow.open(projectProfile, lastEndTime != null)"
            >{{ lastEndTime == null ? '购买源码' : '延长使用期限' }}</el-button>
          </template>
          <el-button
            v-if="projectProfile.epibolyPrice > 0"
            type="important"
            @click="$refs.buyEpibolyWindow.open(projectProfile)"
          >{{ projectProfile.price == null || projectProfile.price === 0 ? '获取技术支持' : '需要技术支持' }}</el-button>
          <el-button
            v-if="projectProfile.techDocUrl != null && projectProfile.techDocUrl !== ''"
            class="pc-only"
            @click="openDoc"
          >查看技术文档</el-button>
        </div>
      </div>
    </div>

    <!-- 代码工程 -->
    <div class="section">
      <h2 class="section-title"><span class="tech-highlight">代码工程</span></h2>
      <div class="project-grid">
        <a
          v-for="codeProject in projectProfile.services"
          class="project-card"
          :key="codeProject.name"
          :href="`/space/framework?p=${projectProfile.name}&n=${codeProject.name}`"
        >
          <div class="card-glow"></div>
          <div class="project-info">
            <h3 class="project-name">{{ codeProject.label }}</h3>
          </div>
          <p class="project-desc">{{ codeProject.introduce }}</p>
          <div class="project-meta">
            <div class="meta-item">
              <span class="meta-label">最后发布日期：</span>
              <span class="meta-value">{{ codeProject.lastPublish }}</span>
            </div>
          </div>
        </a>
      </div>
    </div>
    <!-- 详情 -->
    <div class="detail-wrap">
      <MarkdownEditor
        v-model="projectProfile.description"
        :readonly="true"
      />
    </div>
    <!-- 购买源码下单窗口 -->
    <BuySourceCodeWindow ref="buySourceCodeWindow"/>
    <!-- 部署源码下单窗口 -->
    <BuyEpibolyWindow ref="buyEpibolyWindow"/>
  </div>
</template>

<script >
import MarkdownEditor from '@/components/common/MarkdownEditor'
import BuySourceCodeWindow from '@/components/space/BuySourceCodeWindow'
import BuyEpibolyWindow from '@/components/space/BuyEpibolyWindow'
import { fetchByName } from '@/api/service.space'
import { fetchEndTime } from '@/api/user.order'

export default {
  components: {
    MarkdownEditor,
    BuySourceCodeWindow,
    BuyEpibolyWindow
  },
  data () {
    return {
      // 购买的生效日期
      lastEndTime: null,
      // 项目信息
      projectProfile: null
    }
  },
  methods: {
    init () {
      Promise.all([
        fetchByName(this.$route.query.p),
        fetchEndTime(this.$route.query.p)
      ])
        .then(([space, endTime]) => {
          this.projectProfile = space
          this.lastEndTime = endTime
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 打开文档
    openDoc () {
      window.open(this.projectProfile.techDocUrl)
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

// 顶部横幅
.banner {
  position: relative;
  padding: 120px 0;
  text-align: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMTI4LCAxNjgsIDI1NSwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIj48L3JlY3Q+PC9zdmc+');
    opacity: 0.3;
    z-index: 0;
  }

  .banner-particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // 增加高斯模糊
    filter: blur(50px);
    opacity: .2;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .banner-wrap {
    max-width: 1200px;
    position: relative;
    z-index: 9;
    margin: 0 auto;
  }

  .banner-content {
    padding: 0 20px;
  }

  .banner-title {
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 25px;
    color: #333;
    letter-spacing: 1px;
  }

  .banner-line {
    width: 120px;
    height: 3px;
    background: linear-gradient(90deg, var(--primary-color-match-2), var(--primary-color-match-1));
    margin: 0 auto 25px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: -3px;
      left: 0;
      width: 30px;
      height: 9px;
      background: var(--primary-color-match-2);
      border-radius: 4px;
      animation: lineMove 3s infinite;
    }
  }

  .banner-desc {
    font-size: 16px;
    line-height: 1.8;
    max-width: 800px;
    margin: 0 auto;
    color: #333;
  }
  .price-wrap {
    padding-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .text-price {
      margin: 0 5px;
    }
    p {
      margin: 0;
      font-size: 16px;
      display: flex;
      align-items: flex-end;
      &:last-of-type {
        margin-bottom: 0;
      }
      &.text-mini {
        font-size: 12px;
        margin: 10px 0;
      }
      &.space-holder {
        height: 12px;
      }
      em {
        color: var(--color-danger);
        font-weight: bold;
        font-size: var(--font-size-large);
        font-style: normal;
        margin: 0 5px;
      }
    }
  }
  .action-buttons {
    margin-top: 30px;
    // 有效期
    .end-time-text {
      margin-bottom: 20px;
      font-weight: bold;
      font-size: var(--font-size-middle);
    }
    .el-button {
      width: 200px;
      height: 60px;
      font-size: var(--font-size-middle);
      border-radius: 100px;
      cursor: pointer;
    }
  }
}

@keyframes lineMove {
  0% { left: 0; }
  50% { left: calc(100% - 30px); }
  100% { left: 0; }
}

// 内容区域通用样式
.section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 0;

  .section-title {
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 50px;
    position: relative;

    .tech-highlight {
      position: relative;
      display: inline-block;
      color: #333;

      &::before {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 2px;
        background: linear-gradient(90deg, var(--primary-color-match-1), var(--primary-color-match-2));
      }

      &::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--primary-color-match-2);
        margin-bottom: -2px;
        box-shadow: 0 0 10px var(--primary-color-match-2);
      }
    }
  }
}

// 项目卡片网格
.project-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  perspective: 1000px;
}

// 项目卡片
.project-card {
  position: relative;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(76, 175, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(76, 175, 255, 0.1);
  padding: 28px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  z-index: 1;

  .card-glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(76, 175, 255, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: -1;
  }

  &:hover {
    cursor: pointer;
    .card-glow {
      opacity: 1;
    }
    &::after {
      opacity: 1;
    }
    .project-name {
      background-position: 0%;
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary-color-match-1), var(--primary-color-match-2));
    opacity: 0.5;
    transition: opacity 0.3s ease;
  }

  .project-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .project-name {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-service-name);
    margin: 0;
  }

  .project-desc {
    color: #555;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 24px;
    height: 45px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .project-meta {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: rgba(224, 230, 240, 0.5);
    border-top: 1px solid rgba(76, 175, 255, 0.1);
    padding-top: 15px;

    .meta-label {
      color: var(--color-gray-deep);
    }

    .meta-value {
      color: var(--color-gray-deep);
      font-weight: 500;
    }
  }
}
.detail-wrap {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  :deep(.markdown-editor) {
    // 包含图片的<p>特殊处理，实现图片的无缝衔接
    p:has(> img) {
      line-height: 0;
      font-size: 0;
      margin: 0;
      padding: 0;
    }
    img {
      max-width: 100%;
    }
    .vuepress-markdown-body {
      padding: 32px 40px;
    }
  }
}
</style>
