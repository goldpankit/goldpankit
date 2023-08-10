export default {
  // 通用
  common: {
    homepage: 'Home Page',
    publicSpace: 'Public Spaces',
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
    saveSuccessfully: 'Save successfully',
    deleteSuccessfully: 'Delete successfully',
    // 模态框
    modal: {
      confirmDelete: 'Confirm Delete',
      confirmInstall: 'Confirm Install?',
      confirmUninstall: 'Confirm Uninstall?',
      installServiceTip: 'Installing this service will deduct {price} gold beans from your account. Are you sure you want to proceed with the installation?',
      uninstallServiceTip: 'Are you sure you want to uninstall this service？'
    },
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
    isIncorrect: '{field} is incorrect',
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
    leasedAndPrivateServices: 'Owned and leased services',
    leasedAndPrivateServiceIntroduce: 'Click here to view the services you have created and leased',
  },
  // 空间相关
  space: {
    homePage: 'Home Page',
    searchPlaceholder: 'Search spaces & services',
    searchEmpty: 'Not Found Spaces',
    publicSpaces: 'Public Spaces',
    publicSpaceIntroduce: 'For all technical teams, you can click in to view all the service space, select and open the service space you need.',
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
    uninstalling: 'UNINSTALLING...',
    uninstall: 'UNINSTALL',
    installSuccessfully: 'Install Successfully',
    uninstallSuccessfully: 'Uninstall Successfully',
    payInstall: 'PAY AND INSTALL',
    noServices: 'No Services',
    noSubServices: 'No Sub Services',
    serviceSettings: 'Settings',
    codespace: 'Code space',
    repository: 'Repository',
    unPublish: 'not yet released',
    confirmDeleteTip: 'Confirm deletion of this service?',
    versionNumber: 'Version dumber',
    versionDescription: 'Version description',
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
    databases: 'Data Sources',
    tip: 'This data source will only be stored on your device.',
    databaseIntroduce: 'save your data sources information to help you get the code you want more easily.',
    databaseType: 'Data Source Type',
    host: 'Host',
    port: 'Port',
    schema: 'Schema',
    username: 'Username',
    password: 'Password',
    url: 'URL',
    testConnection: 'Test Connection',
    connecting: 'Connecting...',
    createDatabase: 'Add a new data source',
    connectSuccessfully: 'Succeeded',
    addNewDatabase: 'New Source',
    queryModels: 'Query Models',
    createNewModel: 'Create New Model',
    tables: 'Tables',
    dragTip: 'You can drag and drop the table on the left here.',
    createVirtualTableTip: 'create a virtual table',
    joinLine: 'Join Line',
    aggregateLine: 'Aggregate Line',
    modelName: 'model name'
  },
  // 项目
  project: {
    name: 'Project name',
    project: 'Project',
    myProjects: 'My Projects',
    createProject: 'Create Project',
    noProjects: 'No Projects',
    createTip: 'The project information will only be saved on your current device.',
    codespace: 'Code Space',
    deleteTip: 'Are you sure you want to delete the project named {value}？'
  },
  // 工作台
  workbench: {
    noProjectTip1: 'Unable to initialize project workspace. Please select or create a project first. If you are using it for the first time, you can go to the ',
    noProjectTip2: 'to learn about the purpose of services and service installation!',
    noServiceInstalledTip1: 'The current project does not have any installed services. Please switch projects or go to the ',
    noServiceInstalledTip2: ' to install services for this project!',
    subServiceSettings: 'Sub Service Settings',
    subServiceSettingsTip: 'You can open Settings by clicking on sub services on the left.'
  }
}
