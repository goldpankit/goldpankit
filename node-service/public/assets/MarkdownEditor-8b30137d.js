import{_ as i,r as s,o as m,c,b as u,G as f}from"./index-8997febf.js";const _={name:"MarkdownEditor",props:{modelValue:{required:!0},readonly:{type:Boolean,default:!1},withoutPadding:{default:!1},placeholder:{default:""}},data(){return{}},methods:{handleUploadImage(a,o,e){for(const d of e)new FormData().set("file",d)}}};function p(a,o,e,d,t,l){const r=s("v-md-editor");return m(),c("div",{class:f(["markdown-editor",{"without-padding":e.withoutPadding}])},[u(r,{"model-value":e.modelValue,height:"100%","left-toolbar":"h bold italic strikethrough quote | ul ol table hr | link image code | preview toc fullscreen","right-toolbar":"","disabled-menus":[],mode:e.readonly?"preview":"editable",placeholder:e.placeholder,onUploadImage:l.handleUploadImage,"onUpdate:modelValue":o[0]||(o[0]=n=>a.$emit("update:modelValue",n))},null,8,["model-value","mode","placeholder","onUploadImage"])],2)}const g=i(_,[["render",p],["__scopeId","data-v-3fdef8c6"]]);export{g as M};