import{I as $,a as k}from"./InnerRouterViewWindow-db4e27a9.js";import{l as I,_ as D,r as l,o as r,g as w,w as a,a as o,b as t,e as s,t as p,C as V,B as E,D as x,c as m,F as S,f as B,p as P,h as W}from"./index-8997febf.js";import{E as M}from"./Empty-89b3c193.js";import{P as N}from"./Pagination-ed9a0c44.js";const F={name:"DatabaseView",props:{database:{required:!0}},methods:{...I(["setCurrentDatabase"]),gotoQueryModels(){this.setCurrentDatabase(this.database.id),this.$router.push({name:"DatabaseQueryModel"})}}},Q={class:"toolbar"};function z(e,n,d,v,b,_){const i=l("el-descriptions-item"),u=l("el-button"),h=l("el-descriptions");return r(),w(h,{title:d.database.name},{extra:a(()=>[o("ul",Q,[o("li",null,[t(u,{size:"small",onClick:_.gotoQueryModels},{default:a(()=>[s("Query Models")]),_:1},8,["onClick"])]),o("li",null,[t(u,{size:"small",icon:"Edit",onClick:n[0]||(n[0]=f=>e.$emit("edit"))},{default:a(()=>[s("Edit")]),_:1})]),o("li",null,[t(u,{size:"small",type:"danger",text:"",onClick:n[1]||(n[1]=f=>e.$emit("delete"))},{default:a(()=>[s("Delete")]),_:1})])])]),default:a(()=>[t(i,{label:"Type"},{default:a(()=>[s(p(d.database.type),1)]),_:1}),t(i,{label:"Host"},{default:a(()=>[s(p(d.database.host),1)]),_:1}),t(i,{label:"Port"},{default:a(()=>[s(p(d.database.port),1)]),_:1}),t(i,{label:"Schema"},{default:a(()=>[s(p(d.database.schema),1)]),_:1}),t(i,{label:"Username"},{default:a(()=>[s(p(d.database.username),1)]),_:1}),t(i,{label:"Password"},{default:a(()=>[s("******")]),_:1})]),_:1},8,["title"])}const T=D(F,[["render",z],["__scopeId","data-v-1be9048d"]]);const R={components:{CreateDatabaseWindow:V,Pagination:N,Empty:M,DatabaseView:T,InnerRouterViewWindow:$,InnerRouterView:k},data(){return{databases:[],pagination:{pageIndex:1,capacity:10,total:0}}},methods:{search(){E(this.pagination).then(e=>{this.databases=e.records}).catch(e=>{this.$tip.apiFailed(e)})},edit(e){this.$refs.window.push("operaDatabase")},deleteDatabase(e){this.$model.deleteConfirm("Do you want to delete the database?").then(()=>{x(e).then(()=>{this.search()}).catch(n=>{this.$tip.apiFailed(n)})}).catch(()=>{})}},created(){this.search()}},g=e=>(P("data-v-c8bbd968"),e=e(),W(),e),q={class:"form"},A={class:"wrap"},H=g(()=>o("h2",null,"Databases",-1)),L=g(()=>o("section",{class:"tip"}," The database information will only be stored on your device. ",-1)),U={class:"database-list-wrap"},j={class:"toolbar"},G={key:0,class:"database-list"};function J(e,n,d,v,b,_){const i=l("el-button"),u=l("DatabaseView"),h=l("Empty"),f=l("Pagination"),C=l("CreateDatabaseWindow");return r(),m("div",q,[o("div",A,[H,L,o("div",U,[o("ul",j,[o("li",null,[t(i,{type:"primary",onClick:n[0]||(n[0]=c=>e.$refs.operaDatabaseWindow.open())},{default:a(()=>[s("Add New Database")]),_:1})])]),b.databases.length>0?(r(),m("ul",G,[(r(!0),m(S,null,B(b.databases,c=>(r(),m("li",{key:c.name},[t(u,{database:c,onEdit:y=>_.edit(c),onDelete:y=>_.deleteDatabase(c.id),onConnect:y=>e.connect(c)},null,8,["database","onEdit","onDelete","onConnect"])]))),128))])):(r(),w(h,{key:1,description:"No Databases"})),t(f,{pagination:b.pagination},null,8,["pagination"])])]),t(C,{ref:"operaDatabaseWindow",onSuccess:_.search},null,8,["onSuccess"])])}const Z=D(R,[["render",J],["__scopeId","data-v-c8bbd968"]]);export{Z as default};