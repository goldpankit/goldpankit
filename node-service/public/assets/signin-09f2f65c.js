import{_ as g,l as h,n as w,q as v,u as k,r,o as b,c as x,a,b as o,w as s,j as y,e as l,v as I,p as V,h as S}from"./index-8997febf.js";const U={data(){return{form:{username:"",password:""},loginData:{isWorking:!1}}},methods:{...h(["setUserInfo"]),login(){this.$refs.form.validate().then(()=>{this.loginData.isWorking||(this.loginData.isWorking=!0,w(this.form).then(e=>e).then(e=>{document.cookie=`x-kit-token=${e};`,v(e)}).then(()=>{k().then(e=>{this.setUserInfo(e),this.$router.push({name:"Index"})})}).catch(e=>{this.$tip.apiFailed(e)}).finally(()=>{this.loginData.isWorking=!1}))}).catch(()=>{})}}},m=e=>(V("data-v-550f7681"),e=e(),S(),e),C={class:"signup"},D={class:"wrap"},W=m(()=>a("h2",null,"Sign In",-1)),B=m(()=>a("label",null,"Password",-1)),P={class:"login-box"},q={class:"create-account"};function K(e,t,N,z,n,d){const p=r("el-input"),u=r("el-form-item"),_=r("router-link"),c=r("el-form"),f=r("el-button");return b(),x("div",C,[a("div",D,[W,o(c,{ref:"form",model:n.form,onSubmit:t[2]||(t[2]=y(()=>{},["stop"]))},{default:s(()=>[o(u,{label:"Username",prop:"username",required:""},{default:s(()=>[o(p,{modelValue:n.form.username,"onUpdate:modelValue":t[0]||(t[0]=i=>n.form.username=i),type:"text",size:"large"},null,8,["modelValue"])]),_:1}),o(u,{class:"password-item",label:"Password",prop:"password",required:""},{label:s(()=>[B,o(_,{to:"#"},{default:s(()=>[l("Forgot Password")]),_:1})]),default:s(()=>[o(p,{modelValue:n.form.password,"onUpdate:modelValue":t[1]||(t[1]=i=>n.form.password=i),"show-password":"",type:"password",size:"large",onKeypress:I(d.login,["enter","native"])},null,8,["modelValue","onKeypress"])]),_:1})]),_:1},8,["model"]),a("div",P,[a("div",null,[o(f,{type:"important",disabled:n.loginData.isWorking,onClick:d.login},{default:s(()=>[l("Sign In")]),_:1},8,["disabled","onClick"])])])]),a("div",q,[o(_,{to:{name:"SignUp"}},{default:s(()=>[l("Create Account")]),_:1})])])}const M=g(U,[["render",K],["__scopeId","data-v-550f7681"]]);export{M as default};