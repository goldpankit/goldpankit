import{_ as F,o as n,c as r,F as I,g as w,J as T,t as y,r as i,h as p,w as h,a as m,j as C,b as v,m as O,i as B,a8 as K,A as $,B as U,k as z,e as x,p as q,l as Q,a3 as P,a9 as D}from"./index-8602688b.js";import{Q as X}from"./QueryModelView-7acb3252.js";const Y={name:"InstallCheckbox",props:{modelValue:{type:Array},type:{default:"checkbox"},options:{}},data(){return{}},computed:{optionValues(){return this.options.map(l=>l.value)}},watch:{modelValue:{immediate:!0,handler(){this.filterValues(this.modelValue)}},optionValues(){this.filterValues(this.modelValue)}},methods:{handleSelect(l){let t=this.modelValue.findIndex(a=>a===l.value),e=[];t===-1?e=this.modelValue.concat([l.value]):e=this.modelValue.filter((a,u)=>u!==t),this.filterValues(e)},filterValues(l){const t=[];for(const e of l)this.options.find(u=>u.value===e)!=null&&t.push(e);t!==this.modelValue&&(t!=null&&this.modelValue!=null&&t.join(",")===this.modelValue.join(",")||(this.$emit("update:modelValue",t),this.$emit("change",t)))}}},Z={key:0,class:"installer-checkbox"},ee=["onClick"],le={key:1};function te(l,t,e,a,u,o){return e.options.length>0?(n(),r("ul",Z,[(n(!0),r(I,null,w(e.options,d=>(n(),r("li",{key:d.value,class:T({selected:e.modelValue==null?!1:e.modelValue.findIndex(b=>b===d.value)!==-1}),onClick:b=>o.handleSelect(d)},y(d.label),11,ee))),128))])):(n(),r("p",le,"Please add options first."))}const N=F(Y,[["render",te],["__scopeId","data-v-e2e976b6"]]);const ne={name:"InstallInput",props:{type:{default:"text"},rows:{default:3}}};function ae(l,t,e,a,u,o){const d=i("el-input");return n(),p(d,{type:e.type,rows:e.rows,class:"install-input"},null,8,["type","rows"])}const E=F(ne,[["render",ae],["__scopeId","data-v-35abcc78"]]);const oe={name:"InstallRadio",props:{modelValue:{},options:{}},data(){return{optionSettingData:{visible:!1}}},methods:{handleSelect(l){this.$emit("update:modelValue",l),this.$emit("change",l)}}},ie={key:0,class:"installer-radio"},se=["onClick"],ue={key:1};function de(l,t,e,a,u,o){return e.options.length>0?(n(),r("ul",ie,[(n(!0),r(I,null,w(e.options,d=>(n(),r("li",{key:d.value,class:T({selected:e.modelValue===d.value}),onClick:b=>o.handleSelect(d.value)},y(d.label),11,se))),128))])):(n(),r("p",ue,"Please add options first."))}const L=F(oe,[["render",de],["__scopeId","data-v-f13c727d"]]);const re={name:"MySqlFieldSelect",props:{modelValue:{},table:{required:!0},multiple:{default:!0}},methods:{handleInput(l){this.$emit("update:modelValue",l.map(t=>this.table.fields.find(e=>e.name===t)).filter(t=>t!=null))}}},ce={class:"option-content"},me={class:"text-info-1"};function _e(l,t,e,a,u,o){const d=i("el-option"),b=i("el-select");return n(),p(b,{class:"mysql-field-select","popper-class":"mysql-field-select__popper",multiple:e.multiple,"model-value":e.modelValue==null?[]:e.modelValue.map(f=>f.name),"onUpdate:modelValue":o.handleInput},{default:h(()=>[(n(!0),r(I,null,w(e.table.fields,f=>(n(),p(d,{value:f.name,label:f.name},{default:h(()=>[m("p",ce,[m("span",null,y(f.name),1),m("span",me,y(f.comment),1)])]),_:2},1032,["value","label"]))),256))]),_:1},8,["multiple","model-value","onUpdate:modelValue"])}const pe=F(re,[["render",_e],["__scopeId","data-v-3550a1ac"]]);const he={name:"OptionValueInput",props:{modelValue:{},optionSetting:{required:!0}},methods:{emitChange(l){this.$emit("update:model-value",l),this.$emit("input",l)}}},ve={class:"option-value-input"};function be(l,t,e,a,u,o){const d=i("el-input"),b=i("el-input-number");return n(),r("div",ve,[e.optionSetting.inputType==="input"?(n(),p(d,{key:0,"model-value":e.modelValue,"onUpdate:modelValue":o.emitChange},null,8,["model-value","onUpdate:modelValue"])):e.optionSetting.inputType==="number_input"?(n(),p(b,{key:1,"model-value":e.modelValue,controls:!1,"onUpdate:modelValue":o.emitChange},null,8,["model-value","onUpdate:modelValue"])):e.optionSetting.inputType==="textarea"?(n(),p(d,{key:2,type:"textarea",rows:1,"model-value":e.modelValue,"onUpdate:modelValue":o.emitChange},null,8,["model-value","onUpdate:modelValue"])):C("",!0)])}const fe=F(he,[["render",be],["__scopeId","data-v-c1e053d5"]]);const ge={name:"InstallSelect",components:{OptionValueInput:fe},props:{modelValue:{},options:{},type:{default:"radio"}},data(){return{optionSettingData:{visible:!1}}},computed:{validOptions(){return this.options.filter(l=>l.value.trim()!==""&&l.label.trim()!=="")},currentOption(){return this.validOptions.find(l=>l.value===this.modelValue.value)},optionValues(){return this.validOptions.map(l=>l.value)},currenOptionSettings(){return this.currentOption==null?[]:this.currentOption.settings.map(l=>l.defaultValue)}},watch:{optionValues(){this.handleSelect(this.modelValue.value)},currenOptionSettings(){this.fillSettingValue()},modelValue:{immediate:!0,handler(){this.fillSettingValueFromModelValue()}}},methods:{handleSelect(l){const t=this.validOptions.find(a=>a.value===l);let e={value:null,settings:{}};if(t!=null){const a={};for(const u of t.settings)a[u.name]=u.defaultValue;e={value:l,settings:a}}this.$emit("update:modelValue",e),this.$emit("change",e),this.fillSettingValue()},fillSettingValue(){this.$nextTick(()=>{if(this.currentOption!=null)for(const l of this.currentOption.settings)l.value=l.defaultValue})},fillSettingValueFromModelValue(){for(const l in this.modelValue.settings){const t=this.options.find(a=>a.value===this.modelValue.value);if(t==null)continue;const e=t.settings.find(a=>a.name===l);e!=null&&(e.value=this.modelValue.settings[l])}}}},ye={key:0,class:"installer-select"},Ve={key:1};function Se(l,t,e,a,u,o){const d=i("el-option"),b=i("el-select"),f=i("el-button"),k=i("OptionValueInput"),S=i("el-form-item"),g=i("el-form"),_=i("el-dialog");return e.options.length>0?(n(),r("div",ye,[v(b,{"model-value":e.modelValue.value,clearable:"",onChange:o.handleSelect},{default:h(()=>[(n(!0),r(I,null,w(o.validOptions,s=>(n(),p(d,{key:s.value,value:s.value,label:s.label},null,8,["value","label"]))),128))]),_:1},8,["model-value","onChange"]),o.currentOption!=null&&o.currentOption.settings.length>0?(n(),p(f,{key:0,type:"primary",icon:"Setting",class:"button-icon",onClick:t[0]||(t[0]=s=>u.optionSettingData.visible=!0)})):C("",!0),o.currentOption!=null?(n(),p(_,{key:1,modelValue:u.optionSettingData.visible,"onUpdate:modelValue":t[2]||(t[2]=s=>u.optionSettingData.visible=s),title:`${o.currentOption.label}${l.$t("service.settingsForSelectType")}`,"append-to-body":!0},{default:h(()=>[v(g,null,{default:h(()=>[(n(!0),r(I,null,w(o.currentOption.settings,s=>(n(),p(S,{key:s.name,label:s.label,required:s.required},{default:h(()=>[v(k,{modelValue:e.modelValue.settings[s.name],"onUpdate:modelValue":V=>e.modelValue.settings[s.name]=V,"option-setting":s,onInput:t[1]||(t[1]=V=>l.$emit("change"))},null,8,["modelValue","onUpdate:modelValue","option-setting"])]),_:2},1032,["label","required"]))),128))]),_:1})]),_:1},8,["modelValue","title"])):C("",!0)])):(n(),r("p",Ve,"Please add options first."))}const W=F(ge,[["render",Se],["__scopeId","data-v-1c9b90a3"]]);const ke={name:"InstallNumberInput",props:{type:{default:"text"}}};function Ie(l,t,e,a,u,o){const d=i("el-input-number");return n(),p(d,{class:"install-number-input",controls:!1})}const j=F(ke,[["render",Ie],["__scopeId","data-v-6340b22c"]]),Fe={name:"Switch"};function Ce(l,t,e,a,u,o){const d=i("el-switch");return n(),p(d)}const R=F(Fe,[["render",Ce]]);const we={name:"TableFieldVariableInput",components:{InstallSwitch:R,InstallNumberInput:j,InstallSelect:W,InstallCheckbox:N,InstallRadio:L,InstallInput:E},props:{modelValue:{},variable:{required:!0}}};function Te(l,t,e,a,u,o){const d=i("InstallInput"),b=i("InstallNumberInput"),f=i("InstallSelect"),k=i("InstallCheckbox"),S=i("InstallRadio"),g=i("InstallSwitch");return e.variable.inputType==="input"?(n(),p(d,{key:0,"model-value":e.modelValue,"onUpdate:modelValue":t[0]||(t[0]=_=>l.$emit("update:modelValue",_)),onInput:t[1]||(t[1]=_=>l.$emit("change",_))},null,8,["model-value"])):e.variable.inputType==="number_input"?(n(),p(b,{key:1,"model-value":e.modelValue,"onUpdate:modelValue":t[2]||(t[2]=_=>l.$emit("update:modelValue",_)),onInput:t[3]||(t[3]=_=>l.$emit("change",_))},null,8,["model-value"])):e.variable.inputType==="textarea"?(n(),p(d,{key:2,type:"textarea",rows:1,"model-value":e.modelValue,"onUpdate:modelValue":t[4]||(t[4]=_=>l.$emit("update:modelValue",_)),onInput:t[5]||(t[5]=_=>l.$emit("change",_))},null,8,["model-value"])):e.variable.inputType==="select"?(n(),p(f,{key:3,options:e.variable.options,"model-value":e.modelValue,"onUpdate:modelValue":t[6]||(t[6]=_=>l.$emit("update:modelValue",_)),onChange:t[7]||(t[7]=_=>l.$emit("change",_))},null,8,["options","model-value"])):e.variable.inputType==="checkbox"?(n(),p(k,{key:4,options:e.variable.options,"model-value":e.modelValue,"onUpdate:modelValue":t[8]||(t[8]=_=>l.$emit("update:modelValue",_)),onChange:t[9]||(t[9]=_=>l.$emit("change",_))},null,8,["options","model-value"])):e.variable.inputType==="radio"?(n(),p(S,{key:5,options:e.variable.options,"model-value":e.modelValue,"onUpdate:modelValue":t[10]||(t[10]=_=>l.$emit("update:modelValue",_)),onChange:t[11]||(t[11]=_=>l.$emit("change",_))},null,8,["options","model-value"])):e.variable.inputType==="switch"?(n(),p(g,{key:6,"model-value":e.modelValue,"onUpdate:modelValue":t[12]||(t[12]=_=>l.$emit("update:modelValue",_)),onChange:t[13]||(t[13]=_=>l.$emit("change",_))},null,8,["model-value"])):C("",!0)}const A=F(we,[["render",Te],["__scopeId","data-v-f253c4c5"]]);const xe={name:"VariableRemarkIcon",props:{variable:{required:!0}}};function Me(l,t,e,a,u,o){const d=i("QuestionFilled"),b=i("el-icon"),f=i("el-popover");return e.variable.remark!=null&&e.variable.remark.trim()!==""?(n(),p(f,{key:0,"popper-class":"global-popover",title:"参数说明",placement:"top",width:"255px"},{reference:h(()=>[v(b,null,{default:h(()=>[v(d)]),_:1})]),default:h(()=>[m("p",null,y(e.variable.remark),1)]),_:1})):C("",!0)}const H=F(xe,[["render",Me],["__scopeId","data-v-9fef24ee"]]);function M(l){return l==null||l===""||JSON.stringify(l)==="[]"||JSON.stringify(l)==="{}"}function J(l){return l==="input"||l==="textarea"||l==="radio"?"":l==="select"?{value:null,settings:[]}:l==="checkbox"?[]:l==="table"||l==="database"||l==="query_model"?null:""}const Oe={name:"FieldSetting",components:{VariableRemarkIcon:H,TableFieldVariableInput:A,MySqlFieldSelect:pe},props:{table:{required:!0},group:{required:!0},valueKey:{default:"value"}},computed:{tableFields(){return this.table.fields.map(l=>l.name)}},watch:{tableFields(){this.handleSelect(this.group[this.valueKey])}},methods:{handleSelect(l){l=l.filter(e=>this.table.fields.find(a=>a.name===e.name)!=null);const t=JSON.parse(JSON.stringify(l));for(const e of t){e.origin==null&&(e.origin=JSON.parse(JSON.stringify(e)));for(const a of this.group.children)e[a.name]=M(e[a.name])?a.defaultValue:e[a.name],M(e[a.name])&&(e[a.name]=J(a.inputType))}this.group[this.valueKey]=t,this.emitChange()},emitChange(){this.$emit("change")},getColumnMinWidth(l){return l.inputType==="select"?"150px":"120px"}},created(){this.handleSelect(this.group[this.valueKey])}},Ke={class:"column-header-wrap"},$e={key:0,class:"required"};function Ue(l,t,e,a,u,o){const d=i("MySqlFieldSelect"),b=i("el-table-column"),f=i("VariableRemarkIcon"),k=i("TableFieldVariableInput"),S=i("el-table");return n(),r(I,null,[m("h5",null,y(e.group.label),1),v(d,{"onUpdate:modelValue":o.handleSelect,"model-value":e.group[e.valueKey],table:e.table,placeholder:"请选择字段"},null,8,["onUpdate:modelValue","model-value","table"]),v(S,{size:"small",data:e.group[e.valueKey]},{default:h(()=>[v(b,{label:"字段名",width:"100px",prop:"name",fixed:""}),(n(!0),r(I,null,w(e.group.children,g=>(n(),p(b,{key:g.name,label:g.label,"min-width":o.getColumnMinWidth(g)},{header:h(()=>[m("div",Ke,[g.required?(n(),r("em",$e,"*")):C("",!0),m("label",null,y(g.label),1),v(f,{variable:g},null,8,["variable"])])]),default:h(({row:_})=>[v(k,{variable:g,modelValue:_[g.name],"onUpdate:modelValue":s=>_[g.name]=s,onChange:o.emitChange},null,8,["variable","modelValue","onUpdate:modelValue","onChange"])]),_:2},1032,["label","min-width"]))),128))]),_:1},8,["data"])],64)}const qe=F(Oe,[["render",Ue],["__scopeId","data-v-e5c69408"]]);const Qe={name:"TableSelect",components:{FieldSetting:qe},props:{modelValue:{},valueKey:{default:"value"},variable:{required:!0}},data(){return{selected:null}},computed:{...O(["tables","globalLoading","currentDatabaseConnect"]),fieldVariableGroup(){return this.variable.children||[]},currentTable(){return this.modelValue==null?null:this.tables.find(l=>l.name===this.modelValue)}},watch:{"globalLoading.tables":{immediate:!0,handler(l){l||this.handleChange(this.modelValue)}}},methods:{...B(["fetchTables"]),handleChange(l){if(!this.globalLoading.tables){if(this.modelValue!==l&&this.fieldVariableGroup.forEach(t=>{t[this.valueKey]=[]}),this.tables.find(t=>t.name===l)==null){this.$emit("update:modelValue",null),this.$emit("change",null);return}this.$emit("update:modelValue",l),this.$emit("change",l)}}}},De={class:"table-select"},Ne={class:"table-select__wrap"},Ee={class:"option-content"},Le={class:"text-info-1"},We={key:0,class:"connect-error"},je={key:1,class:"field-settings"};function Re(l,t,e,a,u,o){const d=i("el-option"),b=i("el-select"),f=i("el-button"),k=i("FieldSetting");return n(),r("div",De,[m("div",Ne,[v(b,{"popper-class":"table-select__popper","model-value":e.modelValue,clearable:"",loading:l.globalLoading.tables,"loading-text":"正在获取数据库表，请稍后...",onChange:o.handleChange},{default:h(()=>[(n(!0),r(I,null,w(l.tables,S=>(n(),p(d,{key:S.name,value:S.name,label:S.name},{default:h(()=>[m("p",Ee,[m("span",null,y(S.name),1),m("span",Le,y(S.comment),1)])]),_:2},1032,["value","label"]))),128))]),_:1},8,["model-value","loading","onChange"]),v(f,{class:"button-icon",type:"primary",icon:"Refresh",onClick:l.fetchTables},null,8,["onClick"])]),l.currentDatabaseConnect.error!=null?(n(),r("p",We,"数据库连接失败："+y(l.currentDatabaseConnect.error),1)):C("",!0),o.currentTable!=null&&o.fieldVariableGroup.length>0?(n(),r("ul",je,[(n(!0),r(I,null,w(o.fieldVariableGroup,S=>(n(),r("li",{key:S.label},[v(k,{"value-key":e.valueKey,table:o.currentTable,group:S,onChange:t[0]||(t[0]=g=>l.$emit("change"))},null,8,["value-key","table","group"])]))),128))])):C("",!0)])}const Ae=F(Qe,[["render",Re],["__scopeId","data-v-8ee56717"]]);const He={name:"QueryModelFieldSelect",props:{modelValue:{},model:{required:!0},multiple:{default:!0},defaultSelectedFieldObjects:{type:Array}},data(){return{focused:!1,tables:[],selectedFields:this.defaultSelectedFieldObjects,currentHoverTable:null,currentHoverField:null,leaveFieldTimeout:null}},watch:{model:{immediate:!0,handler(){this.refreshTables()}}},methods:{focus(){this.focused=!0},handleFieldSorted(){this.$emit("update:modelValue",this.selectedFields.map(l=>`${l.table.id}.${l.name}`)),this.$emit("fields:change",this.selectedFields)},deleteField(l,t){const e=this.model.tables.find(u=>u.id===l),a=this.modelValue.filter(u=>`${e.id}.${t}`!==u);this.handleInput(e,a)},handleCheckAllChange(l,t){let e=[];t&&(e=l.fields.map(u=>`${l.id}.${u.name}`));let a=this.modelValue;a=a.filter(u=>!u.startsWith(`${l.id}.`)),a=a.concat(e),this.handleInput(l,a)},handleInput(l,t){const e=t.filter(a=>a.startsWith(`${l.id}.`));l.checkedAll=e.length===l.fields.length,this.selectFields(t)},handleFieldEnter(l){this.leaveFieldTimeout!=null&&clearTimeout(this.leaveFieldTimeout),this.currentHoverField=l},handleFieldLeave(){this.leaveFieldTimeout=setTimeout(()=>{this.currentHoverField=null},500)},handleTableEnter(l){this.currentHoverTable=l},handleTableLeave(){this.currentHoverTable=null},close(){this.focused=!1,this.handleTableLeave(),this.handleFieldLeave()},refreshTables(){this.tables=[];for(const l of this.model.tables){const t=l.fields.filter(e=>e.visible);t.length>0&&this.tables.push({id:l.id,type:l.type,name:l.name,alias:l.alias,fields:t,checkedAll:!1})}this.selectFields(this.modelValue)},selectFields(l){const t=this.__getExistsSelectedFieldsObjects(l);this.selectedFields.splice(0,this.selectedFields.length),this.selectedFields.push.apply(this.selectedFields,t),this.$emit("update:modelValue",this.selectedFields.map(e=>e.table.id+"."+e.name)),this.$emit("fields:change",this.selectedFields)},__getExistsSelectedFieldsObjects(l){const t=l.map(a=>{const u=a.split(".")[0],o=a.split(".")[1],d=this.tables.find(S=>S.id===u);if(d==null)return null;const b=d.fields.find(S=>S.name===o);if(b==null)return null;const f=K(d,["fields"]),k=K(b,["table"]);return k.table=f,k}).filter(a=>a!=null),e=[];for(const a of t){const u=this.selectedFields.findIndex(d=>d.table.id===a.table.id&&d.name===a.name);if(u===-1){e.push(a);continue}const o=this.selectedFields[u];o.alias=a.alias,o.table=a.table,e.push(o)}return e}}},Je=l=>(q("data-v-8cb0fa8c"),l=l(),Q(),l),Ge={class:"model-field-select"},Be={key:0,class:"placeholder"},ze=["onMouseenter"],Pe={key:0},Xe=["onClick"],Ye={class:"field-select__tables"},Ze=["onMouseenter"],el={class:"table__header"},ll={class:"table__fields-wrap"},tl={class:"table-fields"},nl=Je(()=>m("em",null,"AS",-1)),al={key:0,class:"text-info-1"};function ol(l,t,e,a,u,o){const d=i("Close"),b=i("el-icon"),f=i("el-checkbox"),k=i("el-checkbox-group"),S=i("el-scrollbar"),g=i("el-popover"),_=$("sortable");return n(),r("div",Ge,[v(g,{trigger:"click","popper-class":"model-field-select-popper","hide-after":0,persistent:!1,onHide:o.close},{reference:h(()=>[U((n(),r("ul",{class:T(["selected-preview",{"is-focus":u.focused}]),onClick:t[1]||(t[1]=(...s)=>o.focus&&o.focus(...s))},[u.selectedFields.length===0?(n(),r("li",Be,"请选择字段")):(n(!0),r(I,{key:1},w(u.selectedFields,s=>(n(),r("li",{key:s.name,class:T({"field-light":u.currentHoverTable!=null&&s.table.id===u.currentHoverTable.id}),onMouseenter:V=>o.handleFieldEnter(s),onMouseleave:t[0]||(t[0]=(...V)=>o.handleFieldLeave&&o.handleFieldLeave(...V))},[m("p",null,y(s.table.alias)+"."+y(s.name),1),s.comment!=null&&s.comment!==""?(n(),r("p",Pe,y(s.comment),1)):C("",!0),m("span",{class:"button-close",onClick:z(V=>o.deleteField(s.table.id,s.name),["stop"])},[v(b,null,{default:h(()=>[v(d)]),_:1})],8,Xe)],42,ze))),128))],2)),[[_,{data:u.selectedFields,onChange:o.handleFieldSorted},"config"]])]),default:h(()=>[m("div",Ye,[(n(!0),r(I,null,w(u.tables,s=>(n(),r("div",{key:s.alias,class:T(["field-select__table",{"table-main":s.type==="MAIN","table-light":u.currentHoverField!=null&&s.id===u.currentHoverField.table.id}]),onMouseenter:V=>o.handleTableEnter(s),onMouseleave:t[2]||(t[2]=(...V)=>o.handleTableLeave&&o.handleTableLeave(...V))},[m("div",el,[v(f,{modelValue:s.checkedAll,"onUpdate:modelValue":V=>s.checkedAll=V,onChange:V=>o.handleCheckAllChange(s,V)},{default:h(()=>[m("h4",null,[x(y(s.name)+" ",1),s.name!==s.alias?(n(),r(I,{key:0},[x("AS "+y(s.alias),1)],64)):C("",!0)])]),_:2},1032,["modelValue","onUpdate:modelValue","onChange"])]),m("div",ll,[v(S,null,{default:h(()=>[m("div",tl,[v(k,{"model-value":e.modelValue,onChange:V=>o.handleInput(s,V)},{default:h(()=>[(n(!0),r(I,null,w(s.fields,V=>(n(),p(f,{label:`${s.id}.${V.name}`,key:V.name},{default:h(()=>[m("p",null,[x(y(V.name)+" ",1),V.alias!==V.name?(n(),r(I,{key:0},[nl,x(),m("b",null,y(V.alias),1)],64)):C("",!0)]),V.comment!==""?(n(),r("p",al,y(V.comment),1)):C("",!0)]),_:2},1032,["label"]))),128))]),_:2},1032,["model-value","onChange"])])]),_:2},1024)])],42,Ze))),128))])]),_:1},8,["onHide"])])}const il=F(He,[["render",ol],["__scopeId","data-v-8cb0fa8c"]]);const sl={name:"QueryModelFieldSetting",components:{VariableRemarkIcon:H,SortableButton:P,QueryModelFieldSelect:il,TableFieldVariableInput:A},props:{valueKey:{default:"value"},model:{required:!0},group:{required:!0}},data(){return{selectedFields:[],defaultSelectedFieldObjects:[]}},watch:{model(){this.initSelectedFields()}},methods:{handleSort(){this.initSelectedFields(),this.emitChange()},initSelectedFields(){this.selectedFields=[],this.defaultSelectedFieldObjects=[];const l=this.group[this.valueKey];l!=null&&l.length>0&&(this.selectedFields=l.map(t=>`${t.table.id}.${t.name}`),this.defaultSelectedFieldObjects=JSON.parse(JSON.stringify(l)))},handleSelect(l){const t=[];for(const e of l){e.origin==null&&(e.origin=JSON.parse(JSON.stringify(e)));for(const a of this.group.children)e[a.name]=M(e[a.name])?a.defaultValue:e[a.name],M(e[a.name])&&(e[a.name]=J(a.inputType));t.push(e)}this.group[this.valueKey].splice(0,this.group[this.valueKey].length),this.group[this.valueKey].push.apply(this.group[this.valueKey],t),this.emitChange()},emitChange(){this.$emit("change")},getColumnMinWidth(l){return l.inputType==="select"?"150px":"120px"},refresh(){this.$refs.fieldSelect.refreshTables()}},created(){this.initSelectedFields()}},ul={key:0,class:"required"};function dl(l,t,e,a,u,o){const d=i("QueryModelFieldSelect"),b=i("SortableButton"),f=i("el-table-column"),k=i("VariableRemarkIcon"),S=i("TableFieldVariableInput"),g=i("el-table"),_=$("sortable");return n(),r(I,null,[m("h5",null,y(e.group.label),1),v(d,{ref:"fieldSelect",modelValue:u.selectedFields,"onUpdate:modelValue":t[0]||(t[0]=s=>u.selectedFields=s),model:e.model,"default-selected-field-objects":u.defaultSelectedFieldObjects,"onFields:change":o.handleSelect},null,8,["modelValue","model","default-selected-field-objects","onFields:change"]),e.group.children.length>0?U((n(),p(g,{key:0,size:"small",data:e.group[e.valueKey],"row-key":s=>`${s.table.id}.${s.name}@${s.alias}`},{default:h(()=>[v(f,{width:"25px",fixed:""},{default:h(()=>[v(b)]),_:1}),v(f,{label:"字段名",width:"150px",prop:"name",fixed:""},{default:h(({row:s})=>[m("p",null,y(s.table.alias)+"."+y(s.name),1),m("p",null,y(s.comment),1)]),_:1}),(n(!0),r(I,null,w(e.group.children,s=>(n(),p(f,{key:s.name,label:s.label,"min-width":o.getColumnMinWidth(s)},{header:h(()=>[s.required?(n(),r("em",ul,"*")):C("",!0),m("label",null,y(s.label),1),v(k,{variable:s},null,8,["variable"])]),default:h(({row:V})=>[v(S,{variable:s,modelValue:V[s.name],"onUpdate:modelValue":c=>V[s.name]=c,onChange:o.emitChange},null,8,["variable","modelValue","onUpdate:modelValue","onChange"])]),_:2},1032,["label","min-width"]))),128))]),_:1},8,["data","row-key"])),[[_,{data:e.group[e.valueKey],onChange:o.handleSort},"config"]]):C("",!0)],64)}const rl=F(sl,[["render",dl],["__scopeId","data-v-c3e6de24"]]);const cl={name:"QueryModelWindow",components:{DataSourceSelect:D,QueryModelView:X},data(){return{visible:!1}},computed:{...O(["currentDatabase"])},methods:{open(){this.visible=!0},close(){this.visible=!1,this.$emit("close")}}},ml=m("h2",null,"查询模型设计",-1),_l={class:"header__opera"};function pl(l,t,e,a,u,o){const d=i("DataSourceSelect"),b=i("Close"),f=i("el-icon"),k=i("QueryModelView"),S=i("el-dialog");return n(),p(S,{class:"query-model-window",modelValue:u.visible,"onUpdate:modelValue":t[0]||(t[0]=g=>u.visible=g),fullscreen:"","append-to-body":"","show-close":!1},{header:h(()=>[ml,m("div",_l,[v(d,{"model-value":l.currentDatabase},null,8,["model-value"]),v(f,{onClick:o.close},{default:h(()=>[v(b)]),_:1},8,["onClick"])])]),default:h(()=>[v(k,{"database-id":l.currentDatabase},null,8,["database-id"])]),_:1},8,["modelValue"])}const hl=F(cl,[["render",pl]]),vl="/images/database/icon-design.svg";const bl={name:"QueryModelSelect",components:{QueryModelWindow:hl,QueryModelFieldSetting:rl},props:{modelValue:{},valueKey:{default:"value"},variable:{required:!0}},computed:{...O(["models","globalLoading","currentDatabaseConnect"]),fieldVariableGroup(){return this.variable.children||[]},currentModel(){return this.modelValue==null?null:this.models.find(l=>l.id===this.modelValue)}},watch:{"globalLoading.models":{immediate:!0,handler(l){l||this.handleChange(this.modelValue)}},"models.length"(){this.handleChange(this.modelValue)}},methods:{handleChange(l){if(!this.globalLoading.models){if(this.modelValue!==l&&this.fieldVariableGroup.forEach(t=>{t[this.valueKey]=[]}),this.models.find(t=>t.id===l)==null){this.$emit("update:modelValue",null),this.$emit("change",null);return}this.$emit("update:modelValue",l),this.$emit("change")}},refreshFieldSetting(){for(const l of this.fieldVariableGroup){const t=this.$refs[`${l.name}FieldSetting`];t&&t[0]&&t[0].refresh()}}}},G=l=>(q("data-v-6d47634a"),l=l(),Q(),l),fl={class:"query-model-select"},gl={class:"option-content"},yl={class:"text-info-1"},Vl=G(()=>m("img",{src:vl,alt:"查询模型"},null,-1)),Sl=G(()=>m("p",null,null,-1)),kl={key:0,class:"connect-error"},Il={key:1,class:"field-settings"};function Fl(l,t,e,a,u,o){const d=i("el-option"),b=i("el-select"),f=i("el-button"),k=i("QueryModelWindow"),S=i("QueryModelFieldSetting");return n(),r(I,null,[m("div",fl,[v(b,{"popper-class":"model-select__popper","model-value":e.modelValue,clearable:"",onChange:o.handleChange},{default:h(()=>[(n(!0),r(I,null,w(l.models,g=>(n(),p(d,{key:g.id,value:g.id,label:g.name},{default:h(()=>[m("p",gl,[m("span",null,y(g.name),1),m("span",yl,y(g.comment),1)])]),_:2},1032,["value","label"]))),128))]),_:1},8,["model-value","onChange"]),v(f,{class:"button-icon",type:"primary",onClick:t[0]||(t[0]=g=>l.$refs.queryModelWindow.open())},{default:h(()=>[Vl]),_:1}),Sl,v(k,{ref:"queryModelWindow",onClose:o.refreshFieldSetting},null,8,["onClose"])]),l.currentDatabaseConnect.error!=null?(n(),r("p",kl,"数据库连接失败："+y(l.currentDatabaseConnect.error),1)):C("",!0),o.currentModel!=null&&o.fieldVariableGroup.length>0?(n(),r("ul",Il,[(n(!0),r(I,null,w(o.fieldVariableGroup,g=>(n(),r("li",{key:g.label},[v(S,{ref_for:!0,ref:`${g.name}FieldSetting`,"value-key":e.valueKey,model:o.currentModel,group:g,onChange:t[1]||(t[1]=_=>l.$emit("change"))},null,8,["value-key","model","group"])]))),128))])):C("",!0)],64)}const Cl=F(bl,[["render",Fl],["__scopeId","data-v-6d47634a"]]);const wl={name:"VariableInput",components:{InstallNumberInput:j,InstallSelect:W,DataSourceSelect:D,QueryModelSelect:Cl,TableSelect:Ae,InstallCheckbox:N,InstallRadio:L,InstallInput:E,InstallSwitch:R},props:{variable:{required:!0},valueKey:{default:"value"}},computed:{inputType(){return this.variable.inputType}}},Tl={class:"variable-input"};function xl(l,t,e,a,u,o){const d=i("InstallInput"),b=i("InstallNumberInput"),f=i("InstallSelect"),k=i("InstallCheckbox"),S=i("InstallRadio"),g=i("InstallSwitch"),_=i("DataSourceSelect"),s=i("TableSelect"),V=i("QueryModelSelect");return n(),r("div",Tl,[e.variable.inputType==="input"?(n(),p(d,{key:0,modelValue:e.variable[e.valueKey],"onUpdate:modelValue":t[0]||(t[0]=c=>e.variable[e.valueKey]=c),onInput:t[1]||(t[1]=c=>l.$emit("change",c))},null,8,["modelValue"])):e.variable.inputType==="number_input"?(n(),p(b,{key:1,modelValue:e.variable[e.valueKey],"onUpdate:modelValue":t[2]||(t[2]=c=>e.variable[e.valueKey]=c),onInput:t[3]||(t[3]=c=>l.$emit("change",c))},null,8,["modelValue"])):e.variable.inputType==="textarea"?(n(),p(d,{key:2,type:"textarea",modelValue:e.variable[e.valueKey],"onUpdate:modelValue":t[4]||(t[4]=c=>e.variable[e.valueKey]=c),onInput:t[5]||(t[5]=c=>l.$emit("change",c))},null,8,["modelValue"])):e.variable.inputType==="select"?(n(),p(f,{key:3,modelValue:e.variable[e.valueKey],"onUpdate:modelValue":t[6]||(t[6]=c=>e.variable[e.valueKey]=c),options:e.variable.options,onChange:t[7]||(t[7]=c=>l.$emit("change",c))},null,8,["modelValue","options"])):e.variable.inputType==="checkbox"?(n(),p(k,{key:4,modelValue:e.variable[e.valueKey],"onUpdate:modelValue":t[8]||(t[8]=c=>e.variable[e.valueKey]=c),options:e.variable.options,onChange:t[9]||(t[9]=c=>l.$emit("change",c))},null,8,["modelValue","options"])):e.variable.inputType==="radio"?(n(),p(S,{key:5,modelValue:e.variable[e.valueKey],"onUpdate:modelValue":t[10]||(t[10]=c=>e.variable[e.valueKey]=c),options:e.variable.options,onChange:t[11]||(t[11]=c=>l.$emit("change",c))},null,8,["modelValue","options"])):e.variable.inputType==="switch"?(n(),p(g,{key:6,modelValue:e.variable[e.valueKey],"onUpdate:modelValue":t[12]||(t[12]=c=>e.variable[e.valueKey]=c),onInput:t[13]||(t[13]=c=>l.$emit("change",c))},null,8,["modelValue"])):e.variable.inputType==="datasource"?(n(),p(_,{key:7,modelValue:e.variable[e.valueKey],"onUpdate:modelValue":t[14]||(t[14]=c=>e.variable[e.valueKey]=c),"with-prefix":!1,"with-block":!0,onChange:t[15]||(t[15]=c=>l.$emit("change",c))},null,8,["modelValue"])):e.variable.inputType==="table"?(n(),p(s,{key:8,variable:e.variable,"value-key":e.valueKey,modelValue:e.variable[e.valueKey],"onUpdate:modelValue":t[16]||(t[16]=c=>e.variable[e.valueKey]=c),onChange:t[17]||(t[17]=c=>l.$emit("change",c))},null,8,["variable","value-key","modelValue"])):e.variable.inputType==="query_model"?(n(),p(V,{key:9,variable:e.variable,"value-key":e.valueKey,modelValue:e.variable[e.valueKey],"onUpdate:modelValue":t[18]||(t[18]=c=>e.variable[e.valueKey]=c),onChange:t[19]||(t[19]=c=>l.$emit("change",c))},null,8,["variable","value-key","modelValue"])):C("",!0)])}const Nl=F(wl,[["render",xl],["__scopeId","data-v-ea68e2f3"]]);const Ml={name:"ServiceCodeErrorWindow",data(){return{visible:!1,error:null}},methods:{open(l){this.error=l,this.visible=!0}}},Ol={class:"window-header-wrap"},Kl={class:"title"},$l={class:"tip"},Ul={class:"window-content-wrap"};function ql(l,t,e,a,u,o){const d=i("CircleCloseFilled"),b=i("el-icon"),f=i("el-dialog");return n(),p(f,{modelValue:u.visible,"onUpdate:modelValue":t[0]||(t[0]=k=>u.visible=k),width:"1000px",class:"service-code-error-window","show-close":!1},{header:h(()=>[m("div",Ol,[m("div",Kl,[v(b,null,{default:h(()=>[v(d)]),_:1}),m("h5",null,y(l.$t("service.serviceCodeErrorTitle")),1)]),m("p",$l,y(l.$t("service.serviceCodeErrorTip")),1)])]),default:h(()=>[m("div",Ul,[m("p",null,"at "+y(u.error.position),1),m("pre",null,y(u.error.message),1)])]),_:1},8,["modelValue"])}const El=F(Ml,[["render",ql]]);export{qe as F,L as I,pe as M,fe as O,El as S,H as V,Nl as a,E as b,N as c,J as g,M as i};