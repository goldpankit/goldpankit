import {exec as createProject} from "@/ai/directives/project.create";
import {exec as initGit} from "@/ai/directives/git.init";
import {exec as createDirectory} from "@/ai/directives/dir.create";
import {exec as commitToGit} from "@/ai/directives/git.commit";
import {exec as installService} from "@/ai/directives/service.install";
import {exec as publishProject} from "@/ai/directives/project.publish";
import {exec as installPlugin} from "@/ai/directives/plugin.install";

/**
 * 获取到文本内容中的JSON字符串
 * @param content
 */
function getJson (content) {
  // 解析content，将json字符串部分抽取出来
  if (content.indexOf('{')!== -1) {
    const json = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1)
    return JSON.parse(json)
  }
  return null
}

/**
 * 指令列表
 */
export const directives = {
  // 创建项目
  createProject: {
    title: '创建项目',
    getParamsQuestion: `请直接获取以下内容的projectName项目名称，projectRemark项目备注信息（非代码实现，直接获取输出即可），并输出JSON格式，如：{projectName: '', projectRemark: ''}。`,
    eg: '帮我创建一个test项目，用来实践我一个想法',
    answerHandler: getJson,
    exec: createProject
  },
  // 创建目录
  createDirectory: {
    title: '创建目录',
    eg: '帮我创建一个test目录，用来存放项目代码',
    answerHandler: getJson,
    exec: createDirectory
  },
  // 安装项目服务
  installService: {
    title: '安装项目服务',
    eg: '帮我安装Eva服务',
    answerHandler: getJson,
    exec: installService
  },
  // 初始化git
  initGit: {
    title: '初始化git',
    eg: '帮我初始化git',
    answerHandler: getJson,
    exec: initGit
  },
  // 提交到git
  commitToGit: {
    title: '提交到git',
    eg: '帮我提交到git',
    answerHandler: getJson,
    exec: commitToGit
  },
  // 发布项目
  publishProject: {
    title: '发布项目',
    eg: '帮我发布项目',
    answerHandler: getJson,
    exec: publishProject
  },
  // 安装插件
  installPlugin: {
    title: '安装插件',
    eg: '帮我安装vue-router插件',
    answerHandler: getJson,
    exec: installPlugin
  }
}

/**
 * 生成获取指令问题
 * @param message
 * @returns {string}
 */
export function generateDirectiveQuestion (message) {
  const directiveStrings = []
  for (const key in directives) {
    directiveStrings.push(`${key}: ${directives[key].title}`)
  }
  return `已知指令如下
${directiveStrings.join('\n')}
请直接获取以下内容属于哪条指令并输出JSON格式，如 {directive: 'create_project'}
"${message}"。`
}

/**
 * 根据AI的解析结果解析出指令
 * @param aiResponse
 */
export function getDirective (aiResponse) {
  for (const key in directives) {
    if (aiResponse.indexOf(key)!== -1) {
      return {
        directive: key,
        ...directives[key]
      }
    }
  }
}

/**
 * 执行指令
 */
export function exec (directive) {
  return directives[directive.directive].exec(directive.params)
}
