const PROJECT_NAME = 'kit'
module.exports = {
  // 服务配置目录
  SERVICE_CONFIG_DIRECTORY: `.${PROJECT_NAME}`,
  // 服务配置文件
  SERVICE_CONFIG_FILE: `${PROJECT_NAME}.json`,
  // 服务配置文件内容
  SERVICE_CONFIG_CONTENT: {
    id: null,
    name: '',
    type: '',
    version: '1.0.0', // 版本号
    compiler: 'static', // 编译器
    description: '', // 模版描述
    build: `${process.cwd()}/.${PROJECT_NAME}/build`,
    variables: [], // 全局变量
    select: [], // 忘了
    translator: [ // 翻译器，将代码翻译成模版
      // {path: '*', source: 'ruoyi', target: '${projectEnName}' },
    ],
    settings: [] // 文件设置，设置内容见SERVICE_FILE_CONFIG_CONTENT
  },
  // 服务文件配置
  SERVICE_FILE_CONFIG_CONTENT: {
    path: '',
    enableExpress: '',
    variables: [] // 文件变量
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
  // 监听、推送服务文件时忽略的目录
  IGNORE_DIRS: ['.DS_Store',`.${PROJECT_NAME}`, '.idea', '.vscode', 'node_modules', '.git', '.github'],
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