import{j as r}from"./fields-B4O9Q4Yk.js";import{L as p}from"./vendor-BwziPlmK.js";import{P as i}from"./index-nWGa0jEF.js";const l=({currentPage:n,totalPages:t,baseLink:a})=>{const s=[];for(let e=1;e<=t;e++)s.push(e);return s.length<2?null:r.jsx("ul",{className:"acpt-pagination",children:s.map((e,o)=>r.jsx("li",{children:e===n?r.jsx("span",{children:e}):r.jsx(p,{to:`${a}/${e}`,children:e})},o))})};l.propTypes={currentPage:i.number.isRequired,totalPages:i.number.isRequired,baseLink:i.string.isRequired};export{l as P};
