<template>
  <div class="page">
    <div class="banner">
      <div class="wrap">
        <h2>Gold Pan Kit</h2>
        <h3>一分钟搭建框架！</h3>
        <div class="opera">
          <el-button @click="$router.push({name: 'SignUp'})" type="important">注册</el-button>
          <el-button type="important2" @click="$router.push({name: 'PublicServices'})">去搭框架</el-button>
        </div>
      </div>
    </div>
    <div class="content-wrap">
      <div class="content what-content">
        <div class="wrap" style="padding-top: 50px; padding-bottom: 50px;">
          <h3>WHAT is the KIT？</h3>
          <ul class="words">
            <li>KIT只干一件事 —— 搭框架！</li>
            <li>你可以在这里快速构建出各个技术框架！</li>
            <li>你也可以在这里快速构建出一整套系统！</li>
            <li>你还可以通过插件随时丰富框架或系统！</li>
          </ul>
        </div>
      </div>
      <div class="content human-content">
        <div class="wrap">
          <h3>适用人群</h3>
          <div class="group-wrap">
            <div class="group">
              <img src="/images/index/student.svg" alt="IT从业者和学生党"/>
              <h4>IT从业者和学生党——成熟框架，快速搭建</h4>
              <p>KIT让框架和系统的构建变得极其简单，无论是学习还是为公司构建系统，都可以快速完成，避免手动构建遇到的种种问题！</p>
            </div>
            <div class="group">
              <img class="group-img-author" src="/images/index/author.svg" alt="开源作者/外包软件公司"/>
              <h4>开源作者——持续发展，灵活变现</h4>
              <p>KIT提供源码翻译器，可基于现有的源码快速改造出动态的框架或系统。同时KIT还提供强大的插件开发功能，可以为项目持续开发插件，保证项目的持续发展。</p>
            </div>
          </div>
          <div class="group-wrap">
            <div class="group">
              <img src="/images/index/min-company.svg" alt="外包软件企业"/>
              <h4 style="margin-top: 10px;">外包软件企业——快速构建，高效交付</h4>
              <p>基于KIT丰富的框架和系统，企业可以通过直接在KIT上构建业务系统，实现快速交付。还可发布企业积累的项目源码进行售卖，提高影响力！</p>
            </div>
            <div class="group">
              <img src="/images/index/company.svg" alt="大型软件公司"/>
              <h4 style="margin-top: 10px;">大型软件企业——高度规范，增强产出</h4>
              <p>基于KIT提供的源码翻译器，企业可快速将内部框架私有化，实现技术团队编码高度规范化。基于强大的插件开发功能，可显著提高研发效率，增强产出密度！</p>
            </div>
          </div>
        </div>
      </div>
      <div class="content history-content">
        <div class="wrap">
          <h3>发展历史</h3>
          <el-timeline>
            <el-timeline-item timestamp="2019/3/16" placement="top">
              <el-card>
                <h4>KIT前身发布</h4>
                <p>2019年3月16日正式发布<a href="http://coderd.adjustrd.com" target="_blank">懒猴子CG</a>，之后更名为CodeRd。</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2021/3/8" placement="top">
              <el-card>
                <h4>公司成立</h4>
                <p>经过近两年的发展，2021年3月8日于湖南省郴州市桂阳县成立了阿茄思特网络技术有限公司，注册资金100万元。</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2023/5/9" placement="top">
              <el-card>
                <h4>获用户投资</h4>
                <p>2022年5月9日，因项目资金短缺，向用户发起融资。共获得了崔易、朱晨辉、赵鹏、林郴、常洋、赵浩、曹宝红、侯泽为、李寻飞9人累计4万元的投资款。</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2023/5/20" placement="top">
              <el-card>
                <h4>获天使轮投资</h4>
                <p>2023年5月20日获得了「清华海峡院高端装备技术研究中心」天使轮投资，并纳入「清华海峡院」专利项目。</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2023/8/17" placement="top">
              <el-card>
                <h4>KIT发布</h4>
                <p>将CodeRd进行了全面的重构，采用了新的架构和设计，解决了CodeRd的瓶颈问题，2023年8月17日首次发布KIT v1.1.0。</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2024/7/10" placement="top">
              <el-card>
                <h4>稳定版发布</h4>
                <p>经过近一年的更新迭代，2024年7月10日发布KIT稳定版本2.9.3。</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2024/7/19" placement="top">
              <el-card>
                <h4>官网上线</h4>
                <p>缩减KIT本身的功能，成就线上版本！2024年7月19日，KIT官网正式上线。</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <div class="content about-me">
        <div class="wrap">
          <h3>继续了解</h3>
          <ul>
            <li>
              <div class="img-wrap">
                <img src="/images/wechat.png" alt="微信二维码"/>
              </div>
              <label>微信扫码加入交流群</label>
            </li>
            <li>
              <div class="img-wrap">
                <img src="/images/douyin.png" alt="抖音二维码"/>
              </div>
              <label>关注抖音不迷路</label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// definePageMeta({
//   layout: 'blank'
// })
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  overflow-y: auto;
  --title-font-size: 75px;
  --sub-title-font-size: 30px;
  --gap: 50px;
  --gap-page-padding: 30px;
  --width: 1200px;
  --min-width: 1200px;
  .banner {
    --width: 100%;
    --height: 800px;
    --button-width: 245px;
    --button-height: 60px;
  }
  .content-wrap {
    --top: -150px;
    --title-font-size: 40px;
    --sub-title-font-size: 22px;
    --words-font-size: 20px;
    --border-radius: 100px;
    .group {
      --padding: 50px;
      p {
        --font-size: 14px;
      }
    }
  }
}
.banner {
  width: var(--width);
  min-width: var(--min-width);
  height: var(--height);
  // animation: changeBackground 10s ease-in-out infinite alternate;
  background: #2e3444;
  position: relative;
  overflow: hidden;
  .wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: var(--color-light);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
    .opera {
      margin-top: var(--gap);
      .el-button {
        width: var(--button-width);
        height: var(--button-height);
        font-size: 18px;
        border-radius: 100px;
        margin-right: 20px;
        &:last-of-type {
          margin-right: 0;
        }
      }
    }
  }
  h2 {
    font-size: var(--title-font-size);
    margin-bottom: 20px;
    text-shadow: 0 0 5px #ab5155;
  }
  h3 {
    width: 800px;
    font-size: var(--sub-title-font-size);
    margin-bottom: 15px;
    text-align: center;
  }
  p {
    width: 600px;
    font-size: var(--font-size-middle);
    letter-spacing: 1px;
    text-align: center;
    margin-bottom: 15px;
    line-height: 30px;
  }
}
.content-wrap {
  width: var(--width);
  min-width: var(--min-width);
  margin: 0 auto;
  position: relative;
  top: var(--top);
  box-shadow: 0 0 20px -10px #999;
  border-radius: var(--border-radius);
  overflow: hidden;
}
.content {
  background: var(--color-light);
  padding: 30px 0;
  .wrap {
    width: 90%;
    margin: 0 auto;
    padding: var(--gap-page-padding);
    padding-top: 0;
    padding-bottom: 0;
    h3 {
      text-align: center;
      font-size: var(--title-font-size);
    }
    ul {
      margin: 30px 0;
      li {
        &:last-of-type {
          margin-bottom: 0 !important;
          padding-bottom: 0;
        }
        p {
          margin-top: 20px;
        }
      }
    }
    p {
      font-size: var(--words-font-size);
    }
    .opera {
      display: flex;
      justify-content: center;
      margin-top: 100px;
      .el-button {
        width: 255px;
        height: 80px;
        font-size: 20px;
      }
    }
  }
}
// 什么是KIT
.content.what-content {
  background-color: var(--primary-color-match-1);
  .wrap {
    padding-left: 550px;
    background: url('/images/coding_boy.svg') no-repeat;
    background-size: 520px auto;
    background-position: 0 150px;
    ul {
      li {
        font-size: var(--words-font-size);
        margin-bottom: 20px;
      }
    }
  }
}
// 适用人群
.content.human-content {
  padding-top: 60px;
  .group-wrap {
    display: flex;
    justify-content: space-between;
    .group {
      width: 48.5%;
      flex-shrink: 0;
      margin-top: var(--padding);
      padding: var(--padding);
      border: 1px solid #eee;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #f7f7f7;
      border-radius: 10px;
      h4 {
        font-size: var(--sub-title-font-size);
      }
      img {
        width: 80px;
        height: 80px;
        &.group-img-author {
          transform: scale(1.5);
        }
      }
      p {
        margin-top: 20px;
        font-size: var(--font-size);
        color: #999;
        text-align: center;
        line-height: 1.5;
      }
    }
  }
}
// 开始使用
.content.guide-content {
  background-color: #2e3444;
  color: #fff;
}
// 发展历史
.content.history-content {
  // 时间线
  .el-timeline {
    margin-bottom: 0;
  }
  .el-card {
    border-radius: 100px;
    padding: 20px 100px;
    box-shadow: none;
    border-width: 5px;
    h4 {
      font-size: 20px;
    }
    p {
      font-size: 15px;
    }
  }
}
// 关注
.content.about-me {
  ul {
    display: flex;
    justify-content: center;
    margin-top: 50px;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      label {
        margin-top: 20px;
        font-size: 20px;
      }
      .img-wrap {
        border: 10px solid #222e5e;
        border-radius: 50%;
        overflow: hidden;
        width: 300px;
        height: 300px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      &:first-of-type {
        margin-right: 200px;
        .img-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          border: 10px solid #000000;
          img {
            width: 230px;
            height: 230px;
          }
        }
      }
    }
  }
}
footer {
  display: flex;
  justify-content: center;
  padding: 50px;
}
@keyframes changeBackground {
  0%   { background-color: #FC777D; }
  100% { background-color: #2d1516; }
}
</style>
