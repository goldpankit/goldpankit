import{I as S,a as V}from"./InnerRouterViewWindow-b5dcb824.js";import{_ as k,r as c,o as d,h as $,w as s,a as o,b as t,e as u,t as r,c as p,F as m,p as j,l as g,C as E,D as F,E as B,G as T,H as W,I as N,A as P,B as q,g as z,j as H}from"./index-d9f3c27d.js";import{P as M}from"./Pagination-82383a20.js";const O={name:"DatabaseView",props:{projectId:{required:!0},database:{required:!0}},data(){return{hidden:{host:!0,username:!0,password:!0}}},methods:{gotoQueryModels(){this.$router.push({name:"DatabaseQueryModel",query:{project:this.projectId,db:this.database.id}})}}},D=e=>(j("data-v-b21d1b8d"),e=e(),g(),e),Q={class:"content-wrap"},R=D(()=>o("span",{class:"content-holder"},"******",-1)),A={class:"content-wrap"},G=D(()=>o("span",{class:"content-holder"},"******",-1)),L={class:"content-wrap"},J=D(()=>o("span",{class:"content-holder"},"******",-1)),K={class:"toolbar"};function U(e,a,l,I,n,b){const _=c("el-descriptions-item"),f=c("View"),h=c("el-icon"),w=c("Hide"),y=c("el-button"),v=c("el-descriptions");return d(),$(v,{title:l.database.name},{extra:s(()=>[o("ul",K,[o("li",null,[t(y,{type:"primary",size:"small",onClick:b.gotoQueryModels},{default:s(()=>[u("查询模型")]),_:1},8,["onClick"])]),o("li",null,[t(y,{size:"small",icon:"Edit",onClick:a[6]||(a[6]=i=>e.$emit("edit"))},{default:s(()=>[u(r(e.$t("common.edit")),1)]),_:1})]),o("li",null,[t(y,{size:"small",type:"danger",text:"",onClick:a[7]||(a[7]=i=>e.$emit("delete"))},{default:s(()=>[u(r(e.$t("common.delete")),1)]),_:1})])])]),default:s(()=>[t(_,{label:e.$t("database.databaseType")},{default:s(()=>[u(r(l.database.type),1)]),_:1},8,["label"]),t(_,{label:e.$t("database.host")},{default:s(()=>[o("div",Q,[n.hidden.host?(d(),p(m,{key:0},[R,t(h,{onClick:a[0]||(a[0]=i=>n.hidden.host=!1)},{default:s(()=>[t(f)]),_:1})],64)):(d(),p(m,{key:1},[o("span",null,r(l.database.host),1),t(h,{onClick:a[1]||(a[1]=i=>n.hidden.host=!0)},{default:s(()=>[t(w)]),_:1})],64))])]),_:1},8,["label"]),t(_,{label:e.$t("database.port")},{default:s(()=>[u(r(l.database.port),1)]),_:1},8,["label"]),t(_,{label:e.$t("database.schema")},{default:s(()=>[u(r(l.database.schema),1)]),_:1},8,["label"]),t(_,{label:e.$t("database.username")},{default:s(()=>[o("div",A,[n.hidden.username?(d(),p(m,{key:0},[G,t(h,{onClick:a[2]||(a[2]=i=>n.hidden.username=!1)},{default:s(()=>[t(f)]),_:1})],64)):(d(),p(m,{key:1},[o("span",null,r(l.database.username),1),t(h,{onClick:a[3]||(a[3]=i=>n.hidden.username=!0)},{default:s(()=>[t(w)]),_:1})],64))])]),_:1},8,["label"]),t(_,{label:e.$t("database.password")},{default:s(()=>[o("div",L,[n.hidden.password?(d(),p(m,{key:0},[J,t(h,{onClick:a[4]||(a[4]=i=>n.hidden.password=!1)},{default:s(()=>[t(f)]),_:1})],64)):(d(),p(m,{key:1},[o("span",null,r(l.database.password),1),t(h,{onClick:a[5]||(a[5]=i=>n.hidden.password=!0)},{default:s(()=>[t(w)]),_:1})],64))])]),_:1},8,["label"])]),_:1},8,["title"])}const X=k(O,[["render",U],["__scopeId","data-v-b21d1b8d"]]);const Y={components:{FormTip:E,OperaDataSourceWindow:F,Pagination:M,Empty:B,DatabaseView:X,InnerRouterViewWindow:S,InnerRouterView:V},data(){return{loading:!0,project:null,databases:[]}},methods:{fetchProject(){this.loading=!0,T(this.$route.params.projectId).then(e=>{this.project=e,this.fetchDatabases()}).catch(e=>{this.loading=!1,console.error("找不到项目信息！",e),this.$tip.apiFailed("找不到项目信息！"),this.$routers.push({name:"Desktop"})})},fetchDatabases(){W(this.$route.params.projectId).then(e=>{setTimeout(()=>{this.databases=e,this.loading=!1},500)}).catch(e=>{this.$tip.apiFailed(e)}).finally(()=>{setTimeout(()=>{this.loading=!1},500)})},edit(e){this.$refs.operaDataSourceWindow.open(this.project.id,e)},deleteDatabase(e){const a=this.databases.find(l=>l.id===e);if(a==null){this.$tip.error("未找到数据库信息，请刷新后重试！");return}this.deleteConfirm(`确认删除「${a.name}」数据库吗？`).then(()=>{N({projectId:this.project.id,databaseId:e}).then(()=>{this.fetchDatabases()}).catch(l=>{this.$tip.apiFailed(l)})}).catch(()=>{})}},created(){this.fetchProject()}},Z=e=>(j("data-v-0c21881d"),e=e(),g(),e),x={key:0,class:"form"},ee={class:"wrap"},te=Z(()=>o("em",null,"kit.db.json",-1)),ae={class:"database-list-wrap"},se={class:"toolbar"},oe={key:0,class:"database-list"};function ne(e,a,l,I,n,b){const _=c("FormTip"),f=c("el-button"),h=c("DatabaseView"),w=c("Empty"),y=c("OperaDataSourceWindow"),v=P("loading");return n.project!=null?(d(),p("div",x,[o("div",ee,[o("h2",null,r(n.project.name)+"项目数据库",1),t(_,null,{default:s(()=>[u(" 当前数据库信息保存在「"),o("em",null,r(n.project.name),1),u("」项目的"),te,u("文件中。 ")]),_:1}),q((d(),p("div",ae,[o("ul",se,[o("li",null,[t(f,{type:"primary",onClick:a[0]||(a[0]=i=>e.$refs.operaDataSourceWindow.open(n.project.id))},{default:s(()=>[u(r(e.$t("database.addNewDatabase")),1)]),_:1})])]),n.databases.length>0?(d(),p("ul",oe,[(d(!0),p(m,null,z(n.databases,i=>(d(),p("li",{key:i.name},[t(h,{"project-id":n.project.id,database:i,onEdit:C=>b.edit(i),onDelete:C=>b.deleteDatabase(i.id)},null,8,["project-id","database","onEdit","onDelete"])]))),128))])):(d(),$(w,{key:1,description:"暂无数据库配置"}))])),[[v,n.loading]])]),t(y,{"with-tip":!1,ref:"operaDataSourceWindow",onSuccess:b.fetchDatabases},null,8,["onSuccess"])])):H("",!0)}const re=k(Y,[["render",ne],["__scopeId","data-v-0c21881d"]]);export{re as default};