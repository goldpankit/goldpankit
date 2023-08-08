export default {
  // 通用
  common: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    search: 'Search',
    delete: 'Delete',
    edit: 'Edit',
    private: 'Private',
    public: 'Public',
    readme: 'Readme',
    prices: 'Prices',
    issues: 'Issues',
    none: 'None',
    name: 'Name',
    remark: 'Remark',
    cancel: 'Cancel',
    confirm: 'Confirm',
    copy: 'Copy',
    execute: 'Execute',
    or: 'OR',
    introduce: 'Introduce',
    save: 'Save',
    days: 'days',
    currentVersion: 'current version',
    // 日期差
    dateOffset: {
      aMomentAgo: 'A moment ago',
      minutesAgo: '{value} minutes ago',
      hoursAgo: '{value} hours ago',
      daysAgo: '{value} days ago',
      monthsAgo: '{value} months ago',
      yearsAgo: '{value} years ago',
    },
    // 动态码
    otp: {
      send: 'Send OTP Code',
      sending: 'Sending...',
      resend: 'Resend OTP Code',
      sendTip: 'tips: We are sending you a OTP code to {email}. If you do not receive it, you can resend it in 60 seconds.'
    }
  },
  // 表单
  form: {
    isRequired: '{value} is required',
    correctEmailTip: 'Please enter the correct email address'
  },
  // 向导
  guide: {
    kitIntroduce: 'To assist you and your team in efficient project research and development.',
    kitDescription: 'GoldPanKit, jointly developed by the original team of CodeRd and Tsinghua Cross-Strait Research Institute, is a brand-new research and development toolkit that offers one-click installation service for functionalities and technology stack.',
    start: `Let's Start`,
    selectService: 'Select a service',
    selectService2: 'SELECT SERVICES',
    serviceIntroduce: 'In the service space, there are services available such as framework setup, project development, module creation, and more.',
    installService: 'Install Service',
    installIntroduce: 'Click the 「INSTALL」 button on the service page to install the service code into your project.',
    completed: 'COMPLETED',
    goToServiceSpaces: 'Go to the service space'
  },
  // 充值页
  topUp: {
    title: 'Top-up Beans',
    scanTip: 'Scan QR code using WeChat',
    getBeansTip: 'Get {value} beans',
    payTip: 'The top-up function is not available yet. Please use WeChat to scan and add the WeChat ID of the top-up personnel.'
  },
  // 组件
  component: {
    selectDirectory: 'Select Directory',
    createNewFolder: 'Create New Folder',
  },
  // 用户
  user: {
    profile: 'Profile',
    logout: 'Logout',
    account: 'Account',
    username: 'Username',
    password: 'Password',
    email: 'Email Address',
    otpCode: 'OTP code',
    forgotPassword: 'Forgot Password',
    createAccount: 'Create Account',
    haveAnAccount: 'Already have an account?',
  },
  // 空间相关
  space: {
    homePage: 'Home Page',
    searchPlaceholder: 'Search spaces & services',
    searchEmpty: 'Not Found Spaces',
    publicSpaces: 'Public Spaces',
    publicSpaceIntroduce: 'For all technical teams, you can click in to view all the service space, select and open the service space you need.',
    privateSpaces: 'Private service spaces',
    privateSpaceIntroduce: 'Private space only serves you or your team, you can organize technical staff to create and develop your service space for better and more efficient research and development work.',
    createNewSpace: 'Create New Space',
    createNewSpaceIntroduce: 'Create a new service space and start a new journey of research and development.',
    workbench: 'Workbench',
    workbenchIntroduce: 'Workbench is a commonly used interface in project development, where you can install more services for the project after clicking to enter.'
  },
  // 服务
  service: {
    services: 'services',
    services2: 'Services',
    versions: 'versions',
    latestVersion: 'Latest version',
    lastPublish: 'Last publish',
    createNewService: 'Create New Service',
    subServices: 'Sub Services',
    structure: 'Structure',
    withParametersTip: 'tips: Install the service by filling out the form below and clicking the Install button at the bottom.',
    withoutParametersTip: 'This service does not have any parameters, click the INSTALL button at the bottom to install.',
    install: 'INSTALL',
    install2: 'Install',
    installing: 'INSTALLING...',
    reinstall: 'REINSTALL',
    upgrade: 'UPGRADE',
    installSuccessfully: 'Install Successfully',
    uninstallSuccessfully: 'Uninstall Successfully',
    noServices: 'No Services',
    noSubServices: 'No Sub Services',
    // 租赁类型
    leaseType: {
      freeLabel: 'Free',
      timesAbb: 'Times',
      timesLabel: 'Charge per ride',
      monthAbb: 'Month',
      monthLabel: 'Monthly charge',
      yearAbb: 'Year',
      yearLabel: 'Annual charge',
    }
  },
  // 问题
  issue: {
    createNewIssue: 'Create New Issue'
  },
  // 数据库
  database: {
    databases: 'Database Connections',
    tip: 'This database connections will only be stored on your device.',
    databaseIntroduce: 'save your database connection information to help you get the code you want more easily.',
    databaseType: 'Database Type',
    host: 'Host',
    port: 'Port',
    schema: 'Schema',
    username: 'Username',
    password: 'Password',
    url: 'URL',
    testConnection: 'Test Connection',
    connecting: 'Connecting...',
    createDatabase: 'Create Connection',
    connectSuccessfully: 'Succeeded',
    addNewDatabase: 'Add New Connection',
    queryModels: 'Query Models',
    createNewModel: 'Create New Model',
    tables: 'Tables',
    dragTip: 'You can drag and drop the table on the left here.',
    createVirtualTableTip: 'create a virtual table',
    joinLine: 'Join Line',
    aggregateLine: 'Aggregate Line',
  },
  // 项目
  project: {
    project: 'Project',
    myProjects: 'My Projects',
    createProject: 'Create Project',
    noProjects: 'No Projects',
    createTip: 'The project information will only be saved on your current device.',
    codespace: 'Code Space'
  }
}
