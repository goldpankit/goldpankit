<template>
  <div class="page">
    <div class="page-content">
      <Head>
        <Title>程序选购 - 金镐技术社区</Title>
        <Meta name="keywords" :content="`程序在线选购 源码交易平台`" />
      </Head>
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="tech-title">每套系统均由金镐开源组织研发</h1>
        <h2 class="tech-subtitle">清华技术团队，10余年技术深耕</h2>
      </div>

      <!-- 产品展示区 -->
      <div class="products-container">
        <a
          v-for="project in projects"
          :key="project.name"
          class="product-card tech-card"
          :href="`/space/profile?p=${project.name}`" target="_blank"
        >
          <!-- 产品信息区域 -->
          <div class="product-info">
            <div class="product-header">
              <h2>{{ project.label == null ? project.name : project.label }}</h2>
            </div>

            <!-- 功能特点列表 -->
            <ul class="feature-list">
              <li v-for="(feature,index) in getFeatures(project)" :key="index">{{ feature }}</li>
            </ul>

            <!-- 价格 -->
            <div>
              <div class="text-price">{{ project.price }}</div>
            </div>
          </div>

          <!-- 产品预览图 -->
          <div class="product-preview tech-preview">
            <div class="tech-frame">
              <img :src="getImageUri(project.cover)" :alt="project.name">
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/service.space'
export default {
  data () {
    return {
      projects: []
    }
  },
  methods: {
    // 查询项目列表
    fetchList() {
      fetchList()
        .then(data => {
          this.projects = data
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    },
    // 获取项目特征
    getFeatures (project) {
      if (project.features == null || project.features === '') {
        return []
      }
      return project.features.split('\n')
    }
  },
  created () {
    this.fetchList()
  }
}
</script>

<style lang="scss" scoped>
// 页面整体样式
.page {
  padding: 40px 20px;
  height: 100%;
  overflow-y: auto;
  color: #333;
}

// 页面内容
.page-content {
  max-width: 1200px;
  margin: 0 auto;
}

// 页面标题样式
.page-header {
  text-align: center;
  margin-bottom: 60px;

  .tech-title {
    font-size: 42px;
    background: linear-gradient(120deg, var(--primary-color-match-2) 0%, var(--primary-color-match-1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 16px;
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--primary-color-match-2), var(--primary-color-match-2), transparent);
    }
  }

  .tech-subtitle {
    font-size: 20px;
    color: #666;
    text-shadow: 0 0 10px rgba(102, 102, 102, 0.3);
    font-weight: normal;
  }
}

// 产品展示区样式
.products-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

// 产品卡片样式
.tech-card {
  height: 540px;
  display: flex;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  margin-bottom: 30px;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);

    &::before {
      opacity: 1;
    }
  }

  // 产品信息区域
  .product-info {
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  // 产品标题区域
  .product-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    h2 {
      font-size: 28px;
      color: #1a1a1a;
      margin-right: 12px;
      font-weight: 600;
    }
  }

  // 功能特点列表
  .feature-list {
    list-style: none;
    padding: 0;
    margin: 0 0 30px 0;

    li {
      position: relative;
      padding-left: 28px;
      margin-bottom: 16px;
      color: #444;
      font-size: 15px;

      &:before {
        content: "✓";
        position: absolute;
        left: 0;
        color: #00C853;
        font-weight: bold;
      }
    }
  }

  // 产品预览图区域
  .tech-preview {
    box-sizing: border-box;
    width: 700px;
    padding: 30px;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.5);
    position: relative;

    .tech-frame {
      position: absolute;
      top: -30px;
      bottom: 35px;
      right: -10px;
      width: 100%;
      img {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        z-index: 1;
        transition: transform 0.3s ease;
        object-fit: cover;
        &:hover {
          transform: scale(1.02);
        }
      }
    }
  }
}

// 响应式布局
@media (max-width: 1024px) {
  .product-card {
    flex-direction: column;

    .product-preview {
      width: 100%;
      padding: 20px;
    }
  }
}
</style>
