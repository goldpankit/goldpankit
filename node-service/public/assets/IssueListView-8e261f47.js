import{P as L,L as B,m as F,i as N,_ as C,r as o,o as i,c as n,b as s,d as r,t as h,f as p,F as d,w as u,u as V,x as w,g as j,p as P,h as $}from"./index-509f7063.js";import{F as q,M as A,V as D,I as T,a as U,b as M,f as R,i as z,u as E}from"./service.version-1330aacb.js";import{P as G}from"./Pagination-ba4bc926.js";const O={name:"ServiceInstaller",components:{ProjectSelect:L,DirectorySelect:B,FieldSetting:q,MySqlFieldSelect:A,VariableInput:D,InstallRadio:T,InstallInput:U,InstallCheckbox:M},props:{installing:{},uninstalling:{},space:{required:!0},service:{required:!0},version:{required:!0},withProject:{default:!0},projectConfig:{},withBreadcrumbs:{default:!1},withInstallButton:{default:!1}},data(){return{isWorking:{install:!1,uninstall:!1},variables:[]}},computed:{...F(["currentProject","currentDatabase"]),serviceVariables(){return this.variables.filter(e=>e.scope==="service")},unique(){return[this.space,this.service,this.version]}},watch:{unique(){this.fetchVersion()},"isWorking.install":function(){this.$emit("update:installing",this.isWorking.install)},"isWorking.uninstall":function(){this.$emit("update:uninstalling",this.isWorking.uninstall)}},methods:{...N(["setCurrentProject"]),fetchVersion(){R({space:this.space,service:this.service,version:this.version}).then(e=>{this.variables=JSON.parse(e.variables).map(t=>t.type==="variable"&&t.scope==="service"?{...t,value:this.__getVariableValue(t)}:t.type==="group"&&t.scope==="service"?(t.children=t.children.map(l=>({...l,value:this.__getVariableValue(l)})),t):(t.type==="group"&&t.scope==="table_field"&&(t.value=this.__getVariableValue(t)),t))}).catch(e=>{this.$tip.apiFailed(e)})},install(){this.isWorking.install||(this.isWorking.install=!0,z({projectId:this.currentProject,database:this.currentDatabase,space:this.space,service:this.service,version:this.version,variables:this.variables}).then(()=>{this.$tip.success("Install Successfully"),this.$emit("installed")}).catch(e=>{this.$emit("error",e)}).finally(()=>{this.isWorking.install=!1}))},uninstall(){this.isWorking.uninstall||(this.isWorking.uninstall=!0,E({projectId:this.currentProject,database:this.currentDatabase,space:this.space,service:this.service,version:this.version,variables:this.variables}).then(()=>{this.$tip.success("Uninstall Successfully"),this.$emit("uninstalled")}).catch(e=>{this.$emit("error",e)}).finally(()=>{this.isWorking.uninstall=!1}))},__getVariableValue(e){let t=null;if(this.projectConfig!=null){const l=this.projectConfig.services[this.service];if(l!=null&&(t=l.variables[e.name]),t==null&&(e.type==="variable"||e.type==="group"&&e.scope==="service")){let v=null;for(const _ in this.projectConfig.main){v=_;break}const c=this.projectConfig.main[v].variables[e.name];t=c,c!=null&&c.constructor!==e.defaultValue.constructor&&(t=null)}}return t==null&&(t=e.defaultValue),t}},created(){this.fetchVersion()}},x=e=>(P("data-v-1843dcc6"),e=e(),$(),e),J={class:"service-installer"},H={key:0,class:"nav"},K={class:"title"},Q={class:"content-wrap"},X=x(()=>s("p",{class:"install-tip"}," tips: Install the service by filling out the form below and clicking the Install button at the bottom. ",-1)),Y={class:"form-wrap"},Z={key:1,class:"label-wrap"},ee={key:1,class:"group-vars"},te={class:"text-info-1 text-mini"},se={key:1,class:"parameters-holder"},ie=x(()=>s("p",null,"This service does not have any parameters, click the INSTALL button at the bottom to install.",-1)),le=[ie],ne={key:2,class:"install"};function ae(e,t,l,v,c,_){const m=o("el-button"),g=o("ProjectSelect"),b=o("el-form-item"),k=o("ArrowRight"),y=o("el-icon"),S=o("VariableInput"),W=o("el-form");return i(),n("div",J,[l.withBreadcrumbs?(i(),n("div",H,[s("div",K,[r(m,{class:"button-icon",icon:"ArrowLeftBold",onClick:t[0]||(t[0]=a=>e.$emit("back"))}),s("h4",null,h(l.service)+h(l.version==null?"":" · "+l.version.toUpperCase())+" · Install",1)])])):p("",!0),s("div",Q,[l.withProject||_.serviceVariables.length>0?(i(),n(d,{key:0},[X,s("div",Y,[r(W,null,{default:u(()=>[l.withProject?(i(),V(b,{key:0,label:"Project",required:""},{default:u(()=>[r(g,{"model-value":e.currentProject,"with-block":!0,"with-prefix":!1,onChange:e.setCurrentProject},null,8,["model-value","onChange"])]),_:1})):p("",!0),(i(!0),n(d,null,w(_.serviceVariables,a=>(i(),n(d,null,[a.hidden?p("",!0):(i(),V(b,{key:a.name,label:a.label},{label:u(()=>[a.type==="variable"?(i(),n(d,{key:0},[j(h(a.label),1)],64)):(i(),n("div",Z,[s("span",null,h(a.label),1),r(y,null,{default:u(()=>[r(k)]),_:1})]))]),default:u(()=>[a.type==="variable"?(i(),V(S,{key:0,variable:a,variables:c.variables},null,8,["variable","variables"])):a.type==="group"?(i(),n("ul",ee,[(i(!0),n(d,null,w(a.children,I=>(i(),n("li",{key:`${a.name}_${I.name}`},[s("label",te,h(I.label),1),r(S,{variable:I},null,8,["variable"])]))),128))])):p("",!0)]),_:2},1032,["label"]))],64))),256))]),_:1})])],64)):(i(),n("div",se,le)),l.withInstallButton?(i(),n("div",ne,[r(m,{type:"important",onClick:_.install,disabled:c.isWorking.install},{default:u(()=>[j(h(c.isWorking.install?"INSTALLING...":"INSTALL"),1)]),_:1},8,["onClick","disabled"])])):p("",!0)])])}const ke=C(O,[["render",ae],["__scopeId","data-v-1843dcc6"]]);const oe={name:"IssueListView",components:{Pagination:G},data(){return{pagination:{pageIndex:1,capacity:10,total:100}}}},f=e=>(P("data-v-f510f853"),e=e(),$(),e),re={class:"issue-wrap"},ce=f(()=>s("div",{class:"toolbar"},[s("ul",null,[s("li",null,"All"),s("li",null,"Enabled"),s("li",null,"Completed"),s("li",null,"Refused")]),s("ul",{class:"issue-types"},[s("li",{class:"bug"},"BUG"),s("li",{class:"optimize"},"Optimize")])],-1)),ue={class:"issues"},_e=f(()=>s("h3",null,"登录失败时验证码没有刷新",-1)),he={class:"text-info-1"},de=f(()=>s("span",null,"刘大逵",-1)),pe=f(()=>s("li",{class:"text-info-1"},[s("span",null,"Completed")],-1)),fe=f(()=>s("li",{class:"text-info-1"},[s("span",null,"3小时前")],-1));function ve(e,t,l,v,c,_){const m=o("UserFilled"),g=o("el-icon"),b=o("router-link"),k=o("Pagination");return i(),n("div",re,[ce,s("ul",ue,[(i(),n(d,null,w(10,y=>s("li",{key:y},[r(b,{to:"#",target:"_blank"},{default:u(()=>[_e,s("ul",null,[s("li",he,[r(g,null,{default:u(()=>[r(m)]),_:1}),de]),pe,fe])]),_:1})])),64))]),r(k,{pagination:c.pagination},null,8,["pagination"])])}const ye=C(oe,[["render",ve],["__scopeId","data-v-f510f853"]]);export{ye as I,ke as S};