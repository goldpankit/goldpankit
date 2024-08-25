<template>
  <div class="page">
    <div class="banner">
      <div class="dynamic-background">
        <svg class="wave-top" width="100%" viewBox="0 0 1200 250">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0 108.306L50 114.323C100 120.34 200 132.374 300 168.476C400 204.578 500 264.749 600 246.698C700 228.647 800 132.374 900 108.306C1000 84.2382 1100 132.374 1150 156.442L1200 180.51V-8.5451e-06H1150C1100 -8.5451e-06 1000 -8.5451e-06 900 -8.5451e-06C800 -8.5451e-06 700 -8.5451e-06 600 -8.5451e-06C500 -8.5451e-06 400 -8.5451e-06 300 -8.5451e-06C200 -8.5451e-06 100 -8.5451e-06 50 -8.5451e-06H0V108.306Z" fill="#fafafa"/>
        </svg>
      </div>
      <div class="wrap">
        <h2>Gold Pan Kit</h2>
        <h3>{{ slogan.message }}</h3>
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

<script>
import anime from 'animejs/lib/anime.es.js';
export default {
  data () {
    return {
      slogan: {
        messageTimeout: null,
        letterTimeout: null,
        deleteTimeout: null,
        messages: ['一分钟搭建框架！', '灵活的功能和技术栈选配！'],
        message: '一分钟搭建框架！'
      }
    }
  },
  methods: {
    // 开启口号动画
    startSloganAnimation () {
      this.slogan.message = ''
      this.__outputMessage(this.slogan.messages, 0, 0)
    },
    // 开启banner动画
    startBannerAnimation () {
      const wave1 = "M0 108.306L50 114.323C100 120.34 200 132.374 300 168.476C400 204.578 500 264.749 600 246.698C700 228.647 800 132.374 900 108.306C1000 84.2382 1100 132.374 1150 156.442L1200 180.51V0H1150C1100 0 1000 0 900 0C800 0 700 0 600 0C500 0 400 0 300 0C200 0 100 0 50 0H0V108.306Z",
        wave2 = "M0 250L50 244.048C100 238.095 200 226.19 300 226.19C400 226.19 500 238.095 600 232.143C700 226.19 800 202.381 900 196.429C1000 190.476 1100 202.381 1150 208.333L1200 214.286V0H1150C1100 0 1000 0 900 0C800 0 700 0 600 0C500 0 400 0 300 0C200 0 100 0 50 0H0V250Z",
        wave3 = "M0 250L50 238.095C100 226.19 200 202.381 300 166.667C400 130.952 500 83.3333 600 101.19C700 119.048 800 202.381 900 214.286C1000 226.19 1100 166.667 1150 136.905L1200 107.143V0H1150C1100 0 1000 0 900 0C800 0 700 0 600 0C500 0 400 0 300 0C200 0 100 0 50 0H0V250Z",
        wave4 = "M0 125L50 111.111C100 97.2222 200 69.4444 300 97.2222C400 125 500 208.333 600 236.111C700 263.889 800 236.111 900 229.167C1000 222.222 1100 236.111 1150 243.056L1200 250V0H1150C1100 0 1000 0 900 0C800 0 700 0 600 0C500 0 400 0 300 0C200 0 100 0 50 0H0V125Z";

      anime({
        targets: '.wave-top > path',
        easing: 'linear',
        duration: 15000,
        loop: true,
        d: [
          { value: [wave1, wave2] },
          { value: wave3 },
          { value: wave4 },
          { value: wave1 },
        ],
      });
    },
    // 输出消息
    __outputMessage (messages, index, timeout = 5000) {
      this.slogan.messageTimeout = setTimeout(() => {
        this.slogan.message = ''
        this.__outputLetters(messages[index].split(''), 0)
        setTimeout(() => {
          this.__deleteLetters()
        }, 3000)
        if (index < messages.length - 1) {
          this.__outputMessage(messages, index + 1)
        } else {
          this.__outputMessage(messages, 0)
        }
      }, timeout)
    },
    // 输出字符
    __outputLetters (letters, index) {
      this.slogan.letterTimeout = setTimeout(() => {
        this.slogan.message += letters[index]
        if (index < letters.length - 1) {
          this.__outputLetters(letters, index + 1)
        }
      }, 150)
    },
    // 删除字符
    __deleteLetters () {
      this.slogan.deleteTimeout = setTimeout(() => {
        this.slogan.message = this.slogan.message.slice(0, -1)
        if (this.slogan.message.length > 0) {
          this.__deleteLetters()
        }
      }, 50)
    }
  },
  mounted () {
    // 开启口号动画
    this.startSloganAnimation()
    // 开启banner动画
    this.startBannerAnimation()

    // 解决浏览器页签切换时口号输出不正确的问题
    document.addEventListener('visibilitychange', () => {
      // 页签显示开启口号动画
      if (document.visibilityState === 'visible') {
        this.startSloganAnimation()
      }
      // 页签隐藏关闭口号动画
      else {
        if (this.slogan.letterTimeout != null) {
          clearTimeout(this.slogan.letterTimeout)
        }
        if (this.slogan.messageTimeout != null) {
          clearTimeout(this.slogan.messageTimeout)
        }
        if (this.slogan.deleteTimeout != null) {
          clearTimeout(this.slogan.deleteTimeout)
        }
      }
    })
  }
}
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
  .dynamic-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    svg {
      transform: rotate(180deg);
      position: absolute;
      bottom: 0;
    }
  }
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
        box-shadow: 0 0 10px -5px #000;
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
    height: 40px;
    font-size: var(--sub-title-font-size);
    margin-bottom: 15px;
    text-align: center;
    position: relative;
    &::after {
      content: '';
      width: 2px;
      height: 32px;
      background: var(--primary-color-match-2);
      position: absolute;
      top: 50%;
      right: -3px;
      transform: translateX(0) translateY(-50%);
      animation: shine 1s infinite;
    }
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
@keyframes shine {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
