class Response {
  code;
  message;

  constructor(code, enMessage, zhMessage) {
    this.code = code
    this.message = {
      withI18n: true,
      en: enMessage,
      zh: zhMessage
    }
  }
}
module.exports = {
  // 安装
  INSTALL: {
    MISSING_PROJECT: new Response(
      'missing_project',
      'Please select a project',
      '请先选择一个项目'
    ),
    PROJECT_NOT_ALLOWED: new Response(
      'project_not_allowed',
      'The current project has already installed another main service, please switch to a different project and try again.',
      '当前项目已安装了其他的服务，请切换项目后重试'
    ),
  },
  UNINSTALL: {
    PLUGIN_NOT_EXISTS: new Response(
      'plugin_not_exists',
      'Unable to uninstall plugin as it is either not installed in the project or the installation configuration has been deleted',
      '无法卸载插件，该插件未安装在项目中或安装配置已被删除'
    )
  },
  // 项目
  PROJECT: {
    PROJECT_NOT_EXISTS: new Response(
      'project_not_exists',
      'The project does not exists.',
      '项目不存在'
    ),
    PROJECT_NAME_EXISTS: new Response(
      'project_name_exists',
      'Project name is already taken.',
      '项目名称已存在，请尝试换一个名称'
    )
  },
  // 数据源
  DATA_SOURCE: {
    NOT_EXISTS: new Response(
      'datasource_not_exists',
      'The data source does not exists.',
      '数据源不存在'
    ),
    NAME_EXISTS: new Response(
      'datasource_not_exists',
      'The data source name is already taken.',
      '数据源名称已存在，请尝试换一个名称'
    ),
    MODEL_NOT_EXISTS: new Response(
      'datasource_not_exists',
      'The query model does not exists.',
      '查询模型不存在'
    ),
    MODEL_NAME_EXISTS: new Response(
      'datasource_model_name_exists',
      'The model name is already taken.',
      '模型名称已存在，请尝试换一个名称'
    ),
  }
}
