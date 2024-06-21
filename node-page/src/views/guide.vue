<template>
  <div class="page">
    <div class="banner">
      <div class="wrap">
        <h2>Gold Pan Kit</h2>
        <h3>我想助力您和您的团队进行高效的项目研发</h3>
        <p>经过五年多的发展，很荣幸我们获得了「清华海峡院」和「彭一波」先生的认可和投资。未来我们（就我吧）将继续佛系研发，直到KIT成为真正好用的产品！</p>
        <div class="opera">
          <el-button @click="$router.push({name: 'SignUp'})" type="important">{{$t('common.signUp')}}</el-button>
          <el-button type="important2" @click="$router.push({name: 'PublicServices'})">{{$t('guide.goToServices')}}</el-button>
        </div>
      </div>
    </div>
    <div class="content-wrap">
      <div class="content what-content">
        <div class="wrap">
          <h3>WHAT is the KIT？</h3>
          <ul class="words">
            <li>KIT is ....，好吧我说中文！</li>
            <li>简单来讲，KIT就是个GITHUB！但，在KIT上获取的代码是动态的！</li>
            <li>更简单的来说，录入参数，就可以构建出你想要的项目、框架或功能的代码！</li>
            <li>所以！！！</li>
            <li>你可以在这里快速构建出各个技术框架（技术栈想怎么集成就怎么集成的那种），虽然目前我们支持的技术框架并不多！</li>
            <li>你也可以在这里快速构建出一整套系统，并且功能随意挑，再也不用像GIT那样拉下来就是一大堆不要的功能啦！比如大家想要的电商小程序、知识付费APP等，虽然这些我们都还没有！</li>
            <li>更重要的是，在KIT上构建的项目或框架，你可以很方便的进行升级和及时获得项目重大BUG消息！防止你的项目出现了重大漏洞造成了公司的损失！</li>
            <li>当然，还能替代一些代码生成器的工作，无论是单表还是多表，你都可以在KIT上直接构建出页面和接口！</li>
            <li>未来我们还会深度整合AI技术，让一切逐渐不可思议！</li>
          </ul>
        </div>
      </div>
      <div class="content">
        <div class="wrap">
          <h3>发展历史</h3>
          <el-timeline>
            <el-timeline-item timestamp="2018/12" placement="top">
              <el-card>
                <h4>想法诞生</h4>
                <p>在此之前，我在研发一款基于浏览器的操作系统，想用它来实现未来跨硬件且高隐私的数据操作和读取。系统研发完了，但应用过多，没法快速实现，所以想实现一个极速开发平台。</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2019/3/16" placement="top">
              <el-card>
                <h4>KIT前身发布</h4>
                <p>2019年3月16日正式发布<a href="http://coderd.adjustrd.com" target="_blank">懒猴子CG</a>，而后更名为CodeRd。</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2021/1/18" placement="top">
              <el-card>
                <h4>辞职</h4>
                <p>2021年1月28日辞了工作，回到湖南老家创办公司，把精力全身心投入到产品中。</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2021/3/8" placement="top">
              <el-card>
                <h4>成立公司</h4>
                <p>2021年3月8日成立了桂阳阿茄思特网络技术有限公司，阿茄思特为Adjust的谐音，寓意公司为“调整”而生，简称“AD科技”。注册了公司域名adjustrd.com，后面加了“路”的缩写“rd”，寓意我们愿意不断的去调整目前世界所有不够完善的一切。本想全身心投入，但生活所迫不得不做一些外包项目和带一些学生来养活自己。</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2023/5/9" placement="top">
              <el-card>
                <h4>获用户投资</h4>
                <p>资金陷入困境，我个人的温饱成了问题。我尝试在交流群中售卖CodeRd股份，获得了崔易、朱晨辉、赵鹏、林郴、常洋、赵浩、曹宝红、侯泽为、李寻飞9人累计4万元的投资款，非常荣幸也非常感谢能得到他们的帮助。将来无论是工作还是继续创业，只要我能赚到钱，我会一一表达感谢和加倍偿还。</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2023/5/20" placement="top">
              <el-card>
                <h4>获天使轮投资</h4>
                <p>经过2年的摸爬滚打，通过了「清华海峡院」的项目评估，2023年5月20日获得了「清华海峡院北京办公室副主任彭一波」先生10万元资金投入和100万元的资源投入，并纳入「清华海峡院高端装备技术研究中心」专利项目</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2023/8/17" placement="top">
              <el-card>
                <h4>正式发布</h4>
                <p>经过3个月的研发，CodeRd进行了全面的重构，采用了新的架构和设计，解决了CodeRd的瓶颈问题，2023年8月17日首次发布KIT v1.1.0。</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2024/1" placement="top">
              <el-card>
                <h4>用户里程碑</h4>
                <p>虽然KIT刚上线不久，但CodeRd依然在持续运营，2024年1月，CodeRd累计注册用户数超过1万。</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2024/2/1" placement="top">
              <el-card>
                <h4>扩大团队</h4>
                <p>拿着手头上的积蓄和投资款开始招募团队，组建了一个5人团队，准备做大做强！筹划KIT的商业模式，从全面开放通过售卖服务和插件的方式，到尝试只做付费用户的方式。</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2024/5/31" placement="top">
              <el-card>
                <h4>缩减团队</h4>
                <p>在尝试两次商业模式的变化后，手头上资金不多了，准备干老本行——接外包！公司团队缩减至了2个人，加上外部优秀的合作人员，差不多团队还有10人。</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2024/6/14" placement="top">
              <el-card>
                <h4>全面免费</h4>
                <p>KIT进入了全面免费模式，不再收费。目标只有一个，让KIT真正的好用和被接受！</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="1993/8/13" placement="top">
              <el-card>
                <h4>未来</h4>
                <p>未来就回到初衷，不管投资人怎么想。我只踏踏实实基于KIT提供的服务做好外包项目，没有外包项目时就升级KIT，开发更多的服务和插件。</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <div class="content guide-content">
        <div class="wrap">
          <h3>试一试</h3>
          <ul>
            <li>
              <h4>i. 注册个账号</h4>
              <p>需要有可以接收短信的大陆手机号，单纯用来修改密码和BUG通知，个人信息均加密存储，不会泄漏也不会打电话骚扰。</p>
            </li>
            <li>
              <h4>ii. {{$t('guide.selectService')}}</h4>
              <p>{{$t('guide.serviceIntroduce')}}</p>
            </li>
            <li>
              <h4>iii. {{$t('guide.installService')}}</h4>
              <p>{{$t('guide.installIntroduce')}}</p>
            </li>
            <li>
              <h4>iv. 安装插件</h4>
              <p>KIT插件表示框架或基础工程中的某一个功能模块或技术栈集成代码。可在工作台页面选择您需要的插件进行安装。</p>
            </li>
          </ul>
          <div class="opera">
            <el-button type="important"  @click="$router.push({name: 'SignUp'})">注册个账号</el-button>
            <el-button type="important2"  @click="$router.push({name: 'PublicServices'})">{{$t('guide.goToServices')}}</el-button>
          </div>
        </div>
      </div>
      <div class="content about-me">
        <div class="wrap">
          <h3>继续了解我们</h3>
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
              <label>抖音关注不迷路</label>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <footer>
      {{$t('common.currentVersion')}}: v{{version}}
    </footer>
  </div>
</template>

<script>

import {fetchVersion} from "../api/client";

export default {
  name: "guide",
  data () {
    return {
      version: ''
    }
  },
  methods: {
    fetchVersion () {
      fetchVersion()
        .then((data) => {
          this.version = data
        })
        .catch(e => {
          this.$tip.apiFailed(e)
        })
    }
  },
  created () {
    this.fetchVersion()
  }
}
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  overflow-y: auto;
}
.banner {
  height: 800px;
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
      margin-top: 50px;
      .el-button {
        width: 245px;
        height: 60px;
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
    font-size: 75px;
    margin-bottom: 20px;
    text-shadow: 0 0 5px #ab5155;
  }
  h3 {
    width: 800px;
    font-size: 30px;
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
  width: 88%;
  min-width: 1200px;
  margin: 0 auto;
  position: relative;
  top: -150px;
  box-shadow: 0 0 20px -10px #999;
  border-radius: 100px;
  overflow: hidden;
}
.content {
  background: var(--color-light);
  padding: 50px 0;
  .wrap {
    width: 1200px;
    margin: 0 auto;
    padding: var(--gap-page-padding);
    h3 {
      margin-top: 50px;
      text-align: center;
      font-size: 50px;
    }
    h4 {
      font-size: 25px;
    }
    ul {
      margin: 30px 0;
      li {
        margin-bottom: 30px;
        p {
          margin-top: 20px;
        }
      }
    }
    ul.words {
      li {
        font-size: 20px;
      }
    }
    p {
      font-size: 20px;
    }
    // 时间线
    .el-card {
      border-radius: 100px;
      padding: 20px 100px;
      box-shadow: none;
      border-width: 5px;
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
  // background-color: #ecf0f9;
  background-color: var(--primary-color-match-1);
  .wrap {
    padding-left: 550px;
    background: url('/images/coding_boy.svg') no-repeat;
    background-size: 520px auto;
    background-position: 0 150px;
  }
}
// 开始使用
.content.guide-content {
  background-color: #2e3444;
  color: #fff;
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
