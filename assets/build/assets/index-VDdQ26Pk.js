import{j as e}from"./fields-B4O9Q4Yk.js";import{a as t,r as h}from"./vendor-BwziPlmK.js";import{P as s,B as j,I as g}from"./index-nWGa0jEF.js";import{u as v}from"./Layout-3l8w9I7o.js";const y=({title:m,size:p="medium",visible:o=!1,textAlign:f="left",padding:u=24,buttons:c=[],testId:d,children:x})=>{const n=t.useRef(!1),[a,r]=t.useState(!o),i=t.useRef();return t.useEffect(()=>{n.current?r(!a):n.current=!0},[o]),v(i,()=>{r(!0)}),a?null:h.createPortal(e.jsx("div",{className:"acpt-overlay",children:e.jsxs("div",{ref:i,className:`acpt-modal ${p} ${a?"modal-hidden":"modal-open"}`,"data-cy":d?"modal-"+d:null,children:[e.jsxs("div",{className:"acpt-modal-header flex-between",children:[e.jsx("h3",{children:m}),e.jsx("a",{className:"modal-close-icon",href:"#",onClick:l=>{l.preventDefault(),r(!a)},children:e.jsx(g,{icon:"bx:bx-x",color:"#777",width:24})})]}),e.jsx("div",{className:`acpt-modal-body p-${u} text-${f}`,children:x}),c.length>0&&e.jsx("div",{className:"acpt-modal-footer",children:e.jsx("div",{className:"i-flex-center s-8",children:c.map(l=>l)})})]})}),document.getElementById("acpt-admin-app-wrapper"))};y.propTypes={title:s.string.isRequired,visible:s.bool,padding:s.number,testId:s.string,buttons:s.arrayOf(j),textAlign:s.oneOf(["center","left","right"]),size:s.oneOf(["small","medium","large"])};export{y as M};
