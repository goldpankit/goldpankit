import{_ as v,r as a,o as p,g,w as n,a as i,m as I,n as b,Z as V,c as m,b as t,t as _,i as k,e as A}from"./index-298973e7.js";const w={name:"AvatarUploader",props:{modelValue:{required:!0}},methods:{handleAvatarSuccess(e){if(!e.success){this.$tip.apiFailed(e);return}this.$emit("update:modelValue",e.data.fileKey)},beforeAvatarUpload(e){return e.size/1024/1024>2?(this.$tip.error("Avatar picture size can not exceed 2MB!"),!1):!0}}},x=["src"];function N(e,s,u,h,o,l){const c=a("el-upload");return p(),g(c,{class:"avatar-uploader",action:"/remote-api/upload/image","show-file-list":!1,accept:".jpeg,.png,.jpg,.gif","on-success":l.handleAvatarSuccess,"before-upload":l.beforeAvatarUpload},{default:n(()=>[i("img",{src:e.getAvatarUri(u.modelValue),class:"avatar"},null,8,x)]),_:1},8,["on-success","before-upload"])}const S=v(w,[["render",N],["__scopeId","data-v-b6fadecc"]]);const B={components:{AvatarUploader:S},computed:{...I(["userInfo"])},data(){return{copyUserInfo:null,isWorking:!1,rules:{nickname:[{required:!0,message:"请输入昵称",trigger:"blur"}]}}},watch:{userInfo:{immediate:!0,handler:function(){this.copyUserInfo=JSON.parse(JSON.stringify(this.userInfo))}}},methods:{...b(["setUserInfo"]),save(){this.isWorking||this.$refs.form.validate(e=>{e&&(this.isWorking=!0,V(this.copyUserInfo).then(()=>{this.setUserInfo(this.copyUserInfo),this.$tip.success(this.$t("common.saveSuccessfully"))}).catch(s=>{this.$tip.apiFailed(s)}).finally(()=>{this.isWorking=!1}))})}}},C={class:"page"},W={key:0,class:"wrap"},$={class:"avatar-wrap"},q={class:"opera"};function z(e,s,u,h,o,l){const c=a("AvatarUploader"),d=a("el-input"),f=a("el-form-item"),y=a("el-form"),U=a("el-button");return p(),m("div",C,[o.copyUserInfo!=null?(p(),m("div",W,[i("div",$,[t(c,{modelValue:o.copyUserInfo.avatar,"onUpdate:modelValue":s[0]||(s[0]=r=>o.copyUserInfo.avatar=r)},null,8,["modelValue"]),i("h2",null,_(e.getUserDisplayName(o.copyUserInfo)),1)]),t(y,{ref:"form",model:o.copyUserInfo,rules:o.rules},{default:n(()=>[t(f,{label:"昵称",prop:"nickname",required:""},{default:n(()=>[t(d,{modelValue:o.copyUserInfo.nickname,"onUpdate:modelValue":s[1]||(s[1]=r=>o.copyUserInfo.nickname=r),maxlength:"20"},null,8,["modelValue"])]),_:1}),t(f,{label:e.$t("common.introduce"),prop:"introduce"},{default:n(()=>[t(d,{modelValue:o.copyUserInfo.introduce,"onUpdate:modelValue":s[2]||(s[2]=r=>o.copyUserInfo.introduce=r),type:"textarea",rows:5},null,8,["modelValue"])]),_:1},8,["label"])]),_:1},8,["model","rules"]),i("div",q,[t(U,{type:"primary",size:"large",disabled:o.isWorking,onClick:l.save},{default:n(()=>[A(_(e.$t("common.save")),1)]),_:1},8,["disabled","onClick"])])])):k("",!0)])}const D=v(B,[["render",z],["__scopeId","data-v-fb8f51e2"]]);export{D as default};