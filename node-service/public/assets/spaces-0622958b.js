import{s as w}from"./service.space-69d75299.js";import{P as z}from"./Pagination-d43afe86.js";import{_ as V,E,r as o,z as b,o as t,c as r,a as s,b as l,w as m,x as D,g as h,j as c,A as P,F as B,f as L,e as N,t as p}from"./index-d23d572e.js";import{S as x}from"./ServiceList-09f22230.js";import"./BeanAmount-4b125199.js";const F={components:{ServiceList:x,Empty:E,Pagination:z},data(){return{loading:!1,keyword:"",pagination:{pageIndex:1,pageCount:0,capacity:15,total:0},spaces:[]}},methods:{search(){this.loading||(this.loading=!0,w({...this.pagination,model:{keyword:this.keyword.trim()}}).then(e=>{this.pagination.total=e.total,this.pagination.pageCount=e.pageCount,this.spaces=e.records}).catch(e=>{this.$tip.apiFailed(e)}).finally(()=>{this.loading=!1}))},handleSizeChange(e){this.pagination.capacity=e,this.search()},handleCurrentChange(e){this.pagination.pageIndex=e,this.search()}},created(){this.search()}},I={class:"page"},K={class:"warp"},j={class:"search-wrap"},A={class:"input-wrap"},U={key:1,class:"space-list"},q=["onClick"],T={key:0,class:"user-profile"},G=["src"];function H(e,u,J,M,n,i){const _=o("Search"),C=o("el-icon"),y=o("el-input"),v=o("el-button"),g=o("Pagination"),f=o("ServiceList"),k=o("Empty"),S=b("loading");return t(),r("div",I,[s("div",K,[s("div",j,[s("div",A,[l(C,{size:"20"},{default:m(()=>[l(_)]),_:1}),l(y,{modelValue:n.keyword,"onUpdate:modelValue":u[0]||(u[0]=a=>n.keyword=a),size:"large",placeholder:e.$t("space.searchPlaceholder"),onKeypress:D(i.search,["enter","native"])},null,8,["modelValue","placeholder","onKeypress"])]),l(v,{size:"large",type:"primary",onClick:i.search},{default:m(()=>[N(p(e.$t("common.search")),1)]),_:1},8,["onClick"])]),n.pagination.pageCount>1?(t(),h(g,{key:0,pagination:n.pagination,position:"top",onCurrentChange:i.handleCurrentChange,onSizeChange:i.handleSizeChange},null,8,["pagination","onCurrentChange","onSizeChange"])):c("",!0),n.loading||n.spaces.length>0?P((t(),r("ul",U,[(t(!0),r(B,null,L(n.spaces,a=>(t(),r("li",{key:a.id},[s("a",{href:"javascript:;",onClick:d=>e.$router.push({name:"SpaceDetail",params:{name:a.name}})},[s("h3",null,p(a.name),1),s("p",null,p(a.introduce),1),l(f,{services:a.mainServices,onSelect:d=>e.$router.push({name:"SpaceDetail",params:{name:a.name},query:{service:d.name}})},null,8,["services","onSelect"]),a.user!=null?(t(),r("div",T,[s("img",{src:e.getAccessUri(a.user.avatar,"/images/avatar/default.png")},null,8,G),s("span",null,p(a.user.username),1)])):c("",!0)],8,q)]))),128))])),[[S,n.loading]]):c("",!0),n.keyword.trim()!==""&&n.spaces.length===0?(t(),h(k,{key:2,description:e.$t("space.searchEmpty")},null,8,["description"])):c("",!0),n.pagination.pageCount>1?(t(),h(g,{key:3,pagination:n.pagination,onCurrentChange:i.handleCurrentChange,onSizeChange:i.handleSizeChange},null,8,["pagination","onCurrentChange","onSizeChange"])):c("",!0)])])}const Y=V(F,[["render",H],["__scopeId","data-v-7ba79824"]]);export{Y as default};