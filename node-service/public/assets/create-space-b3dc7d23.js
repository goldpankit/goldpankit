import{_ as v,T as w,V as S,r as a,o as b,c as g,b as m,d as e,w as n,g as x,p as k,h as C}from"./index-509f7063.js";import{c as I}from"./service.space-af0f690f.js";import{M as y}from"./MarkdownEditor-d552790b.js";const B={components:{MarkdownEditor:y,HelpButton:w,I18nInput:S},data(){return{form:{name:"",withPrivate:!1,homepage:"",introduce:"",description:""}}},methods:{create(){I(this.form).then(r=>{this.$router.push({name:"CreateService",query:{space:this.form.name}})}).catch(r=>{this.$tip.apiFailed(r)})}}},i=r=>(k("data-v-7c57ee1a"),r=r(),C(),r),N={class:"page"},U={class:"wrap"},q=i(()=>m("h2",null,"Create Space",-1)),E={class:"form-wrap"},H=i(()=>m("span",null,"Space Name",-1)),M={class:"opera"};function P(r,t,T,z,o,c){const u=a("HelpButton"),p=a("el-input"),s=a("el-form-item"),_=a("el-switch"),f=a("i18n-input"),d=a("el-form"),h=a("MarkdownEditor"),V=a("el-button");return b(),g("div",N,[m("div",U,[q,m("div",E,[e(d,{model:o.form},{default:n(()=>[e(s,{label:"Space Name",required:""},{label:n(()=>[H,e(u,{code:"space-name"})]),default:n(()=>[e(p,{modelValue:o.form.name,"onUpdate:modelValue":t[0]||(t[0]=l=>o.form.name=l)},null,8,["modelValue"])]),_:1}),e(s,{label:"Private"},{default:n(()=>[e(_,{modelValue:o.form.withPrivate,"onUpdate:modelValue":t[1]||(t[1]=l=>o.form.withPrivate=l)},null,8,["modelValue"])]),_:1}),e(s,{label:"Homepage"},{default:n(()=>[e(p,{modelValue:o.form.homepage,"onUpdate:modelValue":t[2]||(t[2]=l=>o.form.homepage=l)},null,8,["modelValue"])]),_:1}),e(s,{label:"Introduce",required:""},{default:n(()=>[e(f,{modelValue:o.form.introduce,"onUpdate:modelValue":t[3]||(t[3]=l=>o.form.introduce=l),type:"textarea",maxlength:"200"},null,8,["modelValue"])]),_:1})]),_:1},8,["model"]),e(d,{class:"description-form",model:o.form},{default:n(()=>[e(s,{label:"Description",required:""},{default:n(()=>[e(h,{modelValue:o.form.description,"onUpdate:modelValue":t[4]||(t[4]=l=>o.form.description=l)},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),m("div",M,[e(V,{type:"primary",size:"large",onClick:c.create},{default:n(()=>[x("Create Space")]),_:1},8,["onClick"])])])])}const A=v(B,[["render",P],["__scopeId","data-v-7c57ee1a"]]);export{A as default};