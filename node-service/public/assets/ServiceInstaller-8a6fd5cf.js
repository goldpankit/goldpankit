import{N as C,P as q,Q as E,R as F,m as L,n as B,h as M,S as R,T as G,_ as N,r as u,o,c,a as p,t as f,b as d,w as _,F as g,f as b,g as V,e as v,j as m,U as O}from"./index-aa9a4821.js";import{S as A,F as U,M as z,V as J,I as Q,a as H,b as K,i as k,g as X}from"./ServiceCodeErrorWindow-4811b85f.js";import{b as Y}from"./service.version-ac5cb490.js";const Z={name:"ServiceInstaller",components:{FormItemTip:C,ServiceCodeErrorWindow:A,MergeWindow:q,ProjectSelect:E,DirectorySelect:F,FieldSetting:U,MySqlFieldSelect:z,VariableInput:J,InstallRadio:Q,InstallInput:H,InstallCheckbox:K},props:{installing:{},uninstalling:{},space:{required:!0},service:{required:!0},plugin:{required:!1},servicePrice:{required:!0},serviceLease:{required:!1},version:{required:!0},versions:{required:!1,default(){return[]}},withProject:{default:!0},projectConfig:{},withTitle:{default:!1},withInstallButton:{default:!1}},data(){return{isWorking:{install:!1,uninstall:!1},versionData:null,variables:[],selectedVersion:null}},computed:{...L(["currentProject","currentProjectDetail","currentDatabase","currentDatabaseDetail"]),isPlugin(){return this.plugin!=null},serviceVariables(){return this.variables},contentWrapStyle(){return this.withTitle?"border-top: 3px; margin-top: 20px;":"padding-top: 0; border-top: 0;margin-top: 0;"},unique(){return[this.space,this.service,this.selectedVersion]}},watch:{version:{immediate:!0,handler(e){this.selectedVersion=e}},unique(){this.fetchVersion()},"isWorking.install":function(){this.$emit("update:installing",this.isWorking.install)},"isWorking.uninstall":function(){this.$emit("update:uninstalling",this.isWorking.uninstall)},projectConfig(){this.initVariables()},plugin(){this.initVariables()}},methods:{...B(["setInstallData"]),...M(["refreshBalance"]),fetchVersion(){Y({space:this.space,service:this.service,plugin:this.plugin,version:this.selectedVersion}).then(e=>{this.versionData=e,this.initVariables()}).catch(e=>{this.$tip.apiFailed(e)})},install(){if(this.serviceLease!=null){this.__install();return}if(this.servicePrice<50){this.__install();return}this.installConfirm(this.servicePrice).then(()=>{this.__install()}).catch(()=>{})},initVariables(){this.versionData!=null&&(this.variables=JSON.parse(this.versionData.variables).map(e=>this.__initVariableValue(e,null)))},__install(){if(this.isWorking.install)return;if(this.isWorking.install=!0,this.currentProject==null||this.currentProject===""){this.$tip.warning(this.$t("service.selectProject")),this.isWorking.install=!1;return}const e=this.__getInstallVariables(this.variables);if(!this.__checkVariables(e)){this.isWorking.install=!1;return}R({projectId:this.currentProject,database:this.currentDatabase,space:this.space,service:this.service,plugin:this.plugin,version:this.selectedVersion,variables:e}).then(t=>{this.isWorking.install=!1,this.$tip.success(this.$t("service.installSuccessfully")),this.setInstallData(t),this.refreshBalance(),this.$emit("installed")}).catch(t=>{if(t.code===6e3){this.$refs.serviceCodeErrorWindow.open(t.errorData);return}this.$tip.apiFailed(t)}).finally(()=>{this.isWorking.install=!1})},uninstall(){if(this.serviceLease!=null){this.__uninstall();return}if(this.servicePrice<50){this.__uninstall();return}this.uninstallConfirm().then(()=>{this.__uninstall()}).catch(()=>{})},__uninstall(){this.isWorking.uninstall||(this.isWorking.uninstall=!0,G({projectId:this.currentProject,database:this.currentDatabase,space:this.space,service:this.service,plugin:this.plugin,version:this.selectedVersion,variables:this.__getInstallVariables(this.variables)}).then(e=>{this.isWorking.uninstall=!1,this.$tip.success(this.$t("service.uninstallSuccessfully")),this.setInstallData(e),this.$emit("uninstalled")}).catch(e=>{if(e.code===6e3){this.$refs.serviceCodeErrorWindow.open(e.errorData);return}this.$tip.apiFailed(e)}).finally(()=>{this.isWorking.uninstall=!1}))},__checkVariables(e,t){for(const i of e){if(i.inputType==="query_model"||i.inputType==="table"){if(i.required&&(i.value==null||i.value===""))return this.__tipEmptyVariable(i,t),!1;if(i.children==null||i.children.length===0)continue;for(const s of i.children){const n=s.value;for(const l of s.children){if(!l.required)continue;const a=n.find(h=>k(h[l.name]));if(a!=null)return this.$tip.warning(this.$t("service.fieldMissingValueTip",{fieldGroupLabel:s.label,emptyFieldName:a.name,fieldVariableLabel:l.label})),!1}}continue}if(i.inputType==="select"){const s=i.value;if(i.required&&s.value==null)return this.__tipEmptyVariable(i,t),!1;if(s.value!=null){const n=i.options.find(l=>l.value===s.value);if(n.settings.length>0){for(const l of n.settings)if(k(s.settings[l.name]))return this.$tip.warning(this.$t("service.variableMissingSettingTip",{variable:i.label,settingLabel:l.label})),!1}}continue}if(i.type==="group"){if(!this.__checkVariables(i.children,i.label))return!1;continue}if(i.required&&k(i.value))return this.__tipEmptyVariable(i,t),!1}return!0},__tipEmptyVariable(e,t){t!=null?this.$tip.warning(this.$t("service.missingGroupVariableValueTip",{variable:e.label,groupName:t})):this.$tip.warning(this.$t("service.missingVariableValueTip",{variable:e.label}))},__getInstallVariables(e){return e.map(t=>{if(t.inputType==="select"){const i=t.options.find(n=>n.value===t.value.value);if(i==null)return t;const s={};for(const n of i.settings)s[n.name]=n.value;t.value.settings=s}return t.type==="group"&&(t.children=this.__getInstallVariables(t.children)),t})},__initVariableValue(e,t,i=!0){if(t==null&&i&&this.projectConfig!=null)if(this.isPlugin){const s=this.projectConfig.plugins||this.projectConfig.services;if(s!=null){const n=s[this.plugin];if(n!=null){const l=n.variables.findLast(a=>a.name===e.name);l!=null&&(t=l.value)}}if(t==null){const n=this.projectConfig.service||this.projectConfig.main;if(n!=null){let l=null;for(const h in n){l=h;break}const a=n[l].variables[e.name];t=a,a!=null&&a.constructor!==e.defaultValue.constructor&&(t=null)}}}else{const s=this.projectConfig.service||this.projectConfig.main;if(s!=null){const n=s[this.service];if(n!=null){const l=n.variables.findLast(a=>a.name===e.name);l!=null&&(t=l.value)}}}if(t!=null){if(e.inputType==="table"||e.inputType==="query_model"){for(const s in t.settings){const n=e.children.find(a=>a.name===s);if(n==null)continue;let l=t.settings[s];for(const a of n.children)if(a.inputType==="select")for(const h of l)h[a.name]={value:h[a.name],settings:h[`${a.name}Settings`]},delete h[`${a.name}Settings`];n.value=t.settings[s]}return e.value=t.value,e}return e.type==="group"?(e.children.forEach(s=>this.__initVariableValue(s,t[s.name],!1)),e):(e.value=t,e)}if(t=e.defaultValue,t=t??X(e.inputType),e.inputType==="table"||e.inputType==="query_model"){if(e.children!=null)for(const s of e.children)s.value=s.defaultValue;return e.value=t,e}return e.type==="group"?(e.children!=null&&e.children.forEach(s=>{s.value=s.defaultValue}),e):(e.value=t,e)}},created(){this.fetchVersion()}},x={class:"service-installer"},ee={key:0,class:"nav"},te={class:"title"},ie={key:0,class:"install"},se={class:"install-tip"},ne={class:"form-wrap"},le={key:1,class:"label-wrap"},re={key:1,class:"group-vars"},ae={class:"text-info-1 text-mini"},oe={key:0},ce={key:1,class:"parameters-holder"};function ue(e,t,i,s,n,l){const a=u("el-option"),h=u("el-select"),D=u("el-button"),$=u("ProjectSelect"),j=u("FormItemTip"),w=u("el-form-item"),I=u("ArrowRight"),P=u("el-icon"),S=u("VariableInput"),W=u("el-form"),T=u("ServiceCodeErrorWindow");return o(),c("div",x,[i.withTitle?(o(),c("div",ee,[p("div",te,[p("h4",null,"@"+f(i.space)+"/"+f(i.service)+" · "+f(e.$t("service.install2"))+" · ",1),d(h,{modelValue:n.selectedVersion,"onUpdate:modelValue":t[0]||(t[0]=r=>n.selectedVersion=r)},{default:_(()=>[(o(!0),c(g,null,b(i.versions,r=>(o(),V(a,{key:r,value:r},{default:_(()=>[v(f(r),1)]),_:2},1032,["value"]))),128))]),_:1},8,["modelValue"])]),i.withInstallButton?(o(),c("div",ie,[d(D,{type:"important",onClick:l.install,disabled:n.isWorking.install},{default:_(()=>[v(f(n.isWorking.install?e.$t("service.installing"):e.$t("service.install")),1)]),_:1},8,["onClick","disabled"])])):m("",!0)])):m("",!0),p("div",{class:"content-wrap",style:O(l.contentWrapStyle)},[i.withProject||l.serviceVariables.length>0?(o(),c(g,{key:0},[p("p",se,f(e.$t("service.withParametersTip")),1),p("div",ne,[d(W,null,{default:_(()=>[i.withProject?(o(),V(w,{key:0,label:e.$t("project.project"),required:"",class:"form-item-project"},{default:_(()=>[d($,{"model-value":e.currentProject,"with-block":!0,"with-prefix":!1,onChange:t[1]||(t[1]=r=>e.$emit("change-project",r))},null,8,["model-value"]),e.currentProjectDetail!=null?(o(),V(j,{key:0,content:`服务安装后代码将写入<em>${e.currentProjectDetail.codespace}</em>目录。`},null,8,["content"])):m("",!0)]),_:1},8,["label"])):m("",!0),(o(!0),c(g,null,b(l.serviceVariables,r=>(o(),c(g,null,[r.hidden?m("",!0):(o(),V(w,{key:r.name,label:r.label,required:r.required},{label:_(()=>[r.type==="variable"?(o(),c(g,{key:0},[v(f(r.label),1)],64)):(o(),c("div",le,[p("span",null,f(r.label),1),d(P,null,{default:_(()=>[d(I)]),_:1})]))]),default:_(()=>[r.type==="variable"?(o(),V(S,{key:0,variable:r},null,8,["variable"])):r.type==="group"?(o(),c("ul",re,[(o(!0),c(g,null,b(r.children,y=>(o(),c("li",{key:`${r.name}_${y.name}`},[p("label",ae,[y.required?(o(),c("em",oe,"*")):m("",!0),v(f(y.label),1)]),d(S,{variable:y},null,8,["variable"])]))),128))])):m("",!0),r.inputType==="datasource"&&e.currentDatabaseDetail!=null?(o(),V(j,{key:2,content:`基础信息：${e.currentDatabaseDetail.host}:${e.currentDatabaseDetail.port}/${e.currentDatabaseDetail.schema}`},null,8,["content"])):m("",!0)]),_:2},1032,["label","required"]))],64))),256))]),_:1})])],64)):(o(),c("div",ce,[p("p",null,f(e.$t("service.withoutParametersTip")),1)]))],4),d(T,{ref:"serviceCodeErrorWindow"},null,512)])}const de=N(Z,[["render",ue],["__scopeId","data-v-6f56f01c"]]);export{de as S};