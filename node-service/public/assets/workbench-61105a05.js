import{_ as I,r as a,o as c,c as d,a as i,F as y,g as z,b as o,w as u,p as A,l as K,y as q,E as G,M as O,m as J,s as R,G as H,A as Q,B as P,t,e as p,h as g,j as S,J as V,K as b}from"./index-bb7c4844.js";import{S as X}from"./ServiceInstaller-72cd32c8.js";import{P as Y}from"./Pagination-c2a06621.js";import{B as Z}from"./BeanAmount-99a0e13e.js";import{S as x,P as $}from"./PluginList-f8f96756.js";import{f as ee}from"./service.version-d8bfe557.js";import{f as se}from"./plugin-e31e81cb.js";import{S as ie}from"./ServiceTitle-1b7c3ba2.js";import"./ServiceCodeErrorWindow-5195a573.js";import"./QueryModelView-4432a5c4.js";import"./InnerRouterViewWindow-59ba9655.js";import"./wechat-ae447c56.js";import"./ServiceStatus-66f871d7.js";const ne={name:"IssueListView",components:{Pagination:Y},data(){return{pagination:{pageIndex:1,capacity:10,total:100}}}},w=s=>(A("data-v-f510f853"),s=s(),K(),s),le={class:"issue-wrap"},te=w(()=>i("div",{class:"toolbar"},[i("ul",null,[i("li",null,"All"),i("li",null,"Enabled"),i("li",null,"Completed"),i("li",null,"Refused")]),i("ul",{class:"issue-types"},[i("li",{class:"bug"},"BUG"),i("li",{class:"optimize"},"Optimize")])],-1)),re={class:"issues"},oe=w(()=>i("h3",null,"登录失败时验证码没有刷新",-1)),ce={class:"text-info-1"},ae=w(()=>i("span",null,"刘大逵",-1)),ue=w(()=>i("li",{class:"text-info-1"},[i("span",null,"Completed")],-1)),pe=w(()=>i("li",{class:"text-info-1"},[i("span",null,"3小时前")],-1));function de(s,n,h,_,e,l){const k=a("UserFilled"),v=a("el-icon"),f=a("router-link"),m=a("Pagination");return c(),d("div",le,[te,i("ul",re,[(c(),d(y,null,z(10,j=>i("li",{key:j},[o(f,{to:"#",target:"_blank"},{default:u(()=>[oe,i("ul",null,[i("li",ce,[o(v,null,{default:u(()=>[o(k)]),_:1}),ae]),ue,pe])]),_:1})])),64))]),o(m,{pagination:e.pagination},null,8,["pagination"])])}const he=I(ne,[["render",de],["__scopeId","data-v-f510f853"]]);const ve={name:"SearchInput",props:{modelValue:{required:!0},placeholder:{}},methods:{search(){this.$emit("search")},handleInput(s){this.$emit("update:modelValue",s.target.value)}}},me={class:"search-input"},ge=["value","placeholder"];function _e(s,n,h,_,e,l){const k=a("Search"),v=a("el-icon");return c(),d("div",me,[i("input",{value:h.modelValue,placeholder:h.placeholder,onKeypress:n[0]||(n[0]=q((...f)=>l.search&&l.search(...f),["enter"])),onInput:n[1]||(n[1]=(...f)=>l.handleInput&&l.handleInput(...f))},null,40,ge),o(v,null,{default:u(()=>[o(k)]),_:1})])}const fe=I(ve,[["render",_e],["__scopeId","data-v-898d8650"]]);const ke={components:{ServiceStructureView:x,SearchInput:fe,ServiceTitle:ie,PluginList:$,BeanAmount:Z,IssueListView:he,Empty:G,MarkdownEditor:O,ServiceInstaller:X},data(){return{loading:{page:!0,plugins:!0},isWorking:{install:!1,uninstall:!1},space:null,keyword:"",latestService:null,service:null,selectedPlugin:null,plugins:[],selectedPluginDimension:"readme",project:null}},computed:{...J(["userInfo","currentProject","currentProjectDetail"]),installed(){return this.selectedPlugin==null?!1:this.installedPlugins[this.selectedPlugin.name]!=null},latestServiceVersion(){if(this.latestService==null)return null;const s=this.latestService.version.split(".");return s.length>3?s.slice(0,3).join("."):this.latestService.version},currentServiceVersion(){if(this.service==null)return null;const s=this.service.version.split(".");return s.length>3?s.slice(0,3).join("."):this.service.version},majorVersion(){return this.service==null?"...":`${this.service.version.substring(0,this.service.version.indexOf("."))}`},installedPlugins(){return this.project.plugins||this.project.services},installedService(){return this.project.service||this.project.main},upgradeDescription(){return this.latestService==null?"":this.$t("service.upgradeTip",{currentVersion:this.service.version,newVersion:this.latestService.version,publishDescription:this.latestService.publishDescription})}},watch:{currentProject(){this.latestService=null,this.selectedPlugin=null,this.fetchProject()}},methods:{...R(["setCurrentProject"]),upgrade(){window.open(`/space/${this.space}/${this.service.name}/install?major=${this.majorVersion}`)},install(){this.selectedPluginDimension="install",this.$refs.installer.install()},uninstall(){this.selectedPluginDimension="install",this.$refs.installer.uninstall()},withInstalled(s){return this.installedPlugins[s.name]!=null},fetchProject(){if(this.loading.page=!0,this.currentProject==null||this.currentProject===""){this.project=null,this.space=null,this.loading.page=!1;return}this.refreshProject(!0)},fetchLatestVersion(){this.latestService==null&&ee({space:this.space,service:this.service.name,majorVersion:this.majorVersion}).then(s=>{this.latestService=s}).catch(s=>{if(s.code===4002){this.alert("当前项目使用的服务可能已被更名或删除，您可以前往服务详情了解更多内容。",null,{showCancelButton:!0,confirmButtonText:"查看服务详情"}).then(()=>{window.open(`/space/${this.space}/${this.service.name}`)});return}this.$tip.apiFailed(s)})},refreshProject(s=!1){this.loading.page=!0,H(this.currentProject).then(n=>{if(this.project=n,this.space=this.project.space,this.space==null){this.service=null,this.loading.page=!1;return}if(this.installedService==null){this.loading.page=!1;return}let h=null;for(const _ in this.installedService){h=_;break}this.service={name:h,...this.installedService[h]},this.fetchLatestVersion(),s&&this.searchPlugins()}).catch(n=>{this.$tip.apiFailed(n)}).finally(()=>{this.loading.page=!1})},searchPlugins(){this.loading.plugins=!0,se({space:this.space,service:this.service.name,majorVersion:this.majorVersion,keyword:this.keyword}).then(s=>{this.plugins=s}).catch(s=>{s.code!==4001&&this.$tip.apiFailed(s)}).finally(()=>{this.loading.plugins=!1})},selectPlugin(s){this.plugins.length>0&&(this.selectedPlugin=s)},hasNewVersion(s){const n=this.installedPlugins[s.name];if(n==null)return!1;let h=n.version;const _=h.split(".");_.length>3&&(h=_.slice(0,3).join("."));let e=s.lastVersion;const l=e.split(".");return l.length>3&&(e=l.slice(0,3).join(".")),h!==e}},created(){const s=this.$route.query.project_id;s!=null&&s!==""&&(this.setCurrentProject(s),this.$router.replace({name:"Workbench"})),this.fetchProject()}},Pe={class:"page"},Se={key:0,class:"wrap"},we={class:"header"},ye={class:"title"},je={class:"project-code-space"},Ve={class:"service-info"},be={class:"service-title-wrap"},Ie={class:"info"},Ce={class:"content-wrap"},De={class:"service-wrap"},Te={class:"search-input-wrap"},We={class:"setting-wrap"},Le={class:"main"},Ne={class:"service-dimensions"},Ue={class:"dimension-content"},Be={key:0,class:"opera"},Fe={key:1,class:"opera-tip"},Ee={key:1,class:"setting-holder"},Me={key:1,class:"incorrect-wrap"},ze={class:"content"},Ae={key:2,class:"incorrect-wrap"},Ke={class:"content"};function qe(s,n,h,_,e,l){const k=a("Folder"),v=a("el-icon"),f=a("ServiceTitle"),m=a("el-button"),j=a("el-popover"),T=a("SearchInput"),W=a("Upload"),L=a("Check"),N=a("PluginList"),U=a("MarkdownEditor"),B=a("ServiceInstaller"),F=a("ServiceStructureView"),E=a("el-scrollbar"),M=a("InfoFilled"),C=a("router-link"),D=Q("loading");return P((c(),d("div",Pe,[!e.loading.page&&e.project!=null&&e.service!=null?(c(),d("div",Se,[i("div",null,[i("div",we,[i("div",ye,[i("h2",null,t(e.project.name),1),i("p",je,[o(v,null,{default:u(()=>[o(k)]),_:1}),p(t(s.currentProjectDetail.codespace),1)]),i("div",Ve,[i("div",be,[o(f,{space:e.space,service:e.service.name,"service-label":e.service.label,"with-new-page":!0},null,8,["space","service","service-label"]),p(" · v"+t(e.service.version),1)]),e.latestService!=null&&l.latestServiceVersion!==l.currentServiceVersion?(c(),g(j,{key:0,title:s.$t("service.upgradeTitle"),width:255,trigger:"hover","popper-class":"upgrade-popover"},{default:u(()=>[i("pre",null,t(l.upgradeDescription),1)]),reference:u(()=>[o(m,{size:"small",type:"primary",icon:"Upload",onClick:l.upgrade},{default:u(()=>[p(t(s.$t("service.upgrade")),1)]),_:1},8,["onClick"])]),_:1},8,["title"])):S("",!0)])]),i("div",Ie,[i("em",null,"v"+t(l.majorVersion),1),i("p",null,t(s.$t("common.currentVersion")),1)])]),i("div",Ce,[i("div",De,[i("div",Te,[o(T,{placeholder:s.$t("common.search"),modelValue:e.keyword,"onUpdate:modelValue":n[0]||(n[0]=r=>e.keyword=r),onSearch:l.searchPlugins},null,8,["placeholder","modelValue","onSearch"])]),P((c(),g(N,{plugins:e.plugins,"custom-class":r=>({selected:e.selectedPlugin!=null&&e.selectedPlugin.name===r.name}),installed:r=>l.withInstalled(r),onSelect:n[1]||(n[1]=r=>l.selectPlugin(r))},{title:u(({plugin:r})=>[p(t(r.label||r.name)+" ",1),l.hasNewVersion(r)?(c(),g(v,{key:0},{default:u(()=>[o(W)]),_:1})):l.withInstalled(r)?(c(),g(v,{key:1,class:"installed-icon"},{default:u(()=>[o(L)]),_:1})):S("",!0)]),_:1},8,["plugins","custom-class","installed"])),[[D,e.loading.plugins]])]),i("div",We,[e.selectedPlugin!=null?(c(),d(y,{key:0},[i("h3",null,t(e.selectedPlugin.label||e.selectedPlugin.name),1),i("div",Le,[o(E,null,{default:u(()=>[i("ul",Ne,[i("li",{class:V({selected:e.selectedPluginDimension==="readme"}),onClick:n[2]||(n[2]=r=>e.selectedPluginDimension="readme")},t(s.$t("common.readme")),3),i("li",{class:V({selected:e.selectedPluginDimension==="install"}),onClick:n[3]||(n[3]=r=>e.selectedPluginDimension="install")},t(s.$t("plugin.install")),3),i("li",{class:V({selected:e.selectedPluginDimension==="structure"}),onClick:n[4]||(n[4]=r=>e.selectedPluginDimension="structure")},t(s.$t("service.structure")),3)]),i("div",Ue,[P(i("div",null,[o(U,{modelValue:e.selectedPlugin.description,"onUpdate:modelValue":n[5]||(n[5]=r=>e.selectedPlugin.description=r),readonly:"","without-padding":!0},null,8,["modelValue"])],512),[[b,e.selectedPluginDimension==="readme"]]),P(o(B,{ref:"installer",installing:e.isWorking.install,"onUpdate:installing":n[6]||(n[6]=r=>e.isWorking.install=r),uninstalling:e.isWorking.uninstall,"onUpdate:uninstalling":n[7]||(n[7]=r=>e.isWorking.uninstall=r),space:e.space,service:e.service.name,plugin:e.selectedPlugin.name,"service-price":e.selectedPlugin.price.price,"service-lease":e.selectedPlugin.latestLease,version:e.selectedPlugin.lastVersion,"with-project":!1,"project-config":e.project,onInstalled:n[8]||(n[8]=r=>l.refreshProject()),onUninstalled:n[9]||(n[9]=r=>l.refreshProject())},null,8,["installing","uninstalling","space","service","plugin","service-price","service-lease","version","project-config"]),[[b,e.selectedPluginDimension==="install"]]),P(o(F,{space:e.space,service:e.service.name,plugin:e.selectedPlugin.name,version:e.selectedPlugin.lastVersion},null,8,["space","service","plugin","version"]),[[b,e.selectedPluginDimension==="structure"]])])]),_:1})]),e.selectedPluginDimension==="install"?(c(),d("div",Be,[s.userInfo==null?(c(),g(m,{key:0,type:"primary",onClick:n[10]||(n[10]=r=>s.$router.push({name:"SignIn"}))},{default:u(()=>[p("登录后可安装插件")]),_:1})):(c(),d(y,{key:1},[l.installed?(c(),d(y,{key:0},[l.hasNewVersion(e.selectedPlugin)?(c(),g(m,{key:0,type:"primary",icon:"Upload",disabled:e.isWorking.install,onClick:l.install},{default:u(()=>[p(t(s.$t("service.upgrade")),1)]),_:1},8,["disabled","onClick"])):(c(),g(m,{key:1,type:"primary",disabled:e.isWorking.install,onClick:l.install},{default:u(()=>[p(t(e.isWorking.install?s.$t("service.installing"):s.$t("service.reinstall")),1)]),_:1},8,["disabled","onClick"])),o(m,{disabled:e.isWorking.uninstall,onClick:l.uninstall},{default:u(()=>[p(t(e.isWorking.uninstall?s.$t("service.uninstalling"):s.$t("service.uninstall")),1)]),_:1},8,["disabled","onClick"])],64)):(c(),g(m,{key:1,type:"primary",disabled:e.isWorking.install,onClick:l.install},{default:u(()=>[p(t(e.isWorking.install?s.$t("service.installing"):s.$t("service.install")),1)]),_:1},8,["disabled","onClick"]))],64))])):S("",!0),e.selectedPluginDimension==="install"?(c(),d("div",Fe,[o(v,null,{default:u(()=>[o(M)]),_:1}),i("p",null,t(s.$t("service.installTip")),1)])):S("",!0)],64)):(c(),d("div",Ee,[i("h4",null,t(s.$t("workbench.subServiceSettings")),1),i("p",null,t(s.$t("workbench.subServiceSettingsTip")),1)]))])])])])):e.project==null?(c(),d("div",Me,[i("div",ze,[i("p",null,[p(t(s.$t("workbench.noProjectTip1")),1),o(C,{to:{name:"Index"}},{default:u(()=>[p(t(s.$t("common.homepage")),1)]),_:1}),p(t(s.$t("workbench.noProjectTip2")),1)])])])):e.service==null?(c(),d("div",Ae,[i("div",Ke,[i("p",null,[p(t(s.$t("workbench.noServiceInstalledTip1")),1),o(C,{to:{name:"PublicServices"}},{default:u(()=>[p(t(s.$t("service.publicServices")),1)]),_:1}),p(t(s.$t("workbench.noServiceInstalledTip2")),1)])])])):S("",!0)])),[[D,e.loading.page]])}const is=I(ke,[["render",qe],["__scopeId","data-v-2d3e5048"]]);export{is as default};