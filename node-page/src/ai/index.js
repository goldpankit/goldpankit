import {createProject} from "@/ai/directives/project";

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
  create_project: {
    title: '创建项目',
    getParamsQuestion: `请直接获取以下内容的projectName项目名称，projectRemark项目备注信息（非代码实现，直接获取输出即可），并输出JSON格式，如：{projectName: '', projectRemark: ''}。`,
    eg: '帮我创建一个test项目，用来实践我一个想法',
    answerHandler: getJson
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
  // 创建项目
  if (directive.directive === 'create_project') {
    return createProject(directive.params)
  }
  return Promise.reject('指令未定义')
}
