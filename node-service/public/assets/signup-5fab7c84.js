import{x as C,_ as D,r as p,o as a,c as d,a as r,b as o,w as n,j as v,F as c,e as l,t as h,k as V,p as b,h as w}from"./index-8997febf.js";import{c as E}from"./form.check-e9db3bf5.js";function I(t){return C.post("/usr/regis/email",t,{baseURL:"/remote-api"})}function P(t){return C.post("/usr/regis/email/otp-code",t,{baseURL:"/remote-api"})}const x={data(){return{form:{username:"",password:"",otpElement:"",otpCodeId:null,otpCode:""},rules:{username:[{required:!0,message:"Please input Username"}],password:[{required:!0,message:"Please input password"}],otpElement:[{required:!0,message:"Please input email"},{validator:(t,s,f)=>E(t,s,f,"Please enter the correct email address")}],otpCode:[{required:!0,message:"Please input OTP code"},{required:!0,message:"Please input OTP code"}]},sendOtpCodeData:{isWorking:!1,timeout:0,sended:!1},regisData:{isWorking:!1}}},methods:{regis(){this.$refs.form.validate().then(()=>{this.regisData.isWorking||(this.regisData.isWorking=!0,I(this.form).then(()=>{this.$message.success("Register successful."),this.$router.push({name:"SignIn"})}).catch(t=>{this.$tip.apiFailed(t)}).finally(()=>{this.regisData.isWorking=!1}))}).catch(()=>{})},sendOtpCode(){this.$refs.form.validateField("otpElement").then(()=>{this.sendOtpCodeData.isWorking||(this.sendOtpCodeData.isWorking=!0,P({email:this.form.otpElement,username:this.form.username}).then(t=>{this.form.otpCodeId=t,this.sendOtpCodeData.timeout=60,this.sendOtpCodeData.sended=!0;const s=setInterval(()=>{this.sendOtpCodeData.timeout--,this.sendOtpCodeData.timeout===0&&clearInterval(s)},1e3)}).catch(t=>{this.$tip.apiFailed(t)}).finally(()=>{this.sendOtpCodeData.isWorking=!1}))}).catch(()=>{})}}},k=t=>(b("data-v-390619a8"),t=t(),w(),t),W={class:"signup"},S={class:"wrap"},q=k(()=>r("h2",null,"Sign Up",-1)),U={key:0},T={class:"login-box"},z={class:"have-an-account"},B=k(()=>r("p",null,"Already have an account?",-1));function F(t,s,f,R,e,_){const u=p("el-input"),m=p("el-form-item"),g=p("el-button"),O=p("el-form"),y=p("router-link");return a(),d("div",W,[r("div",S,[q,o(O,{ref:"form",model:e.form,rules:e.rules,onSubmit:s[4]||(s[4]=v(()=>{},["stop"]))},{default:n(()=>[o(m,{label:"Username",prop:"username",required:""},{default:n(()=>[o(u,{modelValue:e.form.username,"onUpdate:modelValue":s[0]||(s[0]=i=>e.form.username=i),type:"text",size:"large"},null,8,["modelValue"])]),_:1}),o(m,{label:"Password",prop:"password",required:""},{default:n(()=>[o(u,{modelValue:e.form.password,"onUpdate:modelValue":s[1]||(s[1]=i=>e.form.password=i),type:"password",size:"large"},null,8,["modelValue"])]),_:1}),o(m,{label:"Email",prop:"otpElement",required:""},{default:n(()=>[o(u,{modelValue:e.form.otpElement,"onUpdate:modelValue":s[2]||(s[2]=i=>e.form.otpElement=i),type:"text",size:"large"},null,8,["modelValue"])]),_:1}),o(m,{label:"OTP code",prop:"otpCode",required:"",class:"otp-code"},{default:n(()=>[r("div",null,[o(u,{type:"text",modelValue:e.form.otpCode,"onUpdate:modelValue":s[3]||(s[3]=i=>e.form.otpCode=i),size:"large"},null,8,["modelValue"]),o(g,{size:"large",type:"primary",disabled:e.sendOtpCodeData.isWorking||e.sendOtpCodeData.timeout!==0,onClick:_.sendOtpCode},{default:n(()=>[e.sendOtpCodeData.isWorking?(a(),d(c,{key:0},[l("Sending...")],64)):e.sendOtpCodeData.timeout===0&&!e.sendOtpCodeData.sended?(a(),d(c,{key:1},[l("Send OTP Code")],64)):e.sendOtpCodeData.timeout===0&&e.sendOtpCodeData.sended?(a(),d(c,{key:2},[l("Resend OTP Code")],64)):(a(),d(c,{key:3},[l(h(e.sendOtpCodeData.timeout)+"s",1)],64))]),_:1},8,["disabled","onClick"])]),e.sendOtpCodeData.sended?(a(),d("p",U,"tips: We are sending you a OTP code to "+h(e.form.otpElement)+". If you do not receive it, you can resend it in 60 seconds.",1)):V("",!0)]),_:1})]),_:1},8,["model","rules"]),r("div",T,[r("div",null,[o(g,{type:"important",onClick:_.regis,disabled:e.regisData.isWorking},{default:n(()=>[l("Create an account")]),_:1},8,["onClick","disabled"])])])]),r("div",z,[B,o(y,{to:{name:"SignIn"}},{default:n(()=>[l("Sign In")]),_:1})])])}const j=D(x,[["render",F],["__scopeId","data-v-390619a8"]]);export{j as default};