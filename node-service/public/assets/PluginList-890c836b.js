import{_ as y,N as F,r as d,A as S,B as $,o as c,h as _,w as f,a as l,b as g,j as b,t as p,E as k,c as m,F as D,g as V,J as w,k as P,P as C,e as x}from"./index-4d680b00.js";import{a as E}from"./service.version-2cd43cdc.js";import{B}from"./BeanAmount-c35d7a51.js";import{S as I}from"./ServiceStatus-19dfa23a.js";const L={name:"ServiceStructureView",props:{space:{required:!0},service:{required:!0},plugin:{required:!1},version:{required:!0}},data(){return{loading:!1,nodes:[]}},computed:{data(){const t=this.nodes.filter(e=>e.type==="DIRECTORY").sort((e,i)=>i.path.split("/").length-e.path.split("/").length),r=this.nodes.filter(e=>e.type==="FILE");for(const e of t){let i=null;for(let s=r.length-1;s>=0;s--){if(!r[s].path.startsWith(e.path))continue;e.children==null&&(e.children=[]);let a=new Date(r[s].publishTime).getTime();(i==null||a>i)&&(e.description=r[s].description,e.publishTime=r[s].publishTime,i=a),r[s].path=r[s].path.split("/").pop(),e.children.push(r[s]),r.splice(s,1)}}t.reverse();for(let e=t.length-1;e>=0;e--){const i=t[e];let s=!1;for(let a=e-1;a>=0;a--){const o=t[a];if(!i.path.startsWith(o.path))continue;o.children==null&&(o.children=[]);let u=new Date(i.publishTime).getTime(),n=new Date(o.publishTime).getTime();u>n&&(o.description=i.description,o.publishTime=i.publishTime),i.path=i.path.split("/").pop(),o.children.push(i),s=!0;break}s&&t.splice(e,1)}return t.push.apply(t,r),F(t),t},factor(){return[this.space,this.service,this.plugin,this.version]}},watch:{factor(){this.fetchVersionFiles()}},methods:{fetchVersionFiles(){this.loading=!0,E({space:this.space,service:this.service,plugin:this.plugin,version:this.version}).then(t=>{this.nodes=t}).catch(t=>{this.$tip.apiFailed(t)}).finally(()=>{this.loading=!1})}},created(){this.fetchVersionFiles()}},q={class:"node-label"},N={class:"filename"},O={class:"text-info-1 text-mini description"},R={class:"text-info-1 text-mini publish-time"};function A(t,r,e,i,s,a){const o=d("Document"),u=d("el-icon"),n=d("Folder"),v=d("el-tree"),T=S("loading");return $((c(),_(v,{class:"service-structure-tree",data:a.data},{default:f(({node:Q,data:h})=>[l("span",q,[h.type==="FILE"?(c(),_(u,{key:0},{default:f(()=>[g(o)]),_:1})):h.type==="DIRECTORY"?(c(),_(u,{key:1},{default:f(()=>[g(n)]),_:1})):b("",!0),l("span",N,p(h.path),1),l("span",O,p(h.description),1),l("span",R,p(t.getDateOffsetText(h.publishTime)),1)])]),_:1},8,["data"])),[[T,s.loading]])}const te=y(L,[["render",A],["__scopeId","data-v-28435211"]]);const j={name:"PluginList",components:{ServiceStatus:I,Empty:k,BeanAmount:B},props:{plugins:{type:Array,required:!0},customClass:{type:Function,default(){return()=>{}}},installed:{type:Function,default(){return()=>{}}}}},W={key:0,class:"plugin-list"},Y=["onClick"],z={class:"latest-version"},J={key:0},M={class:"introduce"},G={class:"price-wrap"},H={class:"text-info-1 text-mini"};function K(t,r,e,i,s,a){const o=d("Empty"),u=d("el-scrollbar");return c(),_(u,null,{default:f(()=>[e.plugins.length>0?(c(),m("ul",W,[(c(!0),m(D,null,V(e.plugins,n=>(c(),m("li",{key:n.id,class:w({...e.customClass(n),"plugin-installed":e.installed(n)===!0}),onClick:P(v=>t.$emit("select",n),["stop"])},[l("h5",null,[C(t.$slots,"title",{plugin:n},()=>[x(p(n.label||n.name),1)],!0)]),l("p",z,[l("span",null,p(t.$t("service.latestVersion"))+": v"+p(n.lastVersion),1),e.installed(n)===!0?(c(),m("span",J,p(t.$t("service.installed")),1)):b("",!0)]),l("p",M,p(n.introduce),1),l("div",G,[l("p",H,p(t.getDateOffsetText(n.lastPublishTime)),1)])],10,Y))),128))])):(c(),_(o,{key:1,description:t.$t("service.noSubServices")},null,8,["description"]))]),_:3})}const se=y(j,[["render",K],["__scopeId","data-v-0abf4a4d"]]);export{se as P,te as S};