import{e as C,M as H,n as K,g as Q,R as $,A as q,S as W,a as ee,d as ue}from"./Index.c4c5503f.js";import{_ as M,j,t as te,r as z,e as b,b as _,o,v as I,C as e,c as s,y as a,M as le,D as m,F as U,N as w,A as R,L as v,B as h,x as d,O as ae,P as oe,a as re,E as J}from"./index.95e8e1bb.js";const de=v(" \u5BA1\u6838\u6D41\u7A0B "),se={key:1,class:"procedure"},ne={class:"name"},ie={class:"select"},pe=j({props:{id:{required:!0,type:Number,default:null},menu:{required:!0,type:Object,default(){return{}}},roles:{type:Array,default:()=>[]},processRoles:{type:Array,default:()=>[]}},setup(O){const S=O,{menu:A,roles:g,processRoles:n}=te(S);console.log("role===",g),console.log("processRoles===",n),z([]),b(()=>C(A.apiJson));function L(p){return g.value.find(D=>D.id===p)}function y(){n.value.push({auditLevel:n.value.length+1,roleId:void 0,roleName:""})}function x(p){n.value.splice(p,1)}function u(p,D){const B=L(D);p.roleName=B.policyName}function i(p){return n.value.map(B=>B.roleId).includes(p)}return(p,D)=>{const B=_("el-button"),P=_("el-icon"),N=_("el-option"),T=_("el-select");return o(),I("div",null,[e(n).length<e(H)?(o(),s(B,{key:0,type:"primary",icon:e(le),onClick:y},{default:a(()=>[de]),_:1},8,["icon"])):m("",!0),e(n).length?(o(),I("div",se,[(o(!0),I(U,null,w(e(n),(V,F)=>(o(),I("div",{class:"procedure-item",key:F},[R("div",ne,[v(h(e(K)(F+1))+"\u7EA7\u5BA1\u6838 ",1),e(n).length>1?(o(),s(P,{key:0,class:"el-icon-delete",onClick:f=>x(F),style:{cursor:"pointer"}},{default:a(()=>[d(e(ae))]),_:2},1032,["onClick"])):m("",!0)]),R("div",ie,[d(T,{modelValue:V.roleId,"onUpdate:modelValue":f=>V.roleId=f,placeholder:"\u8BF7\u9009\u62E9\u5BA1\u6838\u89D2\u8272",size:"mini",class:"select-custom",filterable:"",onChange:f=>u(e(n)[F],f)},{default:a(()=>[(o(!0),I(U,null,w(e(g),(f,t)=>(o(),s(N,{key:t,label:f.policyName,value:f.id,disabled:i(f.id)},null,8,["label","value","disabled"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","onChange"])])]))),128))])):m("",!0)])}}});var ce=M(pe,[["__scopeId","data-v-1469c946"]]);const me=v("\u590D\u5236"),_e=v("\u590D\u5236"),fe=v("\u91CD\u65B0\u751F\u6210"),ve=v("\u63D0\u4EA4"),ye=v("\u53D6\u6D88"),Ae=j({props:{id:{type:Number,default:null},mode:{type:String,default:""},menu:{required:!0,type:Object,default(){return{}}}},emits:["go-back","upsert-end"],setup(O,{emit:S}){const A=O,g=b(()=>C(A.mode==="edit")),n=b(()=>C(A.menu.fieldsJson)),L=b(()=>C(A.menu.apiJson)),y=oe(L.value),x=b(()=>Q(n.value,"auditType")),u=re({data:{rootId:0,pid:$,dirName:"",dirShowName:"",appId:"",appSecret:"",auditType:q,permitsRoleIds:"",selfAuditLevelVO:[],stroreAddrId:W,absPath:""},rules:{dirName:[{required:!0,message:"\u8BF7\u8F93\u5165\u76EE\u5F55\u540D\u79F0"},{min:3,max:30,message:"\u957F\u5EA6\u5728 3 \u5230 30 \u4E2A\u5B57\u7B26"},{validator:(t,l,E)=>{new RegExp("^[a-zA-Z0-9_]*$").test(l)?E():E(new Error("\u4EC5\u652F\u6301\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E0B\u5212\u7EBF"))}}],dirShowName:[{required:!0,message:"\u8BF7\u8F93\u5165\u4E2D\u6587\u540D\u79F0"},{min:3,max:30,message:"\u957F\u5EA6\u5728 3 \u5230 30 \u4E2A\u5B57\u7B26"}],selfAuditLevelVO:[{required:!0,message:"\u8BF7\u8BBE\u7F6E\u5BA1\u6838\u6D41\u7A0B"}]},roleIds:[],roleList:[]}),i=b(()=>u.data.pid===$),p=b(()=>u.data.auditType===ee),D=b(()=>u.data.auditType===q),B=z();function P(){A.id!==void 0&&A.id!==null?y("detail")({params:{id:A.id}}).then(t=>{u.data=t,u.roleIds=typeof t.permitsRoleIds=="string"?t.permitsRoleIds.split(",").map(Number):[]}):y("genAppIdSecret")().then(t=>{u.data.appId=t.appId,u.data.appSecret=t.appSecret}),y("camPolicyList")({params:{page:1,pageSize:9999}}).then(t=>{u.roleList=t.list})}console.log("apiServer====",y),P();function N(t){ue(t)}function T(t=[]){return i.value&&p.value&&t.some(l=>l.roleId===void 0)}function V(){B.value.validate(t=>{if(t){if(T(u.data.selfAuditLevelVO))return J.warning("\u8BF7\u5B8C\u5584\u5BA1\u6838\u6D41\u7A0B");F(u.data)}else J.warning("\u8868\u5355\u6709\u8BEF")})}function F(t){t.permitsRoleIds=u.roleIds.toString(),D.value&&(t.selfAuditLevelVO=[]),i.value&&(t.absPath=t.dirName),g.value?y("update")({data:t}).then(()=>S("upsert-end")):y("add")({data:t}).then(()=>S("upsert-end"))}function f(){y("updateAppIdSecret")({isJSON:!1,data:{dirName:u.data.dirName,oldAppId:u.data.appId,oldAppSecret:u.data.appSecret}}).then(t=>{u.data.appId=t.appId,u.data.appSecret=t.appSecret})}return(t,l)=>{const E=_("el-button"),c=_("el-form-item"),k=_("el-input"),Y=_("el-radio"),X=_("el-radio-group"),Z=_("el-transfer"),G=_("el-form");return o(),s(G,{class:"modelForm",ref_key:"modelFormEl",ref:B,model:e(u).data,rules:e(u).rules,"label-width":"120px"},{default:a(()=>[e(i)?(o(),s(c,{key:0,label:"AppID",prop:"appId"},{default:a(()=>[R("span",null,[v(h(e(u).data.appId),1),d(E,{type:"primary",text:"true",onClick:l[0]||(l[0]=r=>N(e(u).data.appId))},{default:a(()=>[me]),_:1})])]),_:1})):m("",!0),e(i)?(o(),s(c,{key:1,label:"AppSecret",prop:"appSecret"},{default:a(()=>[R("span",null,[v(h(e(u).data.appSecret),1),d(E,{type:"primary",text:"true",onClick:l[1]||(l[1]=r=>N(e(u).data.appSecret))},{default:a(()=>[_e]),_:1})]),e(g)?(o(),s(E,{key:0,type:"text",class:"ml10",onClick:f},{default:a(()=>[fe]),_:1})):m("",!0)]),_:1})):m("",!0),d(c,{label:"\u76EE\u5F55\u540D\u79F0",prop:"dirName"},{default:a(()=>[d(k,{modelValue:e(u).data.dirName,"onUpdate:modelValue":l[2]||(l[2]=r=>e(u).data.dirName=r),disabled:e(g),placeholder:"\u8BF7\u8F93\u5165\u82F1\u6587\u3001\u6570\u5B57\u3001\u4E0B\u5212\u7EBF\u7EC4\u6210\u7684\u5B57\u7B26\u4E32"},null,8,["modelValue","disabled"])]),_:1}),d(c,{label:"\u4E2D\u6587\u540D\u79F0",prop:"dirShowName"},{default:a(()=>[d(k,{modelValue:e(u).data.dirShowName,"onUpdate:modelValue":l[3]||(l[3]=r=>e(u).data.dirShowName=r)},null,8,["modelValue"])]),_:1}),e(i)?(o(),s(c,{key:2,label:"\u5BA1\u6838\u914D\u7F6E",prop:"auditType"},{default:a(()=>[d(X,{modelValue:e(u).data.auditType,"onUpdate:modelValue":l[4]||(l[4]=r=>e(u).data.auditType=r)},{default:a(()=>[(o(!0),I(U,null,w(e(x),r=>(o(),s(Y,{key:r.value,label:Number(r.value)},{default:a(()=>[v(h(r.label),1)]),_:2},1032,["label"]))),128))]),_:1},8,["modelValue"])]),_:1})):m("",!0),e(i)&&e(p)?(o(),s(c,{key:3,label:"\u5BA1\u6838\u6D41\u7A0B\u8BBE\u7F6E",prop:"selfAuditLevelVO"},{default:a(()=>[d(ce,{roles:e(u).roleList,"process-roles":e(u).data.selfAuditLevelVO},null,8,["roles","process-roles"])]),_:1})):m("",!0),e(i)?(o(),s(c,{key:4,label:"\u56DE\u8C03\u5730\u5740",prop:"callbackUrl"},{default:a(()=>[d(k,{modelValue:e(u).data.callbackUrl,"onUpdate:modelValue":l[5]||(l[5]=r=>e(u).data.callbackUrl=r)},null,8,["modelValue"])]),_:1})):m("",!0),e(i)?(o(),s(c,{key:5,label:"\u57DF\u540D\u914D\u7F6E",prop:"domainName"},{default:a(()=>[d(k,{modelValue:e(u).data.domainName,"onUpdate:modelValue":l[6]||(l[6]=r=>e(u).data.domainName=r)},null,8,["modelValue"])]),_:1})):m("",!0),e(i)?(o(),s(c,{key:6,label:"\u67E5\u9605\u6743\u9650"},{default:a(()=>[d(Z,{filterable:"","filter-placeholder":"\u8BF7\u8F93\u5165\u89D2\u8272\u540D\u79F0",titles:["\u6240\u6709\u89D2\u8272","\u5141\u8BB8\u67E5\u8BE2\u7684\u89D2\u8272"],props:{key:"id",label:"policyName"},modelValue:e(u).roleIds,"onUpdate:modelValue":l[7]||(l[7]=r=>e(u).roleIds=r),data:e(u).roleList},null,8,["modelValue","data"])]),_:1})):m("",!0),d(c,null,{default:a(()=>[d(E,{type:"primary",onClick:V},{default:a(()=>[ve]),_:1}),d(E,{onClick:l[8]||(l[8]=r=>S("go-back"))},{default:a(()=>[ye]),_:1})]),_:1})]),_:1},8,["model","rules"])}}});var be=M(Ae,[["__scopeId","data-v-4100bc7c"]]);export{be as default};