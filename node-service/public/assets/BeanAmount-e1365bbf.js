import{_ as n,o as c,c as r,a,t as s,i as _,p,k as i}from"./index-ea6b6181.js";const d="/images/bean.png";const u={name:"BeanAmount",props:{type:{required:!0},price:{required:!0}},methods:{getTypeText(){return this.$const.getServiceLeaseTypes(this.$t).find(e=>e.code===this.type).abbLabel}}},m=e=>(p("data-v-3a292fb7"),e=e(),i(),e),l={key:0,class:"bean-amount"},y=m(()=>a("img",{src:d},null,-1));function f(e,h,t,b,g,o){return t.type!=="FREE"?(c(),r("div",l,[y,a("em",null,s(t.price)+" / "+s(o.getTypeText()),1)])):_("",!0)}const v=n(u,[["render",f],["__scopeId","data-v-3a292fb7"]]);export{v as B};