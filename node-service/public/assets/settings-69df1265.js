import{_ as D,M as z,R as I,m as E,n as F,Z as B,$ as N,r,z as M,A as u,o as p,c as h,a as l,b as n,w as g,i as m,t as o,F as q,H as c,I as v,g as d,e as f}from"./index-4d897c91.js";import{S as H,V as O,P as R,B as U,I as A,a as Z}from"./SystemVariableTable-82ff2716.js";import{S as G}from"./ServiceCodeErrorWindow-6a24c840.js";import{s as J,a as K,b as L}from"./plugin-8cc690a7.js";import{S as Q}from"./ServiceTitle-2a0b6c6e.js";import"./CompilerSelect-17fc29b4.js";import"./service-0d358b1a.js";import"./form.check-189b470c.js";import"./service.version-174df601.js";import"./QueryModelView-36eed71b.js";import"./InnerRouterViewWindow-10b97041.js";const X={components:{ServiceTitle:Q,SystemVariableTable:H,ServiceCodeErrorWindow:G,MarkdownEditor:z,Variables:O,PublishWindow:R,BasicSetting:U,InitializeView:A,DirectorySelect:I,SettingFiles:Z},data(){return{isWorking:{compile:!1,cleanCompile:!1},route:{space:null,service:null,plugin:null},loading:!0,currentTab:"basic",plugin:null,pluginConfig:null}},computed:{...E(["currentProject","currentProjectDetail","currentDatabase","installData"]),initialized(){return this.pluginConfig!=null&&this.pluginConfig.version!=null},compileTip(){return this.currentProjectDetail!=null?this.$t("service.settings.compileTipWithProject",{project:this.currentProjectDetail.name}):this.$t("service.settings.compileTip")},cleanCompileTip(){return this.currentProjectDetail!=null?this.$t("service.settings.cleanCompileTipWithProject",{project:this.currentProjectDetail.name}):this.$t("service.settings.cleanCompileTip")}},methods:{...F(["setInstallData"]),saveConfig(){J({...this.route,readme:this.plugin.description}).catch(i=>{this.$tip.apiFailed(i)})},fetchProfile(){this.loading=!0,K({spaceName:this.route.space,serviceName:this.route.service,pluginName:this.route.plugin}).then(i=>{this.plugin=i}).then(()=>L({space:this.route.space,service:this.route.service,plugin:this.route.plugin})).then(i=>{i!=null&&(this.pluginConfig=i,this.pluginConfig.label=this.pluginConfig.label||this.pluginConfig.name,this.plugin.label=this.pluginConfig.label,this.plugin.description=i.readme)}).catch(i=>{this.$tip.apiFailed(i)}).finally(()=>{this.loading=!1})},compile(){this.isWorking.compile||this.currentProject==null||this.currentProject===""||(this.isWorking.compile=!0,B({...this.route,serviceType:"COMMON",projectId:this.currentProject,database:this.currentDatabase,variables:this.$refs.variables.getVariables()}).then(i=>{this.setInstallData(i),this.$tip.success(this.$t("common.compileSuccessfully"))}).catch(i=>{if(i.code===6e3){this.$refs.serviceCodeErrorWindow.open(i.errorData);return}this.$tip.apiFailed(i)}).finally(()=>{this.isWorking.compile=!1}))},cleanCompile(){this.isWorking.cleanCompile||this.currentProject==null||this.currentProject===""||(this.isWorking.cleanCompile=!0,N({...this.route,projectId:this.currentProject,database:this.currentDatabase,variables:this.$refs.variables.getVariables()}).then(i=>{this.$tip.success("Clean Compile successfully."),this.setInstallData(i)}).catch(i=>{if(i.code===6e3){this.$refs.serviceCodeErrorWindow.open(i.errorData);return}this.$tip.apiFailed(i)}).finally(()=>{this.isWorking.cleanCompile=!1}))}},created(){this.route.space=this.$route.query.space,this.route.service=this.$route.query.service,this.route.plugin=this.$route.query.plugin,this.fetchProfile()}},Y={class:"wrap"},x={class:"header-wrap"},$={class:"header"},ee={key:0,class:"opera"},ie={key:0,class:"text-info-1 service-path"},se={class:"main"},te={class:"tabs"},re={class:"tab-content"};function le(i,s,ne,oe,e,t){const _=r("ServiceTitle"),b=r("el-button"),C=r("el-popover"),T=r("BasicSetting"),k=r("MarkdownEditor"),y=r("Variables"),w=r("SettingFiles"),P=r("SystemVariableTable"),S=r("InitializeView"),W=r("PublishWindow"),V=r("ServiceCodeErrorWindow"),j=M("loading");return e.plugin!=null?u((p(),h("div",{key:0,class:c(["page",{"page-un-initialize":!t.initialized}])},[l("div",Y,[l("div",x,[l("div",$,[n(_,{space:e.plugin.space.name,service:e.plugin.service.name,"service-label":e.plugin.service.label,plugin:e.plugin.name,"plugin-label":e.plugin.label,"with-new-page":!0},null,8,["space","service","service-label","plugin","plugin-label"]),t.initialized?(p(),h("div",ee,[n(C,{placement:"top-start",title:i.$t("service.settings.compileTipTitle"),width:200,trigger:"hover",content:t.compileTip},{reference:g(()=>[n(b,{type:"primary",class:c({"is-disabled":i.currentProject==null||e.isWorking.compile}),loading:e.isWorking.compile,onClick:t.compile},{default:g(()=>[f(o(i.$t("service.settings.compile")),1)]),_:1},8,["class","loading","onClick"])]),_:1},8,["title","content"]),n(C,{placement:"top-start",title:i.$t("service.settings.cleanCompileTipTitle"),width:200,trigger:"hover",content:t.cleanCompileTip},{reference:g(()=>[n(b,{type:"primary",class:c({"is-disabled":i.currentProject==null||e.isWorking.cleanCompile}),loading:e.isWorking.cleanCompile,onClick:t.cleanCompile},{default:g(()=>[f(o(i.$t("service.settings.cleanCompile")),1)]),_:1},8,["class","loading","onClick"])]),_:1},8,["title","content"]),n(b,{type:"important",onClick:s[0]||(s[0]=a=>i.$refs.publishWindow.open(e.route.space,e.route.service,e.route.plugin))},{default:g(()=>[f(o(i.$t("service.settings.publish")),1)]),_:1})])):m("",!0)]),t.initialized?(p(),h("p",ie,o(i.$t("service.settings.at"))+" "+o(e.plugin.local.codespace),1)):m("",!0)]),l("div",se,[t.initialized?(p(),h(q,{key:0},[l("ul",te,[l("li",{class:c({selected:e.currentTab==="basic"}),onClick:s[1]||(s[1]=a=>e.currentTab="basic")},o(i.$t("plugin.settings2")),3),l("li",{class:c({selected:e.currentTab==="readme"}),onClick:s[2]||(s[2]=a=>e.currentTab="readme")},o(i.$t("plugin.readme")),3),l("li",{class:c({selected:e.currentTab==="variables"}),onClick:s[3]||(s[3]=a=>e.currentTab="variables")},o(i.$t("service.settings.variables")),3),l("li",{class:c({selected:e.currentTab==="files"}),onClick:s[4]||(s[4]=a=>e.currentTab="files")},o(i.$t("service.settings.files")),3),l("li",{class:c({selected:e.currentTab==="system_variables"}),onClick:s[5]||(s[5]=a=>e.currentTab="system_variables")},o(i.$t("service.settings.systemVariables")),3)]),l("div",re,[u(n(T,{space:e.route.space,service:e.route.service,plugin:e.route.plugin,"service-config":e.pluginConfig,onCloneSuccess:t.fetchProfile},null,8,["space","service","plugin","service-config","onCloneSuccess"]),[[v,e.currentTab==="basic"]]),e.plugin.description!=null?u((p(),d(k,{key:0,modelValue:e.plugin.description,"onUpdate:modelValue":[s[6]||(s[6]=a=>e.plugin.description=a),t.saveConfig],placeholder:i.$t("service.settings.serviceReadmeHolder")},null,8,["modelValue","placeholder","onUpdate:modelValue"])),[[v,e.currentTab==="readme"]]):m("",!0),u(n(y,{ref:"variables",space:e.route.space,service:e.route.service,plugin:e.route.plugin},null,8,["space","service","plugin"]),[[v,e.currentTab==="variables"]]),u(n(w,{space:e.route.space,service:e.route.service,plugin:e.route.plugin},null,8,["space","service","plugin"]),[[v,e.currentTab==="files"]]),e.currentTab==="system_variables"?(p(),d(P,{key:1})):m("",!0)])],64)):(p(),d(S,{key:1,"space-name":e.plugin.space.name,"service-name":e.plugin.service.name,"plugin-name":e.plugin.name,"plugin-label":e.plugin.label,onInitialized:t.fetchProfile},null,8,["space-name","service-name","plugin-name","plugin-label","onInitialized"]))])]),n(W,{ref:"publishWindow"},null,512),n(V,{ref:"serviceCodeErrorWindow"},null,512)],2)),[[j,e.loading]]):m("",!0)}const Ce=D(X,[["render",le],["__scopeId","data-v-3836631b"]]);export{Ce as default};