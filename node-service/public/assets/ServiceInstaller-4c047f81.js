import{N as T,P as q,Q as F,m as E,n as L,h as B,R as M,S as N,_ as R,r as c,o as a,c as o,a as h,t as u,b as p,w as f,F as m,f as b,g,e as y,j as d,T as G}from"./index-0fd86c75.js";import{S as O,F as A,M as z,V as J,I as Q,a as U,b as H,i as k,g as K}from"./ServiceCodeErrorWindow-2f9173b3.js";import{b as X}from"./service.version-fcf72063.js";import{F as Y}from"./FormItemTip-757dbc9e.js";const Z={name:"ServiceInstaller",components:{FormItemTip:Y,ServiceCodeErrorWindow:O,MergeWindow:T,ProjectSelect:q,DirectorySelect:F,FieldSetting:A,MySqlFieldSelect:z,VariableInput:J,InstallRadio:Q,InstallInput:U,InstallCheckbox:H},props:{installing:{},uninstalling:{},space:{required:!0},service:{required:!0},plugin:{required:!1},servicePrice:{required:!0},serviceLease:{required:!1},version:{required:!0},versions:{required:!1,default(){return[]}},withProject:{default:!0},projectConfig:{},withTitle:{default:!1},withInstallButton:{default:!1}},data(){return{isWorking:{install:!1,uninstall:!1},versionData:null,variables:[],selectedVersion:null}},computed:{...E(["currentProject","currentProjectDetail","currentDatabase","currentDatabaseDetail"]),isPlugin(){return this.plugin!=null},serviceVariables(){return this.variables},contentWrapStyle(){return this.withTitle?"border-top: 3px; margin-top: 20px;":"padding-top: 0; border-top: 0;margin-top: 0;"},unique(){return[this.space,this.service,this.selectedVersion]}},watch:{version:{immediate:!0,handler(e){this.selectedVersion=e}},unique(){this.fetchVersion()},"isWorking.install":function(){this.$emit("update:installing",this.isWorking.install)},"isWorking.uninstall":function(){this.$emit("update:uninstalling",this.isWorking.uninstall)},projectConfig(){this.initVariables()},plugin(){this.initVariables()}},methods:{...L(["setInstallData"]),...B(["refreshBalance"]),fetchVersion(){X({space:this.space,service:this.service,plugin:this.plugin,version:this.selectedVersion}).then(e=>{this.versionData=e,this.initVariables()}).catch(e=>{this.$tip.apiFailed(e)})},install(){if(this.serviceLease!=null){this.__install();return}if(this.servicePrice<50){this.__install();return}this.installConfirm(this.servicePrice).then(()=>{this.__install()}).catch(()=>{})},initVariables(){this.versionData!=null&&(this.variables=JSON.parse(this.versionData.variables).map(e=>this.__initVariableValue(e)))},__install(){if(this.isWorking.install)return;if(this.isWorking.install=!0,this.currentProject==null||this.currentProject===""){this.$tip.warning(this.$t("service.selectProject")),this.isWorking.install=!1;return}const e=this.__getInstallVariables(this.variables);if(!this.__checkVariables(e)){this.isWorking.install=!1;return}M({projectId:this.currentProject,database:this.currentDatabase,space:this.space,service:this.service,plugin:this.plugin,version:this.selectedVersion,variables:e}).then(t=>{this.isWorking.install=!1,this.$tip.success(this.$t("service.installSuccessfully")),this.setInstallData(t),this.refreshBalance(),this.$emit("installed")}).catch(t=>{if(t.code===6e3){this.$refs.serviceCodeErrorWindow.open(t.errorData);return}this.$tip.apiFailed(t)}).finally(()=>{this.isWorking.install=!1})},uninstall(){if(this.serviceLease!=null){this.__uninstall();return}if(this.servicePrice<50){this.__uninstall();return}this.uninstallConfirm().then(()=>{this.__uninstall()}).catch(()=>{})},__uninstall(){this.isWorking.uninstall||(this.isWorking.uninstall=!0,N({projectId:this.currentProject,database:this.currentDatabase,space:this.space,service:this.service,plugin:this.plugin,version:this.selectedVersion,variables:this.__getInstallVariables(this.variables)}).then(e=>{this.isWorking.uninstall=!1,this.$tip.success(this.$t("service.uninstallSuccessfully")),this.setInstallData(e),this.$emit("uninstalled")}).catch(e=>{if(e.code===6e3){this.$refs.serviceCodeErrorWindow.open(e.errorData);return}this.$tip.apiFailed(e)}).finally(()=>{this.isWorking.uninstall=!1}))},__checkVariables(e,t){for(const i of e){if(i.inputType==="query_model"||i.inputType==="table"){for(const s of i.children){const n=s.value;for(const l of s.children){if(!l.required)continue;const _=n.find(v=>k(v[l.name]));if(_!=null)return this.$tip.warning(this.$t("service.fieldMissingValueTip",{fieldGroupLabel:s.label,emptyFieldName:_.name,fieldVariableLabel:l.label})),!1}}continue}if(i.inputType==="select"){const s=i.value;if(i.required&&s.value==null)return this.__tipEmptyVariable(i,t),!1;if(s.value!=null){const n=i.options.find(l=>l.value===s.value);if(n.settings.length>0){for(const l of n.settings)if(k(s.settings[l.name]))return this.$tip.warning(this.$t("service.variableMissingSettingTip",{variable:i.label,settingLabel:l.label})),!1}}continue}if(i.type==="group"){if(!this.__checkVariables(i.children,i.label))return!1;continue}if(k(i.value))return this.__tipEmptyVariable(i,t),!1}return!0},__tipEmptyVariable(e,t){t!=null?this.$tip.warning(this.$t("service.missingGroupVariableValueTip",{variable:e.label,groupName:t})):this.$tip.warning(this.$t("service.missingVariableValueTip",{variable:e.label}))},__getInstallVariables(e){return e.map(t=>{if(t.inputType==="select"){const i=t.options.find(n=>n.value===t.value.value);if(i==null)return t;const s={};for(const n of i.settings)s[n.name]=n.value;t.value.settings=s}return t.type==="group"&&(t.children=this.__getInstallVariables(t.children)),t})},__initVariableValue(e,t){if(t==null&&this.projectConfig!=null)if(this.isPlugin){const i=this.projectConfig.plugins||this.projectConfig.services;if(i!=null){const s=i[this.plugin];if(s!=null){const n=s.variables.findLast(l=>l.name===e.name);n!=null&&(t=n.value)}}if(t==null){const s=this.projectConfig.service||this.projectConfig.main;if(s!=null){let n=null;for(const _ in s){n=_;break}const l=s[n].variables[e.name];t=l,l!=null&&l.constructor!==e.defaultValue.constructor&&(t=null)}}}else{const i=this.projectConfig.service||this.projectConfig.main;if(i!=null){const s=i[this.service];if(s!=null){const n=s.variables.findLast(l=>l.name===e.name);n!=null&&(t=n.value)}}}if(t!=null){if(e.inputType==="table"||e.inputType==="query_model"){for(const i in t.settings){const s=e.children.find(n=>n.name===i);s!=null&&(s.value=t.settings[i])}return e.value=t.value,e}return e.type==="group"?(e.children.forEach(i=>this.__initVariableValue(i,t[i.name])),e):(e.value=t,e)}if(t=e.defaultValue,t=t??K(e.inputType),e.inputType==="table"||e.inputType==="query_model"){if(e.children!=null)for(const i of e.children)i.value=i.defaultValue;return e.value=t,e}return e.type==="group"?(e.children!=null&&e.children.forEach(i=>{i.value=i.defaultValue}),e):(e.value=t,e)}},created(){this.fetchVersion()}},x={class:"service-installer"},ee={key:0,class:"nav"},te={class:"title"},ie={key:0,class:"install"},se={class:"install-tip"},ne={class:"form-wrap"},le={key:1,class:"label-wrap"},re={key:1,class:"group-vars"},ae={class:"text-info-1 text-mini"},oe={key:0},ce={key:1,class:"parameters-holder"};function ue(e,t,i,s,n,l){const _=c("el-option"),v=c("el-select"),S=c("el-button"),I=c("ProjectSelect"),j=c("FormItemTip"),w=c("el-form-item"),P=c("ArrowRight"),W=c("el-icon"),D=c("VariableInput"),$=c("el-form"),C=c("ServiceCodeErrorWindow");return a(),o("div",x,[i.withTitle?(a(),o("div",ee,[h("div",te,[h("h4",null,"@"+u(i.space)+"/"+u(i.service)+" · "+u(e.$t("service.install2"))+" · ",1),p(v,{modelValue:n.selectedVersion,"onUpdate:modelValue":t[0]||(t[0]=r=>n.selectedVersion=r)},{default:f(()=>[(a(!0),o(m,null,b(i.versions,r=>(a(),g(_,{key:r,value:r},{default:f(()=>[y(u(r),1)]),_:2},1032,["value"]))),128))]),_:1},8,["modelValue"])]),i.withInstallButton?(a(),o("div",ie,[p(S,{type:"important",onClick:l.install,disabled:n.isWorking.install},{default:f(()=>[y(u(n.isWorking.install?e.$t("service.installing"):e.$t("service.install")),1)]),_:1},8,["onClick","disabled"])])):d("",!0)])):d("",!0),h("div",{class:"content-wrap",style:G(l.contentWrapStyle)},[i.withProject||l.serviceVariables.length>0?(a(),o(m,{key:0},[h("p",se,u(e.$t("service.withParametersTip")),1),h("div",ne,[p($,null,{default:f(()=>[i.withProject?(a(),g(w,{key:0,label:e.$t("project.project"),required:"",class:"form-item-project"},{default:f(()=>[p(I,{"model-value":e.currentProject,"with-block":!0,"with-prefix":!1,onChange:t[1]||(t[1]=r=>e.$emit("change-project",r))},null,8,["model-value"]),e.currentProjectDetail!=null?(a(),g(j,{key:0,content:`服务安装后代码将写入<em>${e.currentProjectDetail.codespace}</em>目录。`},null,8,["content"])):d("",!0)]),_:1},8,["label"])):d("",!0),(a(!0),o(m,null,b(l.serviceVariables,r=>(a(),o(m,null,[r.hidden?d("",!0):(a(),g(w,{key:r.name,label:r.label,required:r.required},{label:f(()=>[r.type==="variable"?(a(),o(m,{key:0},[y(u(r.label),1)],64)):(a(),o("div",le,[h("span",null,u(r.label),1),p(W,null,{default:f(()=>[p(P)]),_:1})]))]),default:f(()=>[r.type==="variable"?(a(),g(D,{key:0,variable:r},null,8,["variable"])):r.type==="group"?(a(),o("ul",re,[(a(!0),o(m,null,b(r.children,V=>(a(),o("li",{key:`${r.name}_${V.name}`},[h("label",ae,[V.required?(a(),o("em",oe,"*")):d("",!0),y(u(V.label),1)]),p(D,{variable:V},null,8,["variable"])]))),128))])):d("",!0),r.inputType==="datasource"&&e.currentDatabaseDetail!=null?(a(),g(j,{key:2,content:`基础信息：${e.currentDatabaseDetail.host}:${e.currentDatabaseDetail.port}/${e.currentDatabaseDetail.schema}`},null,8,["content"])):d("",!0)]),_:2},1032,["label","required"]))],64))),256))]),_:1})])],64)):(a(),o("div",ce,[h("p",null,u(e.$t("service.withoutParametersTip")),1)]))],4),p(C,{ref:"serviceCodeErrorWindow"},null,512)])}const _e=R(Z,[["render",ue],["__scopeId","data-v-3497f161"]]);export{_e as S};