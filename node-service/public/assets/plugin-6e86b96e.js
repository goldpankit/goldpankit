import{y as n}from"./index-48ed7bfc.js";function e(i){return n.post("/plugin/initialize",i)}function s(i){return n.post("/plugin/profile",i)}function o(i){return n.post("/plugin/files",i)}function a(i){return n.post("/plugin/config",i)}function r(i){return n.post("/plugin/config/save",i)}function u(i){return n.post("/plugin/file/setting/save",i)}function f(i){return n.post("/plugin/variables/save",i)}function p(i){return n.post("/plugin/list",i,{baseURL:"/remote-api"})}export{s as a,a as b,o as c,u as d,f as e,p as f,e as i,r as s};