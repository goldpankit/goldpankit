import{_ as k,O as j,E as y,s as w,d as C,r as c,o as l,c as i,a as t,t as s,b as o,w as n,e as _,F as S,f as I,g as W,m as U,h as D,i as $,j as E}from"./index-8ca28570.js";const F={name:"UserProjects",components:{OperaProjectWindow:j,Empty:y},data(){return{projects:[]}},methods:{search(){w().then(e=>{this.projects=e}).catch(e=>{this.$tip.apiFailed(e)})},editProject(e){this.$refs.operaProjectWindow.open(e)},deleteProject(e){this.deleteConfirm(this.$t("project.deleteTip",{value:`「${e.name}」`})).then(()=>{C(e.id).then(()=>{this.search()}).catch(a=>{this.$tip.apiFailed(a)})}).catch(()=>{})}},created(){this.search()}},N={class:"user-projects"},B={class:"title"},O={key:0},V={class:"avatar"},A={class:"info"},L={class:"opera"};function z(e,a,v,g,h,d){const u=c("Plus"),m=c("el-icon"),p=c("el-button"),f=c("Empty"),P=c("OperaProjectWindow");return l(),i("div",N,[t("div",B,[t("h2",null,s(e.$t("project.myProjects")),1),o(p,{type:"primary",onClick:a[0]||(a[0]=r=>e.$refs.operaProjectWindow.open())},{default:n(()=>[o(m,{size:14,style:{"margin-right":"5px"}},{default:n(()=>[o(u)]),_:1}),_(" "+s(e.$t("project.createProject")),1)]),_:1})]),h.projects.length>0?(l(),i("ul",O,[(l(!0),i(S,null,I(h.projects,r=>(l(),i("li",{key:r.id},[t("div",V,s(r.name.substring(0,1)),1),t("div",A,[t("h3",null,s(r.name),1),t("p",null,s(r.codespace),1),t("p",null,s(r.remark),1)]),t("div",L,[o(p,{size:"small",icon:"Edit",onClick:b=>d.editProject(r)},{default:n(()=>[_(s(e.$t("common.edit")),1)]),_:2},1032,["onClick"]),o(p,{type:"danger",text:"",onClick:b=>d.deleteProject(r)},{default:n(()=>[_(s(e.$t("common.delete")),1)]),_:2},1032,["onClick"])])]))),128))])):(l(),W(f,{key:1,description:e.$t("project.noProjects")},null,8,["description"])),o(P,{ref:"operaProjectWindow",onSuccess:d.search},null,8,["onSuccess"])])}const T=k(F,[["render",z],["__scopeId","data-v-72f2fdf9"]]);const M={components:{UserProjects:T},data(){return{logoutData:{isWorking:!1}}},computed:{...U(["userInfo"])},methods:{...D(["logout"]),toUserProfile(){if(this.userInfo==null){this.$router.push({name:"SignIn"});return}},doLogout(){this.logoutData.isWorking||(this.logoutData.isWorking=!0,this.logout().then(()=>{}).catch(e=>{this.$tip.apiFailed(e)}).finally(()=>{this.logoutData.isWorking=!1}))}}},q={class:"page"},G={class:"wrap"},H={class:"line"},J={key:0},K={key:1},Q={key:2},R={class:"line gap-top"},X={class:"line gap-top"},Y={class:"project-wrap"};function Z(e,a,v,g,h,d){const u=c("router-link"),m=c("el-button"),p=c("UserProjects");return l(),i("div",q,[t("div",G,[t("div",H,[o(u,{to:{name:"PublicSpaces"},class:"module public-space"},{default:n(()=>[t("h2",null,s(e.$t("space.publicSpaces")),1),t("p",null,s(e.$t("space.publicSpaceIntroduce")),1)]),_:1}),t("a",{onClick:a[1]||(a[1]=(...f)=>d.toUserProfile&&d.toUserProfile(...f)),class:"module profile"},[e.userInfo==null?(l(),i("h2",J,s(e.$t("user.account")),1)):(l(),i("h2",K,s(e.userInfo.username),1)),e.userInfo!=null?(l(),i("ul",Q,[t("li",null,[o(m,{onClick:a[0]||(a[0]=$(f=>e.$router.push({name:"UserProfile"}),["stop"])),icon:"UserFilled"},{default:n(()=>[_(s(e.$t("user.profile")),1)]),_:1})]),t("li",null,[o(m,{onClick:$(d.doLogout,["stop"]),disabled:h.logoutData.isWorking},{default:n(()=>[_(s(e.$t("user.logout")),1)]),_:1},8,["onClick","disabled"])])])):E("",!0)])]),t("div",R,[o(u,{class:"module private-services",to:{name:"UserServices"}},{default:n(()=>[t("h2",null,s(e.$t("user.leasedAndPrivateServices")),1),t("p",null,s(e.$t("user.leasedAndPrivateServiceIntroduce")),1)]),_:1}),o(u,{class:"module workbench",to:{name:"Workbench"}},{default:n(()=>[t("h2",null,s(e.$t("space.workbench")),1),t("p",null,s(e.$t("space.workbenchIntroduce")),1)]),_:1})]),t("div",X,[o(u,{to:{name:"CreateSpace"},class:"module new-space"},{default:n(()=>[t("h2",null,s(e.$t("space.createNewSpace")),1),t("p",null,s(e.$t("space.createNewSpaceIntroduce")),1)]),_:1}),o(u,{to:{name:"Databases"},class:"module database"},{default:n(()=>[t("h2",null,s(e.$t("database.databases")),1),t("p",null,s(e.$t("database.databaseIntroduce")),1)]),_:1})]),t("div",Y,[o(p)])])])}const ee=k(M,[["render",Z],["__scopeId","data-v-b9f01f8a"]]);export{ee as default};