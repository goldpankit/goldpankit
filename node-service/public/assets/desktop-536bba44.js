import{_ as v,O as b,E as y,s as w,d as C,r as i,o as r,c,a as t,t as s,b as o,w as n,e as _,F as S,f as I,g as W,m as U,h as D,i as $,j as E}from"./index-38693b26.js";const F={name:"UserProjects",components:{OperaProjectWindow:b,Empty:y},data(){return{projects:[]}},methods:{search(){w().then(e=>{this.projects=e}).catch(e=>{this.$tip.apiFailed(e)})},editProject(e){this.$refs.operaProjectWindow.open(e)},deleteProject(e){this.deleteConfirm(this.$t("project.deleteTip",{value:`「${e.name}」`})).then(()=>{C(e.id).then(()=>{this.search()}).catch(a=>{this.$tip.apiFailed(a)})}).catch(()=>{})}},created(){this.search()}},N={class:"user-projects"},B={class:"title"},O={key:0},V={class:"avatar"},A={class:"info"},L={class:"opera"};function z(e,a,k,g,h,d){const u=i("Plus"),m=i("el-icon"),p=i("el-button"),f=i("Empty"),P=i("OperaProjectWindow");return r(),c("div",N,[t("div",B,[t("h2",null,s(e.$t("project.myProjects")),1),o(p,{type:"primary",onClick:a[0]||(a[0]=l=>e.$refs.operaProjectWindow.open())},{default:n(()=>[o(m,{size:14,style:{"margin-right":"5px"}},{default:n(()=>[o(u)]),_:1}),_(" "+s(e.$t("project.createProject")),1)]),_:1})]),h.projects.length>0?(r(),c("ul",O,[(r(!0),c(S,null,I(h.projects,l=>(r(),c("li",{key:l.id},[t("div",V,s(l.name.substring(0,1)),1),t("div",A,[t("h3",null,s(l.name),1),t("p",null,s(l.codespace),1),t("p",null,s(l.remark),1)]),t("div",L,[o(p,{size:"small",icon:"Edit",onClick:j=>d.editProject(l)},{default:n(()=>[_(s(e.$t("common.edit")),1)]),_:2},1032,["onClick"]),o(p,{type:"danger",text:"",onClick:j=>d.deleteProject(l)},{default:n(()=>[_(s(e.$t("common.delete")),1)]),_:2},1032,["onClick"])])]))),128))])):(r(),W(f,{key:1,description:e.$t("project.noProjects")},null,8,["description"])),o(P,{ref:"operaProjectWindow",onSuccess:d.search},null,8,["onSuccess"])])}const T=v(F,[["render",z],["__scopeId","data-v-72f2fdf9"]]);const M={components:{UserProjects:T},data(){return{logoutData:{isWorking:!1}}},computed:{...U(["userInfo"])},methods:{...D(["logout"]),toUserProfile(){if(this.userInfo==null){this.$router.push({name:"SignIn"});return}},doLogout(){this.logoutData.isWorking||(this.logoutData.isWorking=!0,this.logout().then(()=>{}).catch(e=>{this.$tip.apiFailed(e)}).finally(()=>{this.logoutData.isWorking=!1}))}}},q={class:"page"},G={class:"wrap"},H={class:"line"},J={key:0},K={key:1},Q={key:2},R={class:"line gap-top"},X={class:"line gap-top"},Y={class:"project-wrap"};function Z(e,a,k,g,h,d){const u=i("router-link"),m=i("el-button"),p=i("UserProjects");return r(),c("div",q,[t("div",G,[t("div",H,[o(u,{to:{name:"PublicServices"},class:"module public-space"},{default:n(()=>[t("h2",null,s(e.$t("service.publicServices")),1),t("p",null,s(e.$t("service.publicServiceIntroduce")),1)]),_:1}),t("a",{onClick:a[1]||(a[1]=(...f)=>d.toUserProfile&&d.toUserProfile(...f)),class:"module profile"},[e.userInfo==null?(r(),c("h2",J,s(e.$t("user.account")),1)):(r(),c("h2",K,s(e.userInfo.username),1)),e.userInfo!=null?(r(),c("ul",Q,[t("li",null,[o(m,{onClick:a[0]||(a[0]=$(f=>e.$router.push({name:"UserProfile"}),["stop"])),icon:"UserFilled"},{default:n(()=>[_(s(e.$t("user.profile")),1)]),_:1})]),t("li",null,[o(m,{onClick:$(d.doLogout,["stop"]),disabled:h.logoutData.isWorking},{default:n(()=>[_(s(e.$t("user.logout")),1)]),_:1},8,["onClick","disabled"])])])):E("",!0)])]),t("div",R,[o(u,{class:"module private-services",to:{name:"UserServices"}},{default:n(()=>[t("h2",null,s(e.$t("user.leasedAndPrivateServices")),1),t("p",null,s(e.$t("user.leasedAndPrivateServiceIntroduce")),1)]),_:1}),o(u,{class:"module workbench",to:{name:"Workbench"}},{default:n(()=>[t("h2",null,s(e.$t("space.workbench")),1),t("p",null,s(e.$t("space.workbenchIntroduce")),1)]),_:1})]),t("div",X,[o(u,{to:{name:"CreateSpace"},class:"module new-space"},{default:n(()=>[t("h2",null,s(e.$t("space.createNewSpace")),1),t("p",null,s(e.$t("space.createNewSpaceIntroduce")),1)]),_:1}),o(u,{to:{name:"Databases"},class:"module database"},{default:n(()=>[t("h2",null,s(e.$t("database.databases")),1),t("p",null,s(e.$t("database.databaseIntroduce")),1)]),_:1})]),t("div",Y,[o(p)])])])}const ee=v(M,[["render",Z],["__scopeId","data-v-38889559"]]);export{ee as default};