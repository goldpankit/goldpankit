import{y as t}from"./index-298973e7.js";function s(e){return t.post("/service/git/clone",e)}function r(e){return t.get("/service/list")}function n(e){return t.post("/service/search",e,{baseURL:"/remote-api"})}function a(e){return t.post("/service/list",e,{baseURL:"/remote-api"})}function c(e){return t.post("/service/initialize",e)}function o(e){return t.post("/service/detail",e,{baseURL:"/remote-api"})}function f(e){return t.post("/service/profile",e)}function u(e){return t.post("/service/files",e)}function v(e){return t.post("/service/config",e)}function l(e){return t.post("/service/config/save",e)}function p(e){return t.post("/service/file/setting/save",e)}function g(e){return t.post("/service/variables/save",e)}export{o as a,r as b,l as c,f as d,v as e,a as f,u as g,p as h,c as i,s as j,g as k,n as s};