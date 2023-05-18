const PROJECT_NAME = 'kit'
module.exports = {
  // 配置目录
  CONFIG_DIR: `.${PROJECT_NAME}`,
  // 服务配置文件
  SERVICE_CONFIG_FILE: `${PROJECT_NAME}.json`,
  // 服务配置文件内容
  SERVICE_CONFIG_CONTENT: {
    id: null,
    name: '',
    type: '',
    version: '1.0.0', // 版本号
    space: 'public', // 服务空间
    compiler: 'static', // 编译器
    description: '', // 模版描述
    build: `${process.cwd()}/.${PROJECT_NAME}/build`,
    variables: [], // 模版变量
    select: [], // 忘了
    translator: [ // 翻译器，将代码翻译成模版
      // {path: '*', source: 'ruoyi', target: '${projectEnName}' },
    ]
  },
  // 本地全局配置目录
  LOCAL_CONFIG_DIRECTORY: `.${PROJECT_NAME}`,
  // 本地全局配置文件
  LOCAL_CONFIG_FILE: `${PROJECT_NAME}.json`,
  // 本地全局配置内容
  LOCAL_CONFIG_FILE_CONTENT: {
    // 服务列表
    services: [
      // {
      //   id: 1, // 服务ID
      //   dir: '' // 本地存放路径
      // }
    ],
    // 项目列表
    projects: [],
  },
  // 目录配置文件前缀
  DIR_CONFIG_PREFIX: '#',
  // 监听、推送服务文件时忽略的目录
  IGNORE_DIRS: ['.DS_Store',`.${PROJECT_NAME}`, '.idea', '.vscode', 'node_modules', '.git', '.github'],
  // 目录配置
  DIR_CONFIG_CONTENT: {
    id: null,
    type: 'DIR',
    // git: { // GIT配置
    //   repository: '',
    //   branch: ''
    // },
    enableExpress: '', // 启用表达式
    variables: [], // 自定义变量列表
  },
  // 文件配置
  FILE_CONFIG_CONTENT: {
    id: null,
    type: 'CODE',
    enableExpress: '',
    variables: [] // 自定义变量列表
  },
  // 文件类型映射
  FILE_TYPE_MAP: {
    '.jpeg': 'IMAGE',
    '.png': 'IMAGE',
    '.gif': 'IMAGE',
    '.jpg': 'IMAGE',
    '.svg': 'CODE',
    '.html': 'CODE',
    '.js': 'CODE',
    '.css': 'CODE',
    '.vue': 'CODE',
    '.sql': 'CODE',
    '.java': 'CODE',
    '.json': 'CODE',
    '.xml': 'CODE',
    '.gitignore': 'CODE',
    '.bat': 'CODE',
    '.sh': 'CODE',
    '.md': 'CODE',
    '.pdm': 'CODE',
    'license': 'CODE',
  }
}
