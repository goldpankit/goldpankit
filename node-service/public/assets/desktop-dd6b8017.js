import{_ as b,O as I,E as C,f as S,d as U,r as c,o as i,c as r,a as t,t as o,b as s,w as l,e as u,F as v,g as W,h as D,m as N,i as A,j as g,k as $,p as E,l as F}from"./index-53ed41db.js";const z={name:"UserProjects",components:{OperaProjectWindow:I,Empty:C},data(){return{projects:[]}},methods:{fetchAll(){S().then(e=>{this.projects=e}).catch(e=>{this.$tip.apiFailed(e)})},editProject(e){this.$refs.operaProjectWindow.open(e)},deleteProject(e){this.deleteConfirm(`确定要删除「${e.name}」吗？删除后不可恢复！`).then(()=>{U(e.id).then(()=>{this.fetchAll()}).catch(a=>{this.$tip.apiFailed(a)})}).catch(()=>{})}},created(){this.fetchAll()}},B={class:"user-projects"},O={class:"title"},V={key:0},L={class:"avatar"},R={class:"info"},M={class:"opera"};function T(e,a,j,w,h,d){const p=c("Plus"),m=c("el-icon"),_=c("el-button"),f=c("Empty"),k=c("OperaProjectWindow");return i(),r("div",B,[t("div",O,[t("h2",null,o(e.$t("project.myProjects")),1),s(_,{type:"primary",onClick:a[0]||(a[0]=n=>e.$refs.operaProjectWindow.open())},{default:l(()=>[s(m,{size:14,style:{"margin-right":"5px"}},{default:l(()=>[s(p)]),_:1}),u(" "+o(e.$t("project.createProject")),1)]),_:1})]),h.projects.length>0?(i(),r("ul",V,[(i(!0),r(v,null,W(h.projects,n=>(i(),r("li",{key:n.id},[t("div",L,o(n.name.substring(0,1)),1),t("div",R,[t("h3",null,o(n.name),1),t("p",null,o(n.codespace),1),t("p",null,o(n.remark),1)]),t("div",M,[s(_,{type:"primary",size:"small",onClick:y=>e.$router.push({name:"Databases",params:{projectId:n.id}})},{default:l(()=>[u("数据库")]),_:2},1032,["onClick"]),s(_,{size:"small",icon:"Edit",onClick:y=>d.editProject(n)},{default:l(()=>[u(o(e.$t("common.edit")),1)]),_:2},1032,["onClick"]),s(_,{type:"danger",text:"",onClick:y=>d.deleteProject(n)},{default:l(()=>[u(o(e.$t("common.delete")),1)]),_:2},1032,["onClick"])])]))),128))])):(i(),D(f,{key:1,description:e.$t("project.noProjects")},null,8,["description"])),s(k,{ref:"operaProjectWindow",onSuccess:d.fetchAll},null,8,["onSuccess"])])}const q=b(z,[["render",T],["__scopeId","data-v-79033965"]]);const G={components:{UserProjects:q},data(){return{logoutData:{isWorking:!1}}},computed:{...N(["userInfo"])},methods:{...A(["logout"]),toUserProfile(){this.userInfo==null&&this.$router.push({name:"SignIn"})},doLogout(){this.logoutData.isWorking||(this.logoutData.isWorking=!0,this.logout().then(()=>{this.$router.push({name:"SignIn"})}).catch(e=>{this.$tip.apiFailed(e)}).finally(()=>{this.logoutData.isWorking=!1}))}}},P=e=>(E("data-v-21b585a4"),e=e(),F(),e),H={class:"page"},J={class:"wrap"},K={class:"line"},Q={key:0},X=P(()=>t("p",{class:"login-tip-wrap"},[u(" 当前未登录，"),t("em",null,"去登录！")],-1)),Y={key:0},Z={class:"line gap-top"},x={key:0,class:"line gap-top"},ee=P(()=>t("h2",null,"我的服务和插件",-1)),te=P(()=>t("p",null,"点击此处可查看自己创建的服务和插件",-1)),oe={class:"project-wrap"};function se(e,a,j,w,h,d){const p=c("router-link"),m=c("el-button"),_=c("Right"),f=c("el-icon"),k=c("UserProjects");return i(),r("div",H,[t("div",J,[t("div",K,[s(p,{to:{name:"PublicServices"},class:"module public-space"},{default:l(()=>[t("h2",null,o(e.$t("service.publicServices")),1),t("p",null,o(e.$t("service.publicServiceIntroduce")),1)]),_:1}),t("a",{onClick:a[2]||(a[2]=(...n)=>d.toUserProfile&&d.toUserProfile(...n)),class:"module profile"},[e.userInfo==null?(i(),r(v,{key:0},[e.userInfo==null?(i(),r("h2",Q,o(e.$t("user.account")),1)):g("",!0),X],64)):(i(),r(v,{key:1},[t("h2",null,o(e.getUserDisplayName(e.userInfo)),1),e.userInfo!=null?(i(),r("ul",Y,[t("li",null,[s(m,{size:"default",icon:"UserFilled",onClick:a[0]||(a[0]=$(n=>e.$router.push({name:"UserProfile"}),["stop"]))},{default:l(()=>[u(o(e.$t("user.profile")),1)]),_:1})]),t("li",null,[s(m,{size:"default",disabled:h.logoutData.isWorking,onClick:a[1]||(a[1]=$(n=>e.$router.push({name:"UpdatePwd"}),["stop"]))},{default:l(()=>[u("修改密码")]),_:1},8,["disabled"])])])):g("",!0),s(m,{class:"button-logout",disabled:h.logoutData.isWorking,link:"",onClick:$(d.doLogout,["stop"])},{default:l(()=>[u(o(e.$t("user.logout")),1),s(f,null,{default:l(()=>[s(_)]),_:1})]),_:1},8,["disabled","onClick"])],64))])]),t("div",Z,[s(p,{class:"module workbench",to:{name:"Workbench"}},{default:l(()=>[t("h2",null,o(e.$t("space.workbench")),1),t("p",null,o(e.$t("space.workbenchIntroduce")),1)]),_:1})]),e.userInfo!=null&&e.userInfo.isDeveloper?(i(),r("div",x,[s(p,{to:{name:"CreateSpace"},class:"module new-space"},{default:l(()=>[t("h2",null,o(e.$t("space.createNewSpace")),1),t("p",null,o(e.$t("space.createNewSpaceIntroduce")),1)]),_:1}),s(p,{class:"module private-services",to:{name:"UserServices"}},{default:l(()=>[ee,te]),_:1})])):g("",!0),t("div",oe,[s(k)])])])}const le=b(G,[["render",se],["__scopeId","data-v-21b585a4"]]);export{le as default};