import{_ as y,s as j,d as C,r,o as a,c,a as t,b as o,w as n,e as m,F as w,f as S,t as h,g as D,p as k,h as $,m as I,i as U,j as g,k as x}from"./index-8997febf.js";import{E as N}from"./Empty-89b3c193.js";const E={name:"UserProjects",components:{Empty:N},data(){return{projects:[]}},methods:{search(){j().then(e=>{this.projects=e}).catch(e=>{console.log("e")})},deleteProject(e){this.$model.deleteConfirm(`Do you want to delete the project named 「${e.name}」 ?`).then(()=>{C(e.id).then(()=>{console.log("删除成功"),this.search()}).catch(s=>{console.log("删除失败",s)})}).catch(()=>{})}},created(){this.search()}},F=e=>(k("data-v-093d11ec"),e=e(),$(),e),W={class:"user-projects"},B={class:"title"},L=F(()=>t("h2",null,"My Projects",-1)),V={key:0},z={class:"avatar"},M={class:"info"},A={class:"opera"};function T(e,s,P,b,_,f){const i=r("Plus"),u=r("el-icon"),p=r("el-button"),v=r("Empty");return a(),c("div",W,[t("div",B,[L,o(p,{type:"primary",onClick:s[0]||(s[0]=d=>e.$router.push({name:"CreateProject"}))},{default:n(()=>[o(u,{size:14,style:{"margin-right":"5px"}},{default:n(()=>[o(i)]),_:1}),m(" Create Project ")]),_:1})]),_.projects.length>0?(a(),c("ul",V,[(a(!0),c(w,null,S(_.projects,d=>(a(),c("li",null,[t("div",z,h(d.name.substring(0,1)),1),t("div",M,[t("h3",null,h(d.name),1),t("p",null,h(d.codespace),1)]),t("div",A,[o(p,{type:"danger",text:"",onClick:re=>f.deleteProject(d)},{default:n(()=>[m("Delete")]),_:2},1032,["onClick"])])]))),256))])):(a(),D(v,{key:1,description:"No Projects."}))])}const q=y(E,[["render",T],["__scopeId","data-v-093d11ec"]]);const G={components:{UserProjects:q},data(){return{logoutData:{isWorking:!1}}},computed:{...I(["userInfo"])},methods:{...U(["logout"]),doLogout(){this.logoutData.isWorking||(this.logoutData.isWorking=!0,this.logout().then(()=>{console.log("退出成功")}).catch(e=>{this.$tip.apiFailed(e)}).finally(()=>{this.logoutData.isWorking=!1}))}}},l=e=>(k("data-v-9f8f4136"),e=e(),$(),e),H={class:"page"},J={class:"wrap"},K={class:"line gap-bottom"},O=l(()=>t("h2",null,"Public Spaces",-1)),Q=l(()=>t("p",null,"For all technical teams, you can click in to view all the service space, select and open the service space you need.",-1)),R={key:0},X={key:1},Y={key:2},Z=l(()=>t("h2",null,"Private service spaces",-1)),ee=l(()=>t("p",null,"Private space only serves you or your team, you can organize technical staff to create and develop your service space for better and more efficient research and development work.",-1)),te={class:"line gap-top"},oe=l(()=>t("h2",null,"Create New Space",-1)),se=l(()=>t("p",null,"Create a new service space and start a new journey of research and development.",-1)),ne=l(()=>t("h2",null,"Databases",-1)),ae=l(()=>t("p",null,"Connect and save your database connection information to help you get the code you want more easily.",-1)),ce={class:"project-wrap"};function le(e,s,P,b,_,f){const i=r("router-link"),u=r("el-button"),p=r("UserProjects");return a(),c("div",H,[t("div",J,[t("div",K,[o(i,{to:{name:"PublicSpaces"},class:"module public-space"},{default:n(()=>[O,Q]),_:1}),t("a",{onClick:s[1]||(s[1]=v=>e.$router.push({name:"UserProfile"})),class:"module profile"},[e.userInfo==null?(a(),c("h2",R,"Profile")):(a(),c("h2",X,h(e.userInfo.nickname),1)),e.userInfo!=null?(a(),c("ul",Y,[t("li",null,[o(u,{onClick:s[0]||(s[0]=g(v=>e.$router.push({name:"UserProfile"}),["stop"])),icon:"UserFilled"},{default:n(()=>[m("Profile")]),_:1})]),t("li",null,[o(u,{onClick:g(f.doLogout,["stop"]),disabled:_.logoutData.isWorking},{default:n(()=>[m("Logout")]),_:1},8,["onClick","disabled"])])])):x("",!0)])]),o(i,{class:"module private-space",to:{name:"UserSpaces"}},{default:n(()=>[Z,ee]),_:1}),t("div",te,[o(i,{to:{name:"CreateSpace"},class:"module new-space"},{default:n(()=>[oe,se]),_:1}),o(i,{to:{name:"Databases"},class:"module database"},{default:n(()=>[ne,ae]),_:1})]),t("div",ce,[o(p)])])])}const _e=y(G,[["render",le],["__scopeId","data-v-9f8f4136"]]);export{_e as default};