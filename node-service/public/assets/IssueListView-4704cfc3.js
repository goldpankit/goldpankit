import{B as W}from"./BeanAmount-0de37442.js";import{E as T}from"./Empty-5aa84973.js";import{_ as I,r as u,o as i,c as r,F as f,f as S,H as q,i as B,a as t,K as E,t as o,g as v,e as w,L,P as D,N as F,m as A,n as N,h as M,O,Q as R,b as _,j as g,w as p,p as U,l as x}from"./index-006c2bb9.js";import{S as z,F as G,M as H,V as J,I as K,a as Q,b as X,c as Y,g as Z}from"./ServiceCodeErrorWindow-019a0c5f.js";import{P as ee}from"./Pagination-875c4169.js";const te={name:"SubServiceList",components:{Empty:T,BeanAmount:W},props:{services:{type:Array,required:!0},customClass:{type:Function,default(){return()=>{}}}}},se={key:0,class:"sub-service-list"},ne=["onClick"],ie={class:"latest-version"},le={class:"user-profile"},re=["src"],ae={class:"price-wrap"},oe={class:"text-info-1 text-mini"},ce={key:0};function ue(e,s,n,c,a,h){const m=u("BeanAmount"),y=u("Empty");return n.services.length>0?(i(),r("ul",se,[(i(!0),r(f,null,S(n.services,l=>(i(),r("li",{key:l.id,class:q(n.customClass(l)),onClick:B($=>e.$emit("click",l),["stop"])},[t("h5",null,[E(e.$slots,"title",{service:l},()=>[w(o(l.name),1)],!0)]),t("p",ie,o(e.$t("service.latestVersion"))+": v"+o(l.lastVersion),1),t("p",null,o(l.introduce),1),t("div",le,[t("img",{src:e.getAccessUri(l.user.avatar,"/images/avatar/default.png")},null,8,re),t("span",null,o(l.user.username),1)]),t("div",ae,[t("p",oe,o(e.$t("service.lastPublish"))+": "+o(e.getDateOffsetText(l.lastPublishTime)),1),l.latestLease!=null?(i(),r("em",ce,o(e.getRemainingDay(l.latestLease.leaseEndTime))+" "+o(e.$t("common.days")),1)):(i(),v(m,{key:1,price:l.price.price,type:l.price.leaseType},null,8,["price","type"]))])],10,ne))),128))])):(i(),v(y,{key:1,description:e.$t("service.noSubServices")},null,8,["description"]))}const Me=I(te,[["render",ue],["__scopeId","data-v-50a6eacc"]]);const de={name:"ServiceInstaller",components:{ServiceCodeErrorWindow:z,MergeWindow:L,ProjectSelect:D,DirectorySelect:F,FieldSetting:G,MySqlFieldSelect:H,VariableInput:J,InstallRadio:K,InstallInput:Q,InstallCheckbox:X},props:{installing:{},uninstalling:{},space:{required:!0},service:{required:!0},serviceType:{required:!0},servicePrice:{required:!0},serviceLease:{required:!1},version:{required:!0},withProject:{default:!0},projectConfig:{},withBreadcrumbs:{default:!1},withInstallButton:{default:!1}},data(){return{isWorking:{install:!1,uninstall:!1},variables:[]}},computed:{...A(["currentProject","currentDatabase"]),serviceVariables(){return this.variables},unique(){return[this.space,this.service,this.version]}},watch:{unique(){this.fetchVersion()},"isWorking.install":function(){this.$emit("update:installing",this.isWorking.install)},"isWorking.uninstall":function(){this.$emit("update:uninstalling",this.isWorking.uninstall)}},methods:{...N(["setCurrentProject","setInstallData"]),...M(["refreshBalance"]),fetchVersion(){Y({space:this.space,service:this.service,version:this.version}).then(e=>{this.variables=JSON.parse(e.variables).map(s=>this.__initVariableValue(s))}).catch(e=>{this.$tip.apiFailed(e)})},install(){if(this.serviceLease!=null){this.__install();return}if(this.servicePrice<50){this.__install();return}this.installConfirm(this.servicePrice).then(()=>{this.__install()}).catch(()=>{})},__install(){this.isWorking.install||(this.isWorking.install=!0,O({projectId:this.currentProject,database:this.currentDatabase,space:this.space,service:this.service,serviceType:this.serviceType,version:this.version,variables:this.__getInstallVariables(this.variables)}).then(e=>{this.$tip.success(this.$t("service.installSuccessfully")),this.setInstallData(e),this.refreshBalance(),this.$emit("installed")}).catch(e=>{if(e.code===6e3){this.$refs.serviceCodeErrorWindow.open(e.errorData);return}this.$tip.apiFailed(e)}).finally(()=>{this.isWorking.install=!1}))},uninstall(){if(this.serviceLease!=null){this.__uninstall();return}if(this.servicePrice<50){this.__uninstall();return}this.uninstallConfirm().then(()=>{this.__uninstall()}).catch(()=>{})},__uninstall(){this.isWorking.uninstall||(this.isWorking.uninstall=!0,R({projectId:this.currentProject,database:this.currentDatabase,space:this.space,service:this.service,serviceType:this.serviceType,version:this.version,variables:this.__getInstallVariables(this.variables)}).then(e=>{this.$tip.success(this.$t("service.uninstallSuccessfully")),this.setInstallData(e),this.$emit("uninstalled")}).catch(e=>{if(e.code===6e3){this.$refs.serviceCodeErrorWindow.open(e.errorData);return}this.$tip.apiFailed(e)}).finally(()=>{this.isWorking.uninstall=!1}))},__getInstallVariables(e){return e.map(s=>{if(s.inputType==="select"){const n=s.options.find(a=>a.value===s.value.value);if(n==null)return s;const c={};for(const a of n.settings)c[a.name]=a.value;s.value.settings=c}return s})},__initVariableValue(e,s){if(s==null&&this.projectConfig!=null){const n=this.projectConfig.services[this.service];if(n!=null){const c=n.variables.findLast(a=>a.name===e.name);c!=null&&(s=c.value)}if(s==null){let c=null;for(const h in this.projectConfig.main){c=h;break}const a=this.projectConfig.main[c].variables[e.name];s=a,a!=null&&a.constructor!==e.defaultValue.constructor&&(s=null)}}if(s!=null){if(e.inputType==="table"||e.inputType==="query_model"){for(const n in s.settings){const c=e.children.find(a=>a.name===n);c!=null&&(c.value=s.settings[n])}return e.value=s.value,console.log(e.name,e.value,s),e}return e.type==="group"?(e.children.forEach(n=>this.__initVariableValue(n,s[n.name])),e):(e.value=s,e)}if(s=e.defaultValue,s=s??Z(e.inputType),e.inputType==="table"||e.inputType==="query_model"){for(const n of e.children)n.value=n.defaultValue;return e.value=s,e}return e.type==="group"?(e.children.forEach(n=>{n.value=n.defaultValue}),e):(e.value=s,e)}},created(){this.fetchVersion()}},_e={class:"service-installer"},pe={key:0,class:"nav"},he={class:"title"},fe={class:"content-wrap"},me={class:"install-tip"},ge={class:"form-wrap"},ye={key:1,class:"label-wrap"},ve={key:1,class:"group-vars"},ke={class:"text-info-1 text-mini"},$e={key:0},Ve={key:1,class:"parameters-holder"},we={key:2,class:"install"};function Se(e,s,n,c,a,h){const m=u("el-button"),y=u("ProjectSelect"),l=u("el-form-item"),$=u("ArrowRight"),C=u("el-icon"),b=u("VariableInput"),P=u("el-form"),j=u("ServiceCodeErrorWindow");return i(),r("div",_e,[n.withBreadcrumbs?(i(),r("div",pe,[t("div",he,[_(m,{class:"button-icon",icon:"ArrowLeftBold",onClick:s[0]||(s[0]=d=>e.$emit("back"))}),t("h4",null,o(n.service)+o(n.version==null?"":" · "+n.version.toUpperCase())+" · "+o(e.$t("service.install2")),1)])])):g("",!0),t("div",fe,[n.withProject||h.serviceVariables.length>0?(i(),r(f,{key:0},[t("p",me,o(e.$t("service.withParametersTip")),1),t("div",ge,[_(P,null,{default:p(()=>[n.withProject?(i(),v(l,{key:0,label:e.$t("project.project"),required:""},{default:p(()=>[_(y,{"model-value":e.currentProject,"with-block":!0,"with-prefix":!1,onChange:e.setCurrentProject},null,8,["model-value","onChange"])]),_:1},8,["label"])):g("",!0),(i(!0),r(f,null,S(h.serviceVariables,d=>(i(),r(f,null,[d.hidden?g("",!0):(i(),v(l,{key:d.name,label:d.label,required:d.required},{label:p(()=>[d.type==="variable"?(i(),r(f,{key:0},[w(o(d.label),1)],64)):(i(),r("div",ye,[t("span",null,o(d.label),1),_(C,null,{default:p(()=>[_($)]),_:1})]))]),default:p(()=>[d.type==="variable"?(i(),v(b,{key:0,variable:d},null,8,["variable"])):d.type==="group"?(i(),r("ul",ve,[(i(!0),r(f,null,S(d.children,V=>(i(),r("li",{key:`${d.name}_${V.name}`},[t("label",ke,[V.required?(i(),r("em",$e,"*")):g("",!0),w(o(V.label),1)]),_(b,{variable:V},null,8,["variable"])]))),128))])):g("",!0)]),_:2},1032,["label","required"]))],64))),256))]),_:1})])],64)):(i(),r("div",Ve,[t("p",null,o(e.$t("service.withoutParametersTip")),1)])),n.withInstallButton?(i(),r("div",we,[_(m,{type:"important",onClick:h.install,disabled:a.isWorking.install},{default:p(()=>[w(o(a.isWorking.install?e.$t("service.installing"):e.$t("service.install")),1)]),_:1},8,["onClick","disabled"])])):g("",!0)]),_(j,{ref:"serviceCodeErrorWindow"},null,512)])}const Oe=I(de,[["render",Se],["__scopeId","data-v-25beed6a"]]);const Ce={name:"IssueListView",components:{Pagination:ee},data(){return{pagination:{pageIndex:1,capacity:10,total:100}}}},k=e=>(U("data-v-f510f853"),e=e(),x(),e),Ie={class:"issue-wrap"},be=k(()=>t("div",{class:"toolbar"},[t("ul",null,[t("li",null,"All"),t("li",null,"Enabled"),t("li",null,"Completed"),t("li",null,"Refused")]),t("ul",{class:"issue-types"},[t("li",{class:"bug"},"BUG"),t("li",{class:"optimize"},"Optimize")])],-1)),Pe={class:"issues"},je=k(()=>t("h3",null,"登录失败时验证码没有刷新",-1)),We={class:"text-info-1"},Te=k(()=>t("span",null,"刘大逵",-1)),qe=k(()=>t("li",{class:"text-info-1"},[t("span",null,"Completed")],-1)),Be=k(()=>t("li",{class:"text-info-1"},[t("span",null,"3小时前")],-1));function Ee(e,s,n,c,a,h){const m=u("UserFilled"),y=u("el-icon"),l=u("router-link"),$=u("Pagination");return i(),r("div",Ie,[be,t("ul",Pe,[(i(),r(f,null,S(10,C=>t("li",{key:C},[_(l,{to:"#",target:"_blank"},{default:p(()=>[je,t("ul",null,[t("li",We,[_(y,null,{default:p(()=>[_(m)]),_:1}),Te]),qe,Be])]),_:1})])),64))]),_($,{pagination:a.pagination},null,8,["pagination"])])}const Re=I(Ce,[["render",Ee],["__scopeId","data-v-f510f853"]]);export{Re as I,Me as S,Oe as a};