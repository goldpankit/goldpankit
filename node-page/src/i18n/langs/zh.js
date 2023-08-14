export default {
  // 通用
  common: {
    homepage: '首页',
    publicSpace: '公共空间',
    signIn: '登录',
    signUp: '注册',
    search: '搜索',
    delete: '删除',
    edit: '编辑',
    private: '私有',
    public: '公开',
    readme: '说明',
    prices: '价格',
    issues: '问题',
    none: '无',
    name: '名称',
    remark: '备注',
    cancel: '取消',
    confirm: '确认',
    copy: '复制',
    execute: '执行',
    or: '或',
    introduce: '简介',
    save: '保存',
    days: '天',
    currentVersion: '当前版本',
    saveSuccessfully: '保存成功',
    deleteSuccessfully: '删除成功',
    refresh: '刷新',
    // 模态框
    modal: {
      confirmDelete: '确认删除',
      confirmInstall: '确认安装?',
      confirmUninstall: '确认卸载?',
      installServiceTip: '安装此服务将从您的账户中扣除 {price} 金豆。您确定要安装吗？',
      uninstallServiceTip: '您确定要卸载这个服务吗？'
    },
    // 日期差
    dateOffset: {
      aMomentAgo: '刚刚',
      minutesAgo: '{value}分钟前',
      hoursAgo: '{value}小时前',
      daysAgo: '{value}天前',
      monthsAgo: '{value}月前',
      yearsAgo: '{value}年前',
    },
    // 动态码
    otp: {
      send: '发送动态码',
      sending: '发送中...',
      resend: '重发动态码',
      sendTip: '提示：我们已经发送动态码到您的邮箱 {email}. 如果没有接收到, 您可以在60秒后重发。'
    }
  },
  // 表单
  form: {
    isRequired: '请输入{value}',
    isSelectRequired: '请选择{value}',
    isIncorrect: '{field}不正确',
    correctEmailTip: '请输入正确的邮箱地址'
  },
  // 向导
  guide: {
    kitIntroduce: '助力您和您的团队进行高效的项目研发',
    kitDescription: 'GoldPanKit由CodeRd原班人马和清华海峡研究院共同研制，是一个全新的研发套件，为您提供功能和技术栈一键安装服务。',
    start: '开始使用',
    selectService: '选择服务',
    selectService2: '选择服务',
    serviceIntroduce: '服务空间中包含了服务，这些服务可以是框架的搭建、项目的构建、模块的开发等。',
    installService: '安装服务',
    installIntroduce: '在服务页点击「安装」按钮即可将服务代码安装到您的项目中。',
    completed: '开发完成',
    goToServiceSpaces: '前往服务空间'
  },
  // 充值页
  topUp: {
    title: '金豆充值',
    scanTip: '使用微信扫码',
    getBeansTip: '获得 {value} 金豆',
    payTip: '充值功能还未开放，请使用微信扫一扫，添加充值人员微信号。'
  },
  // 组件
  component: {
    selectDirectory: '选择目录',
    createNewFolder: '创建目录',
    dirExistsTip: '目录已存在'
  },
  // 用户
  user: {
    profile: '个人资料',
    logout: '退出登录',
    account: '账号',
    username: '用户名',
    password: '密码',
    email: '邮箱地址',
    otpCode: '动态码',
    forgotPassword: '忘记密码',
    createAccount: '创建新账号',
    haveAnAccount: '已有账号？',
    leasedAndPrivateServices: '自己的和已租赁的服务',
    leasedAndPrivateServiceIntroduce: '点击此处可查看自己创建的服务和已租赁的服务',
  },
  // 空间相关
  space: {
    homePage: '首页',
    searchPlaceholder: '输入关键字，搜索空间和服务',
    searchEmpty: '未找到空间或服务',
    publicSpaces: '公共服务空间',
    publicSpaceIntroduce: '点击此处进入公共服务空间，您可以阅读空间的说明和查看提供的服务信息来选择您需要的空间，以协助您快速的研发项目。',
    createNewSpace: '创建新的空间',
    createNewSpaceIntroduce: '点击此处可创建一个新的空间，您可以自由选择是私有空间或公共空间。',
    workbench: '工作台',
    workbenchIntroduce: '工作台是项目开发常用的界面，点击进入后您可以为项目安装更多服务。'
  },
  // 服务
  service: {
    services: '个服务',
    services2: '服务',
    versions: '个版本',
    latestVersion: '最新版本',
    lastPublish: '最后发布于',
    createNewService: '创建服务',
    subServices: '子服务',
    structure: '代码结构',
    withParametersTip: '安装提示: 填写以下信息并点击底部安装按钮即可安装该服务代码到您当前项目代码中。',
    withoutParametersTip: '当前服务没有参数，点击底部安装按钮即可安装该服务代码到您当前项目代码中。',
    install: '安装',
    install2: '安装',
    installing: '安装中...',
    reinstall: '重新安装',
    upgrade: '立即升级',
    uninstalling: '卸载中...',
    uninstall: '卸载',
    installSuccessfully: '安装成功',
    uninstallSuccessfully: '卸载完成',
    payInstall: '支付并安装',
    noServices: '无服务',
    noSubServices: '无子服务',
    serviceSettings: '服务设置',
    codespace: '本地位置',
    repository: '代码仓库',
    unPublish: '暂未发布',
    confirmDeleteTip: '确认删除该服务吗？',
    versionNumber: '版本号',
    versionDescription: '版本描述',
    noneDataSourceTip: '请先选择数据源',
    // 租赁类型
    leaseType: {
      freeLabel: '免费',
      timesAbb: '次',
      timesLabel: '按次收费',
      monthAbb: '月',
      monthLabel: '按月收费',
      yearAbb: '年',
      yearLabel: '按年收费',
    },
    // 构建
    build: {
      completed: '构建执行完成',
      ignore: '忽略',
      ignoreAll: '忽略所有',
      execute: '执行',
      executeAll: '全部执行',
      viewScript: '查看执行脚本',
      targetDataSource: '目标数据源'
    }
  },
  issue: {
    createNewIssue: '创建问题'
  },
  // 数据库相关
  database: {
    databases: '数据源',
    tip: '数据源信息仅会保存在您的当前设备上。',
    databaseIntroduce: '保存您的数据源信息到您的当前设备上，服务可以更方便的为您安装代码。',
    databaseType: '数据源类型',
    host: 'Host',
    port: '端口',
    schema: '库',
    username: '用户名',
    password: '密码',
    url: 'URL',
    testConnection: '测试连接',
    connecting: '连接中...',
    createDatabase: '添加数据源',
    connectSuccessfully: '连接成功',
    addNewDatabase: '添加数据源',
    queryModels: '查询模型',
    createNewModel: '创建模型',
    tables: '表',
    dragTip: '您可以从左侧拖拽表到此区域进行模型设计',
    createVirtualTableTip: '创建虚拟表',
    joinLine: 'JOIN关联线',
    aggregateLine: '聚合关联线',
    modelName: '模型名称'
  },
  // 项目相关
  project: {
    name: '项目名称',
    project: '项目',
    myProjects: '我的项目',
    createProject: '创建项目',
    noProjects: '暂无项目',
    createTip: '项目信息仅存储在您的当前设备上。',
    codespace: '代码空间',
    deleteTip: '您确定要删除名为{value}的项目吗？'
  },
  // 工作台
  workbench: {
    noProjectTip1: '无法初始化项目工作台，请先选择或创建一个项目，如果您是第一次使用，可前往',
    noProjectTip2: '了解服务和服务安装的用途！',
    noServiceInstalledTip1: '当前项目没有安装服务，请切换项目或前往',
    noServiceInstalledTip2: '为此项目安装服务！',
    subServiceSettings: '子服务设置',
    subServiceSettingsTip: '点击左侧的子服务打开设置并安装。'
  }
}
