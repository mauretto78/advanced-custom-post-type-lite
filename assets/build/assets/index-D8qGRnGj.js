import{j as e,u as t}from"./fields-lEbqKXfy.js";import{a as j,R as A,L as x,u as F}from"./vendor-Bd2ZL6QG.js";import{s as g,n as m,a as W,f as M,L as B}from"./Layout-CjJK5OT4.js";import{P as p,u as _,B as P,s as f,au as $,r as C,w as v,b as I,g as D,m as V,av as q,L as U,n as R,A as Y,o as G}from"./index-BQ3U1-jG.js";import{B as O}from"./index--9-3Sden.js";import{B as z,P as H}from"./index-sBWX2MB_.js";import{w as J}from"./woocommerce_icons-Ba_AIm0r.js";import{B as K}from"./index-B8hOVkA-.js";import{W as Q}from"./index-CFoB6rR7.js";import{M as X}from"./index-DYtzcsOi.js";import{u as Z,a as ee,b as te,F as se}from"./index.esm-VK9FF9DZ.js";import"./index-BixwEkkR.js";import"./metaTypes-Bb9tjSPe.js";const E=({id:s,page:u,perPage:y})=>{const h=_(),[a,r]=j.useState(!1),c=()=>{h($(s)).then(n=>{const i=n.payload;i.success?(r(!a),g("WooCommerce product data successfully deleted"),C()):m.error(i.error)}).catch(n=>{m.error(n)})},d=[e.jsx(P,{style:f.DANGER,onClick:()=>{c()},children:t("Yes, delete it")}),e.jsx(P,{style:f.SECONDARY,onClick:()=>{r(!a)},children:t("Return back to list")})];return e.jsxs(A.Fragment,{children:[e.jsx(X,{title:t("Delete WooCommerce product data"),buttons:d,visible:a,children:e.jsx("div",{children:t("You are going to delete WooCommerce this product data. Are you sure?")})}),e.jsx("a",{className:`color-${f.DANGER}`,href:"#",onClick:n=>{n.preventDefault(),r(!a)},children:t("Delete")})]})};E.propTypes={id:p.string.isRequired,page:p.number.isRequired,perPage:p.number.isRequired};const N=j.memo(({record:s,page:u,perPage:y})=>{const{register:h}=Z(),a=`elements.${s.id}`,r=()=>{v("duplicateAction",{belongsTo:"woo_product_data",find:s.id}).then(c=>{c.success===!0?(g("WooCommerce product data successfully duplicated."),W(),C()):m.error(c.error)}).catch(c=>{console.error(c),m.error(t("Unknown error, please retry later"))})};return e.jsx(A.Fragment,{children:e.jsxs("tr",{children:[e.jsx("td",{style:{width:"24px"},children:e.jsxs("label",{className:"checkbox",htmlFor:a,children:[e.jsx("input",{type:"checkbox",id:a,name:a,defaultChecked:!1,...h(a)}),e.jsx("span",{})]})}),e.jsx("td",{children:e.jsx("span",{className:`wcicon-${typeof s.icon=="object"?s.icon.icon:J[s.icon]}`,style:{color:"#777",fontSize:"18px"}})}),e.jsx("td",{children:s.name}),e.jsx("td",{children:e.jsx(K,{status:s.showInUI})}),e.jsx("td",{children:e.jsx(Q,{visibility:s.visibility})}),e.jsx("td",{children:s.fields.length>0?e.jsx(x,{to:`/product-data/product/fields/${s.id}`,children:t("Manage")}):e.jsx(x,{to:`/product-data/product/fields/${s.id}`,children:t("Create")})}),e.jsx("td",{children:e.jsxs("div",{className:"i-flex-center s-8",children:[e.jsx(x,{to:`/product-data/product/view/${s.id}`,children:t("View")}),e.jsx(x,{to:`/product-data/product/edit/${s.id}`,children:t("Edit")}),e.jsx("a",{href:"#",onClick:c=>{c.preventDefault(),r()},children:t("Duplicate")}),e.jsx(E,{id:s.id,page:u,perPage:y})]})})]})})});N.propTypes={page:p.number,perPage:p.number,record:p.object.isRequired};const je=({})=>{const s=document.globals,u=s.settings,[y,h]=j.useReducer(o=>o+1,0),a=j.useRef(),r=ee({mode:"all"});te({control:r.control,name:"elements"});const c=_(),{data:d,loading:n}=I(o=>o.fetchWooCommerceProductData),{page:i}=F(),k=u.length>0&&D(u,"key","records_per_page")!==""?D(u,"key","records_per_page").value:20,w=Math.ceil(d.count/k);j.useEffect(()=>{V(t("WooCommerce product data")),c(q({page:i||1,perPage:k})).then(o=>{M()})},[i]);const L=[e.jsx(O,{to:"/product-data/product/add",style:f.PRIMARY,children:t("Add product data")})],T=o=>{d.records.filter(l=>!R(l.id,"woo_product_data")).map(l=>{r.setValue(`elements.${l.id}`,o)})};document.addEventListener("restoredElement",function(){h()});const S=o=>{r.reset(),o.belongsTo="woo_product_data";const l=o.action;if(l)switch(l){case"hide":G(o);break;case"delete":case"duplicate":v("bulkActionsAction",o).then(b=>{if(b.success===!0){switch(l){case"delete":g("WooCommerce product data successfully deleted");break;case"duplicate":g("WooCommerce product data successfully duplicated");break}r.resetField("elements"),W(),C()}else m.error(b.error)}).catch(b=>{console.error(b),m.error(t("Unknown error, please retry later"))})}};return n?e.jsx(U,{}):e.jsx(se,{...r,children:e.jsx("form",{onSubmit:r.handleSubmit(S),children:e.jsxs(B,{title:t("WooCommerce product data"),actions:L,crumbs:[{label:t("Registered Custom Post Types"),link:"/"},{label:t("WooCommerce product data")}],children:[e.jsx(z,{belongsTo:"woo_product_data"}),d.records&&d.records.length>0?e.jsx("div",{className:"responsive with-shadow b-rounded",children:e.jsxs("table",{className:`acpt-table ${s.is_rtl?"rtl":""}`,children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{width:"24px"},children:e.jsxs("label",{className:"checkbox",htmlFor:"all",children:[e.jsx("input",{ref:a,type:"checkbox",id:"all",defaultChecked:!1,onClick:o=>{d.records.map(l=>T(o.currentTarget.checked))}}),e.jsx("span",{})]})}),e.jsx("th",{}),e.jsx("th",{children:t("Name")}),e.jsx("th",{children:t("Show on UI")}),e.jsx("th",{children:t("Visibility")}),e.jsx("th",{children:t("Fields")}),e.jsx("th",{children:t("Actions")})]})}),e.jsx("tbody",{children:d.records&&d.records.map(o=>{if(!R(o.id,"woo_product_data"))return e.jsx(N,{record:o,page:i||1,perPage:k},o.id)})}),w>1&&e.jsx("tfoot",{children:e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:e.jsx(H,{currentPage:i?parseInt(i):1,totalPages:w,baseLink:"/product-data/product"})})})})]})}):e.jsxs(Y,{style:f.SECONDARY,children:[t("No product data found.")," ",e.jsx(x,{to:"/product-data/product/add",children:t("Register the first one")}),"!"]})]})})})};export{je as default};
