import{_ as I,o as a,c as m,F as y,f as k,H as T,t as b,r as o,g as d,w as v,a as S,j as C,b as V,e as U,m as K,D as O,$ as j,a0 as E,y as M}from"./index-e9189731.js";const G={name:"InstallCheckbox",props:{modelValue:{type:Array},type:{default:"checkbox"},options:{}},data(){return{}},computed:{optionValues(){return this.options.map(t=>t.value)}},watch:{modelValue:{immediate:!0,handler(){this.filterValues(this.modelValue)}},optionValues(){this.filterValues(this.modelValue)}},methods:{handleSelect(t){let l=this.modelValue.findIndex(h=>h===t.value),e=[];l===-1?e=this.modelValue.concat([t.value]):e=this.modelValue.filter((h,c)=>c!==l),this.filterValues(e)},filterValues(t){const l=[];for(const e of t)this.options.find(c=>c.value===e)!=null&&l.push(e);l!==this.modelValue&&(l!=null&&this.modelValue!=null&&l.join(",")===this.modelValue.join(",")||(this.$emit("update:modelValue",l),this.$emit("change",l)))}}},P={key:0,class:"installer-checkbox"},B=["onClick"],W={key:1};function $(t,l,e,h,c,n){return e.options.length>0?(a(),m("ul",P,[(a(!0),m(y,null,k(e.options,u=>(a(),m("li",{key:u.value,class:T({selected:e.modelValue==null?!1:e.modelValue.findIndex(p=>p===u.value)!==-1}),onClick:p=>n.handleSelect(u)},b(u.label),11,B))),128))])):(a(),m("p",W,"Please add options first."))}const q=I(G,[["render",$],["__scopeId","data-v-d3fcae39"]]);const z={name:"InstallInput",props:{type:{default:"text"},rows:{default:3}}};function A(t,l,e,h,c,n){const u=o("el-input");return a(),d(u,{type:e.type,rows:e.rows,class:"install-input"},null,8,["type","rows"])}const D=I(z,[["render",A],["__scopeId","data-v-35abcc78"]]);const L={name:"InstallRadio",props:{modelValue:{},options:{}},data(){return{optionSettingData:{visible:!1}}},methods:{handleSelect(t){this.$emit("update:modelValue",t),this.$emit("change",t)}}},H={key:0,class:"installer-radio"},X=["onClick"],Y={key:1};function Z(t,l,e,h,c,n){return e.options.length>0?(a(),m("ul",H,[(a(!0),m(y,null,k(e.options,u=>(a(),m("li",{key:u.value,class:T({selected:e.modelValue===u.value}),onClick:p=>n.handleSelect(u.value)},b(u.label),11,X))),128))])):(a(),m("p",Y,"Please add options first."))}const N=I(L,[["render",Z],["__scopeId","data-v-0a2cc691"]]);const ee={name:"MySqlFieldSelect",props:{modelValue:{},table:{required:!0},multiple:{default:!0}},methods:{handleInput(t){this.$emit("update:modelValue",t.map(l=>this.table.fields.find(e=>e.name===l)).filter(l=>l!=null))}}},le={class:"option-content"},te={class:"text-info-1"};function ae(t,l,e,h,c,n){const u=o("el-option"),p=o("el-select");return a(),d(p,{class:"mysql-field-select","popper-class":"mysql-field-select__popper",multiple:e.multiple,"model-value":e.modelValue==null?[]:e.modelValue.map(f=>f.name),"onUpdate:modelValue":n.handleInput},{default:v(()=>[(a(!0),m(y,null,k(e.table.fields,f=>(a(),d(u,{value:f.name,label:f.name},{default:v(()=>[S("p",le,[S("span",null,b(f.name),1),S("span",te,b(f.comment),1)])]),_:2},1032,["value","label"]))),256))]),_:1},8,["multiple","model-value","onUpdate:modelValue"])}const ne=I(ee,[["render",ae],["__scopeId","data-v-af47228f"]]);const oe={name:"OptionValueInput",props:{modelValue:{},optionSetting:{required:!0}},methods:{emitChange(t){this.$emit("update:model-value",t),this.$emit("input",t)}}},ue={class:"option-value-input"};function ie(t,l,e,h,c,n){const u=o("el-input"),p=o("el-input-number");return a(),m("div",ue,[e.optionSetting.inputType==="input"?(a(),d(u,{key:0,"model-value":e.modelValue,"onUpdate:modelValue":n.emitChange},null,8,["model-value","onUpdate:modelValue"])):e.optionSetting.inputType==="number_input"?(a(),d(p,{key:1,"model-value":e.modelValue,controls:!1,"onUpdate:modelValue":n.emitChange},null,8,["model-value","onUpdate:modelValue"])):e.optionSetting.inputType==="textarea"?(a(),d(u,{key:2,type:"textarea",rows:1,"model-value":e.modelValue,"onUpdate:modelValue":n.emitChange},null,8,["model-value","onUpdate:modelValue"])):C("",!0)])}const se=I(oe,[["render",ie],["__scopeId","data-v-c1e053d5"]]);const de={name:"InstallSelect",components:{OptionValueInput:se},props:{modelValue:{},options:{},type:{default:"radio"}},data(){return{optionSettingData:{visible:!1}}},computed:{validOptions(){return this.options.filter(t=>t.value.trim()!==""&&t.label.trim()!=="")},currentOption(){return this.validOptions.find(t=>t.value===this.modelValue.value)},optionValues(){return this.validOptions.map(t=>t.value)},currenOptionSettings(){return this.currentOption==null?[]:this.currentOption.settings.map(t=>t.defaultValue)}},watch:{optionValues(){this.handleSelect(this.modelValue.value)},currenOptionSettings(){this.fillSettingValue()},modelValue:{immediate:!0,handler(){this.fillSettingValueFromModelValue()}}},methods:{handleSelect(t){const l=this.validOptions.find(h=>h.value===t);let e={value:null,settings:{}};if(l!=null){const h={};for(const c of l.settings)h[c.name]=c.defaultValue;e={value:t,settings:h}}this.$emit("update:modelValue",e),this.$emit("change",e),this.fillSettingValue()},fillSettingValue(){this.$nextTick(()=>{if(this.currentOption!=null)for(const t of this.currentOption.settings)t.value=t.defaultValue})},fillSettingValueFromModelValue(){for(const t in this.modelValue.settings){const l=this.options.find(h=>h.value===this.modelValue.value);if(l==null)continue;const e=l.settings.find(h=>h.name===t);e!=null&&(e.value=this.modelValue.settings[t])}}}},re={key:0,class:"install-radio-select"},me={key:1};function ce(t,l,e,h,c,n){const u=o("el-option"),p=o("el-select"),f=o("el-button"),i=o("OptionValueInput"),_=o("el-form-item"),r=o("el-form"),x=o("el-dialog");return e.options.length>0?(a(),m("div",re,[V(p,{"model-value":e.modelValue.value,clearable:"",onChange:n.handleSelect},{default:v(()=>[(a(!0),m(y,null,k(n.validOptions,g=>(a(),d(u,{key:g.value,value:g.value,label:g.label},null,8,["value","label"]))),128))]),_:1},8,["model-value","onChange"]),n.currentOption!=null&&n.currentOption.settings.length>0?(a(),d(f,{key:0,type:"primary",icon:"Setting",class:"button-icon",onClick:l[0]||(l[0]=g=>c.optionSettingData.visible=!0)})):C("",!0),n.currentOption!=null?(a(),d(x,{key:1,modelValue:c.optionSettingData.visible,"onUpdate:modelValue":l[2]||(l[2]=g=>c.optionSettingData.visible=g),title:`${n.currentOption.label} Settings`},{default:v(()=>[V(r,null,{default:v(()=>[(a(!0),m(y,null,k(n.currentOption.settings,g=>(a(),d(_,{key:g.name,label:g.label,required:g.required},{default:v(()=>[V(i,{modelValue:g.value,"onUpdate:modelValue":s=>g.value=s,"option-setting":g,onInput:l[1]||(l[1]=s=>t.$emit("change"))},null,8,["modelValue","onUpdate:modelValue","option-setting"])]),_:2},1032,["label","required"]))),128))]),_:1})]),_:1},8,["modelValue","title"])):C("",!0)])):(a(),m("p",me,"Please add options first."))}const w=I(de,[["render",ce],["__scopeId","data-v-fa8025ff"]]);const _e={name:"InstallNumberInput",props:{type:{default:"text"}}};function pe(t,l,e,h,c,n){const u=o("el-input-number");return a(),d(u,{class:"install-number-input",controls:!1})}const Q=I(_e,[["render",pe],["__scopeId","data-v-6340b22c"]]);const he={name:"TableFieldVariableInput",components:{InstallNumberInput:Q,InstallSelect:w,InstallCheckbox:q,InstallRadio:N,InstallInput:D},props:{modelValue:{},variable:{required:!0}}};function fe(t,l,e,h,c,n){const u=o("InstallInput"),p=o("InstallNumberInput"),f=o("InstallSelect"),i=o("InstallCheckbox"),_=o("InstallRadio");return e.variable.inputType==="input"?(a(),d(u,{key:0,"model-value":e.modelValue,"onUpdate:modelValue":l[0]||(l[0]=r=>t.$emit("update:modelValue",r)),onInput:l[1]||(l[1]=r=>t.$emit("change",r))},null,8,["model-value"])):e.variable.inputType==="number_input"?(a(),d(p,{key:1,"model-value":e.modelValue,"onUpdate:modelValue":l[2]||(l[2]=r=>t.$emit("update:modelValue",r)),onInput:l[3]||(l[3]=r=>t.$emit("change",r))},null,8,["model-value"])):e.variable.inputType==="textarea"?(a(),d(u,{key:2,type:"textarea",rows:1,"model-value":e.modelValue,"onUpdate:modelValue":l[4]||(l[4]=r=>t.$emit("update:modelValue",r)),onInput:l[5]||(l[5]=r=>t.$emit("change",r))},null,8,["model-value"])):e.variable.inputType==="select"?(a(),d(f,{key:3,options:e.variable.options,"model-value":e.modelValue,"onUpdate:modelValue":l[6]||(l[6]=r=>t.$emit("update:modelValue",r)),onChange:l[7]||(l[7]=r=>t.$emit("change",r))},null,8,["options","model-value"])):e.variable.inputType==="checkbox"?(a(),d(i,{key:4,options:e.variable.options,"model-value":e.modelValue,"onUpdate:modelValue":l[8]||(l[8]=r=>t.$emit("update:modelValue",r)),onChange:l[9]||(l[9]=r=>t.$emit("change",r))},null,8,["options","model-value"])):e.variable.inputType==="radio"?(a(),d(_,{key:5,options:e.variable.options,"model-value":e.modelValue,"onUpdate:modelValue":l[10]||(l[10]=r=>t.$emit("update:modelValue",r)),onChange:l[11]||(l[11]=r=>t.$emit("change",r))},null,8,["options","model-value"])):C("",!0)}const J=I(he,[["render",fe],["__scopeId","data-v-7763fb5d"]]);function F(t){return t==null||t===""||JSON.stringify(t)==="[]"||JSON.stringify(t)==="{}"}function R(t){return t==="input"||t==="textarea"||t==="radio"?"":t==="select"?{value:null,settings:[]}:t==="checkbox"?[]:t==="table"||t==="database"||t==="query_model"?null:""}const ve={name:"FieldSetting",components:{TableFieldVariableInput:J,MySqlFieldSelect:ne},props:{valueKey:{default:"value"},table:{required:!0},group:{required:!0}},methods:{handleSelect(t){for(const l of t){l.origin==null&&(l.origin=JSON.parse(JSON.stringify(l)));for(const e of this.group.children)l[e.name]=F(l[e.name])?e.defaultValue:l[e.name],F(l[e.name])&&(l[e.name]=R(e.inputType))}this.group[this.valueKey]=t,this.emitChange()},emitChange(){this.$emit("change")},getColumnMinWidth(t){return t.inputType==="select"?"150px":"120px"}}},be={key:0,class:"required"};function ye(t,l,e,h,c,n){const u=o("MySqlFieldSelect"),p=o("el-table-column"),f=o("TableFieldVariableInput"),i=o("el-table");return a(),m(y,null,[S("h5",null,b(e.group.label),1),V(u,{"onUpdate:modelValue":n.handleSelect,"model-value":e.group[e.valueKey],table:e.table,placeholder:"Select fields"},null,8,["onUpdate:modelValue","model-value","table"]),V(i,{size:"small",data:e.group[e.valueKey]},{default:v(()=>[V(p,{label:"字段名",width:"100px",prop:"name",fixed:""}),(a(!0),m(y,null,k(e.group.children,_=>(a(),d(p,{key:_.name,label:_.label,"min-width":n.getColumnMinWidth(_)},{header:v(()=>[_.required?(a(),m("em",be,"*")):C("",!0),U(b(_.name),1)]),default:v(({row:r})=>[V(f,{variable:_,modelValue:r[_.name],"onUpdate:modelValue":x=>r[_.name]=x,onChange:n.emitChange},null,8,["variable","modelValue","onUpdate:modelValue","onChange"])]),_:2},1032,["label","min-width"]))),128))]),_:1},8,["data"])],64)}const ge=I(ve,[["render",ye],["__scopeId","data-v-3319afd4"]]);const Ve={name:"TableSelect",components:{FieldSetting:ge},props:{modelValue:{},valueKey:{default:"value"},variable:{required:!0}},data(){return{selected:null,databases:[],tables:[]}},computed:{...K(["currentProject","currentDatabase"]),fieldVariableGroup(){return this.variable.children||[]}},watch:{currentDatabase(){this.fetchTables()}},methods:{handleChange(t){this.selected=this.tables.find(l=>l.name===t),this.fieldVariableGroup.forEach(l=>{l[this.valueKey]=[]}),this.$emit("update:modelValue",t),this.$emit("change",t)},emitChange(){this.$emit("change")},fetchDatabases(){O().then(t=>{this.databases=t,this.fetchTables()}).catch(t=>{this.$tip.apiFailed(t)})},fetchTables(){const t=this.databases.find(l=>l.id===this.currentDatabase);t!=null&&j({host:t.host,port:t.port,user:t.username,password:t.password,database:t.schema}).then(l=>{this.tables=l,this.modelValue!=null&&(this.selected=this.tables.find(e=>e.name===this.modelValue),this.selected==null&&this.handleChange(null))}).catch(l=>{this.$tip.apiFailed(l)})}},created(){this.fetchDatabases()}},Se={class:"option-content"},Ie={class:"text-info-1"},ke={key:0,class:"field-settings"};function Ce(t,l,e,h,c,n){const u=o("el-option"),p=o("el-select"),f=o("FieldSetting");return a(),m(y,null,[V(p,{class:"table-select","popper-class":"table-select__popper","model-value":e.modelValue,clearable:"",onChange:n.handleChange},{default:v(()=>[(a(!0),m(y,null,k(c.tables,i=>(a(),d(u,{key:i.name,value:i.name,label:i.name},{default:v(()=>[S("p",Se,[S("span",null,b(i.name),1),S("span",Ie,b(i.comment),1)])]),_:2},1032,["value","label"]))),128))]),_:1},8,["model-value","onChange"]),c.selected!=null&&n.fieldVariableGroup.length>0?(a(),m("ul",ke,[(a(!0),m(y,null,k(n.fieldVariableGroup,i=>(a(),m("li",{key:i.label},[V(f,{"value-key":e.valueKey,table:c.selected,group:i,onChange:n.emitChange},null,8,["value-key","table","group","onChange"])]))),128))])):C("",!0)],64)}const xe=I(Ve,[["render",Ce],["__scopeId","data-v-f9b7df16"]]);const Fe={name:"QueryModelFieldSelect",props:{modelValue:{},model:{required:!0},multiple:{default:!0}},computed:{fieldGroups(){let t=[];for(const l of this.model.tables)t.push({name:l.name,alias:l.alias,options:l.fields});return t},fields(){let t=[];for(const l of this.model.tables)t=t.concat(l.fields);return t}},methods:{handleInput(t){this.$emit("update:modelValue",t.map(l=>{const e=l.split(".")[0],h=l.split(".")[1],c=this.model.tables.find(p=>p.alias===e),n=JSON.parse(JSON.stringify(c)),u=c.fields.find(p=>p.name===h);return delete n.fields,u.table=n,u}).filter(l=>l!=null))}}},Ue={class:"option-content"},Te={class:"text-info-1"};function Ke(t,l,e,h,c,n){const u=o("el-option"),p=o("el-option-group"),f=o("el-select");return a(),d(f,{class:"mysql-field-select","popper-class":"mysql-field-select__popper",multiple:e.multiple,"model-value":e.modelValue==null?[]:e.modelValue.map(i=>i.table.alias+"."+i.name),"onUpdate:modelValue":n.handleInput},{default:v(()=>[(a(!0),m(y,null,k(n.fieldGroups,i=>(a(),d(p,{key:i.alias,label:`${i.name} AS ${i.alias}`},{default:v(()=>[(a(!0),m(y,null,k(i.options,_=>(a(),d(u,{value:i.alias+"."+_.name,label:i.alias+"."+_.name},{default:v(()=>[S("p",Ue,[S("span",null,b(i.alias)+"."+b(_.name),1),S("span",Te,b(_.comment),1)])]),_:2},1032,["value","label"]))),256))]),_:2},1032,["label"]))),128))]),_:1},8,["multiple","model-value","onUpdate:modelValue"])}const Oe=I(Fe,[["render",Ke],["__scopeId","data-v-0d9e24b7"]]);const Me={name:"QueryModelFieldSetting",components:{QueryModelFieldSelect:Oe,TableFieldVariableInput:J},props:{valueKey:{default:"value"},model:{required:!0},group:{required:!0}},methods:{handleSelect(t){for(const l of t){l.origin==null&&(l.origin=JSON.parse(JSON.stringify(l)));for(const e of this.group.children)l[e.name]=F(l[e.name])?e.defaultValue:l[e.name],F(l[e.name])&&(l[e.name]=R(e.inputType))}this.group[this.valueKey]=t,this.emitChange()},emitChange(){this.$emit("change")},getColumnMinWidth(t){return t.inputType==="select"?"150px":"120px"}}},qe={key:0,class:"required"};function De(t,l,e,h,c,n){const u=o("QueryModelFieldSelect"),p=o("el-table-column"),f=o("TableFieldVariableInput"),i=o("el-table");return a(),m(y,null,[S("h5",null,b(e.group.label),1),V(u,{model:e.model,"model-value":e.group[e.valueKey],placeholder:"Select fields","onUpdate:modelValue":n.handleSelect},null,8,["model","model-value","onUpdate:modelValue"]),e.group.children.length>0?(a(),d(i,{key:0,size:"small",data:e.group[e.valueKey]},{default:v(()=>[V(p,{label:"字段名",width:"150px",prop:"name",fixed:""},{default:v(({row:_})=>[U(b(_.table.alias)+"."+b(_.name),1)]),_:1}),(a(!0),m(y,null,k(e.group.children,_=>(a(),d(p,{key:_.name,label:_.label,"min-width":n.getColumnMinWidth(_)},{header:v(()=>[_.required?(a(),m("em",qe,"*")):C("",!0),U(b(_.name),1)]),default:v(({row:r})=>[V(f,{variable:_,modelValue:r[_.name],"onUpdate:modelValue":x=>r[_.name]=x,onChange:n.emitChange},null,8,["variable","modelValue","onUpdate:modelValue","onChange"])]),_:2},1032,["label","min-width"]))),128))]),_:1},8,["data"])):C("",!0)],64)}const Ne=I(Me,[["render",De],["__scopeId","data-v-e735555a"]]);const we={name:"QueryModelSelect",components:{QueryModelFieldSetting:Ne},props:{modelValue:{},valueKey:{default:"value"},variable:{required:!0}},data(){return{databases:[],models:[],selected:null}},computed:{...K(["currentProject","currentDatabase"]),fieldVariableGroup(){return this.variable.children||[]}},watch:{currentDatabase(){this.fetchModels()}},methods:{handleChange(t){this.selected=this.models.find(l=>l.id===t),this.fieldVariableGroup.forEach(l=>{l[this.valueKey]=[]}),this.$emit("update:modelValue",t),this.emitChange()},emitChange(){this.$emit("change")},fetchDatabases(){O().then(t=>{this.databases=t,this.fetchModels()}).catch(t=>{this.$tip.apiFailed(t)})},fetchModels(){const t=this.databases.find(l=>l.id===this.currentDatabase);if(t==null){this.models=[];return}this.models=t.models,this.modelValue!=null&&(this.selected=this.models.find(l=>l.id===this.modelValue),this.selected==null&&this.handleChange(null))}},created(){this.fetchDatabases()}},Qe={class:"option-content"},Je={class:"text-info-1"},Re={key:0,class:"field-settings"};function je(t,l,e,h,c,n){const u=o("el-option"),p=o("el-select"),f=o("QueryModelFieldSetting");return a(),m(y,null,[V(p,{class:"model-select","popper-class":"model-select__popper","model-value":e.modelValue,clearable:"",onChange:n.handleChange},{default:v(()=>[(a(!0),m(y,null,k(c.models,i=>(a(),d(u,{key:i.id,value:i.id,label:i.name},{default:v(()=>[S("p",Qe,[S("span",null,b(i.name),1),S("span",Je,b(i.comment),1)])]),_:2},1032,["value","label"]))),128))]),_:1},8,["model-value","onChange"]),c.selected!=null&&n.fieldVariableGroup.length>0?(a(),m("ul",Re,[(a(!0),m(y,null,k(n.fieldVariableGroup,i=>(a(),m("li",{key:i.label},[V(f,{"value-key":e.valueKey,model:c.selected,group:i,onChange:n.emitChange},null,8,["value-key","model","group","onChange"])]))),128))])):C("",!0)],64)}const Ee=I(we,[["render",je],["__scopeId","data-v-c32ae356"]]);const Ge={name:"VariableInput",components:{InstallNumberInput:Q,InstallSelect:w,DataSourceSelect:E,QueryModelSelect:Ee,TableSelect:xe,InstallCheckbox:q,InstallRadio:N,InstallInput:D},props:{variable:{required:!0},valueKey:{default:"value"}},computed:{inputType(){return this.variable.inputType}}},Pe={class:"variable-input"};function Be(t,l,e,h,c,n){const u=o("InstallInput"),p=o("InstallNumberInput"),f=o("InstallSelect"),i=o("InstallCheckbox"),_=o("InstallRadio"),r=o("DataSourceSelect"),x=o("TableSelect"),g=o("QueryModelSelect");return a(),m("div",Pe,[e.variable.inputType==="input"?(a(),d(u,{key:0,modelValue:e.variable[e.valueKey],"onUpdate:modelValue":l[0]||(l[0]=s=>e.variable[e.valueKey]=s),onInput:l[1]||(l[1]=s=>t.$emit("change",s))},null,8,["modelValue"])):C("",!0),e.variable.inputType==="number_input"?(a(),d(p,{key:1,modelValue:e.variable[e.valueKey],"onUpdate:modelValue":l[2]||(l[2]=s=>e.variable[e.valueKey]=s),onInput:l[3]||(l[3]=s=>t.$emit("change",s))},null,8,["modelValue"])):e.variable.inputType==="textarea"?(a(),d(u,{key:2,type:"textarea",modelValue:e.variable[e.valueKey],"onUpdate:modelValue":l[4]||(l[4]=s=>e.variable[e.valueKey]=s),onInput:l[5]||(l[5]=s=>t.$emit("change",s))},null,8,["modelValue"])):e.variable.inputType==="select"?(a(),d(f,{key:3,modelValue:e.variable[e.valueKey],"onUpdate:modelValue":l[6]||(l[6]=s=>e.variable[e.valueKey]=s),options:e.variable.options,onChange:l[7]||(l[7]=s=>t.$emit("change",s))},null,8,["modelValue","options"])):e.variable.inputType==="checkbox"?(a(),d(i,{key:4,modelValue:e.variable[e.valueKey],"onUpdate:modelValue":l[8]||(l[8]=s=>e.variable[e.valueKey]=s),options:e.variable.options,onChange:l[9]||(l[9]=s=>t.$emit("change",s))},null,8,["modelValue","options"])):e.variable.inputType==="radio"?(a(),d(_,{key:5,modelValue:e.variable[e.valueKey],"onUpdate:modelValue":l[10]||(l[10]=s=>e.variable[e.valueKey]=s),options:e.variable.options,onChange:l[11]||(l[11]=s=>t.$emit("change",s))},null,8,["modelValue","options"])):e.variable.inputType==="datasource"?(a(),d(r,{key:6,modelValue:e.variable[e.valueKey],"onUpdate:modelValue":l[12]||(l[12]=s=>e.variable[e.valueKey]=s),"with-prefix":!1,"with-block":!0,onChange:l[13]||(l[13]=s=>t.$emit("change",s))},null,8,["modelValue"])):e.variable.inputType==="table"?(a(),d(x,{key:7,variable:e.variable,"value-key":e.valueKey,modelValue:e.variable[e.valueKey],"onUpdate:modelValue":l[14]||(l[14]=s=>e.variable[e.valueKey]=s),onChange:l[15]||(l[15]=s=>t.$emit("change",s))},null,8,["variable","value-key","modelValue"])):e.variable.inputType==="query_model"?(a(),d(g,{key:8,variable:e.variable,"value-key":e.valueKey,modelValue:e.variable[e.valueKey],"onUpdate:modelValue":l[16]||(l[16]=s=>e.variable[e.valueKey]=s),onChange:l[17]||(l[17]=s=>t.$emit("change",s))},null,8,["variable","value-key","modelValue"])):C("",!0)])}const $e=I(Ge,[["render",Be],["__scopeId","data-v-09222e3e"]]);function ze(t){return M.post("/service/version/publish",t)}function Ae(t){return M.post("/service/version",t,{baseURL:"/remote-api"})}export{ge as F,N as I,ne as M,se as O,$e as V,D as a,q as b,Ae as f,R as g,ze as p};