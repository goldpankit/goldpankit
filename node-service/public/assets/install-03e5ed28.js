import{S as n}from"./ServiceInstaller-e6cea803.js";import{a as l}from"./service-66c0d1f7.js";import{a as p}from"./service.space-81d22611.js";import{_ as h,m as u,J as m,r as v,z as _,o as s,c as i,A as f,g as d,j}from"./index-c7362d92.js";import"./ServiceCodeErrorWindow-bff9e5f4.js";import"./QueryModelView-889c43d8.js";import"./InnerRouterViewWindow-2c28559f.js";import"./form.check-189b470c.js";import"./service.version-814c0d5c.js";import"./FormItemTip-825deeec.js";const g={components:{ServiceInstaller:n},data(){return{loading:!0,route:{space:null,service:null,majorVersion:null},space:null,service:null,project:null}},computed:{...u(["currentProject"])},methods:{fetchSpace(){p(this.$route.params.spaceName).then(e=>{this.space=e}).catch(e=>{this.$tip.apiFailed(e)})},fetchService(){this.loading=!0,l({space:this.route.space,service:this.route.service,majorVersion:this.route.majorVersion}).then(e=>{this.service=e}).catch(e=>{this.$tip.apiFailed(e)}).finally(()=>{this.loading=!1})},handleProjectChange(e){e!=null&&m(e).then(r=>{this.project=r}).catch(r=>{this.$tip.apiFailed(r)})}},created(){this.route.space=this.$route.params.spaceName,this.route.service=this.$route.params.serviceName,this.route.majorVersion=this.$route.query.major,this.fetchSpace(),this.fetchService(),this.currentProject!=null&&this.handleProjectChange(this.currentProject)}},S={class:"page"},P={class:"wrap"};function b(e,r,y,C,t,c){const o=v("ServiceInstaller"),a=_("loading");return s(),i("div",S,[f((s(),i("div",P,[t.space!=null&&t.service!=null?(s(),d(o,{key:0,space:t.space.name,service:t.service.name,"service-price":t.service.price.price,"service-lease":t.service.latestLease,version:t.service.defaultMajorVersion.version,"project-config":t.project,"with-title":!0,"with-install-button":!0,onChangeProject:c.handleProjectChange,onInstalled:r[0]||(r[0]=V=>e.$router.push({name:"Workbench"}))},null,8,["space","service","service-price","service-lease","version","project-config","onChangeProject"])):j("",!0)])),[[a,t.loading]])])}const z=h(g,[["render",b],["__scopeId","data-v-67b020bb"]]);export{z as default};