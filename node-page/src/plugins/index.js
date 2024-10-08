import message from "./message";
import messagebox from "./messagebox";
import globalMethods from "./global.methods";
import constants from './constants'
export default {
  install (app, options) {
    app.config.globalProperties.$const = constants
    app.config.globalProperties.$tip = message
    app.config.globalProperties.$dialog = messagebox
    for (const method in globalMethods) {
      app.config.globalProperties[method] = globalMethods[method]
    }
  }
}
