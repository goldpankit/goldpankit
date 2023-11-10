import {create} from "@/api/user.project";
import {fetchRuntimeRoot} from "@/api/local.file";
import path from "@/utils/path";
import store from '../../store/index.js'

/**
 * 创建项目
 */
export function exec ({ projectName, projectRemark }) {
  return fetchRuntimeRoot()
    .then(data => {
      const codespacePaths = path.split(data).filter(item => item !== '')
      codespacePaths.push(projectName)
      const newProject = {
        name: projectName,
        codespace: path.join(codespacePaths),
        remark: projectRemark
      }
      return create(newProject)
        .then(data => {
          newProject.id = data
          console.log('创建项目成功', newProject)
          store.commit('setCurrentProject', newProject.id)
          store.commit('setCurrentProjectDetail', newProject)
        })
    })
    .then(() => {
      return Promise.resolve(`项目${projectName}创建完成`)
    })
    .catch(e => {
      return Promise.reject(`项目${projectName}创建失败`)
    })
}
