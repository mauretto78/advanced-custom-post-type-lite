import{j as e,u as t}from"./fields-B4O9Q4Yk.js";import{a as N,R as k,d as ve,u as be}from"./vendor-BwziPlmK.js";import{u as w,c as I,a as q,g as ge,b as ye,F as Ne}from"./index.esm-Czmjla35.js";import{u as S,B as C,s as R,ah as Re,P as o,ai as X,I as T,a as E,aj as De,ak as J,al as P,F as Z,G as Ce,am as we,an as Se,ao as Fe,w as qe,Q as $,ap as ee,A as G,aq as Te,ar as se,aa as ke,m as Ae,c as Ee,as as Ie,at as Le,L as Ve,e as U,au as Oe}from"./index-DD5Vwil-.js";import{a as W,n as O,B as Me,L as Pe}from"./Layout-Ov5zB63g.js";import{M}from"./index-B4ZmOmMT.js";import{M as $e,B as Ge,u as _,C as B,S as Y,a as We,L as V,c as te,b as ae}from"./index-BanzpKKb.js";import{I as H}from"./InputHidden-C1Nn0Dsd.js";import{I as L}from"./Input-CzZY9gE5.js";import{T as A}from"./index-DxOnFDlY.js";import{S as _e}from"./Select-DX2ME-Jr.js";import{P as Be}from"./index-oSXH07LE.js";const Ye=()=>{const s=S(),{setValue:c}=w(),[a,i]=N.useState(!1),n=[e.jsx(C,{style:R.SUCCESS,onClick:d=>{d.preventDefault(),s(Re()),c("fields",[]),i(!a)},children:t("Yes")}),e.jsx(C,{style:R.DANGER,onClick:d=>{d.preventDefault(),i(!a)},children:t("No")})];return e.jsxs(k.Fragment,{children:[e.jsx(M,{title:t("Confirm deleting all"),visible:a,buttons:n,children:t("Are you sure?")}),e.jsx(C,{style:R.DANGER,onClick:d=>{d.preventDefault(),i(!a)},children:t("Delete all")})]})},le=({field:s,index:c})=>{const a=S(),{control:i}=w(),{remove:n}=I({control:i,name:"fields"}),[d,x]=N.useState(!1),m=[e.jsx(C,{style:R.SUCCESS,onClick:p=>{p.preventDefault(),a(X({field:s})),n(c),x(!d)},children:t("Yes")}),e.jsx(C,{style:R.DANGER,onClick:p=>{p.preventDefault(),x(!d)},children:t("No")})];return e.jsxs(k.Fragment,{children:[e.jsx(M,{title:t("Confirm deleting option"),visible:d,buttons:m,children:t("Are you sure?")}),e.jsx("a",{href:"#",onClick:p=>{p.preventDefault(),x(!d)},children:e.jsx(T,{icon:"bx-trash",width:18})})]})};le.propTypes={index:o.number.isRequired,field:o.object.isRequired};const z=({element:s})=>{const c=S(),{selectedElements:a}=E(n=>n.productDataFieldsState),i=()=>a.filter(d=>d.id===s.id).length>0;return e.jsx(A,{label:e.jsxs("label",{className:"checkbox",htmlFor:`select-${s.id}`,style:{top:"3px"},children:[e.jsx("input",{id:`select-${s.id}`,type:"checkbox",checked:i(),onChange:n=>{c(De({element:s,selected:n.target.checked}))}}),e.jsx("span",{})]}),icon:!1,tip:t(i()?"Deselect this element":"Select this element")})};z.propTypes={element:o.object.isRequired};const ie=({field:s,view:c,listeners:a,attributes:i,index:n,formId:d})=>{const{formState:{errors:x},control:m}=w(),p=q({control:m,name:d("name")}),l=q({control:m,name:d("type")}),u=q({control:m,name:d("isRequired")}),{append:f}=I({control:m,name:"fields"}),j=S(),{closedElements:r}=E(b=>b.productDataFieldsState),v=()=>r.filter(D=>D===page.id).length===1,g=()=>{const b=d("name"),D=ge(x,b);return D?e.jsx("span",{className:"invalid-feedback",children:t(D.message)}):p||s.name},h=()=>l||s.type,y=()=>{Ce(s.id),v()?j(we({id:s.id})):j(Se({id:s.id}))};return e.jsxs("div",{className:"flex-between s-8 for-xs",children:[e.jsxs("span",{className:"i-flex-center s-8",children:[c==="list"&&e.jsx("span",{className:"cursor-move top-2 handle",...i,...a,children:e.jsx(T,{icon:"bx:dots-vertical-rounded",color:"#777",width:18})}),e.jsx(z,{element:{id:s.id}}),e.jsx("h3",{children:g()}),e.jsx("span",{className:"color-gray",children:e.jsx($e,{fieldType:h(),css:"top-2"})}),e.jsx("span",{className:"i-flex-center s-8",children:e.jsx(A,{label:e.jsx(k.Fragment,{children:e.jsx(Ge,{control:m,defaultValue:typeof u=="boolean"?u:s.isRequired,errors:x,icon:"foundation:asterisk",id:d("isRequired")})}),tip:t("Field required"),icon:!1})})]}),e.jsxs("span",{className:"i-flex-center s-8",children:[e.jsx(A,{label:e.jsx("a",{href:"#",onClick:b=>{b.preventDefault();const D=J(s);j(P({field:D})),f(D),Z(1).then(()=>{W(D.id)})},children:e.jsx(T,{icon:"bx:duplicate",width:18})}),tip:t("Duplicate this meta field"),icon:!1}),e.jsx(A,{label:e.jsx(le,{index:n,field:s}),tip:t("Delete this meta field"),icon:!1}),c==="list"&&e.jsx(A,{label:e.jsx("a",{href:"#",onClick:b=>{b.preventDefault(),y()},children:e.jsx(T,{icon:"bx:expand-alt",width:18})}),tip:t("Hide/show this meta field"),icon:!1})]})]})};ie.propTypes={index:o.number.isRequired,field:o.object.isRequired,listeners:o.func,attributes:o.func,formId:o.func.isRequired,view:o.oneOf(["list","tabular"]).isRequired};const He="Checkbox",ne="Radio",re="Select",de="Text",ze="Textarea",Ke=[{value:de,label:"Text"},{value:ze,label:"Textarea"},{value:re,label:"Select"},{value:He,label:"Checkbox"},{value:ne,label:"Radio"}],ce=({fieldIndex:s,optionIndex:c})=>{const a=S(),i=()=>`fields.${s}.options`,{control:n}=w(),{remove:d}=I({control:n,name:i()}),[x,m]=N.useState(!1),p=[e.jsx(C,{style:R.SUCCESS,onClick:l=>{l.preventDefault(),a(Fe({fieldIndex:s,optionIndex:c})),d(c),m(!x)},children:t("Yes")}),e.jsx(C,{style:R.DANGER,onClick:l=>{l.preventDefault(),m(!x)},children:t("No")})];return e.jsxs("span",{children:[e.jsx(M,{title:t("Confirm deleting option"),visible:x,buttons:p,children:t("Are you sure?")}),e.jsx("a",{href:"#",onClick:l=>{l.preventDefault(),m(!x)},children:e.jsx(A,{icon:!1,tip:t("Delete"),label:e.jsx(T,{icon:"bx-minus"})})})]})};ce.propTypes={fieldIndex:o.number.isRequired,optionIndex:o.number.isRequired};const oe=N.memo(({index:s,fieldIndex:c,fieldId:a,option:i})=>{const n=F=>`fields.${c}.options.${s}.${F}`,{register:d,formState:{errors:x},control:m,setValue:p}=w(),l=q({control:m,name:n("value")}),u=q({control:m,name:n("label")}),{attributes:f,listeners:j,setNodeRef:r,transform:v}=_({id:i.id}),g={transform:B.Translate.toString(v)},[h,y]=N.useState(i.label===i.value),b=()=>l||(i.value?i.value:null),D=()=>u||(i.label?i.label:null);return e.jsxs("div",{className:"i-flex-center s-8",style:g,ref:r,children:[e.jsx(H,{id:n("id"),value:i.id,register:d}),e.jsx("span",{className:"cursor-move top-2 handle",...f,...j,children:e.jsx(T,{icon:"bx:dots-vertical-rounded",color:"#777",width:18})}),e.jsxs("span",{className:"i-flex-center s-24 w-100",children:[e.jsx("span",{className:"w-100",children:e.jsx(L,{id:n("label"),register:d,errors:x,defaultValue:D(),onChangeCapture:F=>{h&&p(n("value"),F.target.value)},onClick:F=>{i.label&&F.target.value==="option"&&p(n("label"),null)},validate:{required:t("This field is mandatory"),maxLength:{value:255,message:"max length is 255"}}})}),e.jsx("span",{children:e.jsx("button",{type:"button",className:`acpt-btn-switch ${h?"active":""}`,onClick:F=>{F.preventDefault(),y(!h)},children:e.jsx(T,{icon:"bx:bx-link",width:"18px"})})}),e.jsx("span",{className:"w-100",children:e.jsx(L,{id:n("value"),register:d,errors:x,defaultValue:b(),onChangeCapture:F=>{h&&p(n("label"),F.target.value)},onClick:F=>{i.value&&F.target.value==="option"&&p(n("value"),null)},validate:{required:t("This field is mandatory"),maxLength:{value:255,message:"max length is 255"}}})}),e.jsx(ce,{fieldIndex:c,optionIndex:s})]})]})});oe.propTypes={fieldId:o.string.isRequired,index:o.number.isRequired,fieldIndex:o.number.isRequired,option:o.object.isRequired};const ue=({fieldId:s,fieldIndex:c})=>{const a=S(),[i,n]=N.useState(!1),[d,x]=N.useState(null),[m,p]=N.useState(null),[l,u]=N.useState(!1);N.useEffect(()=>{l&&(n(!0),qe("fetchDatasetsAction",{}).then(r=>{let v=[{value:null,label:t("Select"),items:[]}];r.records&&r.records.map(g=>{v.push({value:g.id,label:g.label?g.label:g.name,items:g.items?g.items:[]})}),x(v),n(!1)}).catch(r=>{console.error(r.message),n(!1)}))},[l]);const f=()=>{const r=d.filter(g=>g.value===m);if(r.length!==1)return;r[0].items.map(g=>{const h={id:$(),fieldId:s,label:g.label,value:g.value};a(ee({fieldIndex:c,option:h}))}),O.success(t("Dataset loaded correctly")),u(!l)},j=[e.jsx(C,{style:R.PRIMARY,disabled:m===null,onClick:r=>{r.preventDefault(),f()},children:t("Load dataset")}),e.jsx(C,{style:R.DANGER,onClick:r=>{r.preventDefault(),u(!l)},children:t("Close")})];return e.jsxs(k.Fragment,{children:[e.jsx(M,{title:t("Load dataset"),visible:l,padding:0,buttons:j,children:i?e.jsx("div",{className:"p-24",children:t("Loading...")}):e.jsx("div",{className:"p-24",children:e.jsx("select",{id:"dataset",className:"form-control default",onChangeCapture:r=>p(r.target.value),children:d&&d.map(r=>e.jsx("option",{value:r.value,children:r.label}))})})}),e.jsx("a",{href:"#",onClick:r=>{r.preventDefault(),u(!l)},children:t("Load dataset")})]})};ue.propTypes={fieldId:o.string.isRequired,fieldIndex:o.number.isRequired};const me=({fieldId:s,fieldIndex:c,options:a})=>{const i=S(),n=()=>`fields.${c}.options`,{control:d}=w(),{move:x}=I({control:d,name:n()}),m=l=>{const{active:u,over:f}=l;if(u.id===f.id)return;const j=a.findIndex(v=>v.id===u.id),r=a.findIndex(v=>v.id===f.id);x(j,r)},p=()=>{const l={id:$(),fieldId:s,label:"option",value:"option"};i(ee({fieldIndex:c,option:l}))};return e.jsx("div",{children:e.jsxs("fieldset",{className:"acpt-fieldset",children:[e.jsx("legend",{children:t("Option list")}),a&&a.length>0?e.jsx(Y,{onDragEnd:m,items:a,children:e.jsx("div",{className:"flex-column s-24",children:a&&a.map((l,u)=>e.jsx(oe,{index:u,fieldIndex:c,fieldId:s,option:l}))})}):e.jsx(G,{style:R.WARNING,children:t('No options already created. Create the first one now by clicking the button "Add option"!')}),e.jsxs("div",{className:"i-flex-center s-8 mt-24",children:[e.jsx("a",{href:"#",onClick:l=>{l.preventDefault(),p()},children:t("Add option")}),e.jsx(ue,{fieldId:s,fieldIndex:c})]})]})})};me.propTypes={fieldId:o.string.isRequired,fieldIndex:o.number.isRequired,options:o.array.isRequired};const K=({field:s,index:c,view:a})=>{const{attributes:i,listeners:n,setNodeRef:d,transform:x}=_({id:s.id}),m={transform:B.Translate.toString(x)};S();const{closedElements:p}=E(b=>b.productDataFieldsState),{register:l,formState:{errors:u},control:f,setValue:j}=w(),r=b=>`fields.${c}.${b}`,v=q({control:f,name:r("type")}),g=()=>v||s.type,h=b=>b===re||b===ne,y=()=>p.filter(D=>D===s.id).length===1;return e.jsx(We,{id:s.id,size:{type:"product-data-field",children:0},isClosed:y(),element:e.jsxs("div",{id:s.id,className:`bg-white b-rounded ${a==="list"?"p-24":""}`,ref:a==="list"?d:null,style:a==="list"?m:null,children:[e.jsx(H,{id:r("id"),value:s.id,register:l}),e.jsx("div",{className:a==="tabular"||!y()&&a==="list"?"mb-24":"",children:e.jsx(ie,{index:c,formId:r,view:a,field:s,attributes:i,listeners:n})}),e.jsx("div",{className:`${y()?"hidden":""}`,children:e.jsxs("div",{className:"flex-column s-24",children:[e.jsxs("div",{className:"container align-end",children:[e.jsxs("div",{className:"col-6",children:[e.jsx(V,{isRequired:!0,id:r("name"),label:t("Name")}),e.jsx(L,{id:r("name"),register:l,errors:u,placeholder:t("Name"),defaultValue:s.name,onClick:b=>{s.name&&b.target.value==="field"&&j(r("name"),null)},validate:{required:t("This field is mandatory"),maxLength:{value:255,message:"max length is 255"}}})]}),e.jsxs("div",{className:"col-6",children:[e.jsx(V,{isRequired:!0,id:r("type"),label:t("Field type")}),e.jsx(_e,{register:l,errors:u,id:r("type"),values:Ke})]})]}),e.jsxs("div",{className:"container align-end",children:[e.jsxs("div",{className:"col-6",children:[e.jsx(V,{isRequired:!1,id:r("defaultValue"),label:t("Default value")}),e.jsx(L,{id:r("defaultValue"),register:l,errors:u,placeholder:t("Default value"),defaultValue:s.defaultValue,validate:{maxLength:{value:255,message:"max length is 255"}}})]}),e.jsxs("div",{className:"col-6",children:[e.jsx(V,{isRequired:!1,id:r("description"),label:t("A brief description")}),e.jsx(L,{id:r("description"),register:l,errors:u,placeholder:t("A brief description"),defaultValue:s.description,validate:{maxLength:{value:255,message:"max length is 255"}}})]})]}),h(g())&&e.jsx(me,{fieldId:s.id,fieldIndex:c,options:s.options?s.options:[]})]})})]})})};K.propTypes={view:o.string.isRequired,index:o.number.isRequired,field:o.object.isRequired};const pe=({field:s,index:c})=>{const{control:a}=w(),i=q({control:a,name:`fields.${c}.name`});return e.jsx(k.Fragment,{children:e.jsxs("div",{className:"tree-el flex-between s-8",style:{"--level":0},children:[e.jsx("span",{className:"text-ellipsis cursor-pointer",onClick:n=>{n.preventDefault(),W(`lazy-${s.id}`)},children:i||s.name}),e.jsx(Me,{style:R.SECONDARY,children:"F"})]})})};pe.propTypes={field:o.object.isRequired,index:o.number.isRequired};const he=({fields:s})=>{const a=document.globals.globals;return s.length===0?null:e.jsxs("div",{className:"b-rounded with-shadow bg-white p-24",children:[e.jsx("h3",{className:"mb-24 flex-between s-8",children:e.jsx("span",{className:"text-ellipsis cursor-pointer",children:t("product data fields")})}),e.jsx("div",{className:`tree ${a.is_rtl===!0?"rtl":""}`,children:s.map((i,n)=>e.jsx(pe,{index:n,field:i}))})]})};he.propTypes={fields:o.array.isRequired};const Q=({view:s,setFieldTab:c})=>{const a=S(),{selectedElements:i}=E(j=>j.productDataFieldsState),{control:n,setValue:d,getValues:x}=w(),m=q({control:n,name:"fields"}),p=N.useRef(null),[l,u]=N.useState(null),f=()=>{i.map(j=>{const r=m.findIndex(g=>g.id===j.id),v=m[r];switch(l){case"duplicate":const g=J(v);m.push(g),d("fields",m),a(P({field:g}));break;case"delete":const h={...v},y=x("fields").filter(b=>b.id!==j.id);d("fields",y),c&&c(0),a(X({field:h}));break}}),(l==="delete"||l==="duplicate")&&a(Te()),p.current.value=""};return e.jsx(k.Fragment,{children:i.length>0&&e.jsxs("div",{className:"flex-between mb-24",children:[e.jsxs("div",{children:[i.length," ",t("Selected items")]}),e.jsxs("div",{className:"i-flex-center s-8",children:[e.jsxs("select",{ref:p,className:"form-control sm",onChange:j=>{u(j.target.value!==""?j.target.value:null)},children:[e.jsx("option",{value:"",children:t("Select")}),e.jsx("option",{value:"duplicate",children:t("Duplicate")}),e.jsx("option",{value:"delete",children:t("Delete")})]}),e.jsx(C,{style:R.WHITE,size:"sm",disabled:l===null,onClick:j=>{j.preventDefault(),f()},children:t("Execute")})]})]})})};Q.propTypes={view:o.oneOf(["tab","list"]).isRequired,setFieldTab:o.func};const xe=({fields:s,view:c,setView:a,setActiveTab:i})=>{const n=S(),{control:d}=w(),{move:x}=I({control:d,name:"fields"}),m=p=>{const{active:l,over:u}=p;if(l.id===u.id)return;const f=s.findIndex(v=>v.id===l.id),j=s.findIndex(v=>v.id===u.id),r=ae(s,f,j);x(f,j),n(se(r))};return e.jsxs("div",{className:"container",children:[e.jsx("div",{className:"col-3 flex-column s-24 hidden-xs sticky",style:{top:"130px"},children:e.jsx(he,{fields:s})}),e.jsxs("div",{className:"col-9",children:[e.jsxs("div",{className:"flex-between mb-24 s-8 for-xs",children:[e.jsx("h3",{children:t("Manage product data fields")}),e.jsx("div",{className:"i-flex-center s-8",children:e.jsx(te,{localStorageKey:"wc_fields_manage_view",setView:a,view:c,choices:["list","tabular"]})})]}),e.jsx(Q,{view:"list"}),s.length>0?e.jsx(Y,{onDragEnd:m,items:s,children:e.jsx("div",{className:"flex-column s-24",children:s.map((p,l)=>e.jsx(K,{index:l,view:"list",field:p},p.id))})}):e.jsx(G,{style:R.WARNING,children:t('No fields already created. Create the first one now by clicking the button "Add field"!')})]})]})};xe.propTypes={view:o.string.isRequired,setView:o.func.isRequired,fields:o.array.isRequired,setActiveTab:o.func.isRequired};const fe=({index:s,field:c,activeTab:a=0,onClick:i})=>{const{control:n}=w(),d=q({control:n,name:`fields.${s}.name`}),{attributes:x,listeners:m,setNodeRef:p,transform:l}=_({id:c.id}),u={transform:B.Translate.toString(l)};return e.jsxs("div",{id:c.id,className:`flex-between s-8 tab ${a===s?"active":""}`,ref:p,style:u,onClick:()=>{i&&i(s)},children:[e.jsx("span",{className:"cursor-move top-2 handle",...x,...m,children:e.jsx(T,{icon:"bx:dots-vertical-rounded",color:"#777",width:18})}),e.jsx(z,{element:{id:c.id}}),e.jsx("span",{className:"text-ellipsis",children:d||c.name})]})};fe.propTypes={index:o.number.isRequired,field:o.object.isRequired,activeTab:o.number,onClick:o.func};const je=({fields:s,view:c,setView:a,activeTab:i,setActiveTab:n})=>{const d=S(),{control:x}=w(),{move:m}=I({control:x,name:"fields"}),p=u=>{const{active:f,over:j}=u;if(f.id===j.id)return;const r=s.findIndex(h=>h.id===f.id),v=s.findIndex(h=>h.id===j.id),g=ae(s,r,v);m(r,v),n(v),d(se(g))},l=u=>{n(u)};return e.jsxs(k.Fragment,{children:[e.jsxs("div",{className:"flex-between mb-24",children:[e.jsx("h3",{children:t("Manage product data fields")}),e.jsx(te,{localStorageKey:"wc_fields_manage_view",setView:a,view:c,choices:["list","tabular"]})]}),e.jsx(Q,{view:"tab",setFieldTab:n}),s.length>0?e.jsxs("div",{className:"acpt-horizontal-tabs",children:[e.jsx("div",{className:"tablist",children:e.jsx(Y,{onDragEnd:p,items:s,children:s.map((u,f)=>e.jsx(fe,{index:f,field:u,activeTab:i,onClick:l}))})}),s.map((u,f)=>e.jsx(k.Fragment,{children:f===i&&e.jsx("div",{className:"tab-panel",children:e.jsx(K,{field:u,index:f,view:c})})}))]}):e.jsx(G,{style:R.WARNING,children:t('No fields already created. Create the first one now by clicking the button "Add field"!')})]})};je.propTypes={view:o.string.isRequired,setView:o.func.isRequired,fields:o.array.isRequired,activeTab:o.number.isRequired,setActiveTab:o.func.isRequired};const rs=({})=>{const s=S(),{loading:c}=E(h=>h.fetchProductDataFields),{fields:a}=E(h=>h.productDataFieldsState),{id:i}=ve(),[n,d]=N.useState(!1),[x,m]=N.useState(ke("wc_fields_manage_view")),[p,l]=N.useState(0),u=be(),f=ye({mode:"all"});N.useEffect(()=>{Ae(t("Manage product data fields")),Ee("#/"),s(Ie(i)).then(h=>{s(Le(h.payload)),h.payload&&h.payload.map((y,b)=>{f.setValue(`fields.${b}`,y)})}).catch(h=>{console.error(h),d(!0)})},[]);const j=()=>{const h=$();s(P({field:{id:h,name:"field",type:de,isRequired:!1,description:null,defaultValue:null,options:[]}})),l(a.length),Z(1).then(()=>{W(h)})},r=()=>!(f.formState.errors&&f.formState.errors.pages),v=h=>{s(Oe(h)).then(y=>{const b=y.payload;b.success?(u(`/product-data/product/fields/${i}`),O.success(t("WooCommerce product data fields successfully saved"))):O.error(b.error)}).catch(y=>{O.error(y)})},g=[e.jsx(C,{style:R.SECONDARY,onClick:h=>{h.preventDefault(),j()},children:t("Add field")}),e.jsx(C,{disabled:!r(),style:R.PRIMARY,children:t("Save")}),e.jsx(Ye,{})];return c?e.jsx(Ve,{}):n?e.jsx(Be,{}):e.jsx(Ne,{...f,children:e.jsx("form",{onSubmit:f.handleSubmit(v),children:e.jsxs(Pe,{title:t("Manage option pages"),actions:g,crumbs:[{label:t("Registered Custom Post Types"),link:"/"},{label:t("WooCommerce product data"),link:"/product-data/product"},{label:t("product data fields")}],children:[e.jsx(H,{register:f.register,id:"productDataId",value:i}),x==="list"?e.jsx(xe,{setActiveTab:l,view:x,setView:m,fields:U(a)?[]:a}):e.jsx(je,{activeTab:p,setActiveTab:l,view:x,setView:m,fields:U(a)?[]:a})]})})})};export{rs as default};
