const PROJECT_NAME = 'kit'
module.exports = {
  // 服务配置目录
  SERVICE_CONFIG_DIRECTORY: `.${PROJECT_NAME}`,
  // 服务配置文件
  SERVICE_CONFIG_FILE: `${PROJECT_NAME}.json`,
  // 服务配置文件内容
  SERVICE_CONFIG_CONTENT: {
    name: '', // 服务名称
    version: '1.0.0', // 版本号
    private: false, // 是否为私有服务
    receivable: false, // 是否接收服务
    compiler: 'static', // 编译器
    supportedDatabases: [], // 支持的数据库列表
    prices: [ // 价格定义
      {
        type: 'free',
        value: 0
      }
    ],
    builds: [], // 构建列表
    unbuilds: [], // 卸载构建
    variables: [], // 服务变量列表
    translator: { // 翻译器
      output: '', // 翻译输出路径
      settings: [ // 翻译器列表，将代码翻译成模版
        // {path: '*', source: 'ruoyi', target: '${projectEnName}' },
      ]
    },
    settings: [], // 文件设置列表，设置内容见SERVICE_FILE_CONFIG_CONTENT
    introduce: '', // 服务简介
    readme: '' // 服务说明
  },
  // 服务文件配置
  SERVICE_FILE_CONFIG_CONTENT: {
    path: '',
    compiler: '',
    enableExpress: '',
    variables: [] // 文件变量
  },
  // 本地全局配置目录
  LOCAL_CONFIG_DIRECTORY: `.${PROJECT_NAME}`,
  // 本地全局配置文件
  LOCAL_CONFIG_FILE: `data.json`,
  // 本地全局配置内容
  LOCAL_CONFIG_FILE_CONTENT: {
    // 令牌
    tokens: [],
    // 服务列表
    services: [
      // {
      //   "space": "eva",
      //   "name": "单表接口",
      //   "codespace": "/Users/caesar/adjustrd/goldpankit/spaces/eva/eva-server-table-crud"
      // },
    ],
    // 项目列表
    projects: [],
    // 数据库列表
    databases: []
  },
  // 项目配置文件
  PROJECT_CONFIG_FILE: `${PROJECT_NAME}.json`,
  // 项目配置内容
  PROJECT_CONFIG_FILE_CONTENT: {
    space: '', // 空间名称
    main: { // 主服务信息
    //   eva: {
    //     version: 'v3.0.0',
    //     variables: {
    //       basePackage: 'com.kit'
    //     }
    //   }
    },
    services: { // 子服务信息
    //   alipay: {
    //     version: 'v1.2.1',
    //     variables: {}
    //   }
    }
  },
  // 翻译器
  TRANSLATOR: {
    DEFAULT_OUTPUT_PATH: `.${PROJECT_NAME}/translated`
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
