import{j as e,u as s}from"./fields-B4O9Q4Yk.js";import{u as _,a as p,R as w,L as j,d as $}from"./vendor-BwziPlmK.js";import{n as h,L as Y,s as B}from"./Layout-3l8w9I7o.js";import{P as R,u as E,B as b,s as f,h as I,r as O,i as q,a as X,f as A,m as V,c as G,j as v,L as U,A as W,w as z}from"./index-nWGa0jEF.js";import{B as H}from"./index-lTXmqbF6.js";import{T as N}from"./index-fks5oef0.js";import{P as J}from"./index-DfCGOGJX.js";import{F as K,E as Q}from"./FieldGroupsModal-B7uxkrLA.js";import{m as y}from"./metaTypes-FCOIhGU8.js";import{E as Z}from"./index-usWD7cYT.js";import{M as ee}from"./index-VDdQ26Pk.js";import{u as T,a as M,b as se,F as te}from"./index.esm-Czmjla35.js";import{u as oe}from"./index-tMNRH81H.js";import"./index-BFOynEgU.js";const P=({taxonomy:t})=>{const{reset:c}=T(),l=E(),d=_(),[o,r]=p.useState(!1),x=()=>{l(I(t)).then(u=>{const i=u.payload;i.success?(c(),d("/taxonomies"),r(!o),h.success(s("Taxonomy successfully deleted. The browser will refresh after 5 seconds.")),O(5e3)):h.error(i.error)}).catch(u=>{h.error(u)})},m=[e.jsx(b,{style:f.DANGER,onClick:()=>{x()},children:s("Yes, delete it")}),e.jsx(b,{style:f.SECONDARY,onClick:()=>{r(!o)},children:s("Return back to list")})];return e.jsxs(w.Fragment,{children:[e.jsx(ee,{title:s("Delete Taxonomy"),buttons:m,visible:o,children:e.jsx("div",{children:s("You are going to delete this taxonomy. Are you sure?")})}),e.jsx("a",{href:"#",onClick:u=>{u.preventDefault(),r(!o)},children:s("Delete")})]})};P.propTypes={taxonomy:R.string.isRequired};const S=p.memo(({record:t})=>{const{register:c}=T(),l=`elements.${t.slug}`;return e.jsx(w.Fragment,{children:e.jsxs("tr",{children:[e.jsx("td",{style:{width:"24px"},children:!t.isNative&&e.jsxs("label",{className:"checkbox",htmlFor:l,"data-cy":`select-${t.slug}`,children:[e.jsx("input",{type:"checkbox",id:l,name:l,defaultChecked:!1,...c(l)}),e.jsx("span",{})]})}),e.jsx("td",{children:t.slug}),e.jsx("td",{children:e.jsx(Z,{element:t})}),e.jsx("td",{children:q(t,"customPostTypes")&&t.customPostTypes.length>0?e.jsx(j,{to:`/assoc-post-taxonomy/${t.slug}`,children:s("Manage")}):e.jsx(j,{to:`/assoc-post-taxonomy/${t.slug}`,children:s("Associate")})}),e.jsx("td",{children:e.jsxs("div",{className:"i-flex-center s-8",children:[e.jsx(j,{to:`/register_meta?belongsTo=${y.TAXONOMY}&find=${t.slug}`,children:s("Create")}),e.jsx(K,{find:t.slug,belongsTo:y.TAXONOMY})]})}),e.jsx("td",{children:!t.isNative&&e.jsxs("div",{className:"i-flex-center s-8",children:[e.jsx("a",{href:`#/view_taxonomy/${t.slug}`,children:s("View")}),e.jsx("a",{href:`#/edit_taxonomy/${t.slug}`,children:s("Edit")}),e.jsx(P,{taxonomy:t.slug}),e.jsx(Q,{belongsTo:y.TAXONOMY,find:t.slug})]})})]})})});S.propTypes={record:R.object.isRequired};const ne=()=>{const{control:t,register:c}=T(),l=M({control:t,name:"elements"}),d=()=>{let o=0;for(const[r,x]of Object.entries(l))x===!0&&o++;return o};return e.jsxs("div",{className:"flex-between s-8 mb-24","data-cy":"bulk-actions",children:[e.jsxs("span",{children:[d()," ",s("Selected items")]}),e.jsxs("div",{className:"i-flex-center s-8",children:[e.jsxs("select",{name:"action","data-cy":"taxonomy-bulk-actions",className:"form-control sm",...c("action"),children:[e.jsx("option",{value:"",children:s("Select")}),e.jsx("option",{value:"delete",children:s("Delete")})]}),e.jsx(b,{testId:"taxonomy-bulk-actions",style:f.WHITE,size:"sm",children:s("Execute")})]})]})},ae=()=>{const t=document.globals,c=t.settings,[l]=oe(),d=p.useRef(),o=se({mode:"all"}),r=M({control:o.control,name:"elements"}),x=E(),{data:m,loading:u}=X(a=>a.fetchTaxonomies),{page:i}=$(),g=c.length>0&&A(c,"key","records_per_page")!==""?A(c,"key","records_per_page").value:20,k=Math.ceil(m.count/g);p.useEffect(()=>{V(s("Registered Taxonomies")),G("#/taxonomies"),x(v({page:i||1,perPage:g}))},[i]),p.useEffect(()=>{(()=>{if(!r)return!1;let n=0;for(const[re,D]of Object.entries(r))D===!0&&n++;return n===Object.entries(r).length})()?d.current.checked=!0:d.current&&(d.current.checked=!1)},[r]);const C=()=>{if(!r)return!1;for(const[a,n]of Object.entries(r))if(n===!0)return!0;return!1},F=a=>{o.reset(),a.belongsTo=y.TAXONOMY,z("bulkActionsAction",a).then(n=>{if(n.success===!0)switch(a.action){case"delete":h.success(s("Taxonomy successfully deleted. The browser will refresh after 5 seconds.")),o.resetField("elements"),B(),x(v({page:i||1,perPage:g})),O(5e3);break}else h.error(n.error)}).catch(n=>{console.error(n),h.error(s("Unknown error, please retry later"))})},L=[e.jsx(H,{style:f.PRIMARY,to:"/register_taxonomy",children:s("Register new Taxonomy")})];return u?e.jsx(U,{}):e.jsx(te,{...o,children:e.jsx("form",{onSubmit:o.handleSubmit(F),children:e.jsxs(Y,{title:s("Registered Taxonomies"),actions:L,crumbs:[{label:s("Registered Taxonomies")}],children:[e.jsx("div",{ref:l,children:C()&&e.jsx(ne,{})}),m.records&&m.records.length>0?e.jsx("div",{className:"responsive",children:e.jsxs("table",{"data-cy":"cpt-table",className:`acpt-table with-shadow ${t.is_rtl?"rtl":""}`,children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{width:"24px"},children:e.jsxs("label",{"data-cy":"select-all",className:"checkbox",htmlFor:"all",children:[e.jsx("input",{ref:d,type:"checkbox",id:"all",defaultChecked:!1,onClick:a=>{m.records.filter(n=>n.isNative===!1).map(n=>{o.setValue(`elements.${n.slug}`,a.currentTarget.checked)})}}),e.jsx("span",{})]})}),e.jsx("th",{children:e.jsx(N,{tip:s("Taxonomy slug. The post name/slug. Used for various queries for taxonomy content."),label:s("Slug")})}),e.jsx("th",{children:s("Type")}),e.jsx("th",{children:e.jsx(N,{tip:s("Associate custom post types here"),label:s("Associated post types")})}),e.jsx("th",{children:s("Field groups")}),e.jsx("th",{children:s("Actions")})]})}),e.jsx("tbody",{children:m.records&&m.records.map(a=>e.jsx(S,{record:a},a.id))}),k>1&&e.jsx("tfoot",{children:e.jsx("tr",{children:e.jsx("td",{colSpan:7,children:e.jsx(J,{currentPage:i?parseInt(i):1,totalPages:k,baseLink:"/taxonomies"})})})})]})}):e.jsxs(W,{style:f.SECONDARY,children:[s("No taxonomies found.")," ",e.jsx(j,{to:"/register_taxonomy",children:s("Register the first one")}),"!"]})]})})})};ae.propTypes={};export{ae as default};
