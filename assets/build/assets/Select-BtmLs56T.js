import{j as r}from"./fields-B4O9Q4Yk.js";import{R as v}from"./vendor-BwziPlmK.js";import{P as e}from"./index-BQWFQJQ0.js";import{g as R}from"./index.esm-Czmjla35.js";const y=({size:p="default",placeholder:u,id:a,defaultValue:i,description:n,values:o,onChangeCapture:f,validate:g,register:h,errors:b,disabled:x,muted:c})=>{const t=R(b,a),d=(j=null)=>r.jsxs(v.Fragment,{children:[r.jsx("div",{className:`${c?"":"acpt-select"}`,children:r.jsx("select",{id:a,name:a,"data-cy":`select-${a}`,defaultValue:j,placeholder:u,onChangeCapture:f,disabled:x,"aria-invalid":t?"true":"false",className:c?"muted":`form-control ${p} ${t?"has-errors":""}`,...h(a,g),children:o.map(s=>{const m=l=>l.value===null?r.jsx("option",{value:"",children:l.label}):r.jsx("option",{value:l.value,children:l.label});return s.options?r.jsx("optgroup",{label:s.label,"data-original":s.originalLabel?s.originalLabel:s.label,children:s.options.map(l=>m(l))}):m(s)})})}),t&&r.jsx("div",{"data-cy":`select-error-${a}`,className:"invalid-feedback",children:t.message}),n&&r.jsx("div",{className:"form-description",children:n})]});return i&&o.length>0?r.jsx("div",{className:"acpt-select-wrapper-with-values","data-current-value":i,children:d(i)}):d()};y.propTypes={id:e.string.isRequired,size:e.oneOf(["default","sm"]),placeholder:e.string,defaultValue:e.string,description:e.string,isMulti:e.bool,disabled:e.bool,muted:e.bool,values:e.array.isRequired,validate:e.func,register:e.func.isRequired,errors:e.array.isRequired};export{y as S};
