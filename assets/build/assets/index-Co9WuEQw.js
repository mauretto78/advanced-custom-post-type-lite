import{j as s,u as e}from"./fields-lEbqKXfy.js";import{u as f,a as T,L as b}from"./vendor-Bd2ZL6QG.js";import{P as m,u as j,e as P,b as x,m as C,f as k,c as A,L as R,s as u,i as $,d as E,A as L}from"./index-BQ3U1-jG.js";import{n as p,L as w}from"./Layout-CjJK5OT4.js";import{T as h}from"./index-jQfJPT21.js";import{E as N}from"./index-Bf29vF0I.js";import{B as S}from"./index--9-3Sden.js";const y=({record:t,postType:r,defaultChecked:c})=>{const i=j(),d=n=>{i(P({postType:r,taxonomies:[n]})).then(l=>{const o=l.payload;o.success&&p.success(e("Custom post type was associated to selected taxonomies")),o.error&&p.error(error)}).catch(l=>console.error(l))};return s.jsxs("tr",{children:[s.jsx("td",{children:t.slug}),s.jsx("td",{children:s.jsx(N,{element:t})}),s.jsx("td",{children:t.singular}),s.jsx("td",{children:t.plural}),s.jsx("td",{children:s.jsxs("label",{"data-cy":`assoc-${t.slug}-to-${r}`,className:"checkbox",htmlFor:t.id,children:[s.jsx("input",{id:t.id,type:"checkbox",defaultChecked:c,onChange:n=>d({id:t.id,checked:n.target.checked})}),s.jsx("span",{})]})})]})};y.propTypes={postType:m.string.isRequired,record:m.object.isRequired,defaultChecked:m.bool.isRequired};const Y=()=>{const t=document.globals;t.settings;const r=t.globals,c=j(),{data:i,loading:d}=x(a=>a.fetchTaxonomies),{data:n,loading:l}=x(a=>a.fetchCustomPostTypes),{postType:o}=f();if(T.useEffect(()=>{C(e(`${e("Associate taxonomies to")} ${o}`)),c(k()),c(A({postType:o}))},[]),d&&l)return s.jsx(R,{});const g=[s.jsx(S,{style:u.PRIMARY,to:"/register",children:e("Register new Post Type")})];return s.jsx(w,{title:`${e("Associate taxonomies to")} ${o}`,actions:g,crumbs:[{label:e("Registered Custom Post Types"),link:"/"},{label:o,link:`/view/${o}`},{label:`${e("Associate taxonomies to")} ${o}`}],children:n.length>0&&i.records&&i.records.length>0?s.jsx("div",{className:"responsive with-shadow b-rounded",children:s.jsxs("table",{className:`acpt-table ${r.is_rtl?"rtl":""}`,children:[s.jsx("thead",{children:s.jsxs("tr",{children:[s.jsx("th",{children:s.jsx(h,{tip:e("Taxonomy slug. The post name/slug. Used for various queries for taxonomy content."),label:e("Slug")})}),s.jsx("th",{children:e("Type")}),s.jsx("th",{children:s.jsx(h,{tip:e("Singular label. Used when a singular label is needed"),label:e("Singular")})}),s.jsx("th",{children:s.jsx(h,{tip:e("Plural label. Used for the taxonomy admin menu item"),label:e("Plural")})}),s.jsx("th",{children:e("Associate")})]})}),s.jsx("tbody",{children:i.records&&i.records.map(a=>s.jsx(y,{record:a,postType:o,defaultChecked:!$(E(n[0].taxonomies,a.id))},a.id))})]})}):s.jsxs(L,{style:u.SECONDARY,children:[e("No taxonomies found.")," ",s.jsx(b,{to:"/register_taxonomy",children:e("Register the first one")}),"!"]})})};export{Y as default};
