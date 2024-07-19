const path = require('path')
const PROJECT_NAME = 'kit'
module.exports = {
  // 服务配置目录
  SERVICE_CONFIG_DIRECTORY: `.${PROJECT_NAME}`,
  // 服务配置文件
  SERVICE_CONFIG_FILE: `${PROJECT_NAME}.json`,
  // 服务配置文件内容
  SERVICE_CONFIG_CONTENT: {
    name: '', // 服务标识符
    label: '', // 服务名称
    version: '1.0.0', // 版本号
    private: false, // 是否为私有服务
    receivable: false, // 是否接收服务
    compiler: 'static', // 编译器
    repository: '', // 仓库
    branch: '', // 仓库分支
    supportedDatabases: [], // 支持的数据库列表
    prices: [ // 价格定义
      {
        type: 'FREE',
        value: 0
      }
    ],
    builds: [], // 构建列表
    unbuilds: [], // 卸载构建
    variables: [], // 服务变量列表
    translator: { // 翻译器
      output: '', // 翻译输出路径
      filepath: '', // 路径翻译代码
      content: '' // 内容翻译代码
    },
    settings: [], // 文件设置列表，设置内容见SERVICE_FILE_CONFIG_CONTENT
    introduce: '', // 服务简介
    readme: `详细的服务描述有利于使用者更好的明确您的服务意图，您可以采用以下大纲来完善您的服务信息。\n\n## 服务介绍\n\n\n## 代码设计\n\n\n## 使用说明\n\n\n## 效果预览\n\n\n## 注意事项` // 服务说明
  },
  // 插件配置文件内容
  PLUGIN_CONFIG_CONTENT: {
    name: '', // 服务标识符
    label: '', // 服务名称
    minServiceVersion: '', // 最小兼容的服务版本
    version: '1.0.0', // 版本号
    private: false, // 是否为私有服务
    receivable: false, // 是否接收服务
    compiler: 'static', // 编译器
    repository: '', // 仓库
    branch: '', // 仓库分支
    supportedDatabases: [], // 支持的数据库列表
    prices: [ // 价格定义
      {
        type: 'FREE',
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
    introduce: '', // 插件简介
    readme: `详细的插件描述有利于使用者更好的明确您的插件意图，您可以采用以下大纲来完善您的服务信息。\n\n## 插件介绍\n\n\n## 代码设计\n\n\n## 使用说明\n\n\n## 效果预览\n\n\n## 注意事项` // 插件说明
  },
  // 服务文件配置
  SERVICE_FILE_CONFIG_CONTENT: {
    path: '',
    compiler: '',
    withoutIfNotExists: false,
    enableExpress: '',
    variables: [] // 文件变量
  },
  // 本地全局配置目录
  LOCAL_CONFIG_DIRECTORY: `.${PROJECT_NAME}`,
  // 本地全局配置文件
  LOCAL_CONFIG_FILE: 'data.json',
  // 本地全局配置内容
  LOCAL_CONFIG_FILE_CONTENT: {
    // 语言
    lang: 'en',
    // 令牌
    tokens: [],
    // 服务列表
    services: [
      // {
      //   "space": "eva", // 空间标识符
      //   "name": "单表接口", // 服务标识符
      //   "repository": "", // 仓库地址
      //   "codespace": "/Users/caesar/adjustrd/goldpankit/spaces/eva/eva-server-table-crud"
      // },
    ],
    // 插件列表
    plugins: [
      // {
      //   "space": "eva", // 空间标识符
      //   "service": "eva", // 服务标识符
      //   "name": "单表接口", // 插件标识符
      //   "repository": "", // 仓库地址
      //   "codespace": "/Users/caesar/adjustrd/goldpankit/spaces/eva/eva-server-table-crud"
      // },
    ],
    // 项目列表
    projects: [],
    // 数据源列表
    datasources: []
  },
  // 项目配置文件
  PROJECT_CONFIG_FILE: `${PROJECT_NAME}.json`,
  // 项目数据库配置文件
  PROJECT_DATABASE_CONFIG_FILE: `${PROJECT_NAME}.db.json`,
  // 项目配置内容
  PROJECT_CONFIG_FILE_CONTENT: {
    name: '', // 项目名称，当本地没有项目时，利用该名称进行自动创建
    space: '', // 空间名称
    service: { // 服务信息
    //   eva: {
    //     version: 'v3.0.0',
    //     variables: {
    //       basePackage: 'com.kit'
    //     }
    //   }
    },
    plugins: { // 插件信息
    //   alipay: {
    //     version: 'v1.2.1',
    //     variables: {}
    //   }
    }
  },
  // 翻译器
  TRANSLATOR: {
    DEFAULT_OUTPUT_PATH: path.join(`.${PROJECT_NAME}`, 'translated')
  },
  // 读取文件时忽略掉的文件和目录，除此之外，还会进一步忽略项目中.gitignore中的文件配置
  IGNORE_FILES: ['.DS_Store',`.${PROJECT_NAME}`, '.idea', '.vscode', 'node_modules', '.git', '.github'],
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
