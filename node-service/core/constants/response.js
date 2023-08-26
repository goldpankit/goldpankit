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
      '当前项目已安装了其他的主服务，请切换项目后重试'
    ),
  }
}
