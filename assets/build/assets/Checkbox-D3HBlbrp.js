import{j as e,u as m}from"./fields-B4O9Q4Yk.js";import{R as p}from"./vendor-BwziPlmK.js";import{P as s}from"./index-DD5Vwil-.js";import{g as u}from"./index.esm-Czmjla35.js";const f=({id:r,values:i,description:l,validate:o,register:n,errors:d})=>{const a=u(d,r);return e.jsxs(p.Fragment,{children:[e.jsxs("div",{className:"flex-column s-8",children:[Object.keys(i).map((c,t)=>e.jsxs("label",{className:"checkbox",htmlFor:`${r}_${t}`,children:[e.jsx("input",{name:r,value:i[c].value,defaultChecked:i[c].checked,"aria-invalid":a?"true":"false",type:"checkbox",id:`${r}_${t}`,...n(`${r}_${t}`,{...o})}),e.jsx("span",{children:m(c)})]})),a&&e.jsx("div",{className:"invalid-feedback",children:a.message})]}),l&&e.jsx("div",{className:"form-description",children:l}),a&&e.jsx("div",{className:"invalid-feedback",children:a.message})]})};f.propTypes={id:s.string.isRequired,description:s.string,values:s.arrayOf(s.object).isRequired,validate:s.func,register:s.func.isRequired,errors:s.array.isRequired};export{f as C};
